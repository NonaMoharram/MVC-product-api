const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

// مسار جلب كل التصنيفات وإنشاء تصنيف جديد
router
    .route('/')
    .get(categoryController.getAllCategories)
    .post(categoryController.createCategory);

// مسار تعديل وحذف تصنيف معين عن طريق الـ ID
router
    .route('/:id')
    .put(categoryController.updateCategory)
    .delete(categoryController.deleteCategory);

module.exports = router;
