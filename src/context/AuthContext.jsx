import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth'
import { ROLES } from '../utils/constants.js'
import { firebaseAuth } from '../firebase.js'

const AuthContext = createContext(null)
const ROLE_STORAGE_KEY = 'ems_user_roles'
const AVATAR_STORAGE_KEY = 'ems_user_avatars'
const THEME_STORAGE_KEY = 'ems_theme'

function readRolesMap() {
  try {
    const raw = localStorage.getItem(ROLE_STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function applyThemeClass(theme) {
  const root = document.documentElement
  if (theme === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}

function readAvatarsMap() {
  try {
    const raw = localStorage.getItem(AVATAR_STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function buildUser(firebaseUser, role, avatarUrl) {
  if (!firebaseUser) return null
  return {
    id: firebaseUser.uid,
    fullName: firebaseUser.displayName || 'User',
    email: (firebaseUser.email || '').trim().toLowerCase(),
    role: role || ROLES.EMPLOYEE,
    avatarUrl: avatarUrl || firebaseUser.photoURL || 'https://i.pravatar.cc/150?img=9',
  }
}

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [userRole, setUserRole] = useState(() => {
    const currentEmail = firebaseAuth.currentUser?.email?.toLowerCase()
    if (!currentEmail) return ROLES.EMPLOYEE
    const rolesMap = readRolesMap()
    return rolesMap[currentEmail] || ROLES.EMPLOYEE
  })
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) || 'light')
  const [userAvatar, setUserAvatar] = useState('')

  useEffect(() => {
    applyThemeClass(theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (user) => {
      setFirebaseUser(user)
      const email = user?.email?.toLowerCase()
      const rolesMap = readRolesMap()
      setUserRole(email ? rolesMap[email] || ROLES.EMPLOYEE : ROLES.EMPLOYEE)
      const avatarsMap = readAvatarsMap()
      setUserAvatar(email ? avatarsMap[email] || '' : '')
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const auth = useMemo(
    () => ({
      isAuthenticated: !!firebaseUser,
      user: buildUser(firebaseUser, userRole, userAvatar),
    }),
    [firebaseUser, userRole, userAvatar],
  )

  const value = useMemo(() => {
    function saveRole(email, role) {
      const normalizedEmail = String(email || '').trim().toLowerCase()
      if (!normalizedEmail) return
      const rolesMap = readRolesMap()
      rolesMap[normalizedEmail] = role
      localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(rolesMap))
    }

    function readRole(email) {
      const normalizedEmail = String(email || '').trim().toLowerCase()
      if (!normalizedEmail) return ROLES.EMPLOYEE
      const rolesMap = readRolesMap()
      return rolesMap[normalizedEmail] || ROLES.EMPLOYEE
    }

    function saveAvatar(email, avatarUrl) {
      const normalizedEmail = String(email || '').trim().toLowerCase()
      if (!normalizedEmail) return
      const avatarsMap = readAvatarsMap()
      avatarsMap[normalizedEmail] = avatarUrl || ''
      localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(avatarsMap))
    }

    function readAvatar(email) {
      const normalizedEmail = String(email || '').trim().toLowerCase()
      if (!normalizedEmail) return ''
      const avatarsMap = readAvatarsMap()
      return avatarsMap[normalizedEmail] || ''
    }

    async function login({ email, password, role }) {
      const credential = await signInWithEmailAndPassword(firebaseAuth, email, password)
      const safeRole = Object.values(ROLES).includes(role)
        ? role
        : readRole(credential.user.email)
      saveRole(credential.user.email, safeRole)
      setUserRole(safeRole)
      setUserAvatar(readAvatar(credential.user.email))
    }

    async function register({ fullName, email, password, role }) {
      const safeRole = Object.values(ROLES).includes(role) ? role : ROLES.EMPLOYEE
      const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password)
      await updateFirebaseProfile(credential.user, {
        displayName: (fullName || '').trim() || 'User',
      })
      saveRole(credential.user.email, safeRole)
      setUserRole(safeRole)
      setUserAvatar(readAvatar(credential.user.email))
    }

    async function logout() {
      await signOut(firebaseAuth)
      setUserRole(ROLES.EMPLOYEE)
      setUserAvatar('')
    }

    async function updateProfile(partial) {
      if (!firebaseAuth.currentUser) return
      try {
        await updateFirebaseProfile(firebaseAuth.currentUser, {
          displayName: partial.fullName,
        })
      } catch {
        // Keep local profile updates working even if Firebase displayName update fails.
      }
      saveAvatar(firebaseAuth.currentUser.email, partial.avatarUrl)
      setUserAvatar(partial.avatarUrl || '')
      if (partial.role) {
        saveRole(firebaseAuth.currentUser.email, partial.role)
        setUserRole(partial.role)
      }
      setFirebaseUser({ ...firebaseAuth.currentUser })
    }

    function toggleTheme() {
      setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
    }

    return {
      auth,
      theme,
      login,
      register,
      logout,
      updateProfile,
      toggleTheme,
      loading,
    }
  }, [auth, theme, loading, firebaseUser])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

