require("dotenv").config(); // السطر الأول تماماً
const mongoose = require('mongoose');

// استدعاء الموديلات الأربعة كاملة
const Category = require('./models/category.model');
const Product = require('./models/product.model');
const Cart = require('./models/cart.model');   
const Order = require('./models/order.model'); 

const seedDatabase = async () => {
    try {
        // الاتصال بقاعدة البيانات
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB Connected for seeding...');

        // Sub-task 2: تنظيف البيانات بالترتيب الإلزامي لمنع reference errors
        await Order.deleteMany(); 
        await Cart.deleteMany();
        await Product.deleteMany();
        await Category.deleteMany();
        console.log('Database cleaned up successfully (Orders -> Carts -> Products -> Categories).');

        // Sub-task 3: إدخال البيانات التجريبية (3 فئات على الأقل)
        const categories = await Category.insertMany([
            { name: 'Electronics', description: 'Gadgets and electronic devices', slug: 'electronics' },
            { name: 'Clothes', description: 'Apparel and fashionable clothing', slug: 'clothes' },
            { name: 'Shoes', description: 'Footwear for all ages', slug: 'shoes' }
        ]);
        console.log(`${categories.length} Categories added.`);

        // جلب الـ IDs الخاصة بالفئات المضافة لربط المنتجات بها بشكل صحيح
        const electronicsId = categories[0]._id;
        const clothesId = categories[1]._id;
        const shoesId = categories[2]._id;

        // إدخال 6 منتجات موزعة على الـ 3 فئات
        const products = await Product.insertMany([
            { name: 'Laptop', description: 'High performance laptop', price: 999, stock: 10, category: electronicsId, images: ['laptop.jpg'] },
            { name: 'Smartphone', description: 'Latest flagship smartphone', price: 699, stock: 15, category: electronicsId, images: ['phone.jpg'] },
            { name: 'T-Shirt', description: 'Cotton summer t-shirt', price: 25, stock: 50, category: clothesId, images: ['tshirt.jpg'] },
            { name: 'Jeans', description: 'Slim fit denim jeans', price: 40, stock: 30, category: clothesId, images: ['jeans.jpg'] },
            { name: 'Running Shoes', description: 'Comfortable athletic shoes', price: 80, stock: 20, category: shoesId, images: ['running.jpg'] },
            { name: 'Leather Boots', description: 'Classic brown leather boots', price: 120, stock: 12, category: shoesId, images: ['boots.jpg'] }
        ]);

        // Sub-task 4: رسالة نجاح توضح عدد المستندات المضافة
        console.log(`Data Seeding completed successfully! Added ${products.length} products.`);

    } catch (error) {
        console.error('Error during database seeding:', error);
    } finally {
        // Sub-task 4: قطع الاتصال إلزامياً داخل الـ finally block
        await mongoose.disconnect();
        console.log('Mongoose disconnected cleanly.');
    }
};

seedDatabase();


