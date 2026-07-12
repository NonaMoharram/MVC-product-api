const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./db/db');
const errorHandler = require('./middleware/errorHandler');
const app = express();
const AppError = require('./utils/AppError');

const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use(express.json());
app.use((req, res, next) => {
    if (req.body) req.body = mongoSanitize.sanitize(req.body);
    next();
  });

  
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// 404 Handler للمسارات غير الموجودة
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);
// تشغيل السيرفر 
const PORT = process.env.PORT || 5000;
app.listen(PORT, async() => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
});
