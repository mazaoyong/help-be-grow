import { get } from 'lodash';
import { GOODS_STATUS } from '@/constants/course/goods-status';
import { MEDIA_TYPE } from '@/constants/course/media-type';
import { SELLER_TYPE } from '@/constants/course/seller-type';
import { ASSIST_TXT_TYPE } from '@/constants/course/assist-txt-type';
import { ShowCollectInfoEnum } from '@/constants/course/collect-info-type';

export default function column(data) {
  const column = get(data, 'column', {});
  const content = get(data, 'content', {});
  const isOwnAsset = get(data, 'isOwnAsset', false);
  const showCollectInfo = get(data, 'showCollectInfo', ShowCollectInfoEnum.HIDE);
  const needOrder = get(data, 'needOrder', false);
  const textContentDTO = get(content, 'textContentDTO', {});
  const audioContentDTO = get(content, 'audioContentDTO', {});
  const videoContentDTO = get(content, 'videoContentDTO', {});
  const mediaType = +get(content, 'mediaType', MEDIA_TYPE.IMAGE_TEXT);
  const sellerType = +get(content, 'sellerType', SELLER_TYPE.SINGLE);
  const assistTxtType = +get(content, 'assistTxtType', ASSIST_TXT_TYPE.NONE);
  const price = get(content, 'price', 0);
  const columnPrice = get(column, 'price', 0);

  let intro = '';
  let previewIntro = '';
  let previewContent = '';
  let previewContentId = 0;
  let fullContent = '';
  let fullContentId = 0;
  let contentDeleted = false;
  let trafficExhausted = false;
  switch (mediaType) {
    case MEDIA_TYPE.IMAGE_TEXT: intro = textContentDTO.preview; break;
    case MEDIA_TYPE.AUDIO:
      intro = audioContentDTO.audioPreviewText;
      previewContent = audioContentDTO.preview;
      fullContent = audioContentDTO.content;
      break;
    case MEDIA_TYPE.VIDEO:
      intro = videoContentDTO.videoPreviewText;
      previewContent = videoContentDTO.videoPreviewUrl;
      previewContentId = videoContentDTO.videoPreviewId;
      fullContent = videoContentDTO.videoUrl;
      fullContentId = videoContentDTO.videoId;
      contentDeleted = Boolean(videoContentDTO.videoMaterialValidity);
      trafficExhausted = Boolean(videoContentDTO.videoPlayLimit);
      break;
  }

  previewIntro = intro;

  if (isOwnAsset || assistTxtType === ASSIST_TXT_TYPE.ENTIRE) {
    switch (mediaType) {
      case MEDIA_TYPE.IMAGE_TEXT: intro = textContentDTO.content; break;
      case MEDIA_TYPE.AUDIO: intro = audioContentDTO.audioText; break;
      case MEDIA_TYPE.VIDEO: intro = videoContentDTO.videoText; break;
    }
  }

  let status = get(content, 'status', GOODS_STATUS.DELETE);

  // 抹平内容和线下课状态差异
  if (status === 2) {
    status = GOODS_STATUS.UNSELL;
  }

  return {
    // 是否拥有资产
    isOwnAsset,

    /* 是否需要信息采集 */
    showCollectInfo,

    /* 针对0元课程，信息采集前是否需要领取（生成订单） */
    needOrder,

    /* 商品属性 */
    alias: get(content, 'alias', ''),

    goodsId: get(content, 'goodsId', 0),

    title: get(content, 'title', ''),

    summary: get(content, 'summary', ''),

    pictures: [
      {
        id: get(content, 'picId', 0),
        url: get(content, 'cover', ''),
        width: get(content, 'picWidth', 0),
        height: get(content, 'picHeight', 0),
      },
    ],

    origin: get(content, 'origin', ''),

    sku: {
      hasSku: false,

      minPrice: sellerType === SELLER_TYPE.COLUMN ? columnPrice : price,

      maxPrice: sellerType === SELLER_TYPE.COLUMN ? columnPrice : price,
    },

    status,

    publishAt: get(content, 'publishAt', 0),

    /* 知识付费属性 */
    // 信息采集设置
    collectInfoSetting: get(content, 'collectInfoSetting', {}),

    mediaType,

    // 售卖方式
    sellerType,

    // 学习次数
    pageView: get(content, 'pageView', 0),

    // 图文作者
    author: get(content, 'author', ''),

    // 加粉推广配置
    joinGroupSetting: get(content, 'joinGroupSetting', {}),

    // 内容详情
    intro,

    /** 试看图文（图文） | 图文简介（音视频）。需要信息采集时不显示完整图文或图文详情 */
    previewIntro,

    // 音视频辅助图文类型
    assistTxtType,

    // 音视频试看内容
    previewContent,
    previewContentId,

    // 音视频完整内容
    fullContent,
    fullContentId,

    // 资源是否删除
    contentDeleted,

    // 店铺流量是否耗尽
    trafficExhausted,

    // 内容防复制，0：禁止复制，1：允许复制
    copyPicture: get(content, 'copyPicture', 0),

    // 音视频防盗开关
    mediaUrlSwitch: get(data, 'mediaUrlSwitch', false),

    // 关联专栏
    column: {
      alias: get(column, 'alias', ''),
      title: get(column, 'title', ''),
      cover: get(column, 'picture.cover', ''),
      contentsCount: get(column, 'contentsCount', 0),
      sales: get(column, 'subscriptionsCount', 0),
      price: columnPrice,
    },

    // 下一篇
    nextOwlInfo: {},

    // 能否快进和设置倍速
    speedSwitch: Boolean(get(content, 'speedSwitch', true)),
  };
}
