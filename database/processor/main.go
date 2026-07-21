package main

import (
	"database/sql"
	"encoding/csv"
	"fmt"
	"log"
	"os"
	"strconv"

	_ "github.com/mattn/go-sqlite3"
)

// USDA Nutrient IDs we care about (found in nutrient.csv)
const (
	EnergyKcal = 1008
	ProteinG   = 1003
	FatG       = 1004
	CarbG      = 1005
	FiberG     = 1079
)

type FoodItem struct {
	FdcID   int
	Name    string
	Kcal    float64
	Protein float64
	Fat     float64
	Carb    float64
	Fiber   float64
}

func main() {
	// 1. Open the output SQLite database
	os.Remove("nutrients.db") // Delete if exists
	db, err := sql.Open("sqlite3", "nutrients.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// 2. Create Schema
	schema := `
	CREATE TABLE foods (
		id INTEGER PRIMARY KEY,
		name TEXT NOT NULL,
		kcal REAL,
		protein REAL,
		fat REAL,
		carb REAL,
		fiber REAL
	);

	-- FTS5 virtual table for fast offline text searching
	CREATE VIRTUAL TABLE foods_fts USING fts5(name, content='foods', content_rowid='id');

	-- Triggers to keep FTS table synced with main table
	CREATE TRIGGER foods_ai AFTER INSERT ON foods BEGIN
		INSERT INTO foods_fts(rowid, name) VALUES (new.id, new.name);
	END;
	CREATE TRIGGER foods_ad AFTER DELETE ON foods BEGIN
		INSERT INTO foods_fts(foods_fts, rowid, name) VALUES('delete', old.id, old.name);
	END;
	CREATE TRIGGER foods_au AFTER UPDATE ON foods BEGIN
		INSERT INTO foods_fts(foods_fts, rowid, name) VALUES('delete', old.id, old.name);
		INSERT INTO foods_fts(rowid, name) VALUES (new.id, new.name);
	END;
	`
	_, err = db.Exec(schema)
	if err != nil {
		log.Fatal("Failed to create schema:", err)
	}

	// 3. Read food.csv to get names
	fmt.Println("Reading food.csv...")
	foodNames := make(map[int]string)
	readCSV("../usda_data/food.csv", func(record []string) {
		fdcID, _ := strconv.Atoi(record[0]) // fdc_id
		name := record[2]                   // description
		// Only include SR Legacy foods (we want raw ingredients, not branded barcodes)
		if record[1] == "sr_legacy_food" {
			foodNames[fdcID] = name
		}
	})

	// 4. Read food_nutrient.csv to get macros
	fmt.Println("Reading food_nutrient.csv and processing data...")
	foodsMap := make(map[int]*FoodItem)

	readCSV("../usda_data/food_nutrient.csv", func(record []string) {
		fdcID, _ := strconv.Atoi(record[1])     // fdc_id
		nutrientID, _ := strconv.Atoi(record[2]) // nutrient_id
		amount, _ := strconv.ParseFloat(record[3], 64) // amount

		// Only process if this food is in our SR Legacy names map
		if _, exists := foodNames[fdcID]; !exists {
			return
		}

		// Initialize food item if not already in map
		if _, exists := foodsMap[fdcID]; !exists {
			foodsMap[fdcID] = &FoodItem{
				FdcID: fdcID,
				Name:  foodNames[fdcID],
			}
		}

		// Assign nutrients based on USDA ID
		switch nutrientID {
		case EnergyKcal:
			foodsMap[fdcID].Kcal = amount
		case ProteinG:
			foodsMap[fdcID].Protein = amount
		case FatG:
			foodsMap[fdcID].Fat = amount
		case CarbG:
			foodsMap[fdcID].Carb = amount
		case FiberG:
			foodsMap[fdcID].Fiber = amount
		}
	})

	// 5. Insert processed data into SQLite
	fmt.Println("Inserting data into SQLite...")
	tx, err := db.Begin()
	if err != nil {
		log.Fatal(err)
	}
	stmt, err := tx.Prepare("INSERT INTO foods(id, name, kcal, protein, fat, carb, fiber) VALUES(?, ?, ?, ?, ?, ?, ?)")
	if err != nil {
		log.Fatal(err)
	}
	defer stmt.Close()

	for _, food := range foodsMap {
		// Basic validation: skip if no name or 0 calories (unless it's water/tea)
		if food.Name == "" {
			continue
		}
		_, err := stmt.Exec(food.FdcID, food.Name, food.Kcal, food.Protein, food.Fat, food.Carb, food.Fiber)
		if err != nil {
			log.Printf("Failed to insert food %d: %v\n", food.FdcID, err)
		}
	}
	tx.Commit()

	// 6. Vacuum to compress the database file size
	fmt.Println("Vacuuming database to minimize file size...")
	_, err = db.Exec("VACUUM;")
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("✅ Success! nutrients.db has been created.")
}

// Helper function to read CSV files dynamically
func readCSV(filepath string, handler func([]string)) {
	file, err := os.Open(filepath)
	if err != nil {
		log.Fatalf("Could not open %s: %v\n", filepath, err)
	}
	defer file.Close()

	reader := csv.NewReader(file)
	reader.LazyQuotes = true // Handles weirdly formatted CSVs

	// Read header row first
	_, err = reader.Read()
	if err != nil {
		log.Fatalf("Error reading header of %s: %v\n", filepath, err)
	}

	for {
		record, err := reader.Read()
		if err != nil {
			break // EOF or error
		}
		handler(record)
	}
}
