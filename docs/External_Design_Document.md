
---

# **External Design Document for Q2-Commerce**  
### **Version 1.0 | April 2025**  
### **Prepared by: nforne**

---

## **1. Introduction**

### **1.1 Purpose**  
Q2-Commerce is a robust, scalable platform that enables customers, vendors, and administrators to manage e-commerce operations seamlessly. Built with **React.js**, **Node.js**, and **Firebase Firestore**, the system prioritizes real-time synchronization, secure transactions, and efficient user management.

### **1.2 Scope**  
This document offers a detailed look into the platform's:
- Architecture for both frontend and backend.
- Database schema and workflows.
- API designs, security measures, and plans for scalability.

---

## **2. System Architecture**

### **2.1 Overview**  
Q2-Commerce employs a **modular client-server architecture**:
- **Frontend:** React.js for UI/UX, supporting reusable components and responsive design.
- **Backend:** Node.js with Express.js to process requests and interact with the database.
- **Database:** Firebase Firestore for NoSQL storage, ensuring real-time updates.

### **2.2 Workflow**  
- **Frontend:** Users interact with the system via dynamic components like `ProductCard` or `Cart`.
- **Backend:** The backend validates requests, processes logic, and communicates with Firestore.
- **Database:** Firestore stores data hierarchically and synchronizes changes instantly.

---

## **3. Backend Structure**

### **3.1 Modular Directory Breakdown**  
```
ecommerce-backend/
├── config/                  # Firebase setup and server configurations
├── controllers/             # Handles API request and business logic routing
├── models/                  # Firestore schema definitions
├── routes/                  # API endpoints
├── services/                # Business logic abstraction
├── server.js                # Entry point for the application
├── .env                     # Environment variables
└── README.md                # Documentation
```

### **3.2 Example Workflow**  
- **Cart Checkout Flow:**  
  1. Frontend triggers a `POST /transactions` API call.
  2. Backend controller validates cart contents.
  3. Firestore updates transaction records and adjusts product inventory.

---

## **4. Frontend Structure**

### **4.1 Modular Directory Breakdown**  
```
js-Q2-Commerce-Frontend/
├── assets/                # Static assets (e.g., images, fonts, icons)
├── styles/                # Global styles and scoped CSS
├── components/            # Reusable UI components (e.g., buttons, cards)
├── context/               # State management (e.g., AuthContext, CartContext)
├── hooks/                 # Custom hooks for API interaction and logic
├── pages/                 # Main application pages
├── services/              # API services for data fetching
├── utils/                 # Helper functions (e.g., formatters, validators)
├── App.jsx                # Root component integrating routing and context
└── index.jsx              # Entry point rendering App.jsx
```

### **4.2 Component Examples**  
- **ProductCard.jsx:**  
  Displays product details dynamically fetched from the API. Includes an "Add to Cart" button integrated with `CartContext`.

- **ThemeToggle.jsx:**  
  Allows users to switch between Dark, Grey, and Light themes via `ThemeContext`.

---

## **5. Firestore Data Schema**

### **5.1 Hierarchical Structure**  
Firestore organizes data into collections and documents:  
```
/users/{userId}             # User profiles (customer/vendor/admin)
/products/{productId}       # Product inventory
/orders/{orderId}           # Customer orders
/messages/{messageId}       # Transaction-related messages
/transactions/{transactionId} # Payments and order tracking
/reviews/{reviewId}         # Feedback for products and vendors
```

### **5.2 Example Documents**  
#### **User Document**  
```json
{
  "user_id": "12345",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "shopping_cart": []
}
```

#### **Product Document**  
```json
{
  "product_id": "p001",
  "name": "Wireless Headphones",
  "price": 99.99,
  "stock_quantity": 50,
  "vendor_id": "v123",
  "category": "Electronics"
}
```

---

## **6. Key Features**

### **6.1 User Management**  
- Role-based profiles (Customer, Vendor, Administrator).  
- Ability to update user details and manage privileges.

### **6.2 Transactions**  
- Create and update transactions.
- Adjust stock levels and notify vendors for restocking.

### **6.3 Messaging System**  
- Real-time communication tied to transactions.  
- Features include "mark as read" and "delete message."

### **6.4 Reviews**  
- Customers can provide feedback on purchased products or vendors.

### **6.5 Theme Customization**  
- Toggle between Dark, Grey, and Light themes via `ThemeContext`.

---

## **7. API Endpoints**

### **Users**  
- **Create User**:  
  ```json
  POST /users
  {
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
  ```

- **Update User**:  
  ```json
  PUT /users/:id
  {
    "name": "Jane Doe"
  }
  ```

### **Transactions**  
- **Create Transaction**:  
  ```json
  POST /transactions
  {
    "user_id": "12345",
    "vendor_id": "v456",
    "products": [
      {"product_id": "p001", "quantity": 2}
    ],
    "total_amount": 199.98
  }
  ```

---

## **8. Security**

### **8.1 Firestore Rules**  
Access control using role-based rules:  
```json
{
  "rules": {
    "users": {
      ".read": "auth.uid != null",
      ".write": "auth.uid === request.auth.token.user_id"
    },
    "transactions": {
      ".read": "auth.uid != null",
      ".write": "auth.uid === request.auth.token.user_id"
    }
  }
}
```

### **8.2 Encryption**  
Sensitive data such as passwords and transactions are encrypted before storage.

---

## **9. Scalability**

### **9.1 Firestore Optimization**  
- Indexing ensures fast querying for product searches.  
- Sharding collections prevents bottlenecks during high traffic.

### **9.2 Modular Architecture**  
Both frontend and backend structures support easy addition of new features.

---

## **10. Future Enhancements**

### **10.1 AI-Powered Recommendations**  
- Use Firebase ML Kit to recommend products based on user behavior.

### **10.2 Vendor Marketplace Expansion**  
- Enable third-party sellers to list and manage their inventory independently.

### **10.3 Automation**  
- Implement Firestore triggers to automate stock adjustments and order updates.

---