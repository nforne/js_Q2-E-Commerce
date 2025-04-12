import ContentContext from "./content.text.model.js";

class Product {
  constructor(
    product_id,
    name,
    description,
    price,
    stock_quantity,
    category_id,
    business_id
  ) {
    this.product_id = product_id; // Primary Key: Unique identifier for the product
    this.name = name; // Product name
    this.description = new ContentContext(description); // JSON object for product description. Contains product pictures
    this.price = price; // Current product price
    this.stock_quantity = stock_quantity; // Available stock
    this.category_id = category_id; // Foreign Key: Links to Categories
    this.business_id = business_id; // Foreign Key: Links to the business selling the product
  }

  // Method to update product details
  updateProductDetails(fields) {
    for (const [key, value] of Object.entries(fields)) {
      if (this.hasOwnProperty(key) && key !== 'product_id') {
        this[key] = value; // Update all fields except the primary key
      }
    }
  }

  // Method to adjust stock quantity
  adjustStockQuantity(amount) {
    this.stock_quantity += amount; // Increase or decrease stock
    if (this.stock_quantity < 0) {
      throw new Error("Stock quantity cannot be negative.");
    }
  }
}

export default Product;


/*
import ContentContext from "./content.text.model.js";

class Product {
  constructor(
    product_id,
    name,
    description,
    price,
    stock_quantity,
    category_id,
    business_id,
    reorder_threshold = 10 // Default reorder threshold
  ) {
    this.product_id = product_id; // Unique identifier for the product
    this.name = name; // Product name
    this.description = new ContentContext(description); // Description object with pictures and versioning
    this.price = price; // Product price
    this.stock_quantity = stock_quantity; // Available stock quantity
    this.category_id = category_id; // Links to category collection
    this.business_id = business_id; // Vendor or business owner
    this.reorder_threshold = reorder_threshold; // Minimum stock level before triggering an alert
  }

  // Method to update product details
  updateProductDetails(fields) {
    for (const [key, value] of Object.entries(fields)) {
      if (this.hasOwnProperty(key) && key !== 'product_id') {
        this[key] = value; // Update all fields except product_id
      }
    }
  }

  // Method to adjust stock quantity and trigger reorder alerts
  adjustStockQuantity(amount) {
    this.stock_quantity += amount; // Adjust stock by the given amount
    if (this.stock_quantity < 0) {
      throw new Error("Stock quantity cannot be negative.");
    }
    // Trigger reorder alert if stock falls below the threshold
    if (this.stock_quantity <= this.reorder_threshold) {
      console.log(`Reorder Alert: Stock for "${this.name}" is below the threshold (${this.reorder_threshold}).`);
      // Logic to notify the vendor (e.g., send an alert)
    }
  }
}

export default Product;

*/
