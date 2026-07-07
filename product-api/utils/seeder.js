const mongoose = require('mongoose');
const dotenv = require('dotenv');

// استدعاء الموديلات الأربعة الأساسية
const Category = require('../models/category');
const Product = require('../models/Product');
const Order = require('../models/Order');

// 1. تحميل إعدادات البيئة كأول سطر
dotenv.config({ path: './.env' });

const seedDatabase = async () => {
    try {
        // الاتصال بقاعدة البيانات والانتظار
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB Connected for seeding...');

        // 2. ترتيب الحذف الإلزامي: Orders -> Products -> Categories
        await Order.deleteMany();
        await Product.deleteMany();
        await Category.deleteMany();
        console.log('Database cleaned up successfully (Orders -> Products -> Categories).');

        // 3. إدخال البيانات التجريبية: على الأقل 3 تصنيفات
        const categories = await Category.insertMany([
            { name: 'Electronics', description: 'Gadgets and electronic devices', slug: 'electronics' },
            { name: 'Clothes', description: 'Apparel and fashionable clothing', slug: 'clothes' },
            { name: 'Shoes', description: 'Footwear for all ages', slug: 'shoes' }
        ]);
        console.log(`${categories.length} Categories added.`);

        // جلب الـ IDs الخاصة بالتصنيفات لربط المنتجات بها بشكل صحيح
        const electronicsId = categories[0]._id;
        const clothesId = categories[1]._id;
        const shoesId = categories[2]._id;

        // إدخال البيانات التجريبية: على الأقل 6 منتجات مربوطة بالـ Category الصحيح
        const products = await Product.insertMany([
            { name: 'Laptop', description: 'High performance laptop', price: 999, stock: 10, category: electronicsId, images: ['laptop.jpg'] },
            { name: 'Smartphone', description: 'Latest flagship smartphone', price: 699, stock: 15, category: electronicsId, images: ['phone.jpg'] },
            { name: 'T-Shirt', description: 'Cotton summer t-shirt', price: 25, stock: 50, category: clothesId, images: ['tshirt.jpg'] },
            { name: 'Jeans', description: 'Slim fit denim jeans', price: 40, stock: 30, category: clothesId, images: ['jeans.jpg'] },
            { name: 'Running Shoes', description: 'Comfortable athletic shoes', price: 80, stock: 20, category: shoesId, images: ['running.jpg'] },
            { name: 'Leather Boots', description: 'Classic brown leather boots', price: 120, stock: 12, category: shoesId, images: ['boots.jpg'] }
        ]);
        console.log(`${products.length} Products added.`);

        console.log('Data Seeding Completed Successfully! 🌱');

        // 4. إغلاق الاتصال في النهاية وطباعة التقرير
        await mongoose.disconnect();
        console.log('Mongoose disconnected cleanly.');
        process.exit();

    } catch (error) {
        console.error('Error during database seeding:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
};

// تشغيل السكريبت تلقائياً
seedDatabase();

