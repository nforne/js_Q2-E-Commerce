export const processPayment = (formData, total) => {
  if (!formData.name || !formData.address) return "Error: Please fill out all fields.";
  return `Payment of $${total.toFixed(2)} via ${formData.paymentMethod} processed successfully!`;
};
