import React from 'react';
import classnames from 'classnames';
import map from 'lodash/map';
import mapKeysToSnakeCase from 'zan-utils/string/mapKeysToSnakeCase';
import CourseGoodsItem from '../../components/course-goods-item';
import renderItemStatus from '../common/utils/render-item-status';
import { SELLER_TYPE as SELLER_TYPE_MAP } from '../../common/constants';
import { isTextContent, isAudioContent, isVideoContent, isLiveContent } from '../../common/helper';
import { IColumnItem } from './model';

interface IListResponse {
  content?: any[];
  total?: number;
  pageable?: {
    pageNumber?: number;
    pageSize?: number;
  }
}

export const renderColumnImgItem = (item: IColumnItem, toSnake?: boolean, addContent?: boolean) => {
  const sellerType = item.seller_type || 0;
  const isVideo = isVideoContent(item);
  const isLive = isLiveContent(item);
  // 根据sellerTypes来判断商品是否是仅专栏售卖，如果是仅专栏售卖就不展示价格
  // 如果是专栏添加内容，则不在此组件显示
  const showPrice = sellerType !== SELLER_TYPE_MAP.COLUMN && !addContent;

  if (isLive) {
    return (
      <CourseGoodsItem
        item={item}
        hasPrice={showPrice}
      />
    );
  }

  const imgWrapCls = classnames({
    'img-box': true,
    'type-icon text': isTextContent(item),
    'type-icon audio': isAudioContent(item),
    'type-icon video': isVideo,
    'type-icon live': isLive,
  });

  const parsedItem = toSnake ? mapKeysToSnakeCase(item) : item;
  const statusObj = renderItemStatus(parsedItem);
  const videoStatus = statusObj.videoStatus;
  return (
    <CourseGoodsItem
      item={parsedItem}
      imgWrapCls={imgWrapCls}
      showTitleLink={!(videoStatus !== 4 && isVideo)}
      showPrice={showPrice}
    />
  );
};

export function parseContentsAndLives(res: IListResponse = {}) {
  const { content = [], total, pageable } = res;
  const list = mapKeysToSnakeCase(content.map(item => {
    const { videoContentDTO, columnContentDTO, ...baseItem } = item;
    return Object.assign(baseItem, columnContentDTO, videoContentDTO);
  }));
  return { list, total, pageable };
};

export function parseContentList(res: IListResponse = {}) {
  const { content = [], total, pageable } = res;
  const list = map(content, item => {
    const { videoContentDTO, alias, ...other } = item;
    return Object.assign(other, videoContentDTO, {
      alias,
      url: `https://h5.youzan.com/wscvis/knowledge/index?kdt_id=${_global.kdtId}&page=contentshow&alias=${alias}&qr=paidcontent_${alias}`,
    });
  });
  return {
    content: list,
    total,
    pageable,
  };
};
