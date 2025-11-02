import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity,
  Alert,
  ScrollView,
  Animated,
  Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useInventory } from '../contexts/InventoryContext';
import ProductCard from '../components/ProductCard';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const ProductsScreen = ({ navigation }) => {
  const { products, categories, deleteProduct, updateProduct } = useInventory();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name'); // name, price, quantity
  const [showSortMenu, setShowSortMenu] = useState(false);

  const headerAnim = useRef(new Animated.Value(-100)).current;
  const searchAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(headerAnim, {
      toValue: 0,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    Animated.spring(searchAnim, {
      toValue: searchQuery.length > 0 ? 1 : 0,
      tension: 100,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [searchQuery]);

  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price') return b.price - a.price;
      if (sortBy === 'quantity') return a.quantity - b.quantity;
      return 0;
    });

  const handleDelete = (id, name) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteProduct(id)
        }
      ]
    );
  };

  const handleQuickUpdate = (id, updatedProduct) => {
    updateProduct(id, updatedProduct);
  };

  const handleExportData = async () => {
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const exportText = `📦 INVENTORY REPORT\n\n` +
      `Total Products: ${products.length}\n` +
      `Total Value: $${totalValue.toFixed(2)}\n\n` +
      `PRODUCTS:\n` +
      products.map((p, i) => 
        `${i + 1}. ${p.name}\n` +
        `   Category: ${p.category}\n` +
        `   Price: $${p.price} | Stock: ${p.quantity}\n` +
        `   Total: $${(p.price * p.quantity).toFixed(2)}\n`
      ).join('\n');

    try {
      await Share.share({
        message: exportText,
        title: 'Inventory Report'
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getSortIcon = () => {
    if (sortBy === 'name') return 'sort-alphabetical-ascending';
    if (sortBy === 'price') return 'currency-usd';
    return 'package-variant';
  };

  const renderMiniStats = () => {
    const categoryCount = selectedCategory === 'All' ? products.length : 
      products.filter(p => p.category === selectedCategory).length;
    const categoryValue = (selectedCategory === 'All' ? products : 
      products.filter(p => p.category === selectedCategory))
      .reduce((sum, p) => sum + (p.price * p.quantity), 0);

    return (
      <View style={styles.miniStatsContainer}>
        <LinearGradient
          colors={COLORS.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.miniStatCard}
        >
          <MaterialCommunityIcons name="package-variant" size={20} color={COLORS.card} />
          <View style={styles.miniStatText}>
            <Text style={styles.miniStatValue}>{categoryCount}</Text>
            <Text style={styles.miniStatLabel}>Items</Text>
          </View>
        </LinearGradient>

        <LinearGradient
          colors={COLORS.gradients.secondary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.miniStatCard}
        >
          <MaterialCommunityIcons name="currency-usd" size={20} color={COLORS.card} />
          <View style={styles.miniStatText}>
            <Text style={styles.miniStatValue}>${categoryValue.toFixed(0)}</Text>
            <Text style={styles.miniStatLabel}>Value</Text>
          </View>
        </LinearGradient>

        <TouchableOpacity 
          style={styles.exportButtonWrapper}
          onPress={handleExportData}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={COLORS.gradients.info}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.exportButton}
          >
            <MaterialCommunityIcons name="share-variant" size={18} color={COLORS.card} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {renderMiniStats()}

      <View style={styles.searchWrapper}>
        <LinearGradient
          colors={['#FFFFFF', '#FAFBFC']}
          style={styles.searchContainer}
        >
          <MaterialCommunityIcons name="magnify" size={22} color={COLORS.primary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.textLight}
          />
          <Animated.View 
            style={{
              opacity: searchAnim,
              transform: [{ scale: searchAnim }],
            }}
          >
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
                <LinearGradient
                  colors={COLORS.gradients.danger}
                  style={styles.clearButton}
                >
                  <MaterialCommunityIcons name="close" size={16} color={COLORS.card} />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </Animated.View>
        </LinearGradient>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
      >
        <TouchableOpacity
          style={styles.categoryChipWrapper}
          onPress={() => setSelectedCategory('All')}
          activeOpacity={0.7}
        >
          {selectedCategory === 'All' ? (
            <LinearGradient
              colors={COLORS.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.categoryChipActive}
            >
              <MaterialCommunityIcons name="apps" size={16} color={COLORS.card} />
              <Text style={styles.categoryTextActive}>
                All ({products.length})
              </Text>
            </LinearGradient>
          ) : (
            <View style={styles.categoryChip}>
              <MaterialCommunityIcons name="apps" size={16} color={COLORS.textLight} />
              <Text style={styles.categoryText}>
                All ({products.length})
              </Text>
            </View>
          )}
        </TouchableOpacity>
        
        {categories.map(category => {
          const count = products.filter(p => p.category === category).length;
          const isActive = selectedCategory === category;
          const iconMap = {
            'Electronics': 'laptop',
            'Clothing': 'tshirt-crew',
            'Food': 'food-apple',
            'Furniture': 'sofa',
            'Other': 'dots-horizontal'
          };
          return (
            <TouchableOpacity
              key={category}
              style={styles.categoryChipWrapper}
              onPress={() => setSelectedCategory(category)}
              activeOpacity={0.7}
            >
              {isActive ? (
                <LinearGradient
                  colors={COLORS.gradients.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.categoryChipActive}
                >
                  <MaterialCommunityIcons name={iconMap[category] || 'shape'} size={16} color={COLORS.card} />
                  <Text style={styles.categoryTextActive}>
                    {category} ({count})
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.categoryChip}>
                  <MaterialCommunityIcons name={iconMap[category] || 'shape'} size={16} color={COLORS.textLight} />
                  <Text style={styles.categoryText}>
                    {category} ({count})
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.resultsHeader}>
        <View style={styles.resultsInfo}>
          <LinearGradient
            colors={COLORS.gradients.primary}
            style={styles.resultIconContainer}
          >
            <MaterialCommunityIcons name="package-variant" size={16} color={COLORS.card} />
          </LinearGradient>
          <Text style={styles.resultsText}>
            {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'Product' : 'Products'}
          </Text>
        </View>
        
        <View style={styles.headerButtonsRow}>
          <TouchableOpacity 
            style={styles.sortButtonWrapper}
            onPress={() => setShowSortMenu(!showSortMenu)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={COLORS.gradients.info}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sortButton}
            >
              <MaterialCommunityIcons name={getSortIcon()} size={16} color={COLORS.card} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.addButtonWrapper}
            onPress={() => navigation.navigate('AddProduct')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={COLORS.gradients.secondary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addButton}
            >
              <MaterialCommunityIcons name="plus" size={18} color={COLORS.card} />
              <Text style={styles.addButtonText}>Add</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {showSortMenu && (
        <View style={styles.sortMenuContainer}>
          <LinearGradient
            colors={['#FFFFFF', '#FAFBFC']}
            style={styles.sortMenu}
          >
            <TouchableOpacity 
              style={styles.sortOption}
              onPress={() => { setSortBy('name'); setShowSortMenu(false); }}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons 
                name="sort-alphabetical-ascending" 
                size={20} 
                color={sortBy === 'name' ? COLORS.primary : COLORS.textLight} 
              />
              <Text style={[styles.sortOptionText, sortBy === 'name' && styles.sortOptionActive]}>
                Sort by Name
              </Text>
              {sortBy === 'name' && <MaterialCommunityIcons name="check" size={20} color={COLORS.primary} />}
            </TouchableOpacity>

            <View style={styles.sortDivider} />

            <TouchableOpacity 
              style={styles.sortOption}
              onPress={() => { setSortBy('price'); setShowSortMenu(false); }}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons 
                name="currency-usd" 
                size={20} 
                color={sortBy === 'price' ? COLORS.primary : COLORS.textLight} 
              />
              <Text style={[styles.sortOptionText, sortBy === 'price' && styles.sortOptionActive]}>
                Sort by Price
              </Text>
              {sortBy === 'price' && <MaterialCommunityIcons name="check" size={20} color={COLORS.primary} />}
            </TouchableOpacity>

            <View style={styles.sortDivider} />

            <TouchableOpacity 
              style={styles.sortOption}
              onPress={() => { setSortBy('quantity'); setShowSortMenu(false); }}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons 
                name="package-variant" 
                size={20} 
                color={sortBy === 'quantity' ? COLORS.primary : COLORS.textLight} 
              />
              <Text style={[styles.sortOptionText, sortBy === 'quantity' && styles.sortOptionActive]}>
                Sort by Stock
              </Text>
              {sortBy === 'quantity' && <MaterialCommunityIcons name="check" size={20} color={COLORS.primary} />}
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <LinearGradient
        colors={[COLORS.primary + '20', COLORS.primary + '10']}
        style={styles.emptyIconContainer}
      >
        <MaterialCommunityIcons 
          name={searchQuery ? "magnify-close" : "package-variant"} 
          size={64} 
          color={COLORS.primary} 
        />
      </LinearGradient>
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No Products Found' : 'Your Inventory is Empty'}
      </Text>
      <Text style={styles.emptyText}>
        {searchQuery ? 'Try adjusting your search or filters' : 'Start by adding your first product to get started'}
      </Text>
      {!searchQuery && (
        <TouchableOpacity 
          style={styles.emptyButtonWrapper}
          onPress={() => navigation.navigate('AddProduct')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={COLORS.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.emptyButton}
          >
            <MaterialCommunityIcons name="plus-circle" size={22} color={COLORS.card} />
            <Text style={styles.emptyButtonText}>Add Your First Product</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );

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
            <MaterialCommunityIcons name="package-variant-closed" size={28} color={COLORS.card} />
            <Text style={styles.title}>Products</Text>
          </View>
          <View style={styles.headerDecor} />
        </LinearGradient>
      </Animated.View>

      <FlatList
        data={filteredAndSortedProducts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('AddProduct', { product: item })}
            onDelete={() => handleDelete(item.id, item.name)}
            onQuickUpdate={handleQuickUpdate}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
    paddingVertical: SIZES.lg,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.card,
    marginLeft: SIZES.sm,
    letterSpacing: -0.5,
  },
  headerDecor: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    right: -30,
    top: -20,
  },
  listContent: {
    padding: SIZES.md,
    flexGrow: 1,
  },
  headerContainer: {
    marginBottom: SIZES.md,
  },
  miniStatsContainer: {
    flexDirection: 'row',
    gap: SIZES.sm,
    marginBottom: SIZES.md,
  },
  miniStatCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.sm,
    borderRadius: 14,
    ...SHADOWS.small,
  },
  miniStatText: {
    marginLeft: SIZES.sm,
  },
  miniStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.card,
  },
  miniStatLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  exportButtonWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  exportButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchWrapper: {
    marginBottom: SIZES.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    ...SHADOWS.small,
  },
  searchInput: {
    flex: 1,
    marginLeft: SIZES.sm,
    fontSize: 16,
    color: COLORS.text,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesScroll: {
    marginBottom: SIZES.md,
  },
  categoryChipWrapper: {
    marginRight: SIZES.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  categoryChipActive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: 20,
    ...SHADOWS.small,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
    marginLeft: 6,
  },
  categoryTextActive: {
    fontSize: 14,
    color: COLORS.card,
    fontWeight: '600',
    marginLeft: 6,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  resultsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  resultsText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
  },
  headerButtonsRow: {
    flexDirection: 'row',
    gap: SIZES.sm,
  },
  sortButtonWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  sortButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
  },
  addButtonText: {
    color: COLORS.card,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  sortMenuContainer: {
    marginTop: SIZES.sm,
  },
  sortMenu: {
    borderRadius: 14,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.md,
  },
  sortOptionText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    marginLeft: SIZES.sm,
    fontWeight: '500',
  },
  sortOptionActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  sortDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SIZES.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xxl * 2,
    paddingHorizontal: SIZES.lg,
  },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SIZES.md,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SIZES.sm,
    lineHeight: 22,
  },
  emptyButtonWrapper: {
    marginTop: SIZES.xl,
    borderRadius: 25,
    overflow: 'hidden',
    ...SHADOWS.large,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.md,
  },
  emptyButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: SIZES.sm,
  },
});

export default ProductsScreen;