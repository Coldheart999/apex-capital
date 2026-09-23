import { useState, createContext, useContext, ReactNode, useEffect } from 'react'
import { Package, User, ReferralStats } from '@/lib/api'

interface AppContextType {
  user: User | null
  setUser: (user: User | null) => void
  packages: Package[]
  setPackages: (packages: Package[]) => void
  referralStats: ReferralStats | null
  setReferralStats: (stats: ReferralStats | null) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [packages, setPackages] = useState<Package[]>([])
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('accessToken')
      if (!token) return
      
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const userData = await res.json()
          setUser(userData)
        }
      } catch {
        // User not logged in
      }
    }

    fetchUserData()
  }, [])

  return (
    <AppContext.Provider value={{
      user, setUser,
      packages, setPackages,
      referralStats, setReferralStats,
      loading, setLoading
    }}>
      {children}
    </AppContext.Provider>
  )
}