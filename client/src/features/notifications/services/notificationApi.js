import api from "../../../shared/api/axios";

export const getNotificationsAPI = async () => {
  const response = await api.get("/notifications");
  return response.data;
};

export const markNotificationReadAPI = async (id) => {
  const response = await api.patch(
    `/notifications/${id}/read`
  );

  return response.data;
};

export const markAllNotificationsReadAPI = async () => {
  const response = await api.patch(
    "/notifications/read-all"
  );

  return response.data;
};

export const acceptRequestAPI = async (id) => {
  const response = await api.post(
    `/access-request/${id}/accept`
  );

  return response.data;
};

export const declineRequestAPI = async (id) => {
  const response = await api.post(
    `/access-request/${id}/decline`
  );

  return response.data;
};

export const requestAccessAPI = async (sessionId) => {
  const response = await api.post(
    `/access-request/${sessionId}/request-access`
  );

  return response.data;
};