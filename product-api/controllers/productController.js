const Product = require('../models/product.model');
const Category = require('../models/category.model'); // استدعاء موديل التصنيفات للتحقق منه
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

// 1. إنشاء منتج جديد مع التحقق من الـ Category
exports.createProduct = asyncHandler(async (req, res, next) => {
    // التحقق من وجود التصنيف في قاعدة البيانات أولاً
    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
        return next(new AppError('Category not found. Please provide a valid category ', 404));
    }

    const newProduct = await Product.create(req.body);
    res.status(201).json({
        status: 'success',
        data: { product: newProduct }
    });
});

exports.getProducts = asyncHandler(async (req, res, next) => {

 const queryObj = { ...req.query };
 const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
 excludedFields.forEach(el => delete queryObj[el]);

 if (req.query.minPrice || req.query.maxPrice) {
     queryObj.price = {};
     if (req.query.minPrice) queryObj.price.$gte = Number(req.query.minPrice);
     if (req.query.maxPrice) queryObj.price.$lte = Number(req.query.maxPrice);
     
     delete queryObj.minPrice;
     delete queryObj.maxPrice;
 }


 if (req.query.instock) {
     queryObj.instock = req.query.instock === 'true';
 }

 if (req.query.search) {
     const searchRegex = new RegExp(req.query.search, 'i');
     queryObj.$or = [
         { name: searchRegex },
         { description: searchRegex }
     ];
 }
 let query = Product.find(queryObj);
    
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

