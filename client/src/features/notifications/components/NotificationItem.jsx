import AccessRequestNotification from "./AccessRequestNotification";
import AccessApprovedNotification from "./AccessApprovedNotification";
import AccessDeclinedNotification from "./AccessDeclinedNotification";

const NotificationItem = ({ notification, onClick }) => {
  switch (notification.type) {
    case "access_request":
      return (
        <AccessRequestNotification
          notification={notification}
          onClick={onClick}
        />
      );

    case "access_approved":
      return (
        <AccessApprovedNotification
          notification={notification}
          onClick={onClick}
        />
      );

    case "access_declined":
      return (
        <AccessDeclinedNotification
          notification={notification}
          onClick={onClick}
        />
      );

    default:
      return null;
  }
};

export default NotificationItem;