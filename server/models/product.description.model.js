import ContentContext from "./content.text.model.js";

class ProductDescription {
  constructor(short, long, specs, features) {
    if (typeof specs !== 'object' || specs === null) {
      throw new Error('Invalid specs: must be a non-null object.');
    }

    this.short = new ContentContext(short); // Short description for preview displays
    this.long = new ContentContext(long); // Detailed description for the product page
    this.specs = new ContentContext(specs); // Specifications as a JS object (e.g., dimensions, weight, color)
    this.features = features || new ContentContext([]); // Array of key product features
  }

  // Method to update product description details
  updateDescriptionDetails(fields) {
    for (const [key, value] of Object.entries(fields)) {
      if (this.hasOwnProperty(key)) {
        this[key] = value;
      }
    }
  }

  // Method to add a new feature to the features array
  addFeature(feature) {
    if (feature) {
      this.features.push(feature);
    }
  }

  // Method to update specifications
  updateSpecs(newSpecs) {
    if (typeof newSpecs !== 'object' || newSpecs === null) {
      throw new Error('Invalid specs: must be a non-null object.');
    }

    this.specs = { ...this.specs, ...newSpecs }; // Merge new specs with existing ones
  }
}

export default ProductDescription;
