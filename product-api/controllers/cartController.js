const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

// // دالة مساعدة لحساب السعر الإجمالي للعربة تلقائياً // //
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

// // 1. إضافة منتج إلى عربة التسوق (6.2 Add Item to Cart) // //
exports.addToCart = asyncHandler(async (req, res, next) => {
    const { productId, quantity } = req.body;
    const requestedQuantity = quantity || 1;

    // التأكد من وجود المنتج أولاً
    const product = await Product.findById(productId);
    if (!product) {
        return next(new AppError('No product found with that ID', 404));
    }

    // التحقق من المخزون (Validates Stock) عند الإضافة لأول مرة
    if (product.stock < requestedQuantity) {
        return next(new AppError(`Sorry, only ${product.stock} items left in stock`, 400));
    }
   
    let cart = await Cart.findOne();
    if (!cart) {
        cart = await Cart.create({ items: [] });
    }

    // التحقق إذا كان المنتج موجود مسبقاً في العربة لتحديث كميته فقط
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
        // التحقق من المخزون الإجمالي بعد زيادة الكمية داخل العربة
        const newQuantity = cart.items[itemIndex].quantity + requestedQuantity;
        if (product.stock < newQuantity) {
            return next(new AppError(`Cannot add more. Max available stock is ${product.stock}`, 400));
        }
        cart.items[itemIndex].quantity = newQuantity;
    } else {
        // إضافة المنتج مع السعر والكمية لتطابق الـ Schema الجديدة
        cart.items.push({ 
            product: productId, 
            quantity: requestedQuantity, 
            price: product.price 
        });
    }

    // حساب السعر الإجمالي الجديد وحفظ العربة
    await calculateTotalPrice(cart);

    res.status(200).json({
        status: 'success',
        data: cart
    });
});

exports.updateCartItem = asyncHandler(async (req, res, next) => {
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
        // التأكد من المخزن قبل تعديل الكمية الجديدة مباشرة
        const product = await Product.findById(productId);
        if (product && product.stock < quantity) {
            return next(new AppError(`Cannot update quantity. Only ${product.stock} items left in stock`, 400));
        }
        cart.items[itemIndex].quantity = quantity;
    }

    await calculateTotalPrice(cart);

    res.status(200).json({
        status: 'success',
        data: cart
    });
});

// // 3. عرض ومسح محتويات العربة ( View & Clear Cart) // //
exports.getCart = asyncHandler(async (req, res, next) => {
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

exports.clearCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne();
    
    // إذا كانت السلة موجودة، نقوم بتفريغها وحفظها
    if (cart) {
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();
    }

    //  إرجاع سلة فارغة بكود 200 وليس خطأ 404
    res.status(200).json({
        status: 'success',
        data: {
            items: [],
            totalPrice: 0
        }
    });
});


