
const PaymentTypeEnum = Object.freeze({
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal',
  OTHER: 'other', // Extendable for additional payment types
});

class PaymentMethod {
  constructor(payment_id, card_number, expiry_date, payment_type, isDefault) {
    if (!Object.values(PaymentTypeEnum).includes(payment_type)) {
      throw new Error(`Invalid payment type: ${payment_type}. Allowed types are ${Object.values(PaymentTypeEnum).join(', ')}.`);
    }

    this.payment_id = payment_id; // Unique identifier for the payment method
    this.card_number = card_number; // Masked card number (e.g., **** **** **** 1234)
    this.expiry_date = expiry_date; // Card expiration date
    this.payment_type = payment_type; // Enum: credit_card, debit_card, paypal, etc.
    this.isDefault = isDefault; // Boolean: true if the payment method is default
  }

  // Method to update payment details (e.g., card number or expiry date)
  updatePaymentDetails(fields) {
    for (const [key, value] of Object.entries(fields)) {
      if (this.hasOwnProperty(key) && key !== 'payment_id') {
        this[key] = value;
      }
    }
  }

  // Method to set the payment method as default
  setAsDefault() {
    this.isDefault = true;
  }
}

export default { PaymentMethod, PaymentTypeEnum };
