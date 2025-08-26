import { bodegaApi } from '@/api/medicalOfficeApi'

interface LogoutSuccess {
  success: true
  message: string
}

interface LogoutError {
  success: false
  message: string
}

export const logoutAction = async (): Promise<LogoutSuccess | LogoutError> => {
  try {
    const { data } = await bodegaApi.post<LogoutSuccess>('/auth/logout')

    console.log(data)

    if (data.success) return data
    else
      return {
        success: false,
        message: 'Unauthenticated.',
      }
  } catch (error) {
    console.log(error)

    return {
      success: false,
      message: 'Unauthenticated.',
    }
  }
}
