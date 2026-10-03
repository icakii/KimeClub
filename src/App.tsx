import { Route, Routes } from 'react-router-dom'
import { AdminRoute } from './components/AdminRoute'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminLayout } from './layouts/AdminLayout'
import { AppLayout } from './layouts/AppLayout'
import { ForgotPassword } from './pages/ForgotPassword'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Privacy } from './pages/Privacy'
import { ResetPassword } from './pages/ResetPassword'
import { Store } from './pages/Store'
import { Terms } from './pages/Terms'
import { Members } from './pages/admin/Members'
import { Home } from './pages/app/Home'
import { Payments } from './pages/app/Payments'
import { Profile } from './pages/app/Profile'
import { Schedule } from './pages/app/Schedule'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/store" element={<Store />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="payments" element={<Payments />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Members />} />
      </Route>
    </Routes>
  )
}

export default App
