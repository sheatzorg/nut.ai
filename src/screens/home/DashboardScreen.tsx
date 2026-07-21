import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { colors } from '../../theme/colors';
import { TopAppBar } from './TopAppBar';
import { DailyProgressSection } from './DailyProgressSection';
import { QuickLogSection } from './QuickLogSection';
import { RecentEntriesSection } from './RecentEntriesSection';
import { BottomNavBar } from './BottomNavBar';
import { getTodayTotals, getRecentEntries, type DailyTotals, type DailyLog } from '../../services/UserDataService';

interface DashboardScreenProps {
  onNavigate?: (screen: string) => void;
}

export function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  const [activeTab, setActiveTab] = useState('home');
  const [totals, setTotals] = useState<DailyTotals>({
    totalKcal: 0, totalProtein: 0, totalFat: 0, totalCarb: 0, totalFiber: 0, mealCount: 0,
  });
  const [recentEntries, setRecentEntries] = useState<DailyLog[]>([]);

  const loadData = useCallback(async () => {
    try {
      const [todayTotals, entries] = await Promise.all([
        getTodayTotals(),
        getRecentEntries(10),
      ]);
      setTotals(todayTotals);
      setRecentEntries(entries);
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    }
  }, []);

  // Load on mount
  useEffect(() => {
    loadData();
  }, []);

  // Reload when screen comes back into focus (simplified — no navigation library)
  useEffect(() => {
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'voice') onNavigate?.('voice');
    if (tab === 'text') onNavigate?.('text');
    if (tab === 'photo') onNavigate?.('image');
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surfaceContainerLowest} />
      <TopAppBar />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DailyProgressSection
          calories={totals.totalKcal}
          calorieGoal={2400}
          protein={{ current: Math.round(totals.totalProtein), goal: 150 }}
          carbs={{ current: Math.round(totals.totalCarb), goal: 270 }}
          fats={{ current: Math.round(totals.totalFat), goal: 80 }}
        />

        <QuickLogSection
          onAudioPress={() => onNavigate?.('voice')}
          onTextPress={() => onNavigate?.('text')}
          onPhotoPress={() => onNavigate?.('image')}
        />

        <RecentEntriesSection entries={recentEntries} />
      </ScrollView>

      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    gap: 20,
  },
});
