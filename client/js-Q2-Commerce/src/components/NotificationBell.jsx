import { useState, useEffect } from "react";
import { getOrderNotifications, simulateNotificationUpdates } from "../services/notificationService";
import { playNotificationSound } from "../services/soundService";
import styles from "../styles/NotificationBell.module.css";

const NotificationBell = ({ orderId }) => {
  const [notifications, setNotifications] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [expandedMessage, setExpandedMessage] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true); // Default: Sound on
  const [error, setError] = useState(null); // ✅ Added error handling

  useEffect(() => {
    if (!orderId) {
      setError("Order ID is missing!");
      return;
    }

    try {
      const storedNotifications = getOrderNotifications(orderId);
      setNotifications(storedNotifications);
      setUnreadCount(storedNotifications.length);

      simulateNotificationUpdates(orderId, (newMessage) => {
        setNotifications((prev) => [...prev, newMessage]);
        setUnreadCount((prev) => prev + 1);
        playNotificationSound(isSoundEnabled); // Play sound when new notification arrives
      });
    } catch (err) {
      setError("Failed to load notifications. Please try again later.");
    }
  }, [orderId, isSoundEnabled]);

  const handleExpand = (message) => {
    setExpandedMessage(message);
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleCloseExpanded = () => {
    setExpandedMessage(null);
    setShowToast(false);
  };

  return (
    <div className={styles.bellContainer}>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          <div className={styles.bell} onClick={() => setShowToast(!showToast)}>
            🔔
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
          </div>

          {/* Sound Toggle Button */}
          <button onClick={() => setIsSoundEnabled((prev) => !prev)} className={styles.soundToggle}>
            {isSoundEnabled ? "🔊 Sound On" : "🔇 Sound Off"}
          </button>

          {showToast && (
            <div className={styles.toastList}>
              {notifications.map((note, index) => (
                <div key={index} className={styles.toast} onClick={() => handleExpand(note)}>
                  {note.length > 30 ? `${note.substring(0, 30)}...` : note}
                </div>
              ))}
            </div>
          )}

          {expandedMessage && (
            <div className={styles.expandedMessage} onClick={handleCloseExpanded}>
              <p>{expandedMessage}</p>
              <button onClick={handleCloseExpanded}>Close</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NotificationBell;




`import { useState, useEffect } from "react";
import { getOrderNotifications, simulateNotificationUpdates } from "../services/notificationService";
import { playNotificationSound } from "../services/soundService";
import styles from "../styles/NotificationBell.module.css";

const NotificationBell = ({ orderId }) => {
  const [notifications, setNotifications] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [expandedMessage, setExpandedMessage] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true); // Default: Sound on

  useEffect(() => {
    const storedNotifications = getOrderNotifications(orderId);
    setNotifications(storedNotifications);
    setUnreadCount(storedNotifications.length);

    simulateNotificationUpdates(orderId, (newMessage) => {
      setNotifications((prev) => [...prev, newMessage]);
      setUnreadCount((prev) => prev + 1);
      playNotificationSound(isSoundEnabled); // Play sound when new notification arrives
    });
  }, [orderId, isSoundEnabled]);

  const handleExpand = (message) => {
    setExpandedMessage(message);
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleCloseExpanded = () => {
    setExpandedMessage(null);
    setShowToast(false);
  };

  return (
    <div className={styles.bellContainer}>
      <div className={styles.bell} onClick={() => setShowToast(!showToast)}>
        🔔
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
      </div>

      {/* Sound Toggle Button */}
      <button onClick={() => setIsSoundEnabled((prev) => !prev)} className={styles.soundToggle}>
        {isSoundEnabled ? "🔊 Sound On" : "🔇 Sound Off"}
      </button>

      {showToast && (
        <div className={styles.toastList}>
          {notifications.map((note, index) => (
            <div key={index} className={styles.toast} onClick={() => handleExpand(note)}>
              {note.length > 30 ? \`\${note.substring(0, 30)}...\` : note} //-------------------fix
            </div>
          ))}
        </div>
      )}

      {expandedMessage && (
        <div className={styles.expandedMessage} onClick={handleCloseExpanded}>
          <p>{expandedMessage}</p>
          <button onClick={handleCloseExpanded}>Close</button>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
`