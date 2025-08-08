import { razorpayInstance } from '../config/razorpay.js';
import crypto from 'crypto';

/**
 * @desc    Create a Razorpay order
 * @route   POST /api/payment/create-order
 * @access  Private/Buyer
 */
export const createOrder = async (req, res) => {
    try {
        const { amount } = req.body; // Amount in INR

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'A valid amount is required.' });
        }

        const options = {
            amount: Number(amount) * 100, // Amount in the smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_order_${new Date().getTime()}`,
        };

        const order = await razorpayInstance.orders.create(options);

        if (!order) {
            return res.status(500).json({ message: 'Error creating Razorpay order.' });
        }

        res.status(200).json({
            success: true,
            order,
            key_id: process.env.RAZORPAY_KEY_ID,
        });

    } catch (error) {
        console.error("Error in createOrder:", error);
        res.status(500).json({ message: 'Server error while creating order.' });
    }
};

/**
 * @desc    Verify a Razorpay payment
 * @route   POST /api/payment/verify
 * @access  Private/Buyer
 */
export const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ message: 'Payment verification details are required.' });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        // Here you would typically save the payment details to your database
        // For now, we'll just confirm success.
        res.status(200).json({
            success: true,
            message: "Payment verified successfully.",
        });
    } else {
        res.status(400).json({
            success: false,
            message: "Payment verification failed.",
        });
    }
};