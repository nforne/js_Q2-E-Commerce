import Stack from "../models.js/stack.model.js";

const UserRoleEnum = Object.freeze({
  CASUAL: "casual",
  CUSTOMER: "customer",
  VENDOR: "vendor",
  ADMINISTRATOR: "administrator",
});

const rootAdmin = {
  user_id: "admin-001",
  first_name: "Root",
  last_name: "Administrator",
  email: "admin@q2-commerce.com",
  password: "SuperSecurePassword123", // Should be hashed
  created_at: new Date().toISOString(),
  picture: "/admin-avatar.png",
  role: UserRoleEnum.ADMINISTRATOR,
  shopping_cart: [],
  transactions: [],
  addresses: new class {
    constructor() {
      this.default = "HQ - 123 Admin St, Tech City";
      this.archive = new Stack();
      this.archive.push(this.default);
    }
    update(newDefault) {
      if (!this.archive.toArray().includes(newDefault)) this.archive.push(newDefault);
      this.default = newDefault;
    }
  }(),
  payment_methods: new class {
    constructor() {
      this.default = "Business Account - ****6789";
      this.archive = new Stack();
      this.archive.push(this.default);
    }
    update(newDefault) {
      if (!this.archive.toArray().includes(newDefault)) this.archive.push(newDefault);
      this.default = newDefault;
    }
  }(),
  privileges: {
    manageUsers: true,
    manageProducts: true,
    manageOrders: true,
    manageTransactions: true,
    approveVendors: true,
    accessAnalytics: true,
    fullSystemControl: true,
  },
  messages: [
    { id: 1, title: "Welcome Admin!", body: "You have full access to system controls.", unread: false },
    { id: 2, title: "Vendor Request", body: "A new vendor application needs review.", unread: true },
  ],
};

export default rootAdmin;
