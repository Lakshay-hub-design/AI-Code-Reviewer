import api from "../../../shared/api/axios";

export const createSessionAPI = async (data) => {
  const response = await api.post("/session", data);
  return response.data;
};

export const getSessionsAPI = async () => {
  const response = await api.get("/session");
  return response.data;
};

export const getSessionAPI = async (id) => {
  const response = await api.get(`/session/${id}`);
  return response.data;
};

export const updateSessionAPI = async (id, data) => {
  const response = await api.put(`/session/${id}`, data);
  return response.data;
};

export const deleteSessionAPI = async (id) => {
  const response = await api.delete(`/session/${id}`);
  return response.data;
};