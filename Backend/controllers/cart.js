import Cart from '../models/cart.js';
import Listing from '../models/listing.js';

// Helper function to get or create a user's cart
const getOrCreateCart = async (userId) => {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    }
    return cart;
};

// @desc    Get user's cart
// @route   GET /api/cart
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate({
            path: 'items.listing',
            model: 'Listing',
        });
        if (!cart) {
            return res.status(200).json({ items: [] });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
export const addToCart = async (req, res) => {
    const { listingId, quantity } = req.body;
    const userId = req.user._id;

    try {
        const cart = await getOrCreateCart(userId);
        const itemIndex = cart.items.findIndex(p => p.listing.toString() === listingId);

        if (itemIndex > -1) {
            // Item exists, update quantity
            cart.items[itemIndex].quantity += quantity;
        } else {
            // Item does not exist, add new item
            cart.items.push({ listing: listingId, quantity });
        }
        await cart.save();
        const populatedCart = await cart.populate('items.listing');
        res.status(200).json(populatedCart);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:listingId
export const removeFromCart = async (req, res) => {
    const { listingId } = req.params;
    const userId = req.user._id;

    try {
        const cart = await Cart.findOne({ user: userId });
        if (cart) {
            cart.items = cart.items.filter(p => p.listing.toString() !== listingId);
            await cart.save();
            const populatedCart = await cart.populate('items.listing');
            res.status(200).json(populatedCart);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/update
export const updateItemQuantity = async (req, res) => {
    const { listingId, quantity } = req.body;
    const userId = req.user._id;

    try {
        const cart = await Cart.findOne({ user: userId });
        const itemIndex = cart.items.findIndex(p => p.listing.toString() === listingId);

        if (itemIndex > -1) {
            if (quantity > 0) {
                cart.items[itemIndex].quantity = quantity;
            } else {
                // Remove item if quantity is 0 or less
                cart.items.splice(itemIndex, 1);
            }
            await cart.save();
            const populatedCart = await cart.populate('items.listing');
            res.status(200).json(populatedCart);
        } else {
            res.status(404).json({ message: 'Item not in cart' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};