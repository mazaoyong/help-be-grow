export function initResizeListener() {
  document.addEventListener(
    'click',
    function(e) {
      if (window.innerWidth < 1200) {
        return;
      }
      const dom: any = e.target;
      if (
        dom.id === 'app-help-button' ||
        (typeof dom.className === 'string' && dom.className.indexOf('app-help-icon-close') > -1)
      ) {
        const evt = new Event('custom-resize');
        window.dispatchEvent(evt);
      }
    },
    true,
  );
}
