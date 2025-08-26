import { bodegaApi } from '@/api/medicalOfficeApi'
import type { AuthResponse, User } from '../interfaces'
import { isAxiosError } from 'axios'

interface CheckError {
  ok: false
}

interface CheckSuccess {
  ok: true
  user: User
  token: string
}

export const checkAuthAction = async (): Promise<CheckError | CheckSuccess> => {
  try {
    const localToken = localStorage.getItem('token')
    console.log(`localToken: ${localToken}`)

    if (!localToken) {
      console.log('no existe token123')

      return { ok: false }
    }

    const { data } = await bodegaApi.post<AuthResponse>('/auth/check-status')

    console.log('check status response: ')
    console.log(data)

    localStorage.removeItem('token')
    localStorage.setItem('token', data.token)

    return {
      ok: true,
      user: data.user,
      token: data.token,
    }
  } catch (error) {
    //   if (isAxiosError(error) && error.response?.status === 401) {
    //     return { ok: false };
    //   }
    if (isAxiosError(error)) {
      console.error('Error en la petición:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.config?.headers,
      })
    } else {
      console.error('Error desconocido:', error)
    }
  }
}
