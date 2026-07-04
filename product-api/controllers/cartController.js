const Cart = require('../models/Cart');
const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// دالة مساعدة لحساب السعر الإجمالي للعربة تلقائياً
const calculateTotalPrice = async (cart) => {
    let total = 0;
    for (const item of cart.items) {
        const product = await Product.findById(item.product);
        if (product) {
            total += product.price * item.quantity;
        }
    }
    cart.totalPrice = total;
    await cart.save();
};

// 1. إضافة منتج إلى عربة التسوق (6.2 Add Item to Cart)
exports.addToCart = catchAsync(async (req, res, next) => {
    const { productId, quantity } = req.body;

    // التأكد من وجود المنتج أولاً
    const product = await Product.findById(productId);
    if (!product) {
        return next(new AppError('No product found with that ID', 404));
    }

    // جلب العربة الحالية (لتبسيط المنهج سنفترض وجود عربة واحدة ثابتة)
    let cart = await Cart.findOne();
    if (!cart) {
        cart = await Cart.create({ items: [] });
    }

    // التحقق إذا كان المنتج موجود مسبقاً في العربة لتحديث كميته فقط
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity || 1;
    } else {
        cart.items.push({ product: productId, quantity: quantity || 1 });
    }

    // حساب السعر الإجمالي الجديد وحفظ العربة
    await calculateTotalPrice(cart);

    res.status(200).json({
        status: 'success',
        data: { cart }
    });
});

// 2. تحديث وحذف عناصر من العربة (6.3 Update & Remove Cart Items)
exports.updateCartItem = catchAsync(async (req, res, next) => {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne();
    if (!cart) {
        return next(new AppError('No cart found', 404));
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) {
        return next(new AppError('Product not found in cart', 404));
    }

    // إذا كانت الكمية 0 أو أقل نقوم بحذف المنتج من العربة تماماً
    if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
    } else {
        cart.items[itemIndex].quantity = quantity;
    }

    await calculateTotalPrice(cart);

    res.status(200).json({
        status: 'success',
        data: { cart }
    });
});

// 3. عرض ومسح محتويات العربة (6.4 View & Clear Cart)
exports.getCart = catchAsync(async (req, res, next) => {
    const cart = await Cart.findOne().populate('items.product');
    
    if (!cart) {
        return res.status(200).json({
            status: 'success',
            data: { cart: { items: [], totalPrice: 0 } }
        });
    }

    res.status(200).json({
        status: 'success',
        data: { cart }
    });
});

exports.clearCart = catchAsync(async (req, res, next) => {
    const cart = await Cart.findOne();
    if (cart) {
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
