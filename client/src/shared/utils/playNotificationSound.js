// shared/utils/playNotificationSound.js

let audio;

export const playNotificationSound = () => {
  try {
    if (!audio) {
      audio = new Audio(
        "/sounds/notification.mp3"
      );
    }

    audio.currentTime = 0;

    audio.play().catch(() => {});
  } catch {}
};