const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// 1. منطق إتمام الشراء وإنشاء طلب (7.2 Checkout Logic)
exports.checkout = catchAsync(async (req, res, next) => {
    // جلب العربة الحالية مع بيانات المنتجات بالكامل
    const cart = await Cart.findOne().populate('items.product');
    
    if (!cart || cart.items.length === 0) {
        return next(new AppError('Your cart is empty. Cannot checkout.', 400));
    }

    // تجهيز مصفوفة عناصر الطلب والتحقق من المخزون والكميات المتوفرة
    const orderItems = [];
    for (const item of cart.items) {
        if (!item.product) {
            return next(new AppError('One of the products in your cart no longer exists.', 404));
        }
        
        // هنا يمكنكِ إضافة منطق التحقق من المخزون (Stock Verification) إذا كان مدعوماً في موديل المنتج الخاص بكِ
        orderItems.push({
            product: item.product._id,
            quantity: item.quantity
        });
    }

    // إنشاء الطلب الجديد في قاعدة البيانات
    const newOrder = await Order.create({
        items: orderItems,
        totalPrice: cart.totalPrice,
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

// 2. جلب جميع الطلبات وعرضها (7.3 Order Read Endpoints)
exports.getAllOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find().populate('items.product');

    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: { orders }
    });
});

// 3. جلب طلب واحد محدد بالـ ID
exports.getOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
        return next(new AppError('No order found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { order }
    });
});

// 4. تحديث حالة الطلب (7.4 Update Order Status)
exports.updateOrderStatus = catchAsync(async (req, res, next) => {
    const { status } = req.body;

    // التحقق من أن الحالة المرسلة تتبع الخيارات المتاحة فقط
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
