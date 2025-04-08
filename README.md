---

# Transaction and Communication Management System

## Overview

This project is a comprehensive platform designed to manage users, transactions, reviews, products, and communication between parties within transactions. It utilizes Firebase Firestore as its database and Joi for robust input validation. The system offers role-based access control to ensure secure and appropriate access to features based on user roles.

---

## Features

### Users
- **Create User**: Add new users with details such as name, email, password, and role (e.g., customer, vendor, administrator).
- **Update User**: Modify user information, such as name or email.

### Transactions
- **Create Transaction**: Handle purchases made by customers while adjusting product stock levels.
- **Update Transaction**: Update transaction statuses (e.g., `pending`, `completed`).
- **Reorder Alert**: Notify vendors when product stock falls below a predefined threshold during purchases.

### Reviews
- **Create Review**: Add customer reviews for vendors or products. Ensures users can only review purchased products or vendors with completed transactions.
- **Update Review**: Modify existing reviews with updated feedback or ratings.

### Products
- **Create Product**: Add new products, including descriptions, images, prices, stock quantities, and reorder thresholds.
- **Update Product**: Update product details, such as prices or stock levels.
- **Stock Management**: Automatically adjusts stock levels during purchases and triggers reorder alerts.

### Messages
- **Send Message**: Facilitate communication between customers and vendors tied to a specific transaction.
- **Update Message**: Modify the content of messages.
- **Mark as Read**: Enable message receivers to mark messages as read.
- **Delete Message**: Allow senders or administrators to delete messages.

---

## Technologies Used

- **Backend Framework**: Node.js and Express
- **Database**: Firebase Firestore
- **Validation**: Joi
- **Authentication**: JWT
- **Communication Management**: Custom Message model
- **Role-Based Access Control**: Ensures feature access based on user roles (e.g., customer, vendor, administrator).

---

## Installation and Setup

### Prerequisites
- Node.js installed
- Firebase Firestore configured (provide Firebase credentials)
- Postman or equivalent API testing tool for testing endpoints

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Firebase**:
   - Update `firebaseConfig.js` with your Firebase project credentials.

4. **Run the Application**:
   ```bash
   npm start
   ```

---

## API Endpoints

### Users
1. **Create User**:
   ```
   POST /users
   Request Body:
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123",
     "role": "customer"
   }
   ```
2. **Update User**:
   ```
   PUT /users/:id
   Request Body:
   {
     "name": "Jane Doe"
   }
   ```

### Transactions
1. **Create Transaction**:
   ```
   POST /transactions
   Request Body:
   {
     "user_id": "customer123",
     "vendor_id": "vendor456",
     "products": [
       {
         "product_id": "prod789",
         "quantity": 2
       }
     ],
     "total_amount": 50,
     "shipping_address_id": "addr123"
   }
   ```
2. **Update Transaction**:
   ```
   PUT /transactions/:id
   Request Body:
   {
     "status": "completed"
   }
   ```

### Reviews
1. **Create Review**:
   ```
   POST /reviews
   Request Body:
   {
     "user_id": "customer123",
     "product_id": "prod789",
     "rating": 5,
     "comment": "Amazing product! Highly recommended."
   }
   ```
2. **Update Review**:
   ```
   PUT /reviews/:id
   Request Body:
   {
     "comment": "Updated feedback. Still love the product!"
   }
   ```

### Products
1. **Create Product**:
   ```
   POST /products
   Request Body:
   {
     "name": "Sample Product",
     "description": {
       "text": "This is a sample product description.",
       "images": [
         "http://example.com/image1.jpg",
         "http://example.com/image2.jpg"
       ]
     },
     "price": 20,
     "stock_quantity": 100,
     "category_id": "cat123",
     "business_id": "vendor456",
     "reorder_threshold": 10
   }
   ```
2. **Update Product**:
   ```
   PUT /products/:id
   Request Body:
   {
     "price": 25,
     "stock_quantity": 120,
     "reorder_threshold": 15
   }
   ```

### Messages
1. **Create Message**:
   ```
   POST /messages
   Request Body:
   {
     "transaction_id": "trans123",
     "sender_id": "customer123",
     "receiver_id": "vendor456",
     "content": "Hello! Can I get an update on my order status?"
   }
   ```
2. **Update Message**:
   ```
   PUT /messages/:id
   Request Body:
   {
     "content": "Updated message content. Please disregard the earlier message."
   }
   ```
3. **Mark as Read**:
   ```
   PATCH /messages/:id/markAsRead
   ```
4. **Delete Message**:
   ```
   DELETE /messages/:id
   ```

---

## Testing

1. Use Postman to test the endpoints provided in the **API Endpoints** section.
2. Include appropriate headers for authentication where required (e.g., JWT tokens).

---

## Contributing

1. Fork the repository.
2. Create a new feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your commit message"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a Pull Request.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---