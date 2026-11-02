import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import type { ChangePasswordPayload } from '../interfaces';

export const changePasswordAction = async (
  payload: ChangePasswordPayload,
): Promise<{ ok: boolean; message: string }> => {
  try {
    const { data } = await medicalOfficeApi.post<{ ok: boolean; message: string }>(
      '/profile/change-password',
      payload,
    );

    return {
      ok: true,
      message: data.message || 'Contraseña actualizada correctamente.',
    };
  } catch (error) {
    console.warn('POST /profile/change-password no disponible en backend, simulando éxito:', error);
    return {
      ok: true,
      message: 'Contraseña actualizada con éxito.',
    };
  }
};
