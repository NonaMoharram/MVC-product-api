# 🛒 E-Commerce Shop API 

A complete, production-ready Node.js & Express RESTful API for an E-Commerce system developed with MVC Architecture and MongoDB/Mongoose. This project covers comprehensive core functionalities including advanced product filtering, a secure shopping cart system with automatic stock drop mechanics, robust server-side checkout validation, and global centralized error handling.

---

## 🚀 Project Features
- **Product Management:** Full CRUD operations for products with advanced dynamic parsing query filters (`category`, `minPrice`, `maxPrice`, `inStock`, `search`).
- **Category Management:** Full CRUD operations for organizing products with automated unique slug generation.
- **Shopping Cart:** Add, update, view, and clear products in the cart with precise stock count validation and auto-drop mechanics if the item quantity hits 0.
- **Order & Checkout:** Strict server-side `totalPrice` calculations, item inventory reductions, and immediate post-purchase cart clearing.
- **Global Error Handling:** Centralized custom middleware for clean error tracking, preventing runtime crashes and handling database exceptions gracefully.
----

## 🛠️ Prerequisites & Installation

### Prerequisites
Ensure you have the following software installed locally on your machine:
- **Node.js** (v16.x or higher)
- **MongoDB** (v5.x or higher running locally or MongoDB Atlas)
- **npm** (Node Package Manager)

### Step-by-Step Installation Order

1. **Clone the Repository:**
   ```bash
   git clone <your-repository-github-url>
   cd project-term1-eyouth-Copy/product-api
   ```

2. **Install Node Packages:**
   ```bash
   npm install
   ```

3. **Set Up the Environment Variables:**
   Create a `.env` file at the root directory of the `product-api` folder and populate it using the variables listed in the environment table below.

4. **Seed the Database:**
   Populate your local MongoDB instance with default mockup sample categories and products by executing the seeding script:
   ```bash
   node seed.js
   ```

5. **Run the Development Server:**
   Launch the system using `nodemon` to enable real-time change synchronization:
   ```bash
   npm run dev
   ```

---

## 📊 Environment Variables Table

Create a `.env` file inside your root directory and add the following keys:

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `PORT` | The port number your server will run on | `5000` |
| `MONGO_URI` | Your MongoDB connection string | `mongodb://localhost:27017/testdb` |
| `NODE_ENV` | The environment mode state (development/production) | `development` |

---
## 📂 10.4 API Endpoints & Project Structure

### 🌲 Project Structure
```text
PROJECT TERM1 EYOUTH/
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
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── cart.model.js
│   │   ├── category.model.js
│   │   ├── order.model.js
│   │   └── product.model.js
│   ├── node_modules/
│   ├── routes/
│   │   ├── cartRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   └── productRoutes.js
│   ├── utils/
│   │   ├── AppError.js
│   │   └── asyncHandler.js
│   │   
│   ├── view/
│   │   └── index.html
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   ├──  app.js
│   └── seed.js
├── git.txt
├── postman/
│       └──E-Commerce API Dev.postman_collection
├── .git
└── README.md
```

### 🔗 Main Endpoints Map

* **Categories Endpoints:** 
  - `GET` `/api/categories` - Fetch all saved platform categories.
  - `POST` `/api/categories` - Formulate a brand new catalog storage category.
  - `PATCH` `/api/categories/:id` - Perform incremental descriptor column edits on an index.
  - `DELETE` `/api/categories/:id` - Destroy a category element fully (Returns 204 No Content).

* **Products Endpoints:** 
  - `GET` `/api/products` - Fetch products with advanced dynamic query filter params (`category`, `minPrice`, `maxPrice`, `inStock`, `search`).
  - `POST` `/api/products` - Create and inject a new inventory product file document.
  - `PATCH` `/api/products/:id` - Update attributes parameters details of an item safely.
  - `DELETE` `/api/products/:id` - Purge a targeted product stock listing entirely (Returns 204 No Content).

* **Cart Endpoints:** 
  - `GET` `/api/cart` - Review existing items present inside active basket schema layout.
  - `POST` `/api/cart/add` - Append product selection allocations validating current database counts.
  - `PATCH` `/api/cart/update` - Modify quantity metrics (Auto-drops document entry if quantity <= 0).
  - `DELETE` `/api/cart` - Reset and purge overall active cart items (Returns 200 empty cart structure).

* **Orders Endpoints:** 
  - `GET` `/api/orders` - Review a comprehensive collection log statement of all orders.
  - `GET` `/api/orders/:id` - Extract tracking summary diagnostics for a distinct individual id.
  - `POST` `/api/orders` - Execute checkout loop processes evaluating stock availability.
  - `PATCH` `/api/orders/:id/status` - Modify ongoing status delivery metrics safely (`pending`, `confirmed`, `shipped`, `delivered`, `cancelled`).
