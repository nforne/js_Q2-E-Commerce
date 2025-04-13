// Fetch transactions based on user
export const getTransactionsByUser = async (userId) => {
  try {
    const response = await fetch(`https://your-api.com/users/${userId}/transactions`);
    if (!response.ok) throw new Error("Failed to fetch transactions");
    return await response.json();
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    return [];
  }
};

export const getTransactionsByIds = async (transactionIds) => {
  try {
    const response = await fetch("https://your-api.com/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionIds }),
    });

    if (!response.ok) throw new Error("Failed to fetch transactions");
    return await response.json();
  } catch (error) {
    console.error("Error fetching transactions by IDs:", error);
    return [];
  }
};

// Fetch products based on user
export const getProductsByUser = async (userId) => {
  try {
    const response = await fetch(`https://your-api.com/users/${userId}/products`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return await response.json();
  } catch (error) {
    console.error("Error fetching user products:", error);
    return [];
  }
};

export const getProductsByIds = async (productIds) => {
  try {
    const response = await fetch("https://your-api.com/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIds }),
    });

    if (!response.ok) throw new Error("Failed to fetch products");
    return await response.json();
  } catch (error) {
    console.error("Error fetching products by IDs:", error);
    return [];
  }
};

// Fetch messages
export const getMessagesByUser = async (userId) => {
  try {
    const response = await fetch(`https://your-api.com/users/${userId}/messages`);
    if (!response.ok) throw new Error("Failed to fetch messages");
    return await response.json();
  } catch (error) {
    console.error("Error fetching user messages:", error);
    return [];
  }
};

export const getMessagesByIds = async (messageIds) => {
  try {
    const response = await fetch("https://your-api.com/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageIds }),
    });

    if (!response.ok) throw new Error("Failed to fetch messages");
    return await response.json();
  } catch (error) {
    console.error("Error fetching messages by IDs:", error);
    return [];
  }
};

// Fetch reviews
export const getReviewsByUser = async (userId) => {
  try {
    const response = await fetch(`https://your-api.com/users/${userId}/reviews`);
    if (!response.ok) throw new Error("Failed to fetch reviews");
    return await response.json();
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return [];
  }
};

export const getReviewsByIds = async (reviewIds) => {
  try {
    const response = await fetch("https://your-api.com/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewIds }),
    });

    if (!response.ok) throw new Error("Failed to fetch reviews");
    return await response.json();
  } catch (error) {
    console.error("Error fetching reviews by IDs:", error);
    return [];
  }
};
