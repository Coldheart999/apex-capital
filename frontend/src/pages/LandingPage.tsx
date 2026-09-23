import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon, SparklesIcon } from '@heroicons/react/24/outline'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Apex Capital
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#features" className="text-gray-700 hover:text-primary-600 transition-colors">Features</a>
            <a href="#packages" className="text-gray-700 hover:text-primary-600 transition-colors">Packages</a>
            <a href="#testimonials" className="text-gray-700 hover:text-primary-600 transition-colors">Testimonials</a>
            <Link
              to="/login"
              className="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md mb-8">
            <SparklesIcon className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Investing Excellence Since 2020</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-700 bg-clip-text text-transparent mb-6">
            Build Your Financial Future
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Join Apex Capital and grow your wealth with our expertly curated investment packages.
            Earn consistent returns while we manage the complexity.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link
              to="/register"
              className="px-10 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <span>Get Started</span>
            </Link>
            <Link
              to="/packages"
              className="px-10 py-4 bg-white text-primary-600 border-2 border-primary-200 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-colors flex items-center justify-center space-x-2"
            >
              <span>View Packages</span>
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            No minimum deposit • Bank-level security • 24/7 support
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Why Choose Apex Capital</h2>
          <p className="text-center text-gray-600 mb-16 max-w2xl mx-auto">
            We provide cutting-edge investment solutions with transparent, automated returns.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Automated Returns', desc: 'Daily yield deposited automatically into your account', icon: '🤖' },
              { title: 'Multiple Packages', desc: 'Choose from various investment tiers to match your goals', icon: '📦' },
              { title: 'Referral Program', desc: 'Earn bonuses for every friend you bring to Apex Capital', icon: '👥' },
            ].map((f, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg text-center border border-gray-100">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Investing?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of satisfied investors at Apex Capital</p>
          <Link
            to="/register"
            className="inline-block px-12 py-4 bg-white text-primary-600 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">&copy; 2024 Apex Capital. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
