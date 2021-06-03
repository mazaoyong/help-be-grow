/* eslint-disable camelcase */
import React, { FC, useCallback } from 'react';
import { Tag } from 'zent';
import classnames from 'classnames';
import { Img, ListPopupEditor } from '@youzan/ebiz-components';
import { ListPopupEditorType } from '@youzan/ebiz-components/es/list-popup-editor';
import { priceValidator, titleValidator } from './fns';
import { chainSupportModify } from '../../common/chain';
import { getTrialText } from '../../common/helper';
import { LIVE_TYPE } from '../../common/constants';
import './style.scss';

const { ImgLockWrap } = Img;

interface IGoodsItem {
  alias: string;
  is_lock: boolean;
  live_detail_url?: string;
  url?: string;
  redirect_url?: string;
  cover: string;
  title: string;
  has_product_lock: boolean;
  is_free?: number;
  price: number;
  live_type?: number;
  media_type?: number;
}

interface IProps {
  item: IGoodsItem,
  canEdit?: boolean;
  // 用于弱管控的情况，优先级高于canEdit
  canSelfEdit?: boolean;
  showContent?: boolean;
  showPrice?: boolean;
  hasPrice?: boolean;
  priceItem?: React.ReactElement | null;
  showThumb?: boolean;
  showTitleLink?: boolean;
  imgWrapCls?: string;
  style?: React.CSSProperties;
  quickUpdateCallback?: (param: string)=> ((...args: any) => void);
}

// 这个组件在直播列表中使用时item是下划线格式，在专栏添加内容弹窗中使用时item是驼峰。。。。
const CourseGoodsItem: FC<IProps> = (props: IProps) => {
  const {
    item,
    quickUpdateCallback = () => { return () => {}; },
    canEdit = false,
    canSelfEdit,
    showContent = true,
    showPrice = true,
    hasPrice = true,
    showThumb = true,
    showTitleLink = true,
    style = {},
    priceItem,
    imgWrapCls = '',
  } = props;
  // canSelfEdit 作为弱管控的标志。只有创建商品的店铺才有编辑的能力
  // 所以把优先级调到最高
  const supportModify =
    (canSelfEdit !== undefined
      ? canSelfEdit
      : (chainSupportModify && canEdit)) && !item.has_product_lock;
  const prefix = 'course-list__item';
  const imgCls = classnames(`${prefix}__cover`, {
    [imgWrapCls]: imgWrapCls,
  });

  const renderThumb = () => {
    return (
      <div className={imgCls}>
        <ImgLockWrap
          isLock={item.is_lock}
          width="80px"
          height="45px"
          src={item.cover}
          fullfill="!100x100.jpg"
        />
      </div>
    );
  };

  const handleSubmit = useCallback(key => value => {
    quickUpdateCallback(key)(value, item.alias);
  }, [item.alias, quickUpdateCallback]);

  const renderContent = () => {
    let url = item.live_detail_url || item.url || item.redirect_url;
    const mediaType = item.media_type;
    const trialText = mediaType ? getTrialText(mediaType) : '试看';
    let type = '';

    if (typeof url === 'string') {
      url = url.replace('&sg=live', '');
    }
    if (item.live_type === LIVE_TYPE.IMAGE_TEXT) {
      type = '图文语音直播';
    } else if (item.live_type === LIVE_TYPE.POLYV) {
      type = '第三方直播';
    } else if (item.live_type === LIVE_TYPE.VIDEO) {
      type = '视频直播';
    }

    const priceNode = showTitleLink ? (
      <a
        rel="noopener noreferrer"
        className="ellipsis-2"
        style={{ marginRight: '5px' }}
        target="_blank"
        href={url}
      >
        {item.title}
      </a>
    ) : <p className="gray ellipsis-2">{item.title}</p>;

    return (
      <>
        <div className={`${prefix}__title`}>
          {
            supportModify ? (
              <ListPopupEditor
                width="400px"
                type={ListPopupEditorType.STR}
                initialValue={item.title}
                validate={titleValidator}
                onSubmit={handleSubmit('title')}
              >
                {priceNode}
              </ListPopupEditor>
            ) : priceNode
          }
        </div>
        <div>
          {type && <Tag className={`${prefix}__type`} outline>{type}</Tag>}
          {item.is_free ? <Tag outline theme="green">{trialText}</Tag> : null}
        </div>
      </>
    );
  };

  const renderPrice = () => {
    const { price } = item;
    const priceNode = priceItem || <span className={`${prefix}__price ellipsis`}>¥{(price / 100).toFixed(2)}</span>;
    return (
      <div className={`${prefix}__item`}>
        {hasPrice ? (
          <>
            { supportModify ? (
              <ListPopupEditor
                type={ListPopupEditorType.NUM}
                initialValue={price / 100}
                validate={priceValidator}
                onSubmit={handleSubmit('price')}
              >
                {priceNode}
              </ListPopupEditor>
            ) : (
              <>
                {priceNode}
                <div style={{
                  width: '12px',
                  height: '14px',
                  marginLeft: '5px',
                  display: 'inline-block',
                }} />
              </>
            )}
          </>
        ) : (
          <span className={`${prefix}__price gray`} style={{ marginRight: '22px' }}>-</span>
        )}
      </div>
    );
  };

  return (
    <div className={`${prefix} clearfix`} style={style}>
      {showThumb && renderThumb()}
      <div className={`${prefix}__content`}>
        {showContent && renderContent()}
        {showPrice && renderPrice()}
      </div>
    </div>
  );
};

export default CourseGoodsItem;
