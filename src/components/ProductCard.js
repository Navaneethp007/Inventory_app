import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const ProductCard = ({ product, onPress, onDelete }) => {
  const isLowStock = product.quantity <= product.lowStockThreshold;
  const isOutOfStock = product.quantity === 0;

  const getStockStatus = () => {
    if (isOutOfStock) return { text: 'Out of Stock', color: COLORS.danger };
    if (isLowStock) return { text: 'Low Stock', color: COLORS.warning };
    return { text: 'In Stock', color: COLORS.success };
  };

  const stockStatus = getStockStatus();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.category}>{product.category}</Text>
        </View>
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <MaterialCommunityIcons name="delete-outline" size={24} color={COLORS.danger} />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <MaterialCommunityIcons name="currency-usd" size={20} color={COLORS.primary} />
          <Text style={styles.infoLabel}>Price</Text>
          <Text style={styles.infoValue}>${product.price}</Text>
        </View>

        <View style={styles.infoItem}>
          <MaterialCommunityIcons name="package-variant" size={20} color={COLORS.info} />
          <Text style={styles.infoLabel}>Quantity</Text>
          <Text style={styles.infoValue}>{product.quantity}</Text>
        </View>

        <View style={styles.infoItem}>
          <MaterialCommunityIcons name="cash-multiple" size={20} color={COLORS.secondary} />
          <Text style={styles.infoLabel}>Total</Text>
          <Text style={styles.infoValue}>${(product.price * product.quantity).toFixed(2)}</Text>
        </View>
      </View>

      <View style={[styles.statusBadge, { backgroundColor: stockStatus.color + '20' }]}>
        <View style={[styles.statusDot, { backgroundColor: stockStatus.color }]} />
        <Text style={[styles.statusText, { color: stockStatus.color }]}>{stockStatus.text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    ...SHADOWS.small,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.sm,
  },
  headerLeft: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  deleteButton: {
    padding: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SIZES.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.sm,
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: SIZES.sm,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ProductCard;