import api from "../../shared/api/axios";

export const getCommentsApi = (sessionId) =>
  api.get(`/comments/${sessionId}`);

export const createCommentApi = (sessionId, data) =>
  api.post(`/comments/${sessionId}`, data);

export const resolveCommentApi = (commentId) =>
  api.patch(`/comments/${commentId}/resolve`);

export const deleteCommentApi = (commentId) =>
  api.delete(`/comments/${commentId}/delete`);