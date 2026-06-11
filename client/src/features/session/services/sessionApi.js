import api from "../../../shared/api/axios";

export const createSessionAPI = async (data) => {
  const response = await api.post("/sessions", data);
  return response.data;
};

export const getSessionsAPI = async () => {
  const response = await api.get("/sessions");
  return response.data;
};

export const getSessionAPI = async (id) => {
  const response = await api.get(`/sessions/${id}`);
  return response.data;
};

export const updateSessionAPI = async (id, data) => {
  const response = await api.put(`/sessions/${id}`, data);
  return response.data;
};

export const deleteSessionAPI = async (id) => {
  const response = await api.delete(`/sessions/${id}`);
  return response.data;
};