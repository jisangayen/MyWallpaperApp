import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { CATEGORIES } from '../data/wallpapers';

interface FilterBarProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export const FilterBar = ({ activeCategory, onSelectCategory }: FilterBarProps) => {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <TouchableOpacity
              key={category}
              onPress={() => onSelectCategory(category)}
              style={styles.tab}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.categoryText,
                isActive && styles.activeText
              ]}>
                {category}
              </Text>
              
              {/* Premium Underline Indicator */}
              {isActive && (
                <View style={styles.activeIndicator}>
              
                  <View style={styles.line} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    marginBottom: 10,
  },
  scrollContent: {
    paddingHorizontal: 25,
    alignItems: 'center',
  },
  tab: {
    marginRight: 28, // Spacing between words
    alignItems: 'center',
    paddingBottom: 8,
  },
  categoryText: {
    color: '#64748b', // Muted slate for non-active
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase', // Professional look
  },
  activeText: {
    color: '#fff', // Pure white when active
    fontWeight: '900',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  line: {
    height: 3,
    width: 20,
    backgroundColor: '#6366f1', // Indigo accent
    borderRadius: 2,
  },
  dot: {
    height: 3,
    width: 3,
    backgroundColor: '#f89924',
    borderRadius: 2,
    marginRight: 4,
  }
});