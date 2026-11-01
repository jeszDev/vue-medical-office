import tippy, { type Instance, type Placement } from 'tippy.js';
import type { Directive } from 'vue';

export interface TooltipOptions {
  content: string;
  placement?: Placement;
  color?: string;
}

const getElementInstance = (el: HTMLElement & { _tippyInstance?: Instance }) => {
  return el._tippyInstance;
};

export const createMidoneTooltip = (
  el: HTMLElement,
  options: string | TooltipOptions,
): Instance => {
  const content = typeof options === 'string' ? options : options.content;
  const placement: Placement = typeof options === 'object' && options.placement ? options.placement : 'top';
  const colorClass =
    typeof options === 'object' && options.color
      ? options.color
      : '[--color:var(--color-primary)]';

  return tippy(el, {
    content,
    placement,
    arrow: false,
    animation: false,
    hideOnClick: true,
    delay: [80, 0],
    render(instance) {
      const popper = document.createElement('div');
      const box = document.createElement('div');
      popper.appendChild(box);
      box.className = `backdrop-blur-xl rounded-lg border px-2.5 py-0.5 bg-(--color)/20 border-(--color)/60 text-(--color) ${colorClass} text-xs shadow-md font-medium whitespace-nowrap z-50 select-none pointer-events-none`;
      box.textContent = String(instance.props.content || '');
      return {
        popper,
        onUpdate(prevProps, nextProps) {
          box.textContent = String(nextProps.content || '');
        },
      };
    },
  });
};

export const vTooltip: Directive<HTMLElement & { _tippyInstance?: Instance }, string | TooltipOptions> = {
  mounted(el, binding) {
    if (!binding.value) return;
    const instance = createMidoneTooltip(el, binding.value);
    el._tippyInstance = instance;
  },
  updated(el, binding) {
    const instance = getElementInstance(el);
    if (!binding.value) {
      if (instance) {
        instance.destroy();
        delete el._tippyInstance;
      }
      return;
    }
    const newContent = typeof binding.value === 'string' ? binding.value : binding.value.content;
    if (instance) {
      instance.setContent(newContent);
    } else {
      el._tippyInstance = createMidoneTooltip(el, binding.value);
    }
  },
  unmounted(el) {
    const instance = getElementInstance(el);
    if (instance) {
      instance.destroy();
      delete el._tippyInstance;
    }
  },
};
