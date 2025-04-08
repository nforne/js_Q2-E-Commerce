import ContentContext from "./content.text.model.js";

const ProductCategoryEnum = Object.freeze({
  ELECTRONICS: 'Electronics',
  FASHION: 'Fashion',
  HOME_APPLIANCES: 'Home Appliances',
  SPORTS: 'Sports',
  BEAUTY: 'Beauty',
  BOOKS: 'Books',
  TOYS: 'Toys',
  GROCERY: 'Grocery',
  AUTOMOTIVE: 'Automotive',
  HEALTH: 'Health',
});

class ProductCategory {
  constructor(category_id, category_name, description) {
    if (!Object.values(ProductCategoryEnum).includes(category_name)) {
      throw new Error(
        `Invalid category name: ${category_name}. Allowed categories are ${Object.values(ProductCategoryEnum).join(', ')}.`
      );
    }

    this.category_id = category_id; // Primary Key: Unique identifier for the category
    this.category_name = category_name; // Name of the category
    this.description = new ContentContext(description); // Detailed description of the category
  }

  // Method to update category details
  updateCategoryDetails(fields) {
    if (fields.category_name && !Object.values(ProductCategoryEnum).includes(fields.category_name)) {
      throw new Error(
        `Invalid category name: ${fields.category_name}. Allowed categories are ${Object.values(ProductCategoryEnum).join(', ')}.`
      );
    }

    for (const [key, value] of Object.entries(fields)) {
      if (this.hasOwnProperty(key) && key !== 'category_id') {
        this[key] = value; // Update fields except the primary key
      }
    }
  }
}

export default {ProductCategory, ProductCategoryEnum};
