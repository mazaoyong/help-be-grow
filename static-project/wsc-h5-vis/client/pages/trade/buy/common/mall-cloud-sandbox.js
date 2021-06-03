/**
 * 初始化外部自定义组件
 * 支持电商云能力，让外部开发者可以定制页面组件
 */
import { get } from '@/shared/common/helper';
import { createSandbox } from '@youzan/cloud-guard';

function getComponents(design) {
  let components = [];

  design.forEach((item) => {
    if (item.type && item.type.indexOf('cloud_') !== -1) {
      components.push(item.type);
    }

    if (item.children && item.children.length) {
      components = components.concat(getComponents(item.children));
    }
  });

  return components;
}

export function initMallCloudSandbox() {
  const { design } = window._global;

  if (!design || !design.length) {
    return;
  }

  const cloudScript = get(design[0], 'script.url');
  const components = getComponents(design);

  if (!components.length) {
    return;
  }

  createSandbox({
    scriptUrl: cloudScript,
    components,
  });
}
