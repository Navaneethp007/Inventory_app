import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const ProductCard = ({ product, onPress, onDelete, onQuickUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.spring(expandAnim, {
      toValue: isExpanded ? 1 : 0,
      tension: 100,
      friction: 8,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  const isLowStock = product.quantity <= product.lowStockThreshold;
  const isOutOfStock = product.quantity === 0;

  const getStockStatus = () => {
    if (isOutOfStock) return { 
      text: 'Out of Stock', 
      icon: 'close-circle',
      gradient: COLORS.gradients.danger 
    };
    if (isLowStock) return { 
      text: 'Low Stock', 
      icon: 'alert-circle',
      gradient: COLORS.gradients.warning 
    };
    return { 
      text: 'In Stock', 
      icon: 'check-circle',
      gradient: COLORS.gradients.success 
    };
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Electronics': 'laptop',
      'Clothing': 'tshirt-crew',
      'Food': 'food-apple',
      'Furniture': 'sofa',
      'Other': 'package-variant'
    };
    return icons[category] || 'package-variant';
  };

  const stockStatus = getStockStatus();

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.97,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };

  const handleQuickStock = (amount) => {
    const newQuantity = Math.max(0, product.quantity + amount);
    onQuickUpdate(product.id, { ...product, quantity: newQuantity });
  };

  const expandedHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80],
  });

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9} onLongPress={() => setIsExpanded(!isExpanded)}>
        <LinearGradient
          colors={['#FFFFFF', '#FAFBFC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          {/* Top decorative gradient bar */}
          <LinearGradient
            colors={stockStatus.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.topBar}
          />

          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.nameRow}>
                <LinearGradient
                  colors={COLORS.gradients.primary}
                  style={styles.categoryIcon}
                >
                  <MaterialCommunityIcons 
                    name={getCategoryIcon(product.category)} 
                    size={20} 
                    color={COLORS.card} 
                  />
                </LinearGradient>
                <View style={styles.nameContainer}>
                  <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
                  <View style={styles.categoryContainer}>
                    <LinearGradient
                      colors={[COLORS.primary + '20', COLORS.primary + '10']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.categoryBadge}
                    >
                      <MaterialCommunityIcons name="tag" size={10} color={COLORS.primary} />
                      <Text style={styles.category}>{product.category}</Text>
                    </LinearGradient>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.headerActions}>
              <TouchableOpacity 
                onPress={() => setIsExpanded(!isExpanded)} 
                style={styles.expandButton}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={[COLORS.info + '20', COLORS.info + '10']}
                  style={styles.expandGradient}
                >
                  <MaterialCommunityIcons 
                    name={isExpanded ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={COLORS.info} 
                  />
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={onDelete} style={styles.deleteButton} activeOpacity={0.7}>
                <LinearGradient
                  colors={[COLORS.danger + '20', COLORS.danger + '10']}
                  style={styles.deleteGradient}
                >
                  <MaterialCommunityIcons name="delete-outline" size={20} color={COLORS.danger} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <LinearGradient
                colors={COLORS.gradients.secondary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statIconContainer}
              >
                <MaterialCommunityIcons name="currency-usd" size={16} color={COLORS.card} />
              </LinearGradient>
              <View style={styles.statTextContainer}>
                <Text style={styles.statLabel}>Price</Text>
                <Text style={styles.statValue}>${product.price}</Text>
              </View>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <LinearGradient
                colors={COLORS.gradients.info}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statIconContainer}
              >
                <MaterialCommunityIcons name="package-variant" size={16} color={COLORS.card} />
              </LinearGradient>
              <View style={styles.statTextContainer}>
                <Text style={styles.statLabel}>Stock</Text>
                <Text style={styles.statValue}>{product.quantity}</Text>
              </View>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <LinearGradient
                colors={COLORS.gradients.purple}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statIconContainer}
              >
                <MaterialCommunityIcons name="cash-multiple" size={16} color={COLORS.card} />
              </LinearGradient>
              <View style={styles.statTextContainer}>
                <Text style={styles.statLabel}>Total</Text>
                <Text style={styles.statValue}>${(product.price * product.quantity).toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* Quick Stock Adjustment - Expandable */}
          <Animated.View style={[styles.quickActionsContainer, { height: expandedHeight, opacity: expandAnim }]}>
            <View style={styles.quickActionsContent}>
              <Text style={styles.quickActionsTitle}>Quick Stock Adjustment</Text>
              <View style={styles.quickActionsButtons}>
                <TouchableOpacity 
                  style={styles.quickActionButtonWrapper}
                  onPress={() => handleQuickStock(-10)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={COLORS.gradients.danger}
                    style={styles.quickActionButton}
                  >
                    <MaterialCommunityIcons name="minus" size={16} color={COLORS.card} />
                    <Text style={styles.quickActionText}>10</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.quickActionButtonWrapper}
                  onPress={() => handleQuickStock(-1)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={COLORS.gradients.warning}
                    style={styles.quickActionButton}
                  >
                    <MaterialCommunityIcons name="minus" size={16} color={COLORS.card} />
                    <Text style={styles.quickActionText}>1</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.quickActionButtonWrapper}
                  onPress={() => handleQuickStock(1)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={COLORS.gradients.success}
                    style={styles.quickActionButton}
                  >
                    <MaterialCommunityIcons name="plus" size={16} color={COLORS.card} />
                    <Text style={styles.quickActionText}>1</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.quickActionButtonWrapper}
                  onPress={() => handleQuickStock(10)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={COLORS.gradients.info}
                    style={styles.quickActionButton}
                  >
                    <MaterialCommunityIcons name="plus" size={16} color={COLORS.card} />
                    <Text style={styles.quickActionText}>10</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

          <View style={styles.footer}>
            <LinearGradient
              colors={stockStatus.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.statusBadge}
            >
              <View style={styles.statusPulse} />
              <MaterialCommunityIcons name={stockStatus.icon} size={14} color={COLORS.card} />
              <Text style={styles.statusText}>{stockStatus.text}</Text>
            </LinearGradient>

            {product.description && (
              <TouchableOpacity 
                onPress={() => Alert.alert(product.name, product.description)}
                style={styles.infoButton}
              >
                <MaterialCommunityIcons name="information-outline" size={18} color={COLORS.textLight} />
              </TouchableOpacity>
            )}
          </View>

          {/* Bottom decorative element */}
          <View style={styles.decorativeCircle} />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.md,
  },
  card: {
    borderRadius: 20,
    padding: SIZES.md,
    position: 'relative',
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: SIZES.xs,
    marginBottom: SIZES.md,
  },
  headerLeft: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.xs,
    letterSpacing: -0.3,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  category: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: 3,
  },
  headerActions: {
    flexDirection: 'row',
    gap: SIZES.xs,
  },
  expandButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  expandGradient: {
    padding: 8,
  },
  deleteButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  deleteGradient: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    borderRadius: 14,
    padding: SIZES.sm,
    marginBottom: SIZES.sm,
  },
  statBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.xs,
  },
  statTextContainer: {
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
    marginHorizontal: SIZES.xs,
  },
  quickActionsContainer: {
    overflow: 'hidden',
    marginBottom: SIZES.sm,
  },
  quickActionsContent: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SIZES.sm,
  },
  quickActionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: SIZES.xs,
    textAlign: 'center',
  },
  quickActionsButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SIZES.xs,
  },
  quickActionButtonWrapper: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xs,
    gap: 2,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.card,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: 8,
    borderRadius: 20,
    position: 'relative',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.card,
    marginLeft: 6,
    letterSpacing: 0.3,
  },
  statusPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.card,
    marginRight: 6,
  },
  infoButton: {
    padding: SIZES.xs,
  },
  decorativeCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary + '05',
    bottom: -30,
    right: -30,
  },
});

export default ProductCard;