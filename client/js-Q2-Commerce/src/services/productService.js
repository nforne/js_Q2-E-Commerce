export const fetchProductsByCategory = async (category) => {
  const products = {
    featured: [
      { id: 1, name: "Wireless Headphones", price: 199.99, image: "/images/headphones.jpg" },
      { id: 2, name: "Smart Watch", price: 149.99, image: "/images/smartwatch.jpg" }
    ],
    "new-arrivals": [
      { id: 3, name: "Bluetooth Speaker", price: 89.99, image: "/images/speaker.jpg" },
      { id: 4, name: "Gaming Mouse", price: 59.99, image: "/images/mouse.jpg" }
    ],
    "best-sellers": [
      { id: 5, name: "USB-C Charger", price: 39.99, image: "/images/charger.jpg" },
      { id: 6, name: "Mechanical Keyboard", price: 129.99, image: "/images/keyboard.jpg" }
    ],
    deals: [
      { id: 7, name: "Noise-Canceling Earbuds", price: 79.99, image: "/images/earbuds.jpg" },
      { id: 8, name: "Portable Power Bank", price: 29.99, image: "/images/powerbank.jpg" }
    ]
  };
  return products[category] || [];
};

export const fetchProductById = async (id) => {
  const products = [
    { id: "1", name: "Wireless Headphones", price: 199.99, description: "Premium sound quality", image: "/images/headphones.jpg" },
    { id: "2", name: "Smart Watch", price: 149.99, description: "Track your health and fitness", image: "/images/smartwatch.jpg" },
    { id: "3", name: "Bluetooth Speaker", price: 89.99, description: "Rich bass and clear sound", image: "/images/speaker.jpg" }
  ];
  return products.find((p) => p.id === id) || null;
};

