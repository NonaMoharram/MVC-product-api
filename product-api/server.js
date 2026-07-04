const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const productRoutes = require('./routes/productRoutes');

// Load environment config
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Body Parser Middleware
app.use(express.json());

// Mount Routing Files
app.use('/api/products', productRoutes);

const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT ||5000;

// وظيفته التعامل مع أي مسار غير موجود في السيرفر (404)
app.all('*', (req, res, next) => {
  const AppError = require('./utils/appError');
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// المستقبل المركزي للأخطاء (Central Error Handler Middleware)
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack // يعرض مكان الخطأ بالتفصيل أثناء التطوير
  });
});

app.listen(PORT, () => {
  console.log(`Server running in environment mode on port: ${PORT}`);
});
