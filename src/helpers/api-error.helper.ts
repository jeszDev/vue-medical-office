import { isAxiosError } from 'axios';

/**
 * Extrae un mensaje de error comprensible para el usuario final a partir de un error de Axios o Error genérico.
 * Evita mostrar strings técnicos como "Request failed with status code 403".
 */
export const getApiErrorMessage = (
  error: unknown,
  fallbackMessage = 'Ocurrió un error al procesar la solicitud',
): string => {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;
    const backendMessage = data?.message;

    // Si Laravel envió errores de validación (HTTP 422)
    if (status === 422 && data?.errors && typeof data.errors === 'object') {
      const firstField = Object.keys(data.errors)[0];
      if (firstField && Array.isArray(data.errors[firstField]) && data.errors[firstField][0]) {
        return data.errors[firstField][0];
      }
    }

    // Si Laravel devolvió un mensaje explícito en data.message
    if (backendMessage && typeof backendMessage === 'string') {
      if (backendMessage === 'This action is unauthorized.') {
        return 'No tienes los permisos necesarios para realizar esta acción.';
      }
      return backendMessage;
    }

    // Mensajes amigables según el código HTTP de respuesta
    switch (status) {
      case 400:
        return 'La solicitud contiene datos incorrectos o incompletos.';
      case 401:
        return 'Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.';
      case 403:
        return 'No tienes los permisos necesarios para realizar esta acción.';
      case 404:
        return 'El registro solicitado no fue encontrado.';
      case 409:
        return 'Existe un conflicto con la información enviada (posible duplicado).';
      case 422:
        return 'Verifica los campos obligatorios del formulario.';
      case 500:
      case 502:
      case 503:
        return 'Ocurrió un error en el servidor. Por favor, inténtalo más tarde.';
      default:
        return fallbackMessage;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
};
