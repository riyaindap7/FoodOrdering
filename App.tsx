import React, { useState, useEffect } from 'react';

const FoodOrderingApp = () => {
  // Mock data to simulate Firebase data
  const mockMenuItems = [
    {
      id: '1',
      name: 'Classic Burger',
      description: 'Juicy beef patty with lettuce, tomato, and our special sauce',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
      category: 'Burgers',
      rating: 4.5,
      prepTime: '15-20 min'
    },
    {
      id: '2',
      name: 'Margherita Pizza',
      description: 'Fresh mozzarella, tomatoes, and basil on crispy crust',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
      category: 'Pizza',
      rating: 4.7,
      prepTime: '20-25 min'
    },
    {
      id: '3',
      name: 'Caesar Salad',
      description: 'Crisp romaine lettuce with parmesan and croutons',
      price: 9.99,
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop',
      category: 'Salads',
      rating: 4.3,
      prepTime: '10-15 min'
    },
    {
      id: '4',
      name: 'Chicken Tacos',
      description: 'Grilled chicken with fresh salsa and avocado',
      price: 11.99,
      image: 'https://images.unsplash.com/photo-1565299585323-38174c6b8085?w=300&h=200&fit=crop',
      category: 'Mexican',
      rating: 4.6,
      prepTime: '12-18 min'
    },
    {
      id: '5',
      name: 'Chocolate Cake',
      description: 'Rich chocolate cake with creamy frosting',
      price: 6.99,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop',
      category: 'Desserts',
      rating: 4.8,
      prepTime: '5-10 min'
    }
  ];

  // Type definitions
  type MenuItem = {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    rating: number;
    prepTime: string;
  };

  type CartItem = MenuItem & { quantity: number };

  // State variables
  const [currentScreen, setCurrentScreen] = useState('menu');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Simulate Firebase data fetching
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        setMenuItems(mockMenuItems);
        setError(null);
      } catch (err) {
        setError('Failed to fetch menu items');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, change: number) => {
    setCart(prevCart => {
      return prevCart
        .map(item => {
          if (item.id === id) {
            const newQuantity = item.quantity + change;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const submitOrder = () => {
    setCurrentScreen('confirmation');
    setTimeout(() => {
      setCart([]);
      setCurrentScreen('menu');
    }, 3000);
  };

  // Function to retry loading data
  const retryLoading = () => {
    setError(null);
    setLoading(true);
    // Simulate the loading process again
    setTimeout(() => {
      setMenuItems(mockMenuItems);
      setLoading(false);
    }, 1500);
  };

  const styles = {
    container: {
      maxWidth: '420px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative' as const,
      boxShadow: '0 0 20px rgba(0,0,0,0.1)'
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      padding: '20px'
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #f3f4f6',
      borderTop: '4px solid #f97316',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '16px'
    },
    header: {
      backgroundColor: 'white',
      padding: '16px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky' as const,
      top: 0,
      zIndex: 10
    },
    headerTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    },
    headerTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937',
      margin: 0
    },
    headerSubtitle: {
      fontSize: '14px',
      color: '#6b7280',
      margin: 0
    },
    cartButton: {
      backgroundColor: '#f97316',
      color: 'white',
      border: 'none',
      padding: '12px',
      borderRadius: '50%',
      fontSize: '20px',
      cursor: 'pointer',
      position: 'relative' as const,
      width: '48px',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    cartBadge: {
      position: 'absolute' as const,
      top: '-8px',
      right: '-8px',
      backgroundColor: '#ef4444',
      color: 'white',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold'
    },
    categoriesContainer: {
      display: 'flex',
      gap: '8px',
      overflowX: 'auto' as const,
      paddingBottom: '8px'
    },
    categoryButton: {
      backgroundColor: '#e5e7eb',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '14px',
      cursor: 'pointer',
      whiteSpace: 'nowrap' as const,
      transition: 'all 0.2s'
    },
    categoryButtonActive: {
      backgroundColor: '#f97316',
      color: 'white'
    },
    menuContainer: {
      padding: '16px',
      paddingBottom: '100px'
    },
    menuItem: {
      backgroundColor: 'white',
      borderRadius: '12px',
      marginBottom: '16px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      overflow: 'hidden'
    },
    menuItemImage: {
      width: '100px',
      height: '100px',
      objectFit: 'cover' as const
    },
    menuItemContent: {
      flex: 1,
      padding: '16px'
    },
    menuItemHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '8px'
    },
    menuItemName: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#1f2937',
      margin: 0
    },
    menuItemPrice: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#f97316'
    },
    menuItemDescription: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '12px',
      lineHeight: '1.4'
    },
    menuItemFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    menuItemInfo: {
      display: 'flex',
      gap: '16px',
      fontSize: '12px',
      color: '#6b7280'
    },
    addButton: {
      backgroundColor: '#f97316',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer'
    },
    backButton: {
      background: 'none',
      border: 'none',
      fontSize: '16px',
      color: '#f97316',
      cursor: 'pointer',
      padding: '8px'
    },
    emptyCartContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      height: '60vh',
      padding: '24px',
      textAlign: 'center' as const
    },
    emptyCartIcon: {
      fontSize: '64px',
      marginBottom: '16px'
    },
    cartContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      height: 'calc(100vh - 80px)'
    },
    cartItems: {
      flex: 1,
      padding: '16px',
      overflowY: 'auto' as const
    },
    cartItem: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    cartItemImage: {
      width: '60px',
      height: '60px',
      borderRadius: '8px',
      objectFit: 'cover' as const,
      marginRight: '16px'
    },
    cartItemContent: {
      flex: 1
    },
    cartItemName: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '4px'
    },
    cartItemPrice: {
      fontSize: '14px',
      color: '#f97316',
      fontWeight: 'bold'
    },
    quantityControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    quantityButton: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      border: 'none',
      backgroundColor: '#e5e7eb',
      cursor: 'pointer',
      fontSize: '18px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    quantityButtonActive: {
      backgroundColor: '#f97316',
      color: 'white'
    },
    quantityText: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    orderSummary: {
      backgroundColor: 'white',
      padding: '16px',
      borderTop: '1px solid #e5e7eb'
    },
    totalContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    },
    totalLabel: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    totalAmount: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#f97316'
    },
    checkoutButton: {
      width: '100%',
      backgroundColor: '#f97316',
      color: 'white',
      border: 'none',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer'
    },
    checkoutContainer: {
      padding: '16px',
      paddingBottom: '100px'
    },
    checkoutSection: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '16px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    checkoutSectionTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '12px'
    },
    checkoutItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: '1px solid #f3f4f6'
    },
    checkoutItemLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    checkoutTotal: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '16px',
      borderTop: '2px solid #f3f4f6',
      marginTop: '8px'
    },
    checkoutInfo: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '8px',
      lineHeight: '1.5'
    },
    paymentMethod: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    cardIcon: {
      width: '40px',
      height: '28px',
      backgroundColor: '#3b82f6',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px'
    },
    placeOrderContainer: {
      position: 'fixed' as const,
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '420px',
      backgroundColor: 'white',
      padding: '16px',
      borderTop: '1px solid #e5e7eb'
    },
    placeOrderButton: {
      width: '100%',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer'
    },
    confirmationContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      padding: '24px',
      textAlign: 'center' as const
    },
    confirmationIcon: {
      width: '80px',
      height: '80px',
      backgroundColor: '#10b981',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '40px',
      color: 'white',
      marginBottom: '24px'
    },
    confirmationTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '8px'
    },
    confirmationSubtitle: {
      fontSize: '16px',
      color: '#6b7280',
      marginBottom: '16px'
    },
    confirmationEmoji: {
      fontSize: '32px',
      animation: 'pulse 2s infinite'
    }
  };

  // Add keyframes for animations
  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;

  // Loading Screen
  if (loading) {
    return (
      <div style={styles.container}>
        <style>{keyframes}</style>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading delicious food...</p>
        </div>
      </div>
    );
  }

  // Error Screen
  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
            Oops! Something went wrong
          </h2>
          <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '24px' }}>{error}</p>
          <button 
            onClick={retryLoading}
            style={styles.checkoutButton}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Menu Screen
  if (currentScreen === 'menu') {
    return (
      <div style={styles.container}>
        <style>{keyframes}</style>
        
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTop}>
            <div>
              <h1 style={styles.headerTitle}>FoodieApp</h1>
              <p style={styles.headerSubtitle}>Delicious food delivered</p>
            </div>
            <button 
              onClick={() => setCurrentScreen('cart')}
              style={styles.cartButton}
            >
              🛒
              {getTotalItems() > 0 && (
                <span style={styles.cartBadge}>
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>

          {/* Categories */}
          <div style={styles.categoriesContainer}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  ...styles.categoryButton,
                  ...(selectedCategory === category ? styles.categoryButtonActive : {})
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div style={styles.menuContainer}>
          {filteredItems.map(item => (
            <div key={item.id} style={styles.menuItem}>
              <img 
                src={item.image} 
                alt={item.name}
                style={styles.menuItemImage}
              />
              <div style={styles.menuItemContent}>
                <div style={styles.menuItemHeader}>
                  <h3 style={styles.menuItemName}>{item.name}</h3>
                  <span style={styles.menuItemPrice}>${item.price}</span>
                </div>
                <p style={styles.menuItemDescription}>{item.description}</p>
                <div style={styles.menuItemFooter}>
                  <div style={styles.menuItemInfo}>
                    <span>⭐ {item.rating}</span>
                    <span>🕒 {item.prepTime}</span>
                  </div>
                  <button
                    onClick={() => addToCart(item)}
                    style={styles.addButton}
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Cart Screen
  if (currentScreen === 'cart') {
    return (
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTop}>
            <button 
              onClick={() => setCurrentScreen('menu')}
              style={styles.backButton}
            >
              ← Back
            </button>
            <h1 style={styles.headerTitle}>Your Cart</h1>
            <div style={{ width: '60px' }} />
          </div>
        </div>

        {cart.length === 0 ? (
          <div style={styles.emptyCartContainer}>
            <div style={styles.emptyCartIcon}>🛒</div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#6b7280', marginBottom: '8px' }}>
              Your cart is empty
            </h2>
            <p style={{ fontSize: '16px', color: '#9ca3af', marginBottom: '24px' }}>
              Add some delicious items to get started!
            </p>
            <button
              onClick={() => setCurrentScreen('menu')}
              style={styles.checkoutButton}
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div style={styles.cartContainer}>
            {/* Cart Items */}
            <div style={styles.cartItems}>
              {cart.map(item => (
                <div key={item.id} style={styles.cartItem}>
                  <img 
                    src={item.image} 
                    alt={item.name}
                    style={styles.cartItemImage}
                  />
                  <div style={styles.cartItemContent}>
                    <h3 style={styles.cartItemName}>{item.name}</h3>
                    <p style={styles.cartItemPrice}>${item.price}</p>
                  </div>
                  <div style={styles.quantityControls}>
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      style={styles.quantityButton}
                    >
                      -
                    </button>
                    <span style={styles.quantityText}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      style={{...styles.quantityButton, ...styles.quantityButtonActive}}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div style={styles.orderSummary}>
              <div style={styles.totalContainer}>
                <span style={styles.totalLabel}>Total</span>
                <span style={styles.totalAmount}>${getTotalPrice().toFixed(2)}</span>
              </div>
              <button
                onClick={() => setCurrentScreen('checkout')}
                style={styles.checkoutButton}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Checkout Screen
  if (currentScreen === 'checkout') {
    return (
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTop}>
            <button 
              onClick={() => setCurrentScreen('cart')}
              style={styles.backButton}
            >
              ← Back
            </button>
            <h1 style={styles.headerTitle}>Order Summary</h1>
            <div style={{ width: '60px' }} />
          </div>
        </div>

        <div style={styles.checkoutContainer}>
          {/* Order Items */}
          <div style={styles.checkoutSection}>
            <h2 style={styles.checkoutSectionTitle}>Your Order</h2>
            {cart.map(item => (
              <div key={item.id} style={styles.checkoutItem}>
                <div style={styles.checkoutItemLeft}>
                  <span style={{ fontWeight: '500' }}>{item.name}</span>
                  <span style={{ color: '#6b7280' }}>x{item.quantity}</span>
                </div>
                <span style={{ fontWeight: 'bold' }}>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div style={styles.checkoutTotal}>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Total</span>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#f97316' }}>
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>
          </div>

          {/* Delivery Info */}
          <div style={styles.checkoutSection}>
            <h2 style={styles.checkoutSectionTitle}>Delivery Information</h2>
            <div style={styles.checkoutInfo}>
              <strong>Address:</strong> 123 Main Street, City, State 12345
            </div>
            <div style={styles.checkoutInfo}>
              <strong>Phone:</strong> (555) 123-4567
            </div>
            <div style={styles.checkoutInfo}>
              <strong>Estimated Delivery:</strong> 25-35 minutes
            </div>
          </div>

          {/* Payment Method */}
          <div style={styles.checkoutSection}>
            <h2 style={styles.checkoutSectionTitle}>Payment Method</h2>
            <div style={styles.paymentMethod}>
              <div style={styles.cardIcon}>💳</div>
              <span style={{ color: '#6b7280' }}>**** **** **** 1234</span>
            </div>
          </div>
        </div>

        <div style={styles.placeOrderContainer}>
          <button
            onClick={submitOrder}
            style={styles.placeOrderButton}
          >
            Place Order - ${getTotalPrice().toFixed(2)}
          </button>
        </div>
      </div>
    );
  }

  // Confirmation Screen
  if (currentScreen === 'confirmation') {
    return (
      <div style={styles.container}>
        <style>{keyframes}</style>
        <div style={styles.confirmationContainer}>
          <div style={styles.confirmationIcon}>
            ✓
          </div>
          <h1 style={styles.confirmationTitle}>Order Confirmed!</h1>
          <p style={styles.confirmationSubtitle}>Your delicious meal is being prepared</p>
          <p style={{ fontSize: '14px', color: '#9ca3af' }}>Estimated delivery: 25-35 minutes</p>
          <div style={{ marginTop: '24px' }}>
            <div style={styles.confirmationEmoji}>🍔 👨‍🍳 🚚</div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default FoodOrderingApp;