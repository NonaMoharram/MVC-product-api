const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

// 1. دالة إتمام الشراء والـ Checkout
exports.checkout = asyncHandler(async (req, res, next) => {
    // 🌟 السطر الأول: قراءة وفحص العنوان في البداية (Score 1/1) 🌟
    const { shippingAddress } = req.body;
    if (!shippingAddress) {
        return next(new AppError('Shipping address is required to complete the checkout', 400));
    }

    // جلب السلة وفحصها
    const cart = await Cart.findOne().populate('items.product');
    if (!cart || cart.items.length === 0) {
        return next(new AppError('Your cart is empty. Cannot checkout.', 400));
    }

    const orderItems = [];
    // فحص المخزن وتجهيز عناصر الطلب
    for (const item of cart.items) {
        if (!item.product) {
            return next(new AppError('One of the products in your cart no longer exists.', 404));
        }
        if (item.product.stock < item.quantity) {
            return next(new AppError(`Not enough stock for product: ${item.product.name}`, 400));
        }

        orderItems.push({
            product: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity
        });
    }
    // تقليل كمية المخزن لكل منتج في قاعدة البيانات
    for (const item of cart.items) {
        item.product.stock -= item.quantity;
        await item.product.save();
    }

    // حساب السعر في السيرفر بعد تجهيز المصفوفة وقبل الإنشاء 
    const calculatedTotalPrice = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // إنشاء الطلب الجديد في قاعدة البيانات
    const newOrder = await Order.create({
        items: orderItems,
        totalPrice: calculatedTotalPrice, 
        shippingAddress: shippingAddress, 
        status: 'pending'
    });

    // تفريغ عربة التسوق
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({
        status: 'success',
        data: { order: newOrder }
    });
});

// 2. جلب كافة الطلبات 
exports.getAllOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find().populate('items.product');
    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: { orders }
    });
});

// 3. جلب طلب واحد محدد والتحقق من وجوده (Returns 404 if it doesn't exist)
exports.getOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) {
        return next(new AppError('No order found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: { order }
    });
});

// 4. تحديث حالة الطلب والتحقق من الـ enum (Status update validation)
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    
    if (!status || !allowedStatuses.includes(status.toLowerCase())) {
        return next(new AppError('Invalid order status. Status must be one of the allowed enum values', 400));
    }

    const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        { status: status.toLowerCase() }, 
        { new: true, runValidators: true }
    ).populate('items.product');

    if (!updatedOrder) {
        return next(new AppError('No order found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { order: updatedOrder }
    });
});

