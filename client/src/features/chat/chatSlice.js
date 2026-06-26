import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMessagesApi } from "./chatApi";

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (sessionId, thunkAPI) => {
    try {
      const response = await getMessagesApi(sessionId);
      return response.data.messages;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load messages",
      );
    }
  },
);

const initialState = {
  messages: [],
  typingUsers: [],
  loading: false,
  sending: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",

  initialState,

  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    clearMessages: (state) => {
      state.messages = [];
    },
    typingStarted: (state, action) => {
      const exists = state.typingUsers.find(
        user => user.socketId === action.payload.socketId
      );

      if (!exists) {
        state.typingUsers.push(action.payload);
      }
    },

    typingStopped: (state, action) => {
      state.typingUsers = state.typingUsers.filter(
        user => user.socketId !== action.payload.socketId
      );
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;

        state.messages = action.payload;
      })

      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      });
  },
});

export const { addMessage, clearMessages, typingStarted, typingStopped } = chatSlice.actions;

export default chatSlice.reducer;
