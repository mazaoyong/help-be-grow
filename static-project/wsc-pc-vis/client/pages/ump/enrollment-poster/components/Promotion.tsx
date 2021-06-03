import React, { useCallback } from 'react';
import { Dialog, Input, CopyButton, Notify, Button } from 'zent';
import { clickTracker, EventTypeEnum } from 'components/logger';
import Divider from './Divider';
import { IPosterItemData } from '../types';
import { useStore } from '../store';
import buildUrl from '@youzan/utils/url/buildUrl';
import DownloadImage from './DownloadImage';
import { ENROLLMENT_POSTER_LIST } from '../contants';

function CopyButtonInInput(props) {
  const { url } = props;
  const handleCopySuccess = useCallback(() => {
    Notify.success('复制成功');
    clickTracker({
      eventName: '复制分享链接',
      eventSign: 'copy_sharing_url',
      pageType: ENROLLMENT_POSTER_LIST,
      otherParams: {
        eventType: EventTypeEnum.COPY,
      },
    });
  }, []);
  return (
    <CopyButton text={url} onCopySuccess={handleCopySuccess}>
      <Button type="primary" className="copy-button">
        复制
      </Button>
    </CopyButton>
  );
}

function Promotion() {
  const [data, dispatch] = useStore();
  const visible = data.promotionVisible;
  const itemData: IPosterItemData = data.itemData;

  let templatePicUrl = '';
  if (itemData) {
    templatePicUrl = itemData.templatePicUrl;
  }
  const h5Url = buildUrl(
    `${_global.url.h5}/wscvis/ump/enrollment-poster?id=${
      itemData ? itemData.id : 0
    }&resourceAlias=${itemData ? itemData.resourceAlias : ''}&kdtId=${_global.kdtId}`,
    '',
    _global.kdtId,
  );

  const handleDialogClose = useCallback(() => {
    dispatch({ promotionVisible: false });
  }, [dispatch]);
  return (
    <Dialog title="推广" className="promotion" visible={visible} onClose={handleDialogClose}>
      <div className="promotion-img">
        <img src={templatePicUrl} />
      </div>
      <div className="promotion-content">
        <div className="promotion-content-label">分享链接：</div>
        <div className="promotion-content-url">
          <Input
            className="copy-input"
            value={h5Url}
            disabled
            addonAfter={<CopyButtonInInput url={h5Url} />}
          />
        </div>
        <div className="promotion-content-action">
          <DownloadImage
            text={'下载海报'}
            url={templatePicUrl}
            onClick={() => {
              clickTracker({
                eventName: '下载海报',
                eventSign: 'download_poster',
                pageType: ENROLLMENT_POSTER_LIST,
                otherParams: {
                  eventType: EventTypeEnum.DOWNLOAD,
                },
              });
            }}
          />
          <Divider />
          <DownloadImage
            text={'下载二维码'}
            url={itemData ? itemData.qrcodeUrl : ''}
            onClick={() => {
              clickTracker({
                eventName: '下载二维码',
                eventSign: 'download_qrcode',
                pageType: ENROLLMENT_POSTER_LIST,
                otherParams: {
                  eventType: EventTypeEnum.DOWNLOAD,
                },
              });
            }}
          />
        </div>
      </div>
    </Dialog>
  );
}

export default Promotion;
