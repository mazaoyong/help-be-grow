import isString from 'lodash/isString';

/**
 * 自动设置标题
 * ...
 * config: {
 *    // 支持字符串类型
 *    // 字符串支持 '!this.xxx' 的形式，会自动跟踪变量值
 *    title: ''
 * }
 * ...
 */
export default {
  created() {
    const { $options: { config: { title } } } = this;
    if (!title) return;

    if (title && isString(title)) {
      if (title.indexOf('this.') >= 0) {
        let expression = '';
        expression = title.replace('this.', '');

        this.$watch(expression, {
          immediate: true,
          handler(newValue) {
            document.title = newValue;
          },
        });
      } else {
        document.title = title;
      }
    }
  },
};
