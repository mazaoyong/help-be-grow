import get from 'lodash/get';
import isArray from 'lodash/isArray';
import { newLinkMenuItems } from 'fns/showcase/constants';
// import getTypeWithoutWeapp from 'shared/design-components/common/get-wechat-type';

// 基础组件
import configConf from '@decorate-components/page-config';
import TitleText from '@decorate-components/title-text';
import Richtext from '@decorate-components/richtext';

import GoodsWeapp from '@decorate-components/goods-weapp';
import ImageAd from '@decorate-components/image-ad';
import ImageTextNav from '@decorate-components/image-text-nav';
import Cube from '@decorate-components/cube';

import WhiteLine from '@decorate-components/white-line';
import CustomModule from '@decorate-components/custom-module';
import audio from '@decorate-components/audio';
import contactUs from '@decorate-components/contact-us';
import socialFans from '@decorate-components/social-fans';
import noteCard from '@decorate-components/note-card';
import orientedPoster from '@decorate-components/oriented-poster';
import storeConf from '@decorate-components/store';

import Notice from '@decorate-components/notice';
import Search from '@decorate-components/search';

import Video from '@decorate-components/video';
import PointMall from '@decorate-components/point-mall';
import Seckill from '@decorate-components/seckill';
import GoodsRecommend from '@decorate-components/goods-recommend';
import ShopInfo from '@decorate-components/shop-info';

// 营销组件
import Coupon from '@decorate-components/coupon';
import LimitDiscount from '@decorate-components/limit-discount';
import Groupon from '@decorate-components/groupon';
import PeriodBuy from '@decorate-components/period-buy';
import Bargain from '@decorate-components/bargain';

// 教育组件
import PaidContent from '@decorate-components/paid-content';
import PaidColumn from '@decorate-components/paid-column';
import PaidLive from '@decorate-components/paid-live';
import PaidMember from '@decorate-components/paid-member';
import Punch from '@decorate-components/punch';
import EduGroup from '@decorate-components/edu-group';
import Teacher from '@decorate-components/teacher';
import EduRegisForm from '@decorate-components/edu-regis-form';

function getTypeWithoutWeapp(designType) {
  if (isArray(designType) && designType.length > 0) {
    for (let i = 0; i < designType.length; i++) {
      const item = designType[i];
      if (!item.includes('weapp')) {
        return item;
      }
    }
  }

  return designType;
}

const uploadConfig = {
  fetchUrl: `${_global.url.materials}/shop/fetchPubImg.json`,
  tokenUrl: `${_global.url.materials}/shop/pubImgUploadToken.json`,
  maxSize: 3 * 1024 * 1024,
};

const uploadConfigWithIcon = {
  fetchUrl: `${_global.url.materials}/shop/fetchPubImg.json`,
  tokenUrl: `${_global.url.materials}/shop/pubImgUploadToken.json`,
  maxSize: 3 * 1024 * 1024,
  showIconTab: true,
};

const audioUploadConfig = {
  fetchUrl: `${_global.url.materials}/shop/fetchPubImg.json`,
  tokenUrl: `${_global.url.materials}/shop/pubAudioUploadToken.json`,
};

// 获取 menuList 下拉框
function getLinkMenuList() {
  return newLinkMenuItems;
}

// 店铺笔记卡片组件
const isShopNoteKdt = () => {
  const isInWhiteList = get(_global, 'in_shop_note_ins_white_list', false);
  return isInWhiteList;
};

// 微页面积分商城开关
const isShowcasePointsMall = () => {
  return get(_global, 'design_pointsstore_status', true);
};

// 知识付费组件
const disablePaidCreateFunc = () => {
  return window._global.paidcontent_auth || window._global.is_design_template === 1;
};

