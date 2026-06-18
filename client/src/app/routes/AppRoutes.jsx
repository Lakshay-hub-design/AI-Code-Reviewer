import { Route, Routes } from 'react-router-dom'
import Login from '../../features/auth/pages/Login'
import ProtectedRoute from '../../features/auth/components/ProtectedRoute'
import DashboardHome from '../../features/dashboard/pages/DashboardHome'
import Sessions from '../../features/session/pages/Sessions'
import SharedWithMe from '../../features/sharedSessions/pages/SharedWithMe'
import DashboardLayout from '../../layout/DashboardLayout'
import JoinSession from '../../features/session/pages/JoinSession'
import EditorPage from '../../features/editor/pages/EditorPage'

const AppRoutes = () => {
  return (
    <Routes>
        <Route path='/login' element={<Login />} />
        <Route path="/join/:id" element={<JoinSession />} />
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>  
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="shared" element={<SharedWithMe />} />
          
        </Route>

        <Route path='/editor/:id' element={<EditorPage />} />
    </Routes>
  )
}

export default AppRoutes