import { ITypeFilterOption } from '@youzan/react-components/typings/components/goods-selector-v2';
import { isEduShop } from '@youzan/utils-shop';

export const BASE_URL = (window as any)._global.url.v4;

export const COURSE_MANAGE_URL = `${BASE_URL}/vis/edu/course#/course-manage/list`;
export const DEFAULT_GOODS_MANAGE_URL = `${BASE_URL}/goods/manage/list`;

export const GOODS_MANAGE_URL = isEduShop ? COURSE_MANAGE_URL : DEFAULT_GOODS_MANAGE_URL;

export const MAX_INVENTORY = 10000000;

export const ALL_TYPE: ITypeFilterOption = { text: '全部商品', value: 'ALL' };
export const NORMAL_TYPE: ITypeFilterOption = { text: '实物商品', value: 'NORMAL' };
export const VIRTUAL_TYPE: ITypeFilterOption = { text: '虚拟商品', value: 'VIRTUAL' };
export const ECARD_TYPE: ITypeFilterOption = { text: '电子卡券', value: 'ECARD' };
export const MEMBER_CARD_TYPE: ITypeFilterOption = { text: '付费会员卡', value: 'MEMBER_CARD' };
export const HOTEL_TYPE: ITypeFilterOption = { text: '酒店商品', value: 'HOTEL' };
export const PERIOD_BUY_TYPE: ITypeFilterOption = { text: '周期购商品', value: 'PERIOD_BUY' };
export const FEN_XIAO_TYPE: ITypeFilterOption = { text: '分销商品', value: 'FEN_XIAO' };
export const HAI_TAO_TYPE: ITypeFilterOption = { text: '海淘商品', value: 'HAI_TAO' };
export const BAKE_TYPE: ITypeFilterOption = { text: '蛋糕烘焙', value: 'BAKE' };
export const TIMED_PRODUCT_LAUNCH_TYPE: ITypeFilterOption = {
  text: '定时开售商品',
  value: 'TIMED_PRODUCT_LAUNCH',
};
export const KNOWLEDGE_TYPE: ITypeFilterOption = {
  text: '课程商品',
  value: 'KNOWLEDGE',
  relatedGroupOptions: [
    { text: '全部', value: 'ALL' },
    { text: '线下课', value: 'OFFLINE_COURSE' },
    { text: '专栏', value: 'COLUMN' },
    { text: '内容', value: 'CONTENT' },
    { text: '图文', value: 'contentText' },
    { text: '音频', value: 'contentAudio' },
    { text: '视频', value: 'contentVideo' },
    { text: '直播', value: 'LIVE' },
  ],
};
