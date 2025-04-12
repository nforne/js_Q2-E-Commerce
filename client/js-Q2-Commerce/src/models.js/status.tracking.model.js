
const StatusTrackingEnum = Object.freeze({
  PURCHASED: 'purchased',
  SHIPPED: 'shipped',
  IN_TRANSIT: 'in_transit',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELED: 'canceled',
  RETURN: 'return',
  RETURNED: 'returned',
});


class StatusTracking {
  constructor(
    tracking_id,
    status,
    status_date,
    latitude,
    longitude
  ) {
    if (!Object.values(StatusTrackingEnum).includes(status)) {
      throw new Error(`Invalid status: ${status}. Allowed statuses are ${Object.values(StatusTrackingEnum).join(', ')}.`);
    }

    this.tracking_id = tracking_id; // Unique identifier for the tracking event
    this.status = status; // Enum: purchased, shipped, etc.
    this.status_date = status_date; // Date and time of the status update
    this.latitude = latitude; // Google Maps latitude coordinate
    this.longitude = longitude; // Google Maps longitude coordinate
  }

  // Method to update the tracking status
  updateStatus(newStatus, latitude, longitude) {
    if (!Object.values(StatusTrackingEnum).includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}. Allowed statuses are ${Object.values(StatusTrackingEnum).join(', ')}.`);
    }

    this.status = newStatus;
    this.status_date = new Date(); // Automatically update to the current timestamp
    if (latitude !== undefined) this.latitude = latitude; // Optionally update latitude
    if (longitude !== undefined) this.longitude = longitude; // Optionally update longitude
  }
}


export default {StatusTracking, StatusTrackingEnum} ;