import { Route, Routes } from 'react-router-dom'
import Login from '../../features/auth/pages/Login'
import ProtectedRoute from '../../features/auth/components/ProtectedRoute'
import Dashboard from '../../features/dashboard/pages/Dashboard'

const AppRoutes = () => {
  return (
    <Routes>
        <Route path='/login' element={<Login />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
    </Routes>
  )
}

export default AppRoutes