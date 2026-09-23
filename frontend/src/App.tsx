import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardPage from './pages/DashboardPage'
import PackagesPage from './pages/PackagesPage'
import DepositPage from './pages/DepositPage'
import WithdrawPage from './pages/WithdrawPage'
import ReferralPage from './pages/ReferralPage'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <RequireAuth><DashboardLayout /></RequireAuth>
      }>
        <Route index element={<DashboardPage />} />
      </Route>

      <Route path="/packages" element={
        <RequireAuth><DashboardLayout /></RequireAuth>
      }>
        <Route index element={<PackagesPage />} />
      </Route>

      <Route path="/deposit" element={
        <RequireAuth><DashboardLayout /></RequireAuth>
      }>
        <Route index element={<DepositPage />} />
      </Route>

      <Route path="/withdraw" element={
        <RequireAuth><DashboardLayout /></RequireAuth>
      }>
        <Route index element={<WithdrawPage />} />
      </Route>

      <Route path="/referrals" element={
        <RequireAuth><DashboardLayout /></RequireAuth>
      }>
        <Route index element={<ReferralPage />} />
      </Route>

      <Route path="/history" element={
        <RequireAuth><DashboardLayout /></RequireAuth>
      }>
        <Route index element={<div className="text-center py-16 text-gray-500">Transaction history coming soon</div>} />
      </Route>

      <Route path="/performance" element={
        <RequireAuth><DashboardLayout /></RequireAuth>
      }>
        <Route index element={<div className="text-center py-16 text-gray-500">Performance dashboard coming soon</div>} />
      </Route>

      <Route path="/settings" element={
        <RequireAuth><DashboardLayout /></RequireAuth>
      }>
        <Route index element={<div className="text-center py-16 text-gray-500">Settings coming soon</div>} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App