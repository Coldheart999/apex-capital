import axios from 'axios'

// Base API client
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// Types
export interface User {
  id: number
  email: string
  full_name: string
  phone?: string
  is_active: boolean
  is_admin: boolean
  is_verified: boolean
  balance: number
  invested: number
  total_deposits: number
  total_withdrawals: number
  referral_code?: string
  created_at: string
  last_login?: string
}

export interface Package {
  id: number
  name: string
  description?: string
  price: number
  currency: string
  roi_percentage: number
  daily_return_percentage: number
  duration_days: number
  min_duration_days?: number
  max_duration_days?: number
  features: string[]
  icon?: string
  color_scheme?: string
  is_popular: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Deposit {
  id: number
  user_id: number
  amount: number
  currency: string
  method: string
  status: 'pending' | 'completed' | 'failed'
  transaction_id?: string
  created_at: string
  processed_at?: string
}

export interface Withdrawal {
  id: number
  user_id: number
  amount: number
  currency: string
  method: string
  status: 'pending' | 'completed' | 'failed'
  wallet_address?: string
  bank_account?: string
  created_at: string
  processed_at?: string
}

export interface ReferralStats {
  total_referrals: number
  active_referrals: number
  total_earned: number
  referral_code: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
}

export interface BalanceInfo {
  balance: number
  invested: number
  total_deposits: number
  total_withdrawals: number
}

// API functions
export const authAPI = {
  register: (data: {
    email: string
    full_name: string
    phone?: string
    password: string
    referral_code?: string
  }) => api.post<AuthResponse>('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post<AuthResponse>('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get<User>('/auth/me'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
}

export const userAPI = {
  getBalance: () => api.get<BalanceInfo>('/users/balance'),
  updateProfile: (data: Partial<User>) => api.put<User>('/users/me', data),
}

export const packageAPI = {
  getPackages: () => api.get<Package[]>('/packages/'),
  getPackage: (id: number) => api.get<Package>(`/packages/${id}`),
}

export const depositAPI = {
  getDeposits: (status?: string) => api.get<Deposit[]>('/deposits/', { params: { status_filter: status } }),
  createDeposit: (data: { amount: number; currency?: string; method?: string; note?: string }) =>
    api.post<Deposit>('/deposits/', data),
  getDeposit: (id: number) => api.get<Deposit>(`/deposits/${id}`),
}

export const withdrawalAPI = {
  getWithdrawals: (status?: string) => api.get<Withdrawal[]>('/withdrawals/', { params: { status_filter: status } }),
  createWithdrawal: (data: {
    amount: number
    currency?: string
    method?: string
    wallet_address?: string
    bank_account?: string
    note?: string
  }) => api.post<Withdrawal>('/withdrawals/', data),
}

export const referralAPI = {
  getStats: () => api.get<ReferralStats>('/referrals/stats'),
  getReferrals: () => api.get<any[]>('/referrals/'),
}