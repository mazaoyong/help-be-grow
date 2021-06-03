import React from 'react';
import { Tag } from 'zent';
import { Img } from '@youzan/ebiz-components';
import './style.scss';
import QuickUpdateInfo from '../../quickupdate-info';
import { isInStoreCondition } from 'fns/chain';
import { LIVE_TYPE } from '../../../common/constants';
const { ImgLockWrap } = Img;
// 这个组件在直播列表中使用时item是下划线格式，在专栏添加内容弹窗中使用时item是驼峰。。。。
export default function LiveItem(props) {
  const {
    item,
    row = 0,
    quickUpdateCallback = () => {},
    canEdit = false,
    showContent = true,
    showPrice = true,
    showThumb = true,
    style = {},
  } = props;
  const isLock = item.is_lock;
  let url = item.live_detail_url || item.url;
  if (url && typeof url === 'string') url = url.replace('&sg=live', '');
  let type = '';
  if (item.live_type === LIVE_TYPE.IMAGE_TEXT) {
    type = '图文语音直播';
  }
  if (item.live_type === LIVE_TYPE.POLYV) {
    type = '第三方直播';
  }
  if (item.live_type === LIVE_TYPE.VIDEO) {
    type = '视频直播';
  }

  return (
    <div className="live-list__item clearfix" style={style}>
      {showThumb && (
        <div className="live-list__item__cover">
          <ImgLockWrap
            isLock={isLock}
            width="80px"
            height="45px"
            src={item.cover}
            fullfill="!100x100.jpg"
          />
        </div>
      )}
      <div className="live-list__item__content">
        {showContent && (
          <>
            <div className="live-list__item__title">
              <a rel="noopener noreferrer" className="ellipsis-2" style={{ marginRight: '5px' }} target="_blank" href={url}>
                {item.title}
              </a>
              {isInStoreCondition({
                supportHqStore: true,
                supportSingleStore: true,
                supportRetailSingleShop: true,
                supportRetailUnitedHqShop: true,
              }) && canEdit && !item.has_product_lock && (
                <QuickUpdateInfo
                  rowData={item}
                  row={row}
                  quickUpdateCallback={quickUpdateCallback('title')}
                  type='title'
                />
              )}
            </div>
            <div>
              {type && <Tag className="live-list__item__type" outline theme="">{type}</Tag>}
              {item.is_free ? (
                <Tag outline color="#4b0">
                  试看
                </Tag>
              ) : null}
            </div>
          </>
        )}
        {showPrice && (
          <div className="live-list__item__time ellipsis">
            {item.seller_type === 1 || item.seller_type === 3 ? (
              <>
                <span className="live-list__item__price">¥{(item.price / 100).toFixed(2)}</span>
                {isInStoreCondition({
                  supportHqStore: true,
                  supportSingleStore: true,
                  supportRetailSingleShop: true,
                  supportRetailUnitedHqShop: true,
                }) && !item.has_product_lock && canEdit ? (
                    <QuickUpdateInfo
                      rowData={item}
                      row={row}
                      inputType='number'
                      width={80}
                      quickUpdateCallback={quickUpdateCallback('price')}
                      type='price'
                    />
                  ) : <div style={{ width: '12px', height: '14px', marginLeft: '5px', display: 'inline-block' }} />}
              </>
            ) : (
              <span className="live-list__item__price" style={{ marginRight: '22px' }}>-</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
