class AuditLog {
  constructor(log_id, event_type, user_id, details, timestamp) {
    this.log_id = log_id;
    this.event_type = event_type; // e.g., 'User Update', 'Transaction Created'
    this.user_id = user_id; // Actor responsible for the event
    this.details = details; // JSON object detailing changes
    this.timestamp = timestamp || new Date();
  }
}

export default AuditLog;

