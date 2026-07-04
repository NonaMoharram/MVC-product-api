const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

// مسار لإتمام الشراء وجلب كافة الطلبات
router
    .route('/')
    .get(orderController.getAllOrders)
    .post(orderController.checkout);

// مسار لجلب طلب محدد أو تحديث حالته باستخدام الـ ID
router
    .route('/:id')
    .get(orderController.getOrder)
    .patch(orderController.updateOrderStatus);

module.exports = router;
