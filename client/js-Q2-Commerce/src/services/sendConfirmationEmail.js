export const sendConfirmationEmail = async (orderDetails) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Email sent to ${orderDetails.email} confirming order of $${orderDetails.total.toFixed(2)}`);
      resolve();
    }, 2000);
  });
};
