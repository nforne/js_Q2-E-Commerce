class Address {
  constructor(
    address_id,
    house_number,
    apt_number,
    street,
    city,
    state,
    postal_code,
    country,
    isDefault
  ) {
    this.house_number = house_number;
    this.apt_number = apt_number;
    this.address_id = address_id; // Unique identifier for the address
    this.street = street; // Street name and number
    this.city = city; // City name
    this.state = state; // State or province
    this.postal_code = postal_code; // ZIP or postal code
    this.country = country; // Country name
    this.isDefault = isDefault; // Boolean: true if the address is the default
  }

  // Method to update address fields
  updateAddress(fields) {
    for (const [key, value] of Object.entries(fields)) {
      if (this.hasOwnProperty(key)) {
        this[key] = value;
      }
    }
  }

  // Method to set the address as default
  setAsDefault() {
    this.isDefault = true;
  }
}

export default Address;
