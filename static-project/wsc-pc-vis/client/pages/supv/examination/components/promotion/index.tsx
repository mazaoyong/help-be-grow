import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, Input, CopyButton, Notify, Button, VerticalTabs } from 'zent';
import buildUrl from '@youzan/utils/url/buildUrl';
import { DownloadImage } from '@youzan/ebiz-components';
import { getQrcode } from '../../api';
import fetchWeappQrcode from 'fns/qrcode/fetch-weapp-code';
import styles from './index.m.scss';
const { TabPanel } = VerticalTabs;

interface IPromotionProps {
  visible: boolean;
  showWeapp?: boolean;
  onClose: () => void;
  url: string;
  mode: 'share' | 'preview';
}

function CopyButtonInInput(props) {
  const { url } = props;
  const handleCopySuccess = useCallback(() => {
    Notify.success('复制成功');
  }, []);
  return (
    <CopyButton text={url} onCopySuccess={handleCopySuccess}>
      <Button type="primary" className="copy-button">
        复制
      </Button>
    </CopyButton>
  );
}

function Promotion(props: IPromotionProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [weappQrCodeUrl, setWeappQrCodeUrl] = useState('');
  const { visible, onClose, mode = 'share', url, showWeapp = false } = props;
  const [current, setCurrent] = useState(1);

  const h5Url = buildUrl(url, '', _global.kdtId);
  const weappUrl = `packages/edu/webview/index?targetUrl=${encodeURIComponent(url)}`;

  useEffect(() => {
    if (!visible) return;
    getQrcode(h5Url)
      .then((qrcode) => {
        setQrCodeUrl(qrcode);
      })
      .catch(() => {
        Notify.error('二维码生成失败');
      });
    if (showWeapp) {
      fetchWeappQrcode(weappUrl, '')
        .then((data) => {
          if (data) {
            const base64 = `data:image/png;base64,${data}`;
            setWeappQrCodeUrl(base64);
          }
        })
        .catch(() => {
          Notify.error('二维码生成失败');
        });
    }
  }, [h5Url, visible]);

  return (
    <Dialog title={mode === 'share' ? '分享' : '预览二维码'} visible={visible} onClose={onClose}>
      <VerticalTabs activeId={current} onChange={(v) => setCurrent(v)}>
        <TabPanel tab={<span>H5</span>} id={1}>
          <div className={styles.content}>
            <div className={styles.img}>
              <img src={qrCodeUrl} />
            </div>
            <div className={styles.info}>
              <div className={styles.label}>{mode === 'share' ? '分享链接' : '预览链接'}：</div>
              <div className={styles.url}>
                <Input className={styles.input} value={h5Url} disabled />
                <CopyButtonInInput url={h5Url} />
              </div>
              <div className={styles.action}>
                {mode === 'share' ? (
                  <DownloadImage text={'下载二维码'} url={qrCodeUrl} />
                ) : (
                  '预览时不支持提交考试'
                )}
              </div>
            </div>
          </div>
        </TabPanel>
        {showWeapp ? (
          <TabPanel tab={<span>小程序</span>} id={2}>
            <div className={styles.content}>
              <div className={styles.img}>
                <img src={weappQrCodeUrl} />
              </div>
              <div className={styles.info}>
                <div className={styles.label}>{mode === 'share' ? '分享链接' : '预览链接'}：</div>
                <div className={styles.url}>
                  <Input className={styles.input} value={weappUrl} disabled />
                  <CopyButtonInInput url={weappUrl} />
                </div>
                <div className={styles.action}>
                  {mode === 'share' ? (
                    <DownloadImage text={'下载二维码'} url={weappQrCodeUrl} />
                  ) : (
                    '预览时不支持提交考试'
                  )}
                </div>
              </div>
            </div>
          </TabPanel>
        ) : (
          <></>
        )}
      </VerticalTabs>
    </Dialog>
  );
}

export default Promotion;
