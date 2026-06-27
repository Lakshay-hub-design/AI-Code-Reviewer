import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getActivitiesApi } from "./activityApi";

export const fetchActivities = createAsyncThunk(
  "activity/fetch",
  async (sessionId, thunkAPI) => {
    try {
      const res = await getActivitiesApi(sessionId);

      return res.data.activities;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch activities"
      );
    }
  }
);

const initialState = {
  activities: [],

  isLoading: false,

  error: null,
};

const activitySlice = createSlice({
  name: "activity",

  initialState,

  reducers: {
    addActivity: (state, action) => {
      state.activities.unshift(action.payload);
    },

    clearActivities: (state) => {
      state.activities = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activities = action.payload;
      })

      .addCase(fetchActivities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addActivity,
  clearActivities,
} = activitySlice.actions;

export default activitySlice.reducer;