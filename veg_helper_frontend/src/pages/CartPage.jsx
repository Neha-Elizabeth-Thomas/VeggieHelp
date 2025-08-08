// File: client/src/pages/CartPage.jsx

import React, { useEffect } from 'react'; // 1. Import useEffect
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
    const { userInfo } = useAuth();

    // 2. Use useEffect to dynamically load the Razorpay script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        // Cleanup function to remove the script when the component unmounts
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    const handleCheckout = async () => {
        const totalAmount = calculateTotal();

        try {
            // 1. Create Order on Backend
            const { data: { order, key_id } } = await api.post('/payment/create-order', {
                amount: totalAmount,
            });

            // 2. Configure Razorpay Options
            const options = {
                key: key_id,
                amount: order.amount,
                currency: "INR",
                name: "SubziSahayak",
                description: "Transaction for fresh produce",
                image: "https://i.imgur.com/8Qz4Z5m.png", // A placeholder logo
                order_id: order.id,
                handler: async function (response) {
                    // 3. Verify Payment on Backend
                    try {
                        const verificationResponse = await api.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        if (verificationResponse.data.success) {
                            alert('Payment successful!');
                            clearCart();
                        } else {
                            alert('Payment verification failed. Please contact support.');
                        }
                    } catch (error) {
                        alert('Could not verify payment. Please contact support.');
                    }
                },
                prefill: {
                    name: userInfo.name,
                    email: userInfo.email,
                    contact: userInfo.phone || '',
                },
                notes: {
                    address: "SubziSahayak Corporate Office",
                },
                theme: {
                    color: "#22c55e", // Green theme color
                },
            };

            // 4. Open Razorpay Checkout Modal
            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error("Checkout error:", error);
            alert('Error initiating checkout. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-6">
            {/* 3. The <script> tag is no longer needed here */}
            <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-xl text-gray-600">Your cart is empty.</p>
                    <Link to="/buyer/dashboard" className="text-blue-600 hover:underline mt-4 inline-block">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div>
                    {cartItems.map(item => (
                        <div key={item._id} className="flex items-center justify-between border-b py-4">
                            <div className="flex items-center">
                                <img src={item.imageUrl} alt={item.produceItem} className="w-20 h-20 object-cover rounded-md mr-4" />
                                <div>
                                    <h2 className="text-lg font-semibold capitalize">{item.produceItem}</h2>
                                    <p className="text-gray-500">₹{item.price} / {item.unit}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <input 
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                                    min="1"
                                    className="w-16 p-2 border rounded-md"
                                />
                                <p className="font-semibold w-24 text-right">₹{(item.price * item.quantity).toFixed(2)}</p>
                                <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700">Remove</button>
                            </div>
                        </div>
                    ))}
                    <div className="mt-6 text-right">
                        <h2 className="text-2xl font-bold">Total: ₹{calculateTotal()}</h2>
                        <button onClick={handleCheckout} className="mt-4 py-3 px-6 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
