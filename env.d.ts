/// <reference types="vite/client" />

interface Window {
  tailwind?: {
    Modal: {
      getOrCreateInstance: (el: HTMLElement | Element | null) => {
        show: () => void;
        hide: () => void;
        toggle: () => void;
      };
      getInstance: (el: HTMLElement | Element | null) => {
        show: () => void;
        hide: () => void;
        toggle: () => void;
      } | null;
    };
    Tab?: any;
    Accordion?: any;
  };
}
