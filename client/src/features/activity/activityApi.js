import api from "../../shared/api/axios";

export const getActivitiesApi = (sessionId) =>
  api.get(`/activity/${sessionId}`);