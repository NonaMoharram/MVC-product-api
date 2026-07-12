const Category = require('../models/category.model');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
// 1. إنشاء تصنيف جديد (Create)
exports.createCategory = asyncHandler(async (req, res, next) => {
    const newCategory = await Category.create(req.body);
    res.status(201).json({
        status: 'success',
        message: 'Category created successfully',
        data: { category: newCategory }
    });
});
// 2. جلب جميع التصنيفات (Read All)
exports.getAllCategories = asyncHandler(async (req, res, next) => {
    const categories = await Category.find();
    res.status(200).json({
        status: 'success',
        message: 'Categories fetched successfully',
        results: categories.length,
        data: { categories }

    });
});
// 5. جلب تصنيف محدد بالـ ID (Get Single Category)
exports.getCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return next(new AppError('No category found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Category fetched successfully',
        data: { category }
    });
});
// 3. تعديل تصنيف محدد (Update)
exports.updateCategory = asyncHandler(async (req, res, next) => {
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!updatedCategory) {
        return next(new AppError('No category found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Category updated successfully',
        data: { category: updatedCategory }
    });
});
// 4. حذف تصنيف محدد (Delete)
exports.deleteCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
        return next(new AppError('No category found with that ID', 404));
    }

    res.status(204).send();
});
