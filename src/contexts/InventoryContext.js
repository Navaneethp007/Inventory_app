import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InventoryContext = createContext();

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within InventoryProvider');
  }
  return context;
};

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Electronics', 'Clothing', 'Food', 'Furniture', 'Other']);
  const [loading, setLoading] = useState(true);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save data whenever products change
  useEffect(() => {
    if (!loading) {
      saveData();
    }
  }, [products]);

  const loadData = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem('@products');
      const storedCategories = await AsyncStorage.getItem('@categories');
      
      if (storedProducts) {
        const parsed = JSON.parse(storedProducts);
        console.log("Loaded products:", parsed);
        setProducts(parsed);
      }
      if (storedCategories) {
        const parsedCategories = JSON.parse(storedCategories);
        console.log("Loaded categories:", parsedCategories);
        setCategories(parsedCategories);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('@products', JSON.stringify(products));
      await AsyncStorage.setItem('@categories', JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts(products.map(p => p.id === id ? { ...updatedProduct, id } : p));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addCategory = (category) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  const getStats = () => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const lowStockItems = products.filter(p => p.quantity <= p.lowStockThreshold).length;
    const outOfStock = products.filter(p => p.quantity === 0).length;

    return {
      totalProducts,
      totalValue,
      lowStockItems,
      outOfStock,
    };
  };

  const getLowStockProducts = () => {
    return products.filter(p => p.quantity <= p.lowStockThreshold && p.quantity > 0);
  };

  const getOutOfStockProducts = () => {
    return products.filter(p => p.quantity === 0);
  };

  const value = {
    products,
    categories,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    getStats,
    getLowStockProducts,
    getOutOfStockProducts,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};