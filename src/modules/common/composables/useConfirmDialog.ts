import { ref } from 'vue';

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  action: () => Promise<void> | void;
}

export const useConfirmDialog = () => {
  const isOpen = ref(false);
  const isLoading = ref(false);

  const title = ref('');
  const description = ref('');
  const confirmText = ref('Aceptar');
  const cancelText = ref('Cancelar');

  let currentAction: null | (() => Promise<void> | void) = null;

  const open = (options: ConfirmOptions) => {
    title.value = options.title;
    description.value = options.description ?? '';
    confirmText.value = options.confirmText ?? 'Aceptar';
    cancelText.value = options.cancelText ?? 'Cancelar';

    currentAction = options.action;

    isOpen.value = true;
  };

  const confirm = async () => {
    if (!currentAction) return;

    isLoading.value = true;

    try {
      await currentAction();
      isOpen.value = false;
    } finally {
      isLoading.value = false;
    }
  };

  const cancel = () => {
    isOpen.value = false;
  };

  return {
    isOpen,
    isLoading,
    title,
    description,
    confirmText,
    cancelText,
    open,
    confirm,
    cancel,
  };
};
