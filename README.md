# 🛒 E-Commerce Shop API (Digital Egypt Cubs - Task 10)

A complete Node.js & Express RESTful API for an E-Commerce system developed with MVC Architecture and MongoDB/Mongoose.

---

## 🚀 10.1 Project Features
- **Product Management:** Full CRUD operations for products.
- **Category Management:** Full CRUD operations for organizing products.
- **Shopping Cart:** Add, update, view, and clear products in the cart with auto price calculation.
- **Order & Checkout:** Complete checkout process and order status updates.
- **Global Error Handling:** Centralized custom middleware for clean error tracking (e.g., custom 400 errors for invalid IDs).

---

## 🛠️ 10.2 Prerequisites & Installation

### 💻 Prerequisites
Make sure you have **Node.js** and **MongoDB** installed on your system.

### 📥 Installation Steps
1. Clone the project and open the terminal inside the directory:
   ```bash
   cd product-api
   ```

2. Install all required dependencies:
   ```bash
   npm install
   ```

3. Run the server using nodemon for automatic updates:
   ```bash
   npm run dev
   ```
---

## 📊 10.3 Environment Variables Table

Create a `.env` file inside your root directory and add the following keys:

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `PORT` | The port number your server will run on | `5000` |
| `MONGO_URI` | Your MongoDB connection string | `mongodb://localhost:27017/testdb` |

---

## 📂 10.4 API Endpoints & Project Structure

### 🌲 Project Structure
```text
PROJECT TERM1 EYOUTH/
├── .git/
├── product-api/
│   ├── config/
│   │   └── config.js
│   ├── controllers/
│   │   ├── cartController.js
│   │   ├── categoryController.js
│   │   ├── orderController.js
│   │   └── productController.js
│   ├── db/
│   │   └── db.js
│   ├── MiddleWare/
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Cart.js
│   │   ├── category.js
│   │   ├── Order.js
│   │   └── Product.js
│   ├── node_modules/
│   ├── routes/
│   │   ├── cartRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   └── productRoutes.js
│   ├── utils/
│   │   ├── appError.js
│   │   ├── asyncHandler.js
│   │   └── seeder.js
│   ├── view/
│   │   └── envexample
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── git.txt
├── E-Commerce API Dev.postman_collection.json
└── README.md
```

### 🔗 Main Endpoints

* **Categories:** 
  * `GET` `/api/categories` - Get all categories
  * `POST` `/api/categories` - Create a new category
  * `GET` `/api/categories/:id` - Get category by ID
  * `PATCH` `/api/categories/:id` - Update category by ID
  * `DELETE` `/api/categories/:id` - Delete category by ID

* **Products:** 
  * `GET` `/api/products` - Get all products
  * `POST` `/api/products` - Create a new product
  * `GET` `/api/products/:id` - Get single product details
  * `PUT` `/api/products/:id` - Update product by ID
  * `DELETE` `/api/products/:id` - Delete product by ID

* **Cart:** 
  * `GET` `/api/cart` - View current shopping cart
  * `POST` `/api/cart` - Add a product to the cart
  * `PUT` `/api/cart/update` - Update item quantity in cart
  * `DELETE` `/api/cart` - Clear entire cart
  * `DELETE` `/api/cart` *(with JSON Body `productId`)* - Remove single item from cart

* **Orders:** 
  * `POST` `/api/orders` - Checkout and place an order
  * `GET` `/api/orders` - Get all orders
  * `GET` `/api/orders/:id` - Get single order details
  * `PATCH` `/api/orders/:id` - Update order status
  * `GET` `/api/orders/my-orders` - Get orders of the logged-in user
