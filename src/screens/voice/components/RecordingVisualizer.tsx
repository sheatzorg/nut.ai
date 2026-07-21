import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { formatTime, type Phase } from '../lib/app';

interface RecordingVisualizerProps {
  phase: Phase;
  elapsed: number;
  onToggle: () => void;
}

export function RecordingVisualizer({ phase, elapsed, onToggle }: RecordingVisualizerProps) {
  const recording = phase === 'recording';
  const paused = phase === 'paused';
  const active = phase !== 'idle';

  return (
    <View style={styles.container}>
      <View style={styles.ringContainer}>
        {!active && <View style={styles.idleRing} />}
        {paused && <View style={styles.pausedHalo} />}

        <TouchableOpacity
          style={[styles.micButton, recording && styles.micButtonRecording]}
          onPress={onToggle}
          activeOpacity={0.85}
        >
          {paused ? (
            <MaterialIcons name="play-arrow" size={38} color="#2563eb" />
          ) : (
            <MaterialIcons name="mic" size={38} color={recording ? '#fff' : '#2563eb'} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.statusSection}>
        {active ? (
          <>
            <View style={styles.statusPill}>
              <View style={[styles.liveDot, { backgroundColor: recording ? '#3b82f6' : '#94a3b8' }]} />
              <Text style={styles.statusText}>{recording ? 'LIVE LISTENING' : 'PAUSED'}</Text>
              <View style={styles.divider} />
              <Text style={styles.timerText}>{formatTime(elapsed)}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.hintText}>Tap to start logging</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center' },
  ringContainer: { width: 240, height: 240, alignItems: 'center', justifyContent: 'center' },
  idleRing: { position: 'absolute', width: 160, height: 160, borderRadius: 80, borderWidth: 1, borderColor: 'rgba(59,130,246,0.15)' },
  pausedHalo: { position: 'absolute', width: 176, height: 176, borderRadius: 88, backgroundColor: 'rgba(59,130,246,0.1)' },
  micButton: {
    width: 112, height: 112, borderRadius: 56,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6ebf2',
    shadowColor: '#0f172a', shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12, shadowRadius: 32, elevation: 8,
  },
  micButtonRecording: {
    backgroundColor: '#3b82f6', borderColor: '#3b82f6',
    shadowColor: '#3b82f6', shadowOpacity: 0.55, shadowRadius: 50,
  },
  statusSection: { marginTop: 28, alignItems: 'center', gap: 12 },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6ebf2',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.12, color: '#1d4ed8' },
  divider: { width: 1, height: 12, backgroundColor: '#e6ebf2' },
  timerText: { fontSize: 12, fontWeight: '700', fontVariant: ['tabular-nums'], color: '#0f172a' },
  hintText: { fontSize: 14, fontWeight: '500', color: '#475569' },
});
