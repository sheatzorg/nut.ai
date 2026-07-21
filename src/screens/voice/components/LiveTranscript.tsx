import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Phase } from '../lib/app';

interface LiveTranscriptProps {
  words: string[];
  phase: Phase;
}

export function LiveTranscript({ words, phase }: LiveTranscriptProps) {
  const recording = phase === 'recording';
  const empty = words.length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>TRANSCRIPT</Text>
        {recording && (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live</Text>
          </View>
        )}
      </View>

      <View style={styles.card}>
        {empty ? (
          <Text style={styles.placeholder}>
            {recording ? 'Listening…' : 'Your words will appear here as you speak.'}
          </Text>
        ) : (
          <Text style={styles.transcriptText}>
            {words.map((word, i) => {
              const isLast = i === words.length - 1 && recording;
              return (
                <Text key={i} style={isLast ? styles.lastWord : undefined}>
                  {word}{' '}
                </Text>
              );
            })}
            {recording && <Text style={styles.cursor}>|</Text>}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingHorizontal: 4 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.12, color: '#475569' },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#3b82f6' },
  liveText: { fontSize: 11, fontWeight: '600', color: '#3b82f6' },
  card: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6ebf2',
    borderRadius: 16, padding: 20, minHeight: 92, justifyContent: 'center',
  },
  placeholder: { fontSize: 15, fontStyle: 'italic', color: '#94a3b8', lineHeight: 24 },
  transcriptText: { fontSize: 15, lineHeight: 28, color: '#0f172a' },
  lastWord: { fontWeight: '600', color: '#2563eb' },
  cursor: { fontSize: 15, fontWeight: '300', color: '#2563eb' },
});
