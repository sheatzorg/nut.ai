import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export interface ImageEntry {
  uri: string;
}

interface ImageUploaderProps {
  images: ImageEntry[];
  onAdd: (entries: ImageEntry[]) => void;
  onRemove: (index: number) => void;
}

export function ImageUploader({ images, onAdd, onRemove }: ImageUploaderProps) {
  const hasImages = images.length > 0;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      onAdd(result.assets.map((a) => ({ uri: a.uri })));
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });
    if (!result.canceled) {
      onAdd(result.assets.map((a) => ({ uri: a.uri })));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="camera-alt" size={22} color="#2563eb" />
        </View>
        <Text style={styles.title}>{hasImages ? 'Add another photo' : 'Scan your meal'}</Text>
        <Text style={styles.subtitle}>
          Capture or upload images — foods & ingredients are detected directly
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.primaryButton} onPress={takePhoto} activeOpacity={0.85}>
            <MaterialIcons name="camera-alt" size={18} color="#fff" />
            <Text style={styles.primaryButtonText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={pickImage} activeOpacity={0.85}>
            <MaterialIcons name="photo-library" size={18} color="#2563eb" />
            <Text style={styles.secondaryButtonText}>Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>

      {hasImages && (
        <View style={styles.grid}>
          {images.map((img, i) => (
            <View key={img.uri} style={styles.imageContainer}>
              <Image source={{ uri: img.uri }} style={styles.image} resizeMode="cover" />
              <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(i)}>
                <MaterialIcons name="close" size={13} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  card: {
    alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6ebf2',
    borderRadius: 16, paddingVertical: 32, paddingHorizontal: 20,
  },
  iconContainer: {
    width: 48, height: 48, borderRadius: 16, backgroundColor: '#eff6ff',
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  subtitle: { fontSize: 12, color: '#475569', textAlign: 'center' },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 8, width: '100%' },
  primaryButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: '#3b82f6', paddingVertical: 12, borderRadius: 12,
  },
  primaryButtonText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  secondaryButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6ebf2', paddingVertical: 12, borderRadius: 12,
  },
  secondaryButtonText: { fontSize: 14, fontWeight: '700', color: '#2563eb' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  imageContainer: {
    width: '31%', aspectRatio: 1, borderRadius: 12, overflow: 'hidden',
    borderWidth: 1, borderColor: '#e6ebf2',
  },
  image: { width: '100%', height: '100%' },
  removeButton: {
    position: 'absolute', top: 4, right: 4,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center',
  },
});
