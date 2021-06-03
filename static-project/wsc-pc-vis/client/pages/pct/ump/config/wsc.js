// 微商城营销工具
import get from 'lodash/get';
import { arrayWrapper } from 'fns/chain';
import {
  isWscHqStore,
  isPureWscHqStore,
  isPureWscSingleStore,
  isPureWscChainStore,
  isUnifiedShop,
  isRetailMinimalistPartnerStore
} from '@youzan/utils-shop';

const { url, isSuperStore, isYZEdu, salesmanEntryType } = window._global;
const { www, store, v4 } = url;

export default [
  {
    name: '秒杀',
    desc: '快速抢购引导顾客更多消费',
    supportWeapp: true,
    icon: '/public_files/2019/09/24/05247dd9bf2006384e1be26d16e12caf.png',
    srcset: '/public_files/2019/09/24/05247dd9bf2006384e1be26d16e12caf.png',
    url: `${v4}/ump/seckill`,
    hide: !isPureWscSingleStore
  },
  {
    name: '赠品',
    desc: '设置赠品，回馈客户',
    supportWeapp: true,
    icon: '/public_files/2019/09/24/db1a12aeff1c7223d3357005c84c7999.png',
    srcset: '/public_files/2019/09/24/db1a12aeff1c7223d3357005c84c7999.png',
    url: `${v4}/ump/present`,
    hide: !isPureWscSingleStore
  },
  {
    name: '限时折扣',
    desc: '设置商品限时打折促销',
    supportWeapp: true,
    icon: '/public_files/2019/09/24/27273ca87407123a86b936f3dd95e0d7.png',
    srcset: '/public_files/2019/09/24/27273ca87407123a86b936f3dd95e0d7.png',
    url: `${www}/ump/limitdiscount`,
  },
  {
    name: '优惠套餐',
    desc: '创建商品套餐让客户购买',
    supportWeapp: true,
    icon: '/public_files/2019/09/24/ae000f9f1a6a5a7bc2e3711e957a77c6.png',
    srcset: '/public_files/2019/09/24/ae000f9f1a6a5a7bc2e3711e957a77c6.png',
    url: `${v4}/ump/package-buy`,
    hide: isPureWscChainStore || isUnifiedShop
  },
  {
    name: '优惠券',
    desc: '向客户发放店铺优惠券',
    supportWeapp: true,
    icon: '/public_files/2019/09/24/32ac70f7f3cb9f22870c189ec3f3bbc7.png',
    srcset: '/public_files/2019/09/24/32ac70f7f3cb9f22870c189ec3f3bbc7.png',
    url: isSuperStore ? `${store}/ump/coupon` : `${www}/ump/tradeincard`,
    escapeDisable: true,
  },
  {
    name: '优惠码',
    desc: '向客户发放店铺优惠码',
    supportWeapp: true,
    icon: '/public_files/2019/09/24/1421b7c9e9863df889a185afe11628b6.png',
    srcset: '/public_files/2019/09/24/1421b7c9e9863df889a185afe11628b6.png',
    url: `${www}/ump/promocode`,
    hide: isPureWscChainStore || isUnifiedShop
  },
  {
    name: '多人拼团',
    desc: '引导客户邀请朋友一起拼团购买',
    supportWeapp: true,
    icon: '/public_files/2019/09/24/934a1129fe05b4718cf69f4d4d6d793a.png',
    srcset: '/public_files/2019/09/24/934a1129fe05b4718cf69f4d4d6d793a.png',
    url: `${www}/ump/groupon`,
  },
  {
    name: '分销员',
    desc: '客户带客户，销量涨涨涨',
    supportWeapp: true,
    icon: '/public_files/2019/09/24/2baeae49b055657ec1bdcf1030b0fc0b.png',
    srcset: '/public_files/2019/09/24/2baeae49b055657ec1bdcf1030b0fc0b.png',
    url: `${v4}/ump/salesman`,
    hide: salesmanEntryType !== 2 || isRetailMinimalistPartnerStore,
    color: 'green'
  },
  {
    name: '销售员(分销员)',
    desc: '全渠道服务客户，销量涨不停',
    supportWeapp: true,
    icon: '/public_files/2019/09/24/2baeae49b055657ec1bdcf1030b0fc0b.png',
    srcset: '/public_files/2019/09/24/2baeae49b055657ec1bdcf1030b0fc0b.png',
    url: `${v4}/ump/new-salesman`,
    hide: salesmanEntryType !== 1 || isRetailMinimalistPartnerStore,
    color: 'green'
  },
  {
    name: '发券宝',
    desc: '优惠券定向群发神器',
    supportWeapp: true,
    icon: '/public_files/2019/09/24/e2fa389dd5bf712592edabf809fb39e7.png',
    srcset: '/public_files/2019/09/24/e2fa389dd5bf712592edabf809fb39e7.png',
    url: `${www}/ump/targetedmarketing`,
    hide: isRetailMinimalistPartnerStore,
    color: 'green'
  },
  {
    name: '优惠券礼包',
    desc: '用户一次获得多张优惠券',
    supportWeapp: true,
    icon: '/public_files/2019/09/26/da6fc78f1363b8b924aed0e3b31208b1.png',
    srcset: '/public_files/2019/09/26/da6fc78f1363b8b924aed0e3b31208b1.png',
    url: `${v4}/ump/coupon-package`,
    hide: isPureWscChainStore || isUnifiedShop
  },
  {
    name: '涨粉海报',
    url: `${v4}/industry/fans-poster`,
    icon: '/upload_files/2020/04/30/Fpp1_paZEKJxOFnjgWh2KYOY9rZr.png',
    srcset:'/upload_files/2020/04/30/Fpp1_paZEKJxOFnjgWh2KYOY9rZr.png',
    desc: '利用海报裂变帮助公众号吸粉',
    hide: isRetailMinimalistPartnerStore
  },
];
