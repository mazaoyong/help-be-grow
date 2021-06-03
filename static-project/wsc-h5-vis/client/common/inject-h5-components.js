import { initComponentList } from '@youzan/h5-cpns-injector';

/**
 * h5组件注入公共函数
 * 用法参考[injector、injector-plugin升级指南](https://doc.qima-inc.com/pages/viewpage.action?pageId=284439438)
 *
 * @param {Object} options - 请求参数
 * @param {Array<string>} options.components - 普通挂载模式组件
 * @param {Array<string>} options.pureComponents - 异步组件
 * @param {Object} options.extraData - 根据作者杨金凤的说法，暂时用不上
 * @param {Object} options.pageQuery - 仅用于普通挂载模式组件的参数
 *
 * @return {Array | undefined} - 只会返回pureComponents数组
 */
export default function inject(options = { components: [], pureComponents: [], extraData: {}, pageQuery: {} }) {
  return initComponentList({
    url: '/wscvis/common/get-components.json',
    components: options.components,
    pureComponents: options.pureComponents,
    extraData: options.extraData,
    pageQuery: options.pageQuery,
  });
}
