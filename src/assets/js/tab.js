import $ from 'jquery';

(() => {
  'use strict';
  window.$ = $;
  window.jQuery = $;

  function activateDefaultTabs() {
    $("[role='tablist']").each(function () {
      const $tablist = $(this);
      if ($tablist.find("[role='tab'].active").length === 0) {
        const $firstTab = $tablist.find("[role='tab']").first();
        $firstTab.addClass('active').attr('aria-selected', true);

        $tablist
          .closest('.tabs')
          .find('.tab-content')
          .first()
          .find('.tab-pane')
          .first()
          .addClass('active');
      }
    });
  }

  function ensureTarget($tab) {
    let target = $tab.attr('data-tw-target');
    if (target !== undefined) return target;

    $tab
      .closest("[role='tablist']")
      .find("[role='tab']")
      .each(function (index, el) {
        if (el === $tab[0] && target === undefined) {
          target = `#tab-id-${index}-${Math.floor(Math.random() * 10000)}`;
          const $pane = $tab.closest('.tabs').find('.tab-pane').eq(index);

          $tab.attr('data-tw-target', target);
          if ($pane.length) $pane.attr('id', target.slice(1));
        }
      });

    return target;
  }

  function showTab(tab) {
    const $tab = $(tab);
    const $tablist = $tab.closest("[role='tablist']");
    const $tabs = $tablist.find("[role='tab']");

    $tabs.each(function () {
      if ($(this).hasClass('active') && this !== $tab[0]) {
        this.dispatchEvent(new Event('hide.tw.tab'));
      }
      if (!$(this).hasClass('active') && this === $tab[0]) {
        this.dispatchEvent(new Event('show.tw.tab'));
      }
    });

    $tabs.removeClass('active').attr('aria-selected', false);
    $tab.addClass('active').attr('aria-selected', true);

    const target = ensureTarget($tab);
    if (!target) return;

    const $pane = $(target);
    if (!$pane.length) return;

    const $tabContent = $pane.closest('.tab-content');
    const width = $tabContent.width();

    $tabContent.children('.tab-pane').removeAttr('style').removeClass('active');
    $pane.css('width', `${width}px`).addClass('active');
  }

  function resizeActivePanels() {
    $("[role='tabpanel'].active").each(function () {
      const width = $(this).closest('.tab-content').width();
      $(this).css('width', `${width}px`);
    });
  }

  function createInstance(tab) {
    return {
      show() {
        showTab(tab);
      },
    };
  }

  function initInstances() {
    $("[role='tab']").each(function () {
      this.__tab = createInstance(this);
    });

    window.tailwind = window.tailwind || {};
    window.tailwind.Tab = {
      getInstance(el) {
        return el.__tab;
      },
      getOrCreateInstance(el) {
        if (el.__tab === undefined) el.__tab = createInstance(el);
        return el.__tab;
      },
    };
  }

  $('body').on('click', "[role='tab']", function () {
    showTab(this);
  });

  $(window).on('resize', resizeActivePanels);

  activateDefaultTabs();
  initInstances();
})();
