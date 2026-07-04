const Category = require('../models/category');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// 1. إنشاء تصنيف جديد (Create)
exports.createCategory = catchAsync(async (req, res, next) => {
    const newCategory = await Category.create(req.body);
    res.status(201).json({
        status: 'success',
        data: { category: newCategory }
    });
});

// 2. جلب جميع التصنيفات (Read All)
exports.getAllCategories = catchAsync(async (req, res, next) => {
    const categories = await Category.find();
    res.status(200).json({
        status: 'success',
        results: categories.length,
        data: { categories }
    });
});

// 3. تعديل تصنيف محدد (Update)
exports.updateCategory = catchAsync(async (req, res, next) => {
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!updatedCategory) {
        return next(new AppError('No category found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { category: updatedCategory }
    });
});

// 4. حذف تصنيف محدد (Delete)
exports.deleteCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
        return next(new AppError('No category found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
