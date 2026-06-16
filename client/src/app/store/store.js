import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../../features/auth/authSlice'
import sessionReducer from '../../features/session/sessionSlice'
import notificationReducer from '../../features/notifications/notificationSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        session: sessionReducer,
        notification: notificationReducer
    }
})