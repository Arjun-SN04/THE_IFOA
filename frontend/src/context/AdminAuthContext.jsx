import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { api } from '@/lib/api'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  // Session lives in an httpOnly cookie, so the only way to know whether we're
  // logged in is to ask the server.
  useEffect(() => {
    api
      .me()
      .then((data) => setAdmin(data.admin))
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password)
    setAdmin(data.admin)
    return data.admin
  }, [])

  const logout = useCallback(async () => {
    await api.logout().catch(() => {})
    setAdmin(null)
  }, [])

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider')
  return ctx
}
