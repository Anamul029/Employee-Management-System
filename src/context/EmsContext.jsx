import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { departmentsSeed } from '../data/departments.js'
import { api } from '../services/api.js'

const EmsContext = createContext(null)

export function EmsProvider({ children }) {
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState(departmentsSeed)

  useEffect(() => {
    async function loadData() {
      try {
        const [employeesRes, departmentsRes] = await Promise.all([
          api.get('/api/employees'),
          api.get('/api/departments'),
        ])
        setEmployees(Array.isArray(employeesRes.data) ? employeesRes.data : [])
        const serverDepartments = Array.isArray(departmentsRes.data) ? departmentsRes.data : []
        if (serverDepartments.length) {
          setDepartments(serverDepartments)
        } else {
          const seeded = await Promise.all(
            departmentsSeed.map(async (dept) => {
              const { data } = await api.post('/api/departments', { name: dept.name })
              return data
            }),
          )
          setDepartments(seeded)
        }
      } catch {
        setEmployees([])
        setDepartments(departmentsSeed)
      }
    }
    loadData()
  }, [])

  const value = useMemo(() => {
    async function addEmployee(payload) {
      const { data } = await api.post('/api/employees', payload)
      setEmployees((prev) => [data, ...prev])
      return data
    }

    async function updateEmployee(id, patch) {
      const { data } = await api.put(`/api/employees/${id}`, patch)
      setEmployees((prev) => prev.map((e) => (e.id === id ? data : e)))
      return data
    }

    async function deleteEmployee(id) {
      await api.delete(`/api/employees/${id}`)
      setEmployees((prev) => prev.filter((e) => e.id !== id))
    }

    async function addDepartment(name) {
      const { data } = await api.post('/api/departments', { name })
      setDepartments((prev) => [data, ...prev])
      return data
    }

    async function deleteDepartment(id) {
      await api.delete(`/api/departments/${id}`)
      setDepartments((prev) => prev.filter((d) => d.id !== id))
      setEmployees((prev) => prev.map((e) => (e.departmentId === id ? { ...e, departmentId: '' } : e)))
    }

    function getDepartmentName(departmentId) {
      return departments.find((d) => d.id === departmentId)?.name || '—'
    }

    return {
      employees,
      departments,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      addDepartment,
      deleteDepartment,
      getDepartmentName,
    }
  }, [employees, departments])

  return <EmsContext.Provider value={value}>{children}</EmsContext.Provider>
}

export function useEms() {
  const ctx = useContext(EmsContext)
  if (!ctx) throw new Error('useEms must be used within EmsProvider')
  return ctx
}

