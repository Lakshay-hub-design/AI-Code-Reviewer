import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getNotificationsAPI,
  markNotificationReadAPI,
  markAllNotificationsReadAPI,
  acceptRequestAPI,
  declineRequestAPI,
  requestAccessAPI,
} from "./services/notificationApi";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getNotificationsAPI();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const markNotificationRead = createAsyncThunk(
  "notifications/readOne",
  async (id, { rejectWithValue }) => {
    try {
      await markNotificationReadAPI(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/readAll",
  async (_, { rejectWithValue }) => {
    try {
      await markAllNotificationsReadAPI();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const requestAccess = createAsyncThunk(
  "notifications/requestAccess",
  async (sessionId, { rejectWithValue }) => {
    try {
      return await requestAccessAPI(sessionId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const acceptAccessRequest = createAsyncThunk(
  "notifications/acceptRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      await acceptRequestAPI(requestId);
      return requestId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const declineAccessRequest = createAsyncThunk(
  "notifications/declineRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      await declineRequestAPI(requestId);

      return requestId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

const initialState = {
  notifications: [],

  unreadCount: 0,

  loading: false,

  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,

  reducers: {
    addNotification: (state, action) => {
      const notification = action.payload;

      if (!notification?._id) return;

      const exists = state.notifications.some(
        (n) => n?._id === notification._id,
      );

      if (!exists) {
        state.notifications.unshift(notification);

        if (!notification.read) {
          state.unreadCount += 1;
        }
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n._id !== action.payload,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.notifications = payload.notifications;
        state.unreadCount = payload.unreadCount;
      })
      .addCase(fetchNotifications.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(markNotificationRead.fulfilled, (state, { payload }) => {
        const notification = state.notifications.find((n) => n._id === payload);

        if (notification && !notification.read) {
          notification.read = true;

          state.unreadCount -= 1;
        }
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications.forEach((notification) => {
          notification.read = true;
        });

        state.unreadCount = 0;
      })

      .addCase(acceptAccessRequest.fulfilled, (state, { payload }) => {
        const notification = state.notifications.find(
          (n) => n.data?.accessRequestId === payload,
        );

        if (notification) {
          if (!notification.read && state.unreadCount > 0) {
            state.unreadCount -= 1;
          }

          notification.status = "approved";
          notification.read = true;
        }
      })

      .addCase(declineAccessRequest.fulfilled, (state, { payload }) => {
        const notification = state.notifications.find(
          (n) => n.data?.accessRequestId === payload,
        );

        if (notification) {
          if (!notification.read && state.unreadCount > 0) {
            state.unreadCount -= 1;
          }

          notification.status = "declined";
          notification.read = true;
        }
      });
  },
});

export const { addNotification } = notificationSlice.actions;

export default notificationSlice.reducer;