import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSessionAPI, deleteSessionAPI, getSessionAPI, getSessionsAPI, joinSessionAPI, previewSessionAPI, updateSessionAPI } from "./services/sessionApi";

export const fetchSessions = createAsyncThunk('session/fetchAll', async (params, {rejectWithValue}) => {
    try {
        const data = await getSessionsAPI(params)
        return data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message)
    }
})

export const fetchSession = createAsyncThunk('session/fetchOne', async (id, {rejectWithValue}) => {
    try {
        const data = await getSessionAPI(id)
        return data.session
    } catch (err) {
        return rejectWithValue(err.response?.data?.message)
    }
})

export const createSession = createAsyncThunk('sessions/create', async (payload, { rejectWithValue }) => {
  try {
    const data = await createSessionAPI(payload)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const updateSession = createAsyncThunk('session/update', async ({id, payload}, {rejectWithValue}) => {
    try {
        const data = await updateSessionAPI(id, payload)
        return data.session
    } catch (err) {
        return rejectWithValue(err.response?.data?.message)
    }
})
 
export const deleteSession = createAsyncThunk('sessions/delete', async (id, { rejectWithValue }) => {
  try {
    await deleteSessionAPI(id)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const previewSession = createAsyncThunk("session/preview", async (id, { rejectWithValue }) => {
    try {
      const data = await previewSessionAPI(id);

      return data.session;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
)

export const joinSession = createAsyncThunk("session/join", async (id, { rejectWithValue }) => {
    try {
      const data = await joinSessionAPI(id);

      return data.session;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
)

const initialState = {
  list: [],

  currentSession: null,
  previewSession: null,

  total: 0,
  page: 1,
  totalPages: 1,

  fetchLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  joinLoading: false,
  previewLoading: false,

  error: null,
}

const sessionSlice = createSlice({
    name: 'session',

    initialState,

    reducers: {
        setCurrentSession: (state, action) => {
            state.currentSession = action.payload
        }
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchSessions.pending, (state) => {
          state.fetchLoading = true;
        })
        .addCase(fetchSessions.fulfilled, (state, { payload }) => {
          ((state.list = payload.sessions), (state.fetchLoading = false));
          state.total = payload.total;
          state.page = payload.page;
          state.totalPages = payload.totalPages;
        })
        .addCase(fetchSessions.rejected, (state, { payload }) => {
          ((state.error = payload), (state.fetchLoading = false));
        })
        .addCase(fetchSession.fulfilled, (state, { payload }) => {
          state.currentSession = payload;
        })
        .addCase(createSession.pending, (state) => {
          state.createLoading = true;
          state.error = null;
        })
        .addCase(createSession.fulfilled, (state, { payload }) => {
          state.createLoading = false;
          state.list.unshift(payload.session);
        })
        .addCase(createSession.rejected, (state, { payload }) => {
          state.createLoading = false;
          state.error = payload;
        })
        .addCase(deleteSession.fulfilled, (state, { payload }) => {
          state.list = state.list.filter((s) => s._id !== payload);
        })
        .addCase(updateSession.fulfilled, (state, { payload }) => {
          const index = state.list.findIndex((s) => s._id === payload._id);

          if (index !== -1) {
            state.list[index] = payload;
          }

          if (state.currentSession?._id === payload._id) {
            state.currentSession = payload;
          }
        })
        .addCase(previewSession.fulfilled, (state, { payload }) => {
          state.previewSession = payload;
        });
    }
})

export const { setCurrentSession } = sessionSlice.actions

export default sessionSlice.reducer