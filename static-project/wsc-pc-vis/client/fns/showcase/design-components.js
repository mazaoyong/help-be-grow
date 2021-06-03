import { Design } from 'zent';
import assign from 'lodash/assign';
import getTypeWithoutWeapp from 'shared/design-components/common/get-wechat-type';
import { newLinkMenuItems } from 'fns/showcase/constants';
import ContactUsDesignPreviewItem from 'fns/showcase/ContactUsDesignPreviewItem';

// 基础组件
import configConf from 'shared/design-components/config';
import richtextConf from 'shared/design-components/richtext';
import goodsWeappConf from 'shared/design-components/goods-weapp';
import tagListConf from 'shared/design-components/new-tag-list';
import imageAdConf from 'shared/design-components/image-ad';
import cubeConf from 'shared/design-components/cube';
import oldCubeConf from 'shared/design-components/old-cube';
import textConf from 'shared/design-components/text';
import linkConf from 'shared/design-components/link';
import titleConf from 'shared/design-components/title';
import imageTextNavConf from 'shared/design-components/image-text-nav';

// 营销组件
import couponConf from 'shared/design-components/coupon';
import grouponConf from 'shared/design-components/groupon';
import periodBuyConf from 'shared/design-components/period-buy';
import limitDiscountConf from 'shared/design-components/limit-discount';
import seckillConf from 'shared/design-components/seckill';
import unicashierConf from 'shared/design-components/unicashier';
import paidColumnConf from 'shared/design-components/paid-column';
import paidContentConf from 'shared/design-components/paid-content';
import paidMemberConf from 'shared/design-components/paid-member';
import paidLiveConf from 'shared/design-components/paid-live';

// 其他
import shopBannerConf from 'shared/design-components/shop-banner';
import storeConf from 'shared/design-components/store';
import searchConf from 'shared/design-components/search';
import noticeConf from 'shared/design-components/notice';
import audioConf from 'shared/design-components/audio';
import videoConf from 'shared/design-components/video';
import offlineShopInfoConf from 'shared/design-components/offline-shop-info';
import contactUsConf from 'shared/design-components/contact-us';
import lineConf from 'shared/design-components/line';
import whitespaceConf from 'shared/design-components/whitespace';
import customerModuleConf from 'shared/design-components/custom-module';
import usercenterConf from 'shared/design-components/usercenter';

// 样式
import 'shared/design-components/assets/common/index.scss';

const disablePaidCreateFunc = () => {
  return window._global.paidcontent_auth || window._global.is_design_template === 1;
};

const uploadConfig = {
  fetchUrl: `${_global.url.materials}/shop/fetchPubImg.json`,
  tokenUrl: `${_global.url.materials}/shop/pubImgUploadToken.json`,
  maxSize: 3 * 1024 * 1024,
};

const audioUploadConfig = {
  fetchUrl: `${_global.url.materials}/shop/fetchPubImg.json`,
  tokenUrl: `${_global.url.materials}/shop/pubAudioUploadToken.json`,
};

// 获取 menuList 下拉框
function getLinkMenuList() {
  return newLinkMenuItems;
}

// config component
const configComponent = assign({}, configConf, {
  // 是否可以拖拽
  dragable: false,

  // 是否出现在底部的添加组件区域
  appendable: false,

  // 是否可以编辑，UMP里面有些地方config是不能编辑的
  editable: true,

  configurable: false,

  highlightWhenSelect: false,

  previewProps: {
    appType: 'wechat',
  },
});

const paidDisableText = '需开通知识付费营销插件';

