import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { auth, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return null
  }

  if (!auth?.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (allowedRoles?.length && !allowedRoles.includes(auth?.user?.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

