import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useQuery } from '@tanstack/react-query'
import api, { Package, AuthResponse } from '@/lib/api'
import {
  WalletIcon,
  BriefcaseIcon,
  CreditCardIcon,
  CheckCircleIcon,
  SparklesIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline'

export default function DashboardPage() {
  const { user, logout } = useAuth()

  const { data: packages = [] } = useQuery(['packages'], async () => {
    const res = await api.get<Package[]>('/packages/')
    return res.data
  })

  const stats = [
    { label: 'Account Balance', value: `$${user?.balance?.toFixed(2) || '0.00'}`, icon: WalletIcon, color: 'blue' },
    { label: 'Total Invested', value: `$${user?.invested?.toFixed(2) || '0.00'}`, icon: ArrowTrendingUpIcon, color: 'green' },
    { label: 'Total Deposits', value: `$${user?.total_deposits?.toFixed(2) || '0.00'}`, icon: CreditCardIcon, color: 'purple' },
    { label: 'Total Withdrawn', value: `$${user?.total_withdrawals?.toFixed(2) || '0.00'}`, icon: CurrencyDollarIcon, color: 'amber' },
  ]

  const recentPackages = packages.filter(p => p.is_popular).slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.full_name || 'User'}!</h1>
        <p className="opacity-90 mb-4">Your financial journey with Apex Capital</p>
        <div className="flex items-center space-x-4 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => window.location.href = '/deposit'}
          className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transform hover:scale-[1.02] transition-all text-left"
        >
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <WalletIcon className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="font-bold text-lg text-gray-900">Deposit Funds</h3>
          <p className="text-sm text-gray-500 mt-1">Add money to your account</p>
        </button>
        <button
          onClick={() => window.location.href = '/withdraw'}
          className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transform hover:scale-[1.02] transition-all text-left"
        >
          <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4">
            <CurrencyDollarIcon className="w-6 h-6 text-success-600" />
          </div>
          <h3 className="font-bold text-lg text-gray-900">Withdraw Funds</h3>
          <p className="text-sm text-gray-500 mt-1">Transfer balance to your bank</p>
        </button>
        <button
          onClick={() => window.location.href = '/packages'}
          className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transform hover:scale-[1.02] transition-all text-left"
        >
          <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
            <ArrowTrendingUpIcon className="w-6 h-6 text-secondary-600" />
          </div>
          <h3 className="font-bold text-lg text-gray-900">Investment Packages</h3>
          <p className="text-sm text-gray-500 mt-1">Explore available investments</p>
        </button>
      </div>

      {/* Popular Packages */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Popular Investment Packages</h2>
          <button
            onClick={() => window.location.href = '/packages'}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-primary-500 pl-4 py-2">
            <p className="font-medium text-gray-900">Welcome to Apex Capital!</p>
            <p className="text-sm text-gray-500">Your account is ready. Start investing today.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function PackageCard({ pkg }: { pkg: Package }) {
  const dailyReturn = ((pkg.roi_percentage * pkg.price) / pkg.duration_days).toFixed(2)

  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
        {pkg.is_popular && (
          <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Popular
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-primary-600 mb-2">${pkg.price.toLocaleString()}</p>
      <p className="text-sm text-gray-500 mb-4">{pkg.description}</p>
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">ROI</span>
          <span className="font-semibold text-gray-900">{pkg.roi_percentage}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Daily Return</span>
          <span className="font-semibold text-success-600">${dailyReturn}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Duration</span>
          <span className="font-semibold text-gray-900">{pkg.duration_days} days</span>
        </div>
      </div>
      <button className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
        Invest Now
      </button>
    </div>
  )
}