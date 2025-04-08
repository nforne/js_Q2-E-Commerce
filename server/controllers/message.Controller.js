import gDB from '../config/firebaseConfig.js';

// Reference Firestore
const firestore = gDB.db;

// Create a new message
export async function createMessage(req, res) {
  try {
    const messageData = req.body;

    // Generate a unique message ID (Firestore document ID)
    const messageRef = firestore.collection('messages').doc();
    const messageId = messageRef.id;

    // Add message_id to the message object
    const completeMessageData = { ...messageData, message_id: messageId };

    // Save the message in Firestore
    await messageRef.set(completeMessageData);

    res.status(201).send({ message: 'Message created successfully', messageId });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get a specific message by ID
export async function getMessage(req, res) {
  try {
    const messageId = req.params.id;
    const messageDoc = await firestore.collection('messages').doc(messageId).get();

    if (!messageDoc.exists) {
      return res.status(404).send({ message: 'Message not found' });
    }

    res.status(200).send(messageDoc.data());
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Update a message's details by ID
export async function updateMessage(req, res) {
  try {
    const messageId = req.params.id;
    const updates = req.body;

    // Check if message exists
    const messageRef = firestore.collection('messages').doc(messageId);
    const messageDoc = await messageRef.get();
    if (!messageDoc.exists) {
      return res.status(404).send({ message: 'Message not found' });
    }

    // Update the message in Firestore
    await messageRef.update(updates);

    res.status(200).send({ message: 'Message updated successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Delete a message by ID
export async function deleteMessage(req, res) {
  try {
    const messageId = req.params.id;

    // Check if message exists
    const messageRef = firestore.collection('messages').doc(messageId);
    const messageDoc = await messageRef.get();
    if (!messageDoc.exists) {
      return res.status(404).send({ message: 'Message not found' });
    }

    // Delete the message in Firestore
    await messageRef.delete();

    res.status(200).send({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get all messages
export async function getAllMessages(req, res) {
  try {
    const messageSnapshot = await firestore.collection('messages').get();

    if (messageSnapshot.empty) {
      return res.status(404).send({ message: 'No messages found' });
    }

    const messages = [];
    messageSnapshot.forEach(doc => {
      messages.push(doc.data());
    });

    res.status(200).send(messages);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}


// -----------------------------------------------------------------------------------------------------------
/*
import gDB from '../config/firebaseConfig.js';

// Reference Firestore
const firestore = gDB.db;

// Create a new message (Customers and Vendors within a transaction)
export async function createMessage(req, res) {
  try {
    // Check if the user has privileges to communicate within a transaction
    if (!req.user.privileges.transactionCommunication?.isGranted) {
      return res.status(403).send({ message: 'Forbidden: Insufficient privileges to send a message.' });
    }

    const messageData = req.body;

    // Validate that the sender and receiver are part of the same transaction
    const transactionDoc = await firestore.collection('transactions').doc(messageData.transaction_id).get();
    if (!transactionDoc.exists) {
      return res.status(404).send({ message: 'Transaction not found.' });
    }

    const transactionData = transactionDoc.data();
    const { sender_id, receiver_id } = messageData;

    if (![transactionData.user_id, transactionData.vendor_id].includes(sender_id) ||
        ![transactionData.user_id, transactionData.vendor_id].includes(receiver_id)) {
      return res.status(403).send({ message: 'Forbidden: Sender and receiver must be part of the transaction.' });
    }

    // Generate a unique message ID
    const messageRef = firestore.collection('messages').doc();
    const messageId = messageRef.id;

    // Add message metadata
    const completeMessageData = {
      ...messageData,
      message_id: messageId,
      sent_at: new Date(),
      is_read: false,
    };

    // Save the message in Firestore
    await messageRef.set(completeMessageData);

    res.status(201).send({ message: 'Message created successfully.', messageId });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get a specific message by ID
export async function getMessage(req, res) {
  try {
    const messageId = req.params.id;
    const messageDoc = await firestore.collection('messages').doc(messageId).get();

    if (!messageDoc.exists) {
      return res.status(404).send({ message: 'Message not found.' });
    }

    const messageData = messageDoc.data();

    // Restrict access based on transaction involvement
    if (
      req.user.role !== 'administrator' &&
      ![messageData.sender_id, messageData.receiver_id].includes(req.user.user_id)
    ) {
      return res.status(403).send({ message: 'Forbidden: You can only access messages you are part of.' });
    }

    res.status(200).send(messageData);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Update a message's details by ID
export async function updateMessage(req, res) {
  try {
    const messageId = req.params.id;
    const updates = req.body;

    const messageRef = firestore.collection('messages').doc(messageId);
    const messageDoc = await messageRef.get();

    if (!messageDoc.exists) {
      return res.status(404).send({ message: 'Message not found.' });
    }

    const messageData = messageDoc.data();

    // Restrict updates to the sender of the message or administrators
    if (
      req.user.role !== 'administrator' &&
      messageData.sender_id !== req.user.user_id
    ) {
      return res.status(403).send({ message: 'Forbidden: You can only update messages you have sent.' });
    }

    // Save the updated message in Firestore
    await messageRef.update(updates);

    res.status(200).send({ message: 'Message updated successfully.' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Delete a message by ID
export async function deleteMessage(req, res) {
  try {
    const messageId = req.params.id;

    const messageRef = firestore.collection('messages').doc(messageId);
    const messageDoc = await messageRef.get();

    if (!messageDoc.exists) {
      return res.status(404).send({ message: 'Message not found.' });
    }

    const messageData = messageDoc.data();

    // Restrict deletion to the sender of the message or administrators
    if (
      req.user.role !== 'administrator' &&
      messageData.sender_id !== req.user.user_id
    ) {
      return res.status(403).send({ message: 'Forbidden: You can only delete messages you have sent.' });
    }

    // Delete the message from Firestore
    await messageRef.delete();

    res.status(200).send({ message: 'Message deleted successfully.' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get all messages (Admins can access all; users see threads they are part of)
export async function getAllMessages(req, res) {
  try {
    const messageSnapshot = await firestore.collection('messages').get();

    if (messageSnapshot.empty) {
      return res.status(404).send({ message: 'No messages found.' });
    }

    const messages = [];
    messageSnapshot.forEach(doc => {
      messages.push(doc.data());
    });

    // Filter messages based on roles
    if (req.user.role !== 'administrator') {
      const userMessages = messages.filter(
        message =>
          message.sender_id === req.user.user_id || message.receiver_id === req.user.user_id
      );
      return res.status(200).send(userMessages);
    }

    res.status(200).send(messages);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

*/

// -----------------------------------------------------------------------------------------------------------
/*
import gDB from '../config/firebaseConfig.js';
import Joi from 'joi';
import Message from '../models/message.model.js';

// Reference Firestore
const firestore = gDB.db;

// Joi schema for message validation
const messageSchema = Joi.object({
  transaction_id: Joi.string().required(),
  sender_id: Joi.string().required(),
  receiver_id: Joi.string().required(),
  content: Joi.string().max(1000).required(),
  is_read: Joi.boolean().optional(),
});

// Create a new message
export async function createMessage(req, res) {
  try {
    if (!req.user.privileges.transactionCommunication?.isGranted) {
      return res.status(403).send({ message: 'Forbidden: Insufficient privileges to send a message.' });
    }

    // Validate user input
    const { error } = messageSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const messageData = req.body;

    const transactionDoc = await firestore.collection('transactions').doc(messageData.transaction_id).get();
    if (!transactionDoc.exists) {
      return res.status(404).send({ message: 'Transaction not found.' });
    }

    const transactionData = transactionDoc.data();
    const { sender_id, receiver_id } = messageData;

    if (![transactionData.user_id, transactionData.vendor_id].includes(sender_id) ||
        ![transactionData.user_id, transactionData.vendor_id].includes(receiver_id)) {
      return res.status(403).send({ message: 'Forbidden: Sender and receiver must be part of the transaction.' });
    }

    const messageRef = firestore.collection('messages').doc();
    const messageId = messageRef.id;

    const message = new Message(
      messageId,
      messageData.transaction_id,
      sender_id,
      receiver_id,
      messageData.content
    );

    await messageRef.set({ ...message });

    res.status(201).send({ message: 'Message created successfully.', messageId });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get a specific message
export async function getMessage(req, res) {
  try {
    const messageId = req.params.id;
    const messageDoc = await firestore.collection('messages').doc(messageId).get();

    if (!messageDoc.exists) {
      return res.status(404).send({ message: 'Message not found.' });
    }

    const messageData = messageDoc.data();

    if (
      req.user.role !== 'administrator' &&
      ![messageData.sender_id, messageData.receiver_id].includes(req.user.user_id)
    ) {
      return res.status(403).send({ message: 'Forbidden: You can only access messages you are part of.' });
    }

    res.status(200).send(messageData);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Update a message
export async function updateMessage(req, res) {
  try {
    const messageId = req.params.id;
    const updates = req.body;

    const updateSchema = messageSchema.fork(Object.keys(messageSchema.describe().keys), (field) => field.optional());
    const { error } = updateSchema.validate(updates);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const messageRef = firestore.collection('messages').doc(messageId);
    const messageDoc = await messageRef.get();

    if (!messageDoc.exists) {
      return res.status(404).send({ message: 'Message not found.' });
    }

    const messageData = messageDoc.data();

    if (
      req.user.role !== 'administrator' &&
      messageData.sender_id !== req.user.user_id
    ) {
      return res.status(403).send({ message: 'Forbidden: You can only update messages you have sent.' });
    }

    await messageRef.update(updates);

    res.status(200).send({ message: 'Message updated successfully.' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Mark a message as read
export async function markMessageAsRead(req, res) {
  try {
    const messageId = req.params.id;

    const messageRef = firestore.collection('messages').doc(messageId);
    const messageDoc = await messageRef.get();

    if (!messageDoc.exists) {
      return res.status(404).send({ message: 'Message not found.' });
    }

    const messageData = messageDoc.data();

    if (
      req.user.role !== 'administrator' &&
      messageData.receiver_id !== req.user.user_id
    ) {
      return res.status(403).send({ message: 'Forbidden: Only the recipient can mark the message as read.' });
    }

    await messageRef.update({ is_read: true });

    res.status(200).send({ message: 'Message marked as read.' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Delete a message
export async function deleteMessage(req, res) {
  try {
    const messageId = req.params.id;

    const messageRef = firestore.collection('messages').doc(messageId);
    const messageDoc = await messageRef.get();

    if (!messageDoc.exists) {
      return res.status(404).send({ message: 'Message not found.' });
    }

    const messageData = messageDoc.data();

    if (
      req.user.role !== 'administrator' &&
      messageData.sender_id !== req.user.user_id
    ) {
      return res.status(403).send({ message: 'Forbidden: You can only delete messages you have sent.' });
    }

    await messageRef.delete();

    res.status(200).send({ message: 'Message deleted successfully.' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

*/

// -----------------------------------------------------------------------------------------------------------
/*

*/