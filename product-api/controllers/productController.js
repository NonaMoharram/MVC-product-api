const Product = require('../models/Product');
const Category = require('../models/category'); // استدعاء موديل التصنيفات للتحقق منه
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

// 1. إنشاء منتج جديد مع التحقق من الـ Category
exports.createProduct = asyncHandler(async (req, res, next) => {
    // التحقق من وجود التصنيف في قاعدة البيانات أولاً
    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
        return next(new AppError('Category not found. Please provide a valid category ID', 404));
    }

    const newProduct = await Product.create(req.body);
    res.status(201).json({
        status: 'success',
        data: { product: newProduct }
    });
});

// 2. جلب كل المنتجات مع الفلترة المتقدمة والبحث
exports.getProducts = asyncHandler(async (req, res, next) => {
    // عمل نسخة من الـ query لتصفيتها
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search', 'minPrice', 'maxPrice'];
    excludedFields.forEach(el => delete queryObj[el]);

    // الفلترة الأساسية (مثل التصنيف والـ inStock)
    let query = Product.find(queryObj);

    // فلترة السعر: minPrice & maxPrice
    if (req.query.minPrice || req.query.maxPrice) {
        const priceQuery = {};
        if (req.query.minPrice) priceQuery.$gte = Number(req.query.minPrice);
        if (req.query.maxPrice) priceQuery.$lte = Number(req.query.maxPrice);
        query = query.find({ price: priceQuery });
    }

    // البحث النصي في الاسم والوصف (Search Filter)
    if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, 'i');
        query = query.find({
            $or: [{ name: searchRegex }, { description: searchRegex }]
        });
    }

    // عمل الـ populate للحقول المطلوبة فقط في التكليف (name & description)
    query = query.populate('category', 'name description');

    const products = await query;

    res.status(200).json({
        status: 'success',
        results: products.length,
        data: { products }
    });
});

// 3. جلب منتج محدد بالـ ID مع الـ populate المخصص
exports.getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('category', 'name description');

    if (!product) {
        return next(new AppError('No product found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { product }
    });
});

// 4. تعديل منتج محدد (Update Product)
exports.updateProduct = asyncHandler(async (req, res, next) => {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!updatedProduct) {
        return next(new AppError('No product found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { product: updatedProduct }
    });
});

// 5. حذف منتج محدد (Delete Product)
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
        return next(new AppError('No product found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

