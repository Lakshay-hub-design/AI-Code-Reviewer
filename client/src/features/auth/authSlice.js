import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentUser, logoutUser } from "./services/authApi";

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const data = await getCurrentUser()
    return data.user
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Not authenticated')
  }
})
 
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await logoutUser()
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null
}

const authSlice = createSlice({
    name: 'auth',

    initialState,

    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
            state.isAuthenticated = true
        },

        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },

        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchMe.pending, (state) => { state.loading = true; state.error = null })
        .addCase(fetchMe.fulfilled, (state, { payload }) => {
            state.user = payload
            state.isAuthenticated = true
            state.loading = false
        })
        .addCase(fetchMe.rejected, (state) => {
            state.user = null
            state.loading = false
        })

        .addCase(logout.fulfilled, (state) => {
            state.user = null
            state.isAuthenticated = false
            state.loading = false
        })
        .addCase(logout.rejected, (state) => {
            state.user = null
            state.isAuthenticated = false
            state.loading = false
        })
    }
})

export const {
    setUser,
    clearUser,
    setLoading
} = authSlice.actions

export default authSlice.reducer