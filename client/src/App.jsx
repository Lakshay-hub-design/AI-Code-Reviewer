import React, { useEffect } from 'react'
import AppRoutes from './app/routes/AppRoutes'
import { useDispatch } from 'react-redux'
import { fetchMe } from './features/auth/authSlice'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchMe())
  }, [])
  return (
    <div>
      <AppRoutes />
    </div>
  )
}

export default App
