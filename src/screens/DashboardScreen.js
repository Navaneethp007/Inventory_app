import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useInventory } from '../contexts/InventoryContext';
import StatCard from '../components/StatCard';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const DashboardScreen = ({ navigation }) => {
  const { getStats, getLowStockProducts, getOutOfStockProducts } = useInventory();
  const stats = getStats();
  const lowStockProducts = getLowStockProducts();
  const outOfStockProducts = getOutOfStockProducts();

  const headerAnim = useRef(new Animated.Value(-100)).current;
  const buttonScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(headerAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        tension: 100,
        friction: 5,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleAddPress = () => {
    Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 0.85,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
    navigation.navigate('AddProduct');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ transform: [{ translateY: headerAnim }] }}>
        <LinearGradient
          colors={COLORS.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <View style={styles.greetingContainer}>
                <Text style={styles.greeting}>Welcome Back</Text>
                <Text style={styles.waveEmoji}>👋</Text>
              </View>
              <Text style={styles.title}>Inventory Dashboard</Text>
            </View>
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddPress}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#FFFFFF', '#F8F9FA']}
                  style={styles.addButtonGradient}
                >
                  <MaterialCommunityIcons name="plus" size={26} color={COLORS.primary} />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
          
          {/* Decorative elements */}
          <View style={styles.headerDecor1} />
          <View style={styles.headerDecor2} />
        </LinearGradient>
      </Animated.View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.statsGrid}>
          <StatCard
            icon="package-variant-closed"
            title="Total Products"
            value={stats.totalProducts}
            color={COLORS.primary}
            index={0}
          />
          
          <StatCard
            icon="currency-usd"
            title="Total Value"
            value={`${stats.totalValue.toFixed(2)}`}
            color={COLORS.secondary}
            index={1}
          />
          
          <StatCard
            icon="alert-circle"
            title="Low Stock"
            value={stats.lowStockItems}
            color={COLORS.warning}
            subtitle={lowStockProducts.length > 0 ? `${lowStockProducts.length} items need attention` : 'All items stocked well'}
            index={2}
          />
          
          <StatCard
            icon="package-variant-closed-remove"
            title="Out of Stock"
            value={stats.outOfStock}
            color={COLORS.danger}
            subtitle={outOfStockProducts.length > 0 ? `${outOfStockProducts.length} items unavailable` : 'No items out of stock'}
            index={3}
          />
        </View>

        {lowStockProducts.length > 0 && (
          <View style={styles.alertSection}>
            <LinearGradient
              colors={['#FFFFFF', '#FFFBF5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.alertCard}
            >
              <View style={styles.alertTopBorder}>
                <LinearGradient
                  colors={COLORS.gradients.warning}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.alertBorderGradient}
                />
              </View>
              
              <View style={styles.alertHeader}>
                <LinearGradient
                  colors={COLORS.gradients.warning}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.alertIconContainer}
                >
                  <MaterialCommunityIcons name="alert" size={22} color={COLORS.card} />
                </LinearGradient>
                <Text style={styles.alertTitle}>Low Stock Alert</Text>
              </View>
              
              {lowStockProducts.slice(0, 3).map((product, index) => (
                <View key={product.id} style={styles.alertItem}>
                  <View style={styles.alertDot} />
                  <Text style={styles.alertItemText}>
                    <Text style={styles.alertProductName}>{product.name}</Text> - Only {product.quantity} left
                  </Text>
                </View>
              ))}
              
              {lowStockProducts.length > 3 && (
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Products')}
                  style={styles.viewAllButton}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={[COLORS.warning + '15', COLORS.warning + '08']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.viewAllGradient}
                  >
                    <Text style={styles.viewAllText}>View all {lowStockProducts.length} items</Text>
                    <MaterialCommunityIcons name="arrow-right" size={18} color={COLORS.warning} />
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </LinearGradient>
          </View>
        )}

        {outOfStockProducts.length > 0 && (
          <View style={styles.alertSection}>
            <LinearGradient
              colors={['#FFFFFF', '#FFF5F5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.alertCard}
            >
              <View style={styles.alertTopBorder}>
                <LinearGradient
                  colors={COLORS.gradients.danger}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.alertBorderGradient}
                />
              </View>
              
              <View style={styles.alertHeader}>
                <LinearGradient
                  colors={COLORS.gradients.danger}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.alertIconContainer}
                >
                  <MaterialCommunityIcons name="close-circle" size={22} color={COLORS.card} />
                </LinearGradient>
                <Text style={[styles.alertTitle, { color: COLORS.danger }]}>Out of Stock</Text>
              </View>
              
              {outOfStockProducts.slice(0, 3).map(product => (
                <View key={product.id} style={styles.alertItem}>
                  <View style={[styles.alertDot, { backgroundColor: COLORS.danger }]} />
                  <Text style={styles.alertItemText}>
                    <Text style={styles.alertProductName}>{product.name}</Text> - Requires restock
                  </Text>
                </View>
              ))}
            </LinearGradient>
          </View>
        )}

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('Products')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#FFFFFF', '#F8F9FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.actionGradient}
              >
                <LinearGradient
                  colors={COLORS.gradients.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionIconContainer}
                >
                  <MaterialCommunityIcons name="format-list-bulleted" size={28} color={COLORS.card} />
                </LinearGradient>
                <Text style={styles.actionText}>View All</Text>
                <MaterialCommunityIcons name="arrow-right" size={16} color={COLORS.textLight} />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('AddProduct')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#FFFFFF', '#F5FFF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.actionGradient}
              >
                <LinearGradient
                  colors={COLORS.gradients.secondary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionIconContainer}
                >
                  <MaterialCommunityIcons name="plus-circle" size={28} color={COLORS.card} />
                </LinearGradient>
                <Text style={styles.actionText}>Add Product</Text>
                <MaterialCommunityIcons name="arrow-right" size={16} color={COLORS.textLight} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SIZES.md,
    paddingTop: SIZES.md,
    paddingBottom: SIZES.xl,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
  },
  waveEmoji: {
    fontSize: 16,
    marginLeft: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.card,
    marginTop: 6,
    letterSpacing: -0.5,
  },
  addButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.large,
  },
  addButtonGradient: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerDecor1: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -50,
    right: -30,
  },
  headerDecor2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -20,
    left: -20,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.md,
    paddingTop: SIZES.lg,
    paddingBottom: SIZES.xl,
  },
  statsGrid: {
    marginBottom: SIZES.lg,
  },
  alertSection: {
    marginBottom: SIZES.md,
  },
  alertCard: {
    borderRadius: 20,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  alertTopBorder: {
    height: 4,
    overflow: 'hidden',
  },
  alertBorderGradient: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.md,
    paddingBottom: SIZES.sm,
  },
  alertIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.warning,
    letterSpacing: -0.3,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.warning,
    marginRight: SIZES.sm,
  },
  alertItemText: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  alertProductName: {
    fontWeight: '600',
    color: COLORS.text,
  },
  viewAllButton: {
    margin: SIZES.md,
    marginTop: SIZES.sm,
    borderRadius: 12,
    overflow: 'hidden',
  },
  viewAllGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.sm,
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.warning,
    fontWeight: '600',
    marginRight: 6,
  },
  quickActions: {
    marginTop: SIZES.md,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.md,
    letterSpacing: -0.5,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  actionGradient: {
    padding: SIZES.md,
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  actionText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 4,
  },
});

export default DashboardScreen;