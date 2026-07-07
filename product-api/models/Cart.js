const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: [true, 'Cart item must have a product ID']
            },
            quantity: {
                type: Number,
                required: [true, 'Cart item must have a quantity'],
                min: [1, 'Quantity cannot be less than 1'],
                default: 1
            },
            price: {
                type: Number,
                required: [true, 'Cart item must have a price']
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);

