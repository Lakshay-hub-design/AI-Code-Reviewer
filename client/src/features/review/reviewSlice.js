import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  generateReviewApi,
  getLatestReviewApi,
  getReviewByIdApi,
  getReviewHistoryApi,
} from "./services/reviewApi";

export const generateReview = createAsyncThunk(
  "review/generate",
  async (sessionId, thunkAPI) => {
    try {
      const response = await generateReviewApi(sessionId);

      return response.data.review;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to generate review",
      );
    }
  },
);

export const getLatestReview = createAsyncThunk(
  "review/latest",
  async (sessionId, thunkAPI) => {
    try {
      const response = await getLatestReviewApi(sessionId);

      return response.data.review;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch review",
      );
    }
  },
);

export const getReviewHistory = createAsyncThunk(
  "review/history",
  async (sessionId, thunkAPI) => {
    try {
      const response = await getReviewHistoryApi(sessionId);

      return response.data.reviews;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  },
);

export const getReviewById = createAsyncThunk(
  "review/byId",
  async (reviewId, thunkAPI) => {
    try {
      const response = await getReviewByIdApi(reviewId);

      return response.data.review;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch review",
      );
    }
  },
);

const initialState = {
  review: null,
  reviews: [],
  historyLoading: false,

  isLoading: false,

  error: null,
};

const reviewSlice = createSlice({
  name: "review",

  initialState,

  reducers: {
    clearReview: (state) => {
      state.review = null;
    },
    setReview: (state, action) => {
      state.review = action.payload;

      state.reviews = [
        action.payload,
        ...state.reviews.filter((r) => r._id !== action.payload._id),
      ];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(generateReview.pending, (state) => {
        state.isLoading = true;

        state.error = null;
      })

      .addCase(generateReview.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;

        state.review = action.payload;
      })

      .addCase(generateReview.rejected, (state, action) => {
        state.isLoading = false;

        state.error = action.payload;
      })

      .addCase(getLatestReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(getLatestReview.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.review = action.payload;
      })

      .addCase(getLatestReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(getReviewHistory.pending, (state) => {
        state.historyLoading = true;
      })

      .addCase(getReviewHistory.fulfilled, (state, action) => {
        state.historyLoading = false;

        state.reviews = action.payload;
      })

      .addCase(getReviewHistory.rejected, (state) => {
        state.historyLoading = false;
      })

      .addCase(getReviewById.fulfilled, (state, action) => {
        state.review = action.payload;
      });
  },
});

export const { clearReview, setReview } = reviewSlice.actions;

export default reviewSlice.reducer;
