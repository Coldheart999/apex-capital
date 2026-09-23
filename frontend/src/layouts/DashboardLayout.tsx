import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import {
  HomeIcon,
  BriefcaseIcon,
  WalletIcon,
  CreditCardIcon,
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Investment Packages', href: '/packages', icon: BriefcaseIcon },
  { name: 'My Deposits', href: '/deposits', icon: CreditCardIcon },
  { name: 'Withdraw Funds', href: '/withdraw', icon: WalletIcon },
  { name: 'Referrals', href: '/referrals', icon: UsersIcon },
  { name: 'Transaction History', href: '/history', icon: DocumentTextIcon },
  { name: 'Performance', href: '/performance', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
]

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-primary-900 to-primary-950 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-primary-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-secondary-500 to-primary-400 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Apex Capital</h1>
              <p className="text-sm text-primary-300">Investment Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center space-x-3 px-4 py-3 rounded-lg mx-2 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary-700 text-white'
                        : 'text-primary-200 hover:bg-primary-800 hover:text-white'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-primary-800">
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'User')}&background=06b6d4&color=fff`}
              alt={user?.full_name || 'User'}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium text-sm">{user?.full_name || 'User'}</p>
              <p className="text-xs text-primary-300">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-danger-600 hover:bg-danger-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            {navigation.find(n => n.href === location.pathname)?.name || 'Dashboard'}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Account Balance</p>
              <p className="text-2xl font-bold text-primary-600">${user?.balance?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
