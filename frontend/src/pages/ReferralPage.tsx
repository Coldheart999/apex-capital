import React from 'react'
import { useQuery } from '@tanstack/react-query'
import api, { ReferralStats, Referral } from '@/lib/api'
import {
  UserGroupIcon,
  GiftIcon,
  CheckCircleIcon,
  ClockIcon,
  LinkIcon,
  QrCodeIcon,
} from '@heroicons/react/24/outline'
import { useAuth } from '@/contexts/AuthContext'

export default function ReferralPage() {
  const { user } = useAuth()

  const { data: stats, isLoading: loadingStats } = useQuery(['referral-stats'], async () => {
    const res = await api.get<ReferralStats>('/referrals/stats')
    return res.data
  })

  const { data: referrals = [] } = useQuery(['referrals'], async () => {
    const res = await api.get<any[]>('/referrals/')
    return res.data
  })

  const referralLink = `https://apex-capital.vercel.app/register?ref=${user?.referral_code || ''}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    alert('Referral link copied to clipboard!')
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Referral Program</h1>
        <p className="text-gray-500 mt-2">Earn rewards by inviting friends to Apex Capital</p>
      </div>

      {/* Stats Cards */}
      {!loadingStats && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
            <UserGroupIcon className="w-8 h-8 text-primary-500 mx-auto mb-3" />
            <p className="text-3xl font-bold text-gray-900">{stats.total_referrals}</p>
            <p className="text-sm text-gray-500">Total Referrals</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
            <CheckCircleIcon className="w-8 h-8 text-success-500 mx-auto mb-3" />
            <p className="text-3xl font-bold text-gray-900">{stats.active_referrals}</p>
            <p className="text-sm text-gray-500">Active Referrals</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
            <GiftIcon className="w-8 h-8 text-secondary-500 mx-auto mb-3" />
            <p className="text-3xl font-bold text-gray-900">${stats.total_earned.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Total Earned</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
            <LinkIcon className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <p className="text-lg font-bold text-gray-900 truncate">{stats.referral_code}</p>
            <p className="text-sm text-gray-500">Your Code</p>
          </div>
        </div>
      )}

      {/* Referral Link */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Referral Link</h2>
        <p className="text-gray-600 mb-4">Share this link with your friends. You'll earn commissions for every deposit they make.</p>
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
          />
          <button
            onClick={copyToClipboard}
            className="px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Copy
          </button>
        </div>
        <div className="flex justify-center">
          <div className="bg-gray-100 p-4 rounded-lg">
            <QrCodeIcon className="w-24 h-24 text-gray-700" />
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 border border-primary-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="font-bold text-primary-600">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Share Your Link</h3>
            <p className="text-sm text-gray-600">Share your unique referral link with friends</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="font-bold text-primary-600">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">They Sign Up</h3>
            <p className="text-sm text-gray-600">Friends register using your referral link</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="font-bold text-primary-600">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">You Earn</h3>
            <p className="text-sm text-gray-600">Earn commission on their deposits</p>
          </div>
        </div>
      </div>

      {/* Referral List */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Referrals</h2>
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Referred User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Bonus</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((ref) => (
                <tr key={ref.id} className="border-b last:border-0">
                  <td className="py-3 px-4 text-sm text-gray-500">#{ref.id}</td>
                  <td className="py-3 px-4 text-gray-900">User ID: {ref.referred_id}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ref.status === 'completed'
                        ? 'bg-success-100 text-success-800'
                        : 'bg-warning-100 text-warning-800'
                    }`}>
                    {ref.status}
                  </span>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-success-600">${(ref.referral_bonus || 0).toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{formatDate(ref.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}