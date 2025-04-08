
class CartItem {
  constructor(product_id, unit_price, quantity) {
    this.product_id = product_id; // ID of the product purchased
    this.unit_price = unit_price; // Price at the time of purchase
    this.quantity = quantity; // Quantity purchased
  }
}

export default CartItem;
