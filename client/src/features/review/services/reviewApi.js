import api from "../../../shared/api/axios";

export const generateReviewApi = (sessionId) => {
  return api.post(`/reviews/${sessionId}`);
};

export const getLatestReviewApi = (sessionId) => {
  return api.get(`/reviews/${sessionId}/latest`);
};

export const getReviewHistoryApi = (sessionId) => {
  return api.get(`/reviews/${sessionId}/history`);
};

export const getReviewByIdApi = (reviewId) => {
  return api.get(`/reviews/review/${reviewId}`);
}