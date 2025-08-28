import axios from 'axios'

const medicalOfficeApi = axios.create({
  baseURL: import.meta.env.VITE_MEDICAL_OFFICE_API_URL,
})

medicalOfficeApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export { medicalOfficeApi }
