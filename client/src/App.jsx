import React, { useEffect } from 'react'
import AppRoutes from './app/routes/AppRoutes'
import { useDispatch } from 'react-redux'
import { fetchMe } from './features/auth/authSlice'
import { Toaster } from 'react-hot-toast'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchMe())
  }, [])
  return (
    <div>
      <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1E293B',
              color: '#F1F5F9',
              border: '1px solid #334155',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#22C55E', secondary: '#1E293B' } },
            error:   { iconTheme: { primary: '#EF4444', secondary: '#1E293B' } },
          }}
        />
      <AppRoutes />
    </div>
  )
}

export default App
