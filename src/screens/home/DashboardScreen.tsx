import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { colors } from '../../theme/colors';
import { TopAppBar } from './TopAppBar';
import { DailyProgressSection } from './DailyProgressSection';
import { QuickLogSection } from './QuickLogSection';
import { RecentEntriesSection } from './RecentEntriesSection';
import { BottomNavBar } from './BottomNavBar';

interface DashboardScreenProps {
  onNavigate?: (screen: string) => void;
}

export function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  const [activeTab, setActiveTab] = useState('home');

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
          calories={1840}
          calorieGoal={2400}
          protein={{ current: 82, goal: 150 }}
          carbs={{ current: 190, goal: 270 }}
          fats={{ current: 45, goal: 80 }}
        />

        <QuickLogSection
          onAudioPress={() => onNavigate?.('voice')}
          onTextPress={() => onNavigate?.('text')}
          onPhotoPress={() => onNavigate?.('image')}
        />

        <RecentEntriesSection entries={[]} />
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
