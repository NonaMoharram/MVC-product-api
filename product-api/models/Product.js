const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a product description'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Please add a product price']
    },
    stock: {
        type: Number,
        required: [true, 'Please add product stock quantity'],
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please add a product category']
    },
    images: {
        type: [String],
        required: [true, 'Please add product images']
    },
    inStock: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

