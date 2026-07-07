const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.route('/')
    .get(cartController.getCart)
    .post(cartController.addToCart)
    .delete(cartController.clearCart);

router.route('/update')
    .patch(cartController.updateCartItem)
    .put(cartController.updateCartItem);

module.exports = router;