export const DecorateEditors = [
  Object.assign({}, configConf, {
    previewProps: {
      appType: 'weapp',
    },
    editorProps: {
      showCategory: false,
    },
  }),

  // 标题文本
  Object.assign({}, TitleText, {
    editorProps: {
      linkMenuItems: getLinkMenuList(),
    },
  }),

  // 商品列表(合并版本)
  Object.assign({}, GoodsWeapp, {
    editorProps: {
      uploadConfig: uploadConfigWithIcon,
    },
  }),

  // 新图片广告
  Object.assign({}, ImageAd, {
    editorProps: {
      uploadConfig: uploadConfigWithIcon,
      linkMenuItems: getLinkMenuList(),
    },
  }),

  // 图文导航
  Object.assign({}, ImageTextNav, {
    editorProps: {
      uploadConfig: uploadConfigWithIcon,
      linkMenuItems: getLinkMenuList(),
    },
  }),

  // 富文本
  Object.assign({}, Richtext, {
    editorProps: {
      richTextConfig: {
        uploadConfig: uploadConfigWithIcon,
      },
    },
  }),

  // 魔方
  Object.assign({}, Cube, {
    editorProps: {
      uploadConfig: uploadConfigWithIcon,
      linkMenuItems: getLinkMenuList(),
    },
  }),

  // 辅助空白+辅助线
  Object.assign({}, WhiteLine, {}),

  // 语音
  Object.assign({}, audio, {
    editorProps: {
      uploadConfig,
      audioUploadConfig,
    },
  }),

  // 在线客服
  Object.assign({}, contactUs, {
    defaultType: getTypeWithoutWeapp,
    canInsert: false,
    dragable: false,
  }),

  // 社群涨粉
  Object.assign({}, socialFans, {
    defaultType: getTypeWithoutWeapp,
  }),

  // 店铺笔记
  Object.assign({}, noteCard, {
    defaultType: getTypeWithoutWeapp,
    limit: 5,
    appendable: isShopNoteKdt(),
  }),

  // 定向海报
  Object.assign({}, orientedPoster, {
    defaultType: getTypeWithoutWeapp,
  }),

  // 进入店铺
  Object.assign({}, storeConf, {
    defaultType: getTypeWithoutWeapp,
  }),

  // 自定义模块
  Object.assign({}, CustomModule, {}),

  // 公告
  Object.assign({}, Notice, {}),

  // 搜索组件
  Object.assign({}, Search, {
    defaultType: getTypeWithoutWeapp,
  }),

  // 营销组件
  // 优惠券
  Object.assign({}, Coupon, {}),

  // 拼团
  Object.assign({}, Groupon, {
    editorProps: {
      uploadConfig,
    },
  }),

  // 限时折扣
  Object.assign({}, LimitDiscount, {}),

  // 周期购
  Object.assign({}, PeriodBuy, {
    defaultType: getTypeWithoutWeapp,
  }),

  // 助力砍价
  Object.assign({}, Bargain, {
    defaultType: getTypeWithoutWeapp,
  }),

  // 视频
  Object.assign({}, Video, {
    editorProps: {
      uploadConfig,
    },
    defaultType: getTypeWithoutWeapp,
  }),

  // 秒杀
  Object.assign({}, Seckill, {
    defaultType: getTypeWithoutWeapp,
  }),

  // 个性化推荐
  Object.assign({}, GoodsRecommend, {
    defaultType: getTypeWithoutWeapp,
  }),

  // 积分商城
  Object.assign({}, PointMall, {
    defaultType: getTypeWithoutWeapp,
    appendable: isShowcasePointsMall(),
  }),

  Object.assign({}, ShopInfo),

  // 课程分组
  Object.assign({}, EduGroup, {
    defaultType: getTypeWithoutWeapp,
    appendable: disablePaidCreateFunc,
  }),

  // 知识内容
  Object.assign({}, PaidContent, {
    defaultType: getTypeWithoutWeapp,
    appendable: disablePaidCreateFunc,
  }),

  // 知识专栏
  Object.assign({}, PaidColumn, {
    defaultType: getTypeWithoutWeapp,
    appendable: disablePaidCreateFunc,
  }),

  // 知识直播
  Object.assign({}, PaidLive, {
    defaultType: getTypeWithoutWeapp,
    appendable: disablePaidCreateFunc,
  }),

  // 知识会员权益
  Object.assign({}, PaidMember, {
    defaultType: getTypeWithoutWeapp,
    appendable: disablePaidCreateFunc,
  }),

  // 群打卡
  Object.assign({}, Punch, {
    defaultType: getTypeWithoutWeapp,
    appendable: disablePaidCreateFunc,
  }),

  // 老师
  Object.assign({}, Teacher, {
    defaultType: getTypeWithoutWeapp,
  }),

  // 报名表单
  Object.assign({}, EduRegisForm, {
    defaultType: getTypeWithoutWeapp,
  }),
];
