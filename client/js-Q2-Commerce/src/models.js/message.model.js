import ContentContext from "./content.text.model.js";

class Message {
  constructor(
    message_id,
    transaction_id,
    sender_id,
    receiver_id,
    content,
    sent_at,
    is_read
  ) {
    this.message_id = message_id; // Primary Key: Unique identifier for the message thread
    this.transaction_id = transaction_id; // Foreign Key: Links to Transactions
    this.sender_id = sender_id; // Foreign Key: Links to Users (sender)
    this.receiver_id = receiver_id; // Foreign Key: Links to Users (receiver)
    this.content = new ContentContext(content); // Points to the latest message version
    this.sent_at = sent_at; // Date and time the message was originally sent
    this.is_read = is_read; // Boolean: true if the message has been read
  }
}

export default Message;



// -----------------------------------------------------------------------------------------------------------
/*

import ContentContext from "./content.text.model.js";

class Message {
  constructor(
    message_id,
    transaction_id,
    sender_id,
    receiver_id,
    content,
    sent_at = new Date(), // Automatically set the timestamp when the message is sent
    is_read = false // Default to unread
  ) {
    this.message_id = message_id; // Unique identifier for the message
    this.transaction_id = transaction_id; // Links to Transactions collection
    this.sender_id = sender_id; // Sender of the message
    this.receiver_id = receiver_id; // Receiver of the message
    this.content = new ContentContext(content); // Uses ContentContext for versioning
    this.sent_at = sent_at; // Timestamp for when the message was sent
    this.is_read = is_read; // Read status of the message
  }

  // Method to mark the message as read
  markAsRead() {
    this.is_read = true;
  }

  // Method to update the message content
  updateContent(newContent) {
    this.content.update(newContent); // Update content using ContentContext
  }
}

export default Message;


*/