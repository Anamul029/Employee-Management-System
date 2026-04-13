import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PublicLayout from './layouts/PublicLayout.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import HomePage from './pages/public/HomePage.jsx'
import LoginPage from './pages/public/LoginPage.jsx'
import RegisterPage from './pages/public/RegisterPage.jsx'
import DashboardOverviewPage from './pages/dashboard/DashboardOverviewPage.jsx'
import EmployeesListPage from './pages/employees/EmployeesListPage.jsx'
import AddEmployeePage from './pages/employees/AddEmployeePage.jsx'
import EditEmployeePage from './pages/employees/EditEmployeePage.jsx'
import DepartmentsPage from './pages/departments/DepartmentsPage.jsx'
import ProfilePage from './pages/profile/ProfilePage.jsx'
import NotFoundPage from './pages/misc/NotFoundPage.jsx'

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverviewPage />} />
        <Route path="employees" element={<EmployeesListPage />} />
        <Route
          path="employees/add"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
              <AddEmployeePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="employees/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <EditEmployeePage />
            </ProtectedRoute>
          }
        />
        <Route path="departments" element={<DepartmentsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default App
