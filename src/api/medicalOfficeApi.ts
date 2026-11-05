import axios from 'axios'

const medicalOfficeApi = axios.create({
  baseURL: import.meta.env.VITE_MEDICAL_OFFICE_API_URL,
})

medicalOfficeApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  const activeRole = localStorage.getItem('active_role')
  if (activeRole) {
    config.headers['X-Active-Role'] = activeRole
  }

  return config
})

export { medicalOfficeApi }