// 模板后台独立一份组件列表，供产品编辑/新建模板
export const DesignComponents = [
  configComponent,

  Design.group('基础组件'),

  // 富文本
  assign({}, richtextConf, {
    editorProps: {
      richTextConfig: {
        uploadConfig,
      },
    },
    defaultType: getTypeWithoutWeapp,
  }),

  // 商品列表(合并版本)
  assign({}, goodsWeappConf, {
    editorProps: {
      uploadConfig,
    },
    defaultType: getTypeWithoutWeapp,
  }),

  // 新商品分组
  assign({}, tagListConf, {
    defaultType: getTypeWithoutWeapp,
  }),

  // 新图片广告
  assign({}, imageAdConf, {
    editorProps: {
      uploadConfig,
      linkMenuItems: getLinkMenuList(),
    },
    defaultType: getTypeWithoutWeapp,
  }),

  // 魔方
  assign({}, cubeConf, {
    editorProps: {
      uploadConfig,
      linkMenuItems: getLinkMenuList(),
    },
    defaultType: getTypeWithoutWeapp,
  }),

  // 新版图文导航
  assign({}, imageTextNavConf, {
    editorProps: {
      uploadConfig,
      linkMenuItems: getLinkMenuList(),
    },
    defaultType: getTypeWithoutWeapp,
  }),

  // 老编辑器的魔方(只做展示)
  assign({}, oldCubeConf, {
    appendable: false,
    editable: false,
    defaultType: getTypeWithoutWeapp,
  }),

  // 文本
  assign({}, textConf, {
    editorProps: {
      linkMenuItems: getLinkMenuList(),
    },
    defaultType: getTypeWithoutWeapp,
  }),

  // 关联链接
  assign({}, linkConf, {
    defaultType: getTypeWithoutWeapp,
  }),

  // 标题
  assign({}, titleConf, {
    editorProps: {
      linkMenuItems: getLinkMenuList(),
    },
    defaultType: getTypeWithoutWeapp,
  }),

  Design.group('营销组件'),

  // 优惠券
  assign({}, couponConf, {
    defaultType: getTypeWithoutWeapp,
  }),

  // 拼团
  assign({}, grouponConf, {
    editorProps: {
      uploadConfig,
    },
    defaultType: getTypeWithoutWeapp,
  }),

  // 周期购
  assign({}, periodBuyConf, {
    defaultType: getTypeWithoutWeapp,
  }),

  // 买单
  assign({}, unicashierConf, {
    defaultType: getTypeWithoutWeapp,
  }),

  // 限时折扣
  assign({}, limitDiscountConf, {
    defaultType: getTypeWithoutWeapp,
  }),

  // 秒杀
  assign({}, seckillConf, {
    defaultType: getTypeWithoutWeapp,
  }),

  // 知识专栏
  assign({}, paidColumnConf, {
    defaultType: getTypeWithoutWeapp,
    limit: disablePaidCreateFunc,
    limitMessage: paidDisableText,
  }),

  // 知识内容
  assign({}, paidContentConf, {
    defaultType: getTypeWithoutWeapp,
    limit: disablePaidCreateFunc,
    limitMessage: paidDisableText,
  }),

  // 知识会员权益
  assign({}, paidMemberConf, {
    defaultType: getTypeWithoutWeapp,
    limit: disablePaidCreateFunc,
    limitMessage: paidDisableText,
  }),

  // 知识直播
  assign({}, paidLiveConf, {
    defaultType: getTypeWithoutWeapp,
    limit: disablePaidCreateFunc,
    limitMessage: paidDisableText,
  }),

  Design.group('其他'),

  // 店铺信息
  assign({}, shopBannerConf, {
    editorProps: {
      uploadConfig,
    },
    limit: 1,
    defaultType: getTypeWithoutWeapp,
  }),

  // 进入店铺
  assign({}, storeConf, {
    defaultType: getTypeWithoutWeapp,
  }),

  // 搜索
  assign({}, searchConf, {
    defaultType: getTypeWithoutWeapp,
  }),

  // 公告
  assign({}, noticeConf, {
    defaultType: getTypeWithoutWeapp,
  }),

  // 语音
  assign({}, audioConf, {
    editorProps: {
      uploadConfig,
      audioUploadConfig,
    },
    defaultType: getTypeWithoutWeapp,
  }),

  // 视频组件
  assign({}, videoConf, {
    editorProps: {
      uploadConfig,
    },
    limit: 5,
    defaultType: getTypeWithoutWeapp,
  }),

  // 线下门店
  assign({}, offlineShopInfoConf, {
    defaultType: getTypeWithoutWeapp,
  }),

  // 在线客服
  assign({}, contactUsConf, {
    defaultType: getTypeWithoutWeapp,
    canInsert: false,
    dragable: false,
    limit: 1,
    previewItem: ContactUsDesignPreviewItem, // 要重写preview的样式
  }),

  // 辅助线
  assign({}, lineConf, {
    defaultType: getTypeWithoutWeapp,
  }),

  // 辅助空白
  assign({}, whitespaceConf, {
    defaultType: getTypeWithoutWeapp,
  }),

  // 自定义模块
  customerModuleConf,

  // 个人中心
  assign({}, usercenterConf, {
    editorProps: {
      uploadConfig,
    },
    dragable: false,
    appendable: false,
    configurable: false,
  }),
];
