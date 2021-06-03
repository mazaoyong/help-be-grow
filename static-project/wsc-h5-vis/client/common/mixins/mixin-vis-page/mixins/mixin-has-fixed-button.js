import isString from 'lodash/isString';
import isBoolean from 'lodash/isBoolean';

/**
 * 判断需不需要自动设置底边距
 * ...
 * config: {
 *    // 支持布尔值或者字符串
 *    // 字符串支持 '!this.xxx' 的形式，会自动跟踪变量值
 *    hasFixedButton: false
 * }
 * ...
 */
let autoSetPadding = false;
function setPadding() {
  document.querySelector('body').style.paddingBottom = '50px';
}

function removePadding() {
  document.querySelector('body').style.paddingBottom = 0;
}
export default {
  created() {
    autoSetPadding = false;
    const { $options: { config: { hasFixedButton = false } } } = this;

    if (hasFixedButton && isBoolean(hasFixedButton)) autoSetPadding = true;
    if (hasFixedButton && isString(hasFixedButton) && hasFixedButton.indexOf('this.') >= 0) {
      let expression = hasFixedButton;
      let passValue = true;

      if (hasFixedButton[0] === '!') {
        passValue = false;
        expression = hasFixedButton.slice(1);
      }
      expression = expression.replace('this.', '');

      this.$watch(expression, {
        immediate: true,
        handler(newValue) {
          if (newValue === passValue) {
            setPadding();
          } else {
            removePadding();
          }
        },
      });
    }
  },

  mounted() {
    if (autoSetPadding) setPadding();
  },

  destroyed() {
    if (autoSetPadding) removePadding();
  },
};
