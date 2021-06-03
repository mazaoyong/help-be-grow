/**
 * 隐藏底部 logo
 * ...
 * config: {
 *    // 支持布尔值
 *    hideCopyright: false
 * }
 * ...
 */
export default {
  mounted() {
    const { $options: { config: { hideCopyright = false } } } = this;
    if (!hideCopyright) return;

    const $copyright = document.querySelector('.copyright');
    if ($copyright) $copyright.style.display = 'none';
  },
};
