'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  getAuth,
  User,
  UserCredential,
  AuthError,
} from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '@/utils/firebase'

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

// Define auth context value type
interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  signIn: () => Promise<UserCredential>
  logOut: () => Promise<void>
  clearError: () => void
}

// Create auth context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user)
        setLoading(false)
      },
      (error) => {
        setError(error.message)
        setLoading(false)
      },
    )
    return () => unsubscribe()
  }, [])

  const handleAuthError = (error: AuthError) => {
    console.error('Authentication error:', error)
    setError(error.message)
  }

  const clearError = () => {
    setError(null)
  }

  const signIn = async () => {
    try {
      const provider = new GoogleAuthProvider()
      provider.addScope('profile')
      provider.addScope('email')
      return await signInWithPopup(auth, provider)
    } catch (error) {
      handleAuthError(error as AuthError)
      throw error
    }
  }

  const logOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      handleAuthError(error as AuthError)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    error,
    signIn,
    logOut,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
