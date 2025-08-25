import $ from 'jquery';

(function () {
  'use strict';
  window.$ = $;
  window.jQuery = $;

  // Set defaults
  $('.accordion').each(function () {
    const active = $(this).find('.accordion-item.show');
    if (!active.length) {
      toggle($(this).find('.accordion-button').first(), 'show');
    }
  });

  // Toggle accordion content
  $('body').on('click', '.accordion-button', function () {
    toggle(this);
  });

  function toggle(el, event = 'toggle') {
    $(el)
      .closest('.accordion')
      .find('.accordion-button')
      .each(function () {
        // Trigger "hide.tw.accordion" callback function
        if (
          $(this).closest('.accordion-item').hasClass('show') &&
          this !== el &&
          (event == 'toggle' || event == 'hide')
        ) {
          const event = new Event('hide.tw.accordion');
          $(this).closest('.accordion-header')[0].dispatchEvent(event);
        }

        // Trigger "show.tw.accordion" callback function
        if (
          !$(this).closest('.accordion-item').hasClass('show') &&
          this === el &&
          (event == 'toggle' || event == 'show')
        ) {
          const event = new Event('show.tw.accordion');
          $(this).closest('.accordion-header')[0].dispatchEvent(event);
        }
      });

    const collapsed = !$(el).closest('.accordion-item').hasClass('show');

    // Close active accordion
    $(el)
      .closest('.accordion')
      .find('.accordion-collapse')
      .each(function () {
        $(this).slideUp(300, (el) => {
          $(el).closest('.accordion-item').removeClass('show');
          $(el).closest('.accordion-item').find('.accordion-button').attr('aria-expanded', false);
        });
      });

    // Set active accordion
    setTimeout(() => {
      const accordionItem = $(el).closest('.accordion-item');

      const hide = () => {
        $(accordionItem).removeClass('show');
        $(el).attr('aria-expanded', false);
        $(el).closest('.accordion-item').find('.accordion-collapse').slideUp();
      };

      const show = () => {
        $(accordionItem).addClass('show');
        $(el).attr('aria-expanded', true);
        $(el).closest('.accordion-item').find('.accordion-collapse').slideDown();
      };

      if (event === 'toggle') {
        !collapsed ? hide() : show();
      } else if (event === 'show') {
        show();
      } else {
        hide();
      }
    }, 300);
  }

  // Create instance
  function createInstance(el) {
    return {
      show() {
        toggle(el, 'show');
      },
      hide() {
        toggle(el, 'hide');
      },
      toggle() {
        toggle(el);
      },
    };
  }

  // Register instance
  (function init() {
    $('.accordion-button').each(function () {
      $(this).closest('.accordion-header')[0]['__accordion'] = createInstance(this);
    });

    if (window.tailwind === undefined) window.tailwind = {};
    window.tailwind.Accordion = {
      getInstance(el) {
        return el.__accordion;
      },
      getOrCreateInstance(el) {
        return el.__accordion === undefined ? createInstance(el) : el.__accordion;
      },
    };
  })();
})();
