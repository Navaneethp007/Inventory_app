import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const StatCard = ({ icon, title, value, color, subtitle }) => {
  const getGradientColors = (baseColor) => {
    return [baseColor, baseColor + 'DD'];
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={getGradientColors(color)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name={icon} size={32} color={COLORS.card} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>{value}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        <View style={styles.decorCircle} />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.md,
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  gradient: {
    padding: SIZES.md,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
    fontWeight: '500',
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.card,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  decorCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    right: -30,
    top: -30,
  },
});

export default StatCard;