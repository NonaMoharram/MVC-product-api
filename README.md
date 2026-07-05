# 🛒 E-Commerce Shop API (Digital Egypt Cubs - Task 10)

A complete Node.js & Express RESTful API for an E-Commerce system developed with MVC Architecture and MongoDB.

## 🚀 10.1 Project Features
- **Product Management:** Full CRUD operations for products.
- **Category Management:** Full CRUD operations for organizing products.
- **Shopping Cart:** Add, update, view, and clear products in the cart with auto price calculation.
- **Order & Checkout:** Complete checkout process and order status updates.
- **Global Error Handling:** Centralized custom middleware for clean error tracking.

---

## 🛠️ 10.2 Prerequisites & Installation

### Prerequisites
Make sure you have **Node.js** and **MongoDB** installed on your system.

### Installation Steps
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

## ⚙️ 10.3 Environment Variables Table

Create a `.env` file inside your config directory and add the following keys:

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `PORT` | The port number your server will run on | `5000` |
| `DATABASE_URL` | Your MongoDB connection string | `mongodb://localhost:27017/shop` |

---

## 📍 10.4 API Endpoints & Project Structure

### Project Structure
```text
PROJECT TERM1 EYOUTH/
├── product-api/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── My Shop API.postman_collection.json
└── README.md
```

### Main Endpoints
- **Products:** `GET /api/products`, `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`
- **Categories:** `GET /api/categories`, `POST /api/categories`, `PATCH /api/categories/:id`, `DELETE /api/categories/:id`
- **Cart:** `GET /api/cart`, `POST /api/cart`, `PUT /api/cart/update`, `DELETE /api/cart`
- **Orders:** `POST /api/orders`, `GET /api/orders`, `PATCH /api/orders/:id`
