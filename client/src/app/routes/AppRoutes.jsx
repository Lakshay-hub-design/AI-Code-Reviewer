import { Route, Routes } from 'react-router-dom'
import Login from '../../features/auth/pages/Login'
import ProtectedRoute from '../../features/auth/components/ProtectedRoute'
import DashboardLayout from '../../features/dashboard/layout/DashboardLayout'
import DashboardHome from '../../features/dashboard/pages/DashboardHome'
import Sessions from '../../features/dashboard/pages/Sessions'
import SharedWithMe from '../../features/dashboard/pages/SharedWithMe'

const AppRoutes = () => {
  return (
    <Routes>
        <Route path='/login' element={<Login />} />

        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>  
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="shared" element={<SharedWithMe />} />
          
        </Route>
    </Routes>
  )
}

export default AppRoutes