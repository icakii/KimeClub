import { Route, Routes } from 'react-router-dom'
import { AdminRoute } from './components/AdminRoute'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useClub } from './hooks/useClub'
import { AdminLayout } from './layouts/AdminLayout'
import { AppLayout } from './layouts/AppLayout'
import { ForgotPassword } from './pages/ForgotPassword'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Privacy } from './pages/Privacy'
import { ResetPassword } from './pages/ResetPassword'
import { ServicePaused } from './pages/ServicePaused'
import { Store } from './pages/Store'
import { Terms } from './pages/Terms'
import { Attendance } from './pages/admin/Attendance'
import { Members } from './pages/admin/Members'
import { Subscription } from './pages/admin/Subscription'
import { Home } from './pages/app/Home'
import { Payments } from './pages/app/Payments'
import { Profile } from './pages/app/Profile'
import { Schedule } from './pages/app/Schedule'

function App() {
  // Gate the whole app, not just the public landing page's own RLS-based
  // filtering — a club's own members/staff could otherwise keep using the
  // site after being suspended for non-payment (RLS still lets them read
  // their own club regardless of status; only anonymous reads are filtered).
  const { data: club } = useClub()
  if (club && club.status !== 'live') {
    return <ServicePaused />
  }

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
        <Route path="attendance" element={<Attendance />} />
        <Route path="subscription" element={<Subscription />} />
      </Route>
    </Routes>
  )
}

export default App
