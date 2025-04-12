import gDB from '../config/firebaseConfig.js';
import AuditLog from '../models/auditLog.model.js';

const firestore = gDB.db;

export async function logEvent(event_type, user_id, details) {
  try {
    const logRef = firestore.collection('audit_logs').doc();
    const logId = logRef.id;

    const log = new AuditLog(logId, event_type, user_id, details, new Date());

    await logRef.set({ ...log });

    console.log(`Audit Log Saved: ${event_type} by ${user_id}`);
  } catch (error) {
    console.error('Error logging event:', error.message);
  }
}
