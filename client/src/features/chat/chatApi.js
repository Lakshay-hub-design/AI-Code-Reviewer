import api from "../../shared/api/axios";

export const getMessagesApi = (sessionId) => {
  return api.get(`/messages/${sessionId}`);
};
