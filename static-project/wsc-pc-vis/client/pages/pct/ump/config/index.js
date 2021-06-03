import pctConfig from './pct';
import wscConfig from './wsc';
import extConfig from './ext';
import { isRetailShop } from '@youzan/utils-shop';

export default [
  {
    order: 1,
    title: '知识付费营销工具',
    config: pctConfig,
  },
  {
    order: 2,
    title: `以下${isRetailShop ? '插件' : '微商城营销工具'}已支持知识付费`,
    config: wscConfig,
  },
  {
    order: 3,
    title: '知识付费拓展功能',
    config: extConfig,
  },
];
