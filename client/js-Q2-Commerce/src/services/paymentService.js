export const processPayment = async (formData, total) => {
  if (!formData.name || !formData.address || !formData.paymentMethod) {
    return { success: false, message: "Error: Please fill out all required fields." };
  }

  if (total <= 0) {
    return { success: false, message: "Error: Payment amount must be greater than zero." };
  }

  const supportedMethods = ["Credit Card", "PayPal", "Apple Pay", "Google Pay"];
  if (!supportedMethods.includes(formData.paymentMethod)) {
    return { success: false, message: "Error: Unsupported payment method." };
  }

  try {
    // 🔗 If a real API is available, make the request here
    const response = await fetch("https://your-payment-api.com/process-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        address: formData.address,
        paymentMethod: formData.paymentMethod,
        amount: total.toFixed(2),
      }),
    });

    if (!response.ok) throw new Error("Payment processing failed");

    const data = await response.json();
    return {
      success: true,
      message: `Payment of $${total.toFixed(2)} via ${formData.paymentMethod} processed successfully!`,
      transactionId: data.transactionId,
    };
  } catch (error) {
    console.error("Error processing payment:", error);
    return { success: false, message: "Payment failed. Please try again." };
  }
};



/*

export const processPayment = (formData, total) => {
  if (!formData.name || !formData.address) return "Error: Please fill out all fields.";
  return `Payment of $${total.toFixed(2)} via ${formData.paymentMethod} processed successfully!`;
};

*/