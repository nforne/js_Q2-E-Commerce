import { forEach, values } from "lodash";
import Stack from "./stack.model.js";

const UserRoleEnum = Object.freeze({
  CUSTOMER: 'customer',
  VENDOR: 'vendor',
  ADMINISTRATOR: 'administrator',
});

class User {
  constructor(
    user_id,
    first_name,
    last_name,
    email,
    password,
    created_at,
    role,
    shopping_cart = [],
    transactions = [],
    address,
    payment_method,
    privileges = {},
    messages = []
  ) {
    if (!Object.values(UserRoleEnum).includes(role)) {
      throw new Error(`Invalid role: ${role}. Allowed roles are ${Object.values(UserRoleEnum).join(', ')}.`);
    }

    this.user_id = user_id; // Unique identifier
    this.first_name = first_name; // User's first name
    this.last_name = last_name; // User's last name
    this.email = email; // User's email address
    this.password = password; // Hashed password
    this.created_at = created_at; // Account creation date
    this.role = role; // Enum (customer, vendor, administrator)
    this.shopping_cart = shopping_cart; // Array of product objects
    this.transactions = transactions; // Array of transaction IDs
    this.addresses = new this.#_Collection(address); // Collection of address objects
    this.payment_methods = new this.#_Collection(payment_method); // Collection of payment method objects
    this.privileges = privileges; // JSON object containing multiple privilege objects
    this.messages = messages; // Array of message objects (sent and received)
    
  }

  #_Collection = class Collection {
    constructor(parameter = "") {
      this.default = parameter;
      this.archive = new Stack();
      if (parameter) this.archive.push(this.default);
    }

    update(newdefault){    
      for(const value of [newdefault, this.default]){
        if (!this.#_isArchived(value)) this.archive.push(value);
      }
      this.default = newdefault;
    }

    #_isArchived(parameter){
      return this.archive.toArray().includes(parameter);
    }

    addAll(arrayOfAddresses){
      for(const address of arrayOfAddresses) this.add(address);
    }

    add(parameter){
      if (!this.#_isArchived(parameter)) this.archive.push(parameter);
    }

    asArray() {
      return this.archive.toArray().includes(this.latest) ? this.archive.toArray() : [ ...this.archive.toArray(), this.latest ];
    }

  }

  // Method to update user details
  updateUserDetails(fields) {
    for (const [key, value] of Object.entries(fields)) {
      if (this.hasOwnProperty(key) && key !== 'user_id') {
        this[key] = value; // Update all fields except the primary key
      }
    }
  }

  // Method to add a product to the shopping cart
  addToCart(product) {
    this.shopping_cart.push(product);
  }

  // Method to remove a product from the shopping cart
  removeFromCart(product_id) {
    this.shopping_cart = this.shopping_cart.filter(product => product.product_id !== product_id);
  }

  // Method to add a new transaction
  addTransaction(transaction_id) {
    this.transactions.push(transaction_id);
  }

  // Method to add a new address
  addAddress(address) {
    this.addresses.push(address);
  }

  // Method to set an address as default
  setDefaultAddress(address_id) {
    this.addresses = this.addresses.map(address => ({
      ...address,
      isDefault: address.address_id === address,
    }));
  }

  // Method to add a new payment method
  addPaymentMethod(payment_method) {
    this.payment_methods.push(payment_method);
  }

  // Method to set a payment method as default
  setDefaultPaymentMethod(payment_id) {
    this.payment_methods = this.payment_methods.map(payment => ({
      ...payment,
      isDefault: payment.payment_id === payment,
    }));
  }

  // Method to add a message to the messages array
  addMessage(message) {
    this.messages.push(message);
  }

  // Method to retrieve all messages sent by the user
  getSentMessages() {
    return this.messages.filter(message => message.sender_id === this.user_id);
  }

  // Method to retrieve all messages received by the user
  getReceivedMessages() {
    return this.messages.filter(message => message.receiver_id === this.user_id);
  }
}

export default {User, UserRoleEnum};

// -----------------------------------------------------------------------------------------------------------
/*

*/
