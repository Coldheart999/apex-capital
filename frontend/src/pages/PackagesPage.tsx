import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api, { Package } from '@/lib/api'
import { CheckCircleIcon, SparklesIcon, CurrencyDollarIcon, ClockIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'

export default function PackagesPage() {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)

  const { data: packages = [], isLoading } = useQuery(['packages'], async () => {
    const res = await api.get<Package[]>('/packages/')
    return res.data
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Investment Packages</h1>
        <p className="text-gray-500 mt-2">Choose the plan that fits your financial goals</p>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} onSelect={() => setSelectedPackage(pkg)} />
        ))}
      </div>
    </div>
  )
}

function PackageCard({ pkg, onSelect }: { pkg: Package; onSelect: () => void }) {
  const dailyReturn = ((pkg.roi_percentage * pkg.price) / pkg.duration_days).toFixed(2)
  const features = pkg.features || []

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 hover:border-primary-200 transition-all overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900">{pkg.name}</h3>
          {pkg.is_popular && (
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              ⭐ Popular
            </div>
          )}
        </div>

        <div className="mb-6">
          <p className="text-4xl font-bold text-primary-600">${pkg.price.toLocaleString()}</p>
          {pkg.currency !== 'USD' && <span className="text-gray-500">{pkg.currency}</span>}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Daily Return</p>
            <p className="font-bold text-success-600">${dailyReturn}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Duration</p>
            <p className="font-bold text-gray-900">{pkg.duration_days} days</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Total ROI</p>
            <p className="font-bold text-primary-600">{pkg.roi_percentage}%</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Est. Profit</p>
            <p className="font-bold text-secondary-600">${((pkg.roi_percentage * pkg.price / 100).toFixed(2))}</p>
          </div>
        </div>

        {pkg.description && (
          <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
        )}

        {features.length > 0 && (
          <ul className="space-y-2 mb-6">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center space-x-2 text-sm">
                <CheckCircleIcon className="w-4 h-4 text-success-500 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={onSelect}
          className="w-full py-3 px-6 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
        >
          <ArrowTrendingUpIcon className="w-5 h-5" />
          <span>Invest Now</span>
        </button>
      </div>
    </div>
  )
}