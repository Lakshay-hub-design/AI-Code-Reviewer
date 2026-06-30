import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createCommentApi,
  deleteCommentApi,
  getCommentsApi,
  resolveCommentApi,
} from "./commentApi";

/* ---------------- Thunks ---------------- */

export const fetchComments = createAsyncThunk(
  "comments/fetch",
  async (sessionId, thunkAPI) => {
    try {
      const response = await getCommentsApi(sessionId);

      return response.data.comments;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch comments",
      );
    }
  },
);

export const createComment = createAsyncThunk(
  "comments/create",
  async ({ sessionId, line, text }, thunkAPI) => {
    try {
      const response = await createCommentApi(sessionId, {
        line,
        text,
      });

      return response.data.comment;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create comment",
      );
    }
  },
);

export const resolveComment = createAsyncThunk(
  "comments/resolve",
  async (commentId, thunkAPI) => {
    try {
      const response = await resolveCommentApi(commentId);

      return response.data.comment;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to resolve comment",
      );
    }
  },
);

export const deleteComment = createAsyncThunk(
  "comments/delete",
  async (commentId, thunkAPI) => {
    try {
      await deleteCommentApi(commentId);

      return commentId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete comment",
      );
    }
  },
);

/* ---------------- Slice ---------------- */

const initialState = {
  comments: [],

  loading: false,

  createLoading: false,

  error: null,
};

const commentSlice = createSlice({
  name: "comments",

  initialState,

  reducers: {
    /* -------- Socket Reducers -------- */

    addComment(state, action) {
      state.comments.push(action.payload);

      state.comments.sort((a, b) => {
        if (a.line !== b.line) {
          return a.line - b.line;
        }

        return new Date(a.createdAt) - new Date(b.createdAt);
      });
    },

    updateComment(state, action) {
      const index = state.comments.findIndex(
        (comment) => comment._id === action.payload._id,
      );

      if (index !== -1) {
        state.comments[index] = action.payload;
      }
    },

    removeComment(state, action) {
      state.comments = state.comments.filter(
        (comment) => comment._id !== action.payload,
      );
    },

    clearComments(state) {
      state.comments = [];
    },
  },

  extraReducers: (builder) => {
    builder

      /* -------- Fetch -------- */

      .addCase(fetchComments.pending, (state) => {
        state.loading = true;

        state.error = null;
      })

      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;

        state.comments = action.payload;
      })

      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      })

      /* -------- Create -------- */

      .addCase(createComment.pending, (state) => {
        state.createLoading = true;
      })

      .addCase(createComment.fulfilled, (state, action) => {
        state.createLoading = false;

        state.comments.push(action.payload);

        state.comments.sort((a, b) => {
          if (a.line !== b.line) {
            return a.line - b.line;
          }

          return new Date(a.createdAt) - new Date(b.createdAt);
        });
      })

      .addCase(createComment.rejected, (state, action) => {
        state.createLoading = false;

        state.error = action.payload;
      })

      /* -------- Resolve -------- */

      .addCase(resolveComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (comment) => comment._id === action.payload._id,
        );

        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })

      /* -------- Delete -------- */

      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload,
        );
      });
  },
});

export const { addComment, updateComment, removeComment, clearComments } =
  commentSlice.actions;

export default commentSlice.reducer;
