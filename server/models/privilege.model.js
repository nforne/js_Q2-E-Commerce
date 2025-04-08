import ContentContext from './content.text.model.js';


/*

Possible Privileges:
▪ shopping – Allows the user to make purchases
▪ productManagement – Allows the user to manage products
▪ userManagement – Allows the user to manage other users
▪ reporting – Grants access to reports and analytics
▪ discountManagement – Allows the user to create and modify discount codes
▪ orderFulfillment – Grants the ability to process and fulfill orders
▪ customerSupport – Allows access to customer support tools
▪ marketing – Grants access to marketing campaigns
▪ shippingManagement – Grants access to shipping management eg tracking

*/

const PrivilegeEnum = Object.freeze({
  SHOPPING: 'shopping',
  PRODUCT_MANAGEMENT: 'productManagement',
  USER_MANAGEMENT: 'userManagement',
  REPORTING: 'reporting',
  DISCOUNT_MANAGEMENT: 'discountManagement',
  ORDER_FULFILLMENT: 'orderFulfillment',
  CUSTOMER_SUPPORT: 'customerSupport',
  MARKETING: 'marketing',
  SHIPPING: "shipping",
});


class Privilege {
  constructor(privilege, isGranted, description, granted_by, granted_at) {
    if (!Object.values(PrivilegeEnum).includes(privilege)) {
      throw new Error(`Invalid privilege: ${privilege}. Allowed privileges are ${Object.values(PrivilegeEnum).join(', ')}.`);
    }

    this.privilege = privilege; // Name or identifier of the privilege
    this.isGranted = isGranted; // Boolean: true if granted, false if revoked
    this.description = new ContentContext(description); // Description of the privilege with versioning
    this.granted_by = granted_by; // user_id of the admin or business granting the privilege
    this.granted_at = granted_at; // Date and time when the privilege was granted
  }

  // Method to update the privilege status
  updatePrivilegeStatus(isGranted, description) {
    this.isGranted = isGranted; // Update the privilege status
    this.description.setLatest(description || isGranted); // Optionally update the privilege description    
    this.granted_at = new Date(); // Update the timestamp for privilege change
  }
}

export default { Privilege, PrivilegeEnum};
