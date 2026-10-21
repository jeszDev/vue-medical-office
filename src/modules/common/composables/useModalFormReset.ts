import { onMounted, onUnmounted, toValue, type MaybeRef } from 'vue';

/**
 * Escucha el evento 'hidden.tw.modal' disparado por el sistema de modales
 * (al cerrar con la "X", backdrop, tecla ESC o método programático)
 * y ejecuta el callback de limpieza del formulario.
 */
export function useModalFormReset(
  modalId: string,
  onReset: () => void,
  isEnabled: MaybeRef<boolean> = true,
) {
  let modalElement: HTMLElement | null = null;

  const handleHidden = () => {
    if (toValue(isEnabled)) {
      onReset();
    }
  };

  onMounted(() => {
    modalElement = document.getElementById(modalId);
    if (modalElement) {
      modalElement.addEventListener('hidden.tw.modal', handleHidden);
    } else {
      setTimeout(() => {
        modalElement = document.getElementById(modalId);
        if (modalElement) {
          modalElement.addEventListener('hidden.tw.modal', handleHidden);
        }
      }, 0);
    }
  });

  onUnmounted(() => {
    if (modalElement) {
      modalElement.removeEventListener('hidden.tw.modal', handleHidden);
      modalElement = null;
    }
  });
}
