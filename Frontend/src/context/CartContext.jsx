import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { userInfo } = useAuth();

    // Fetch cart from DB when user logs in
    useEffect(() => {
        const fetchCart = async () => {
            if (userInfo) {
                try {
                    const { data } = await api.get('/cart');
                    // The API returns the full cart object, we just need the items array
                    // The items are also populated with listing details
                    setCartItems(data.items.map(item => ({ ...item.listing, quantity: item.quantity })));
                } catch (error) {
                    console.error("Failed to fetch cart", error);
                }
            } else {
                // Clear cart on logout
                setCartItems([]);
            }
        };
        fetchCart();
    }, [userInfo]);

    const addToCart = async (listing, quantity) => {
        try {
            const { data } = await api.post('/cart/add', { listingId: listing._id, quantity });
            setCartItems(data.items.map(item => ({ ...item.listing, quantity: item.quantity })));
        } catch (error) {
            console.error("Failed to add to cart", error);
        }
    };

    const removeFromCart = async (listingId) => {
        try {
            const { data } = await api.delete(`/cart/remove/${listingId}`);
            setCartItems(data.items.map(item => ({ ...item.listing, quantity: item.quantity })));
        } catch (error) {
            console.error("Failed to remove from cart", error);
        }
    };

    const updateQuantity = async (listingId, quantity) => {
        try {
            const { data } = await api.put('/cart/update', { listingId, quantity });
            setCartItems(data.items.map(item => ({ ...item.listing, quantity: item.quantity })));
        } catch (error) {
            console.error("Failed to update quantity", error);
        }
    };

    const clearCart = () => {
        // This would ideally be an API call too, e.g., api.delete('/cart/clear')
        setCartItems([]);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    return useContext(CartContext);
};