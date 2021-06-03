import { get } from 'lodash';
import args from '@youzan/utils/url/args';
import ABTestClient from '@youzan/client-abtest';
import { YouZanLogger, ABTestConfig } from '@youzan/client-abtest/dist/types/index';

const log = (params: ILogParams) => {
  window.Logger && window.Logger.log(params);
};

const { href } = window.location;
const createShopLogParams = {
  mobile: get(window, '_global.userInfo.mobile', ''),
  device: 'pc',
  app: '有赞官网',
  createway: href,
  from_source: args.get('from_source', href),
};

export const createShopLog = () => {
  log({
    et: 'click',
    ei: 'create_shop',
    en: '创建店铺',
    pt: '',
    params: createShopLogParams
  });
};

export const createShopSuccessLog = (kdtId: number | string = '') => {
  log({
    et: 'custom',
    ei: 'create_shop_success',
    en: '创建店铺成功',
    pt: '',
    params: {
      ...createShopLogParams,
      kdt_id: kdtId
    }
  });
};

export const initAbTestClient = () => {
  try {
    // 更新配置
    ABTestClient.setOptions({
      // 埋点日志实例
      Logger: window.Logger as YouZanLogger,
      // apollo 配置, 由 Node sdk 提供，具体如何获取，请查看 [Node sdk 文档]
      configs: (_global.abTestConfig || []) as [ABTestConfig],
      // 是否自动上报日志, 默认 true, 可省
      report: true,
    });
  } catch (error) {
    console.error(error);
  }
};
