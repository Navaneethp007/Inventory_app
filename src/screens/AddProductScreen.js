import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useInventory } from '../contexts/InventoryContext';
import { COLORS, SIZES } from '../constants/theme';

const AddProductScreen = ({ navigation, route }) => {
  const { addProduct, updateProduct, categories, addCategory } = useInventory();
  const editingProduct = route.params?.product;
  const isEditing = !!editingProduct;

  const [formData, setFormData] = useState({
    name: '',
    category: categories[0],
    price: '',
    quantity: '',
    lowStockThreshold: '10',
    description: '',
  });

  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        category: editingProduct.category,
        price: editingProduct.price.toString(),
        quantity: editingProduct.quantity.toString(),
        lowStockThreshold: editingProduct.lowStockThreshold.toString(),
        description: editingProduct.description || '',
      });
    }
  }, [editingProduct]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      newErrors.quantity = 'Valid quantity is required';
    }

    if (!formData.lowStockThreshold || parseInt(formData.lowStockThreshold) < 0) {
      newErrors.lowStockThreshold = 'Valid threshold is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill all required fields correctly');
      return;
    }

    const productData = {
      name: formData.name.trim(),
      category: formData.category,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      lowStockThreshold: parseInt(formData.lowStockThreshold),
      description: formData.description.trim(),
    };

    if (isEditing) {
      updateProduct(editingProduct.id, productData);
      Alert.alert('Success', 'Product updated successfully');
    } else {
      addProduct(productData);
      Alert.alert('Success', 'Product added successfully');
    }

    navigation.goBack();
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setFormData({ ...formData, category: newCategory.trim() });
      setNewCategory('');
      setShowCategoryInput(false);
    }
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{isEditing ? 'Edit Product' : 'Add Product'}</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            {/* Product Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Product Name *</Text>
              <View style={[styles.inputContainer, errors.name && styles.inputError]}>
                <MaterialCommunityIcons name="package-variant" size={20} color={COLORS.textLight} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter product name"
                  value={formData.name}
                  onChangeText={(value) => updateField('name', value)}
                  placeholderTextColor={COLORS.textLight}
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category *</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
              >
                {categories.map(category => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      formData.category === category && styles.categoryChipActive
                    ]}
                    onPress={() => updateField('category', category)}
                  >
                    <Text style={[
                      styles.categoryText,
                      formData.category === category && styles.categoryTextActive
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.addCategoryChip}
                  onPress={() => setShowCategoryInput(!showCategoryInput)}
                >
                  <MaterialCommunityIcons name="plus" size={16} color={COLORS.primary} />
                  <Text style={styles.addCategoryText}>Add New</Text>
                </TouchableOpacity>
              </ScrollView>

              {showCategoryInput && (
                <View style={styles.newCategoryContainer}>
                  <TextInput
                    style={styles.newCategoryInput}
                    placeholder="New category name"
                    value={newCategory}
                    onChangeText={setNewCategory}
                    placeholderTextColor={COLORS.textLight}
                  />
                  <TouchableOpacity 
                    style={styles.newCategoryButton}
                    onPress={handleAddCategory}
                  >
                    <MaterialCommunityIcons name="check" size={24} color={COLORS.card} />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Price */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price ($) *</Text>
              <View style={[styles.inputContainer, errors.price && styles.inputError]}>
                <MaterialCommunityIcons name="currency-usd" size={20} color={COLORS.textLight} />
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  value={formData.price}
                  onChangeText={(value) => updateField('price', value)}
                  keyboardType="decimal-pad"
                  placeholderTextColor={COLORS.textLight}
                />
              </View>
              {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
            </View>

            {/* Quantity */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Quantity *</Text>
              <View style={[styles.inputContainer, errors.quantity && styles.inputError]}>
                <MaterialCommunityIcons name="package" size={20} color={COLORS.textLight} />
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  value={formData.quantity}
                  onChangeText={(value) => updateField('quantity', value)}
                  keyboardType="number-pad"
                  placeholderTextColor={COLORS.textLight}
                />
              </View>
              {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}
            </View>

            {/* Low Stock Threshold */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Low Stock Alert Threshold *</Text>
              <View style={[styles.inputContainer, errors.lowStockThreshold && styles.inputError]}>
                <MaterialCommunityIcons name="alert" size={20} color={COLORS.textLight} />
                <TextInput
                  style={styles.input}
                  placeholder="10"
                  value={formData.lowStockThreshold}
                  onChangeText={(value) => updateField('lowStockThreshold', value)}
                  keyboardType="number-pad"
                  placeholderTextColor={COLORS.textLight}
                />
              </View>
              {errors.lowStockThreshold && <Text style={styles.errorText}>{errors.lowStockThreshold}</Text>}
              <Text style={styles.helperText}>
                Alert when quantity falls below this number
              </Text>
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description (Optional)</Text>
              <View style={styles.textAreaContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Enter product description..."
                  value={formData.description}
                  onChangeText={(value) => updateField('description', value)}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  placeholderTextColor={COLORS.textLight}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
          >
            <MaterialCommunityIcons name="check" size={20} color={COLORS.card} />
            <Text style={styles.saveButtonText}>{isEditing ? 'Update' : 'Save'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.card,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: SIZES.md,
  },
  inputGroup: {
    marginBottom: SIZES.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: SIZES.md,
    marginLeft: SIZES.sm,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.danger,
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  categoryScroll: {
    marginBottom: SIZES.sm,
  },
  categoryChip: {
    backgroundColor: COLORS.card,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: 20,
    marginRight: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.text,
  },
  categoryTextActive: {
    color: COLORS.card,
    fontWeight: '600',
  },
  addCategoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  addCategoryText: {
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: 4,
    fontWeight: '600',
  },
  newCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.sm,
  },
  newCategoryInput: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  newCategoryButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SIZES.sm,
  },
  textAreaContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SIZES.md,
  },
  textArea: {
    fontSize: 16,
    color: COLORS.text,
    minHeight: 100,
  },
  footer: {
    flexDirection: 'row',
    padding: SIZES.md,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingVertical: SIZES.md,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.md,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.card,
    marginLeft: 6,
  },
});

export default AddProductScreen;