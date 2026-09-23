import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api, { Deposit, Package, BalanceInfo } from '@/lib/api'
import {
  CreditCardIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'

export default function DepositPage() {
  const queryClient = useQueryClient()
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [method, setMethod] = useState('stripe')
  const [note, setNote] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const { data: balanceInfo } = useQuery(['balance'], async () => {
    const res = await api.get<BalanceInfo>('/users/balance')
    return res.data
  })

  const { data: packages = [] } = useQuery(['packages'], async () => {
    const res = await api.get<Package[]>('/packages/')
    return res.data
  })

  const { data: deposits = [] } = useQuery(['deposits'], async () => {
    const res = await api.get<Deposit[]>('/deposits/')
    return res.data
  })

  const createDeposit = useMutation(
    (data: any) => api.post('/deposits/', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['deposits'])
        queryClient.invalidateQueries(['balance'])
        setShowSuccess(true)
        setAmount('')
        setNote('')
      },
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amt = parseFloat(amount)
    if (amt <= 0) return

    createDeposit.mutate({
      amount: amt,
      currency,
      method,
      note: note || undefined,
    })
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Deposit Funds</h1>
        <p className="text-gray-500 mt-2">Add money to your account to start investing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Deposit Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Deposit Form</h2>

          {showSuccess && (
            <div className="bg-success-50 border border-success-200 text-success-800 px-4 py-3 rounded-lg mb-4 flex items-center">
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              Deposit submitted successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">$</span>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-xl"
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Current balance: <strong>${balanceInfo?.balance?.toFixed(2) || '0.00'}</strong>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMethod('stripe')}
                  className={`p-4 border rounded-xl text-center transition-all flex flex-col items-center ${
                    method === 'stripe'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <BanknotesIcon className="w-6 h-6 mb-2 text-primary-600" />
                  <span className="text-sm font-medium">Credit Card</span>
                  <span className="text-xs text-gray-500">Stripe</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('bank')}
                  className={`p-4 border rounded-xl text-center transition-all flex flex-col items-center ${
                    method === 'bank'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CurrencyDollarIcon className="w-6 h-6 mb-2 text-success-600" />
                  <span className="text-sm font-medium">Bank Transfer</span>
                  <span className="text-xs text-gray-500">Manual</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Note (Optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Any additional information..."
              />
            </div>

            <button
              type="submit"
              disabled={createDeposit.isPending || !amount}
              className="w-full py-3 px-6 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <CreditCardIcon className="w-5 h-5" />
              <span>{createDeposit.isPending ? 'Processing...' : 'Submit Deposit'}</span>
            </button>
          </form>
        </div>

        {/* Recent Deposits */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Deposits</h2>
          <div className="space-y-4">
            {deposits.slice(0, 5).map((deposit) => (
              <div key={deposit.id} className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      deposit.status === 'completed' ? 'bg-success-100' : 'bg-gray-100'
                    }`}>
                      <CreditCardIcon className={`w-5 h-5 ${
                        deposit.status === 'completed' ? 'text-success-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">${deposit.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{deposit.method} • {formatDate(deposit.created_at)}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    deposit.status === 'completed'
                      ? 'bg-success-100 text-success-800'
                      : deposit.status === 'failed'
                      ? 'bg-danger-100 text-danger-800'
                      : 'bg-warning-100 text-warning-800'
                  }`}>
                    {deposit.status}
                  </span>
                </div>
              </div>
            ))}
            {deposits.length === 0 && (
              <p className="text-center text-gray-500 py-8">No deposits yet. Make your first deposit!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Wallet({ className }: { className: string }) {
  return <CreditCardIcon className={className} />
}