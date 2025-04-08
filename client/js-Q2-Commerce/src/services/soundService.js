const notificationSound = new Audio("/assets/notification-9-158194.mp3"); // Replace with your actual sound file path

export const playNotificationSound = (isSoundEnabled) => {
  if (isSoundEnabled) {
    notificationSound.play();
  }
};
