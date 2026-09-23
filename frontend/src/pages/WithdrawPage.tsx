import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api, { Withdrawal, BalanceInfo } from '@/lib/api'
import {
  CurrencyDollarIcon,
  BanknotesIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

export interface PaymentMethod {
  id: string
  name: string
  icon: React.ReactNode
  fields: string[]
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'bank',
    name: 'Bank Transfer',
    icon: <BanknotesIcon className="w-5 h-5" />,
    fields: ['bank_account'],
  },
  {
    id: 'stripe',
    name: 'Debit Card',
    icon: <CurrencyDollarIcon className="w-5 h-5" />,
    fields: [],
  },
]

export default function WithdrawPage() {
  const queryClient = useQueryClient()
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('bank')
  const [bankAccount, setBankAccount] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [note, setNote] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const { data: balanceInfo } = useQuery(['balance'], async () => {
    const res = await api.get<BalanceInfo>('/users/balance')
    return res.data
  })

  const { data: withdrawals = [] } = useQuery(['withdrawals'], async () => {
    const res = await api.get<Withdrawal[]>('/withdrawals/')
    return res.data
  })

  const createWithdrawal = useMutation(
    (data: any) => api.post('/withdrawals/', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['withdrawals'])
        queryClient.invalidateQueries(['balance'])
        setShowSuccess(true)
        setAmount('')
        setNote('')
        setBankAccount('')
        setWalletAddress('')
      },
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amt = parseFloat(amount)
    if (amt <= 0) return

    createWithdrawal.mutate({
      amount: amt,
      currency: 'USD',
      method,
      bank_account: method === 'bank' ? bankAccount : undefined,
      wallet_address: walletAddress || undefined,
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
        <h1 className="text-3xl font-bold text-gray-900">Withdraw Funds</h1>
        <p className="text-gray-500 mt-2">Transfer your balance to your bank account or wallet</p>
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-6 border border-primary-100">
        <p className="text-sm text-gray-600">Available Balance</p>
        <p className="text-3xl font-bold text-primary-600">
          ${balanceInfo?.balance?.toFixed(2) || '0.00'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Withdrawal Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Withdrawal Form</h2>

          {showSuccess && (
            <div className="bg-success-50 border border-success-200 text-success-800 px-4 py-3 rounded-lg mb-4 flex items-center">
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              Withdrawal request submitted successfully!
            </div>
          )}

          {balanceInfo && parseFloat(amount) > balanceInfo.balance && (
            <div className="bg-danger-50 border border-danger-200 text-danger-800 px-4 py-3 rounded-lg mb-4 flex items-center">
              <XCircleIcon className="w-5 h-5 mr-2" />
              Insufficient balance for this withdrawal amount.
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
                  min={balanceInfo ? (balanceInfo.balance * 0.01).toFixed(2) : '1'}
                  max={balanceInfo?.balance.toFixed(2) || '0'}
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-xl"
                  placeholder="0.00"
                />
              </div>
              <button
                type="button"
                onClick={() => setAmount((balanceInfo?.balance || 0).toFixed(2))}
                className="text-xs text-primary-600 hover:text-primary-700 mt-1"
              >
                Withdraw all (${balanceInfo?.balance.toFixed(2) || '0.00'})
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {paymentMethods.map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setMethod(pm.id)}
                    className={`p-4 border rounded-xl text-center transition-all flex items-center justify-center space-x-2 ${
                      method === pm.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {pm.icon}
                    <span className="text-sm font-medium">{pm.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {method === 'bank' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account Details</label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Enter bank account number or details"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Address (Optional)</label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Enter wallet address for crypto withdrawals"
              />
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
              disabled={createWithdrawal.isPending || !amount || (balanceInfo && parseFloat(amount) > balanceInfo.balance)}
              className="w-full py-3 px-6 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <CurrencyDollarIcon className="w-5 h-5" />
              <span>{createWithdrawal.isPending ? 'Processing...' : 'Submit Withdrawal'}</span>
            </button>
          </form>
        </div>

        {/* Recent Withdrawals */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Withdrawals</h2>
          <div className="space-y-4">
            {withdrawals.slice(0, 5).map((withdrawal) => (
              <div key={withdrawal.id} className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      withdrawal.status === 'completed'
                        ? 'bg-success-100'
                        : withdrawal.status === 'failed'
                        ? 'bg-danger-100'
                        : 'bg-warning-100'
                    }`}>
                      <CurrencyDollarIcon className={`w-5 h-5 ${
                        withdrawal.status === 'completed'
                          ? 'text-success-600'
                          : withdrawal.status === 'failed'
                          ? 'text-danger-600'
                          : 'text-warning-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">${withdrawal.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{withdrawal.method} • {formatDate(withdrawal.created_at)}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    withdrawal.status === 'completed'
                      ? 'bg-success-100 text-success-800'
                      : withdrawal.status === 'failed'
                      ? 'bg-danger-100 text-danger-800'
                      : 'bg-warning-100 text-warning-800'
                  }`}>
                    {withdrawal.status}
                  </span>
                </div>
              </div>
            ))}
            {withdrawals.length === 0 && (
              <p className="text-center text-gray-500 py-8">No withdrawals yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}