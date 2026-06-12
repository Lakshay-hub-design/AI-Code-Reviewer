import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSessionAPI, deleteSessionAPI, getSessionAPI, getSessionsAPI } from "./services/sessionApi";

export const fetchSessions = createAsyncThunk('session/fetchAll', async (_, {rejectWithValue}) => {
    try {
        const data = await getSessionsAPI()
        return data.sessions
    } catch (err) {
        return rejectWithValue(err.response?.data?.message)
    }
})

export const createSession = createAsyncThunk('sessions/create', async (payload, { rejectWithValue }) => {
  try {
    const data = await createSessionAPI(payload)
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

const initialState = {
    list: [],
    currentSession: null,
    fetchLoading: false,
    createLoading: false,
    deleteLoading: false,
    error: null
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
        .addCase(fetchSessions.pending, (state) => { state.fetchLoading = true })
        .addCase(fetchSessions.fulfilled, (state, {payload}) => {
            state.list = payload,
            state.fetchLoading = false
        })
        .addCase(fetchSessions.rejected, (state, {payload}) => {
            state.error = payload,
            state.fetchLoading = false
        })
        .addCase(createSession.pending, (state) => {
            state.createLoading = true;
            state.error = null;
        })
        .addCase(createSession.fulfilled, (state, {payload}) => {
            state.createLoading = true
            state.list.unshift(payload)
        })
        .addCase(createSession.rejected, (state, { payload }) => {
            state.createLoading = false;
            state.error = payload;
        })
        .addCase(deleteSession.fulfilled, (state, { payload }) => {
            state.list = state.list.filter(s => s._id !== payload)
        })
    }
})

export const { setCurrentSession } = sessionSlice.actions

export default sessionSlice.reducer