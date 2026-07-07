const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

exports.checkout = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne().populate('items.product');

    if (!cart || cart.items.length === 0) {
        return next(new AppError('Your cart is empty. Cannot checkout.', 400));
    }

    const orderItems = [];

    for (const item of cart.items) {
        if (!item.product) {
            return next(new AppError('One of the products in your cart no longer exists.', 404));
        }

        if (item.product.stock < item.quantity) {
            return next(new AppError(`Not enough stock for product: ${item.product.name}.`, 400));
        }
        orderItems.push({
            product: item.product._id,
            name: item.product.name,   
            price: item.product.price, 
            quantity: item.quantity
        });
    }

    for (const item of cart.items) {
        item.product.stock -= item.quantity;
        await item.product.save();
    }

    // قراءة عنوان الشحن باسم متغير مستقل لتفادي أي خطأ إملائي أو تداخل في التهيئة
    const inputShippingAddress = req?.body?.shippingAddress || 'Cairo, Egypt';

    // إنشاء الطلب الجديد في قاعدة البيانات
    const newOrder = await Order.create({
        items: orderItems,
        totalPrice: cart.totalPrice,
        shippingAddress: inputShippingAddress,
        status: 'Pending'
    });

    // تفريغ عربة التسوق تماماً بعد إتمام الشراء بنجاح
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({
        status: 'success',
        data: { order: newOrder }
    });
});
exports.getAllOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find().populate('items.product');

    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: { orders }
    });
});

// // 3. جلب طلب واحد محدد بالـ ID // //
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

exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
    const { status } = req.body;

    const allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!allowedStatuses.includes(status)) {
        return next(new AppError('Invalid order status', 400));
    }

    const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
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
