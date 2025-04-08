const userSample = {
  "user_id": "u123",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "password": "hashed_password_123",
  "created_at": "2025-03-25T00:00:00.000Z",
  "role": "customer",
  "shopping_cart": [],
  "transactions": ["t567"],
  "addresses": [
    {
      "address_id": "a1",
      "house_number": "123",
      "apt_number": "10B",
      "street": "Maple Street",
      "city": "Toronto",
      "state": "Ontario",
      "postal_code": "M1X 1A1",
      "country": "Canada",
      "isDefault": true
    }
  ],
  "payment_methods": [
    {
      "payment_id": "p1",
      "card_number": "**** **** **** 1234",
      "expiry_date": "2026-01-01T00:00:00.000Z",
      "payment_type": "credit_card",
      "isDefault": true
    }
  ],
  "privileges": {
    "shopping": {
      "isGranted": true,
      "description": "Allows the user to make purchases.",
      "granted_by": "admin123",
      "granted_at": "2025-03-25T00:00:00.000Z"
    }
  },
  "messages": []
};

const transactionSample = {
  "transaction_id": "t567",
  "user_id": "u123",
  "vendor_id": "v456",
  "total_amount": 149.99,
  "payment_method_id": "p1",
  "transaction_date": "2025-03-26T00:00:00.000Z",
  "shipping_address_id": "a1",
  "billing_address_id": "a1",
  "products": [
    {
      "product_id": "prod101",
      "unit_price": 49.99,
      "quantity": 3
    }
  ],
  "tracking_status": [
    {
      "tracking_id": "track1",
      "status": "purchased",
      "status_date": "2025-03-26T00:00:00.000Z",
      "latitude": 43.6532,
      "longitude": -79.3832
    }
  ],
  "messages": ["m001"]
};

const messageSample = {
  "message_id": "m001",
  "transaction_id": "t567",
  "sender_id": "u123",
  "receiver_id": "v456",
  "content": {
    "latest": "Hi! Can you confirm if the order has been shipped?",
    "archive": ["Order placed successfully. Thank you!"]
  },
  "sent_at": "2025-03-26T10:00:00.000Z",
  "is_read": false
};

const reviewSample = {
  "message_id": "m001",
  "transaction_id": "t567",
  "sender_id": "u123",
  "receiver_id": "v456",
  "content": {
    "latest": "Hi! Can you confirm if the order has been shipped?",
    "archive": ["Order placed successfully. Thank you!"]
  },
  "sent_at": "2025-03-26T10:00:00.000Z",
  "is_read": false
};

const productSample = {
  "product_id": "prod101",
  "name": "Wireless Headphones",
  "description": {
    "short": "High-quality wireless headphones.",
    "long": "Experience the ultimate sound quality with noise-canceling technology and long-lasting battery.",
    "specs": {
      "weight": "250g",
      "color": "Black",
      "dimensions": "15cm x 10cm x 7cm"
    },
    "features": ["Bluetooth 5.0", "Active Noise Cancellation", "Up to 20 hours of playback"]
  },
  "price": 49.99,
  "stock_quantity": 150,
  "category_id": "Electronics",
  "business_id": "b123"
};

/*
{
  "users": {
    "create": {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123",
      "role": "customer"
    },
    "update": {
      "name": "Jane Doe"
    }
  },
  "transactions": {
    "create": {
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
    },
    "update": {
      "status": "completed"
    }
  },
  "reviews": {
    "create": {
      "user_id": "customer123",
      "product_id": "prod789",
      "rating": 5,
      "comment": "Amazing product! Highly recommended."
    },
    "update": {
      "comment": "Updated feedback. Still love the product!"
    }
  },
  "products": {
    "create": {
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
      "business_id": "vendor456"
    },
    "update": {
      "price": 25,
      "stock_quantity": 120
    }
  },
  "messages": {
    "create": {
      "transaction_id": "trans123",
      "sender_id": "customer123",
      "receiver_id": "vendor456",
      "content": "Hello! Can I get an update on my order status?"
    },
    "update": {
      "content": "Updated message content. Please disregard the earlier message."
    }
  }
}

*/

/*
{
  "users": {
    "create": {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123",
      "role": "customer"
    },
    "update": {
      "name": "Jane Doe",
      "email": "jane.doe@example.com" // Optional fields for user updates
    }
  },
  "transactions": {
    "create": {
      "user_id": "customer123",
      "vendor_id": "vendor456",
      "products": [
        {
          "product_id": "prod789",
          "quantity": 2
        },
        {
          "product_id": "prod101",
          "quantity": 1
        }
      ],
      "total_amount": 75, // Updated to reflect multiple products
      "shipping_address_id": "addr123",
      "billing_address_id": "addr124"
    },
    "update": {
      "status": "completed" // Example update for a transaction's status
    }
  },
  "reviews": {
    "create": {
      "user_id": "customer123",
      "product_id": "prod789",
      "rating": 5,
      "comment": "Amazing product! Highly recommended.",
      "vendor_id": "vendor456" // Added vendor_id for context
    },
    "update": {
      "comment": "Updated feedback. Still love the product!",
      "rating": 4 // Optionally update the rating
    }
  },
  "products": {
    "create": {
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
      "reorder_threshold": 10 // Added reorder threshold for stock management
    },
    "update": {
      "price": 25,
      "stock_quantity": 120,
      "reorder_threshold": 15 // Example update for stock management
    }
  },
  "messages": {
    "create": {
      "transaction_id": "trans123",
      "sender_id": "customer123",
      "receiver_id": "vendor456",
      "content": "Hello! Can I get an update on my order status?"
    },
    "update": {
      "content": "Updated message content. Please disregard the earlier message."
    },
    "markAsRead": {
      "transaction_id": "trans123",
      "receiver_id": "vendor456"
    }
  }
}

*/
