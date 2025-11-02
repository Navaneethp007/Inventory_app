import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useInventory } from '../contexts/InventoryContext';
import StatCard from '../components/StatCard';
import { COLORS, SIZES } from '../constants/theme';

const DashboardScreen = ({ navigation }) => {
  const { getStats, getLowStockProducts, getOutOfStockProducts } = useInventory();
  const stats = getStats();
  const lowStockProducts = getLowStockProducts();
  const outOfStockProducts = getOutOfStockProducts();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome Back!</Text>
          <Text style={styles.title}>Inventory Dashboard</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <MaterialCommunityIcons name="plus" size={28} color={COLORS.card} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsGrid}>
          <StatCard
            icon="package-variant-closed"
            title="Total Products"
            value={stats.totalProducts}
            color={COLORS.primary}
          />
          
          <StatCard
            icon="currency-usd"
            title="Total Value"
            value={`$${stats.totalValue.toFixed(2)}`}
            color={COLORS.secondary}
          />
          
          <StatCard
            icon="alert-circle"
            title="Low Stock"
            value={stats.lowStockItems}
            color={COLORS.warning}
            subtitle={`${lowStockProducts.length} items need attention`}
          />
          
          <StatCard
            icon="package-variant-closed-remove"
            title="Out of Stock"
            value={stats.outOfStock}
            color={COLORS.danger}
            subtitle={`${outOfStockProducts.length} items unavailable`}
          />
        </View>

        {lowStockProducts.length > 0 && (
          <View style={styles.alertSection}>
            <View style={styles.alertHeader}>
              <MaterialCommunityIcons name="alert" size={24} color={COLORS.warning} />
              <Text style={styles.alertTitle}>Low Stock Alert</Text>
            </View>
            {lowStockProducts.slice(0, 3).map(product => (
              <View key={product.id} style={styles.alertItem}>
                <View style={styles.alertDot} />
                <Text style={styles.alertItemText}>
                  {product.name} - Only {product.quantity} left
                </Text>
              </View>
            ))}
            {lowStockProducts.length > 3 && (
              <TouchableOpacity 
                onPress={() => navigation.navigate('Products')}
                style={styles.viewAllButton}
              >
                <Text style={styles.viewAllText}>View all {lowStockProducts.length} items</Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {outOfStockProducts.length > 0 && (
          <View style={[styles.alertSection, { borderLeftColor: COLORS.danger }]}>
            <View style={styles.alertHeader}>
              <MaterialCommunityIcons name="close-circle" size={24} color={COLORS.danger} />
              <Text style={[styles.alertTitle, { color: COLORS.danger }]}>Out of Stock</Text>
            </View>
            {outOfStockProducts.slice(0, 3).map(product => (
              <View key={product.id} style={styles.alertItem}>
                <View style={[styles.alertDot, { backgroundColor: COLORS.danger }]} />
                <Text style={styles.alertItemText}>
                  {product.name} - Requires restock
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('Products')}
            >
              <MaterialCommunityIcons name="format-list-bulleted" size={32} color={COLORS.primary} />
              <Text style={styles.actionText}>View All</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('AddProduct')}
            >
              <MaterialCommunityIcons name="plus-circle" size={32} color={COLORS.secondary} />
              <Text style={styles.actionText}>Add Product</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.card,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.md,
    paddingTop: SIZES.md,
  },
  statsGrid: {
    marginBottom: SIZES.md,
  },
  alertSection: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.warning,
    marginLeft: SIZES.sm,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.sm,
    paddingTop: SIZES.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  quickActions: {
    marginBottom: SIZES.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  actionCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SIZES.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: SIZES.sm,
    fontWeight: '600',
  },
});

export default DashboardScreen;