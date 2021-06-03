import React, { FC, useState } from 'react';
import { get } from 'lodash';
import { PromotionDialog } from '@youzan/react-components';
import { url, fullfillImage } from '@youzan/utils';
import { showBdappCode, getBdappCode } from 'common/api/request';
import fetchWeappQrcode from 'fns/qrcode/fetch-weapp-code';
import { createQrCode, getDetail } from '../../api';
import { hasWeappBinded } from '../../constants';
import { log } from '../../utils/logger';

import './style.scss';

interface ActivityPromotionProps {
  title: string;
  alias: string;
  children: React.ReactNode;
}
const supportBaiduApp = showBdappCode();

const createPoster = ({ codeImg }) => (
  <div
    style={{
      position: 'relative',
      background: `url("${
        fullfillImage('/public_files/6d8468e1231d09700c9e09fece595c69.png', 'origin', { imgcdn: 'https://b.yzcdn.cn' })
      }")`,
      backgroundSize: 'cover',
      width: 240,
      height: 340,
      borderRadius: 6.5,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}
  >
    <div
      style={{
        padding: '9px 12px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <img
        src={_global.shopInfo.logo}
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
        }}
      />
      <p
        style={{
          marginLeft: 6,
          color: 'white',
          fontWeight: 'bolder',
          fontSize: 14,
        }}
      >
        {_global.shopName}
      </p>
    </div>
    <p
      style={{
        position: 'absolute',
        top: 180,
        width: '100%',
        textAlign: 'center',
        fontSize: 14,
        color: '#323233',
      }}
    >
      邀请一起加入，推广赢奖励
    </p>
    <div
      style={{
        position: 'absolute',
        top: 215,
        width: '100%',
        textAlign: 'center',
      }}
    >
      <img src={codeImg} style={{ width: 82, height: 82 }} />
    </div>
    <p
      style={{
        position: 'absolute',
        top: 300,
        width: '100%',
        textAlign: 'center',
        fontSize: 12,
        color: '#969799',
      }}
    >
      长按识别二维码
    </p>
  </div>
);

export const ActivityPromotion: FC<ActivityPromotionProps> = ({ title, alias, children }) => {
  const [showBdapp, setShowBdapp] = useState(false);
  supportBaiduApp.then(res => res && res.mpId && setShowBdapp(true));
  const chainOnlineShopMode = get(_global, 'shopInfo.chainOnlineShopMode', 1);
  const kdtId = chainOnlineShopMode === 2 ? get(_global, 'shopInfo.parentKdtId', _global.kdtId) : _global.kdtId;
  const h5Url = url.buildUrl(
    `/wscvis/ump/introduction/old-student?kdt_id=${kdtId}&from=invite_reward&alias=${alias}`,
    'h5'
  );
  const weappUrl = url.args.add('/packages/edu/webview/index', {
    targetUrl: url.buildUrl(
      `/wscvis/ump/introduction/old-student?kdt_id=${kdtId}&alias=${alias}&from=invite_reward`,
      'h5'
    ),
  });

  return (
    <a
      style={{ cursor: 'pointer' }}
      onClick={() => PromotionDialog.openPromotionDialog({
        supportH5: true,
        supportWeapp: hasWeappBinded,
        supportBaiduApp: showBdapp,
        weappConfig: {
          hasBoundApp: hasWeappBinded,
          hasOrderedApp: hasWeappBinded,
        },
        mode: 'poster',
        h5Url,
        weappUrl,
        baiduAppUrl: weappUrl,
        getQrCode: () => createQrCode({ url: h5Url, isShortenUrl: true }),
        // @ts-ignore
        getWeappCode: () => fetchWeappQrcode(weappUrl).then((data: string = '') => `data:image/png;base64,${data}`),
        getBaiduAppCode: () => getBdappCode({ path: weappUrl, businessType: 1 }).then((data: string = '') => `data:image/png;base64,${data}`),
        getActivity: () => Promise.resolve({}),
        className: 'activity-promotion-dialog',
        createPoster,
        // @ts-ignore
        customTabs: [<div
          key="poster"
          onClick={e => {
            e.stopPropagation();
            window.open(`${window._global.url.v4}/vis/ump/enrollment-poster#/create?formValue=${
              encodeURIComponent(JSON.stringify({
                title,
                relatedType: 2,
                modelType: 1,
                fixedQrcode: h5Url,
              }))
            }&returnUrl=${encodeURIComponent(`${window._global.url.v4}/vis/ump/invite-reward#/list`)}`);

            getDetail({ query: { alias } }).then((data) => {
              const {
                alias,
                baseInfoSetting: { name },
                ruleSetting: { newStudentRewardSettingType },
                newStudentPageSetting: { showJoinNum },
              } = data;
              log({
                et: 'click',
                ei: 'create_poster',
                en: '点击制作推广海报',
                pt: 'inviteRewardBack',
                params: {
                  showJoinNum,
                  newStudentRewardType: newStudentRewardSettingType,
                  name,
                  alias,
                },
              });
            });
          }}
          className="make-poster"
        >
          制作推广海报
        </div>],
        customTabsContent: [''],
      })}
    >{children}</a>
  );
};
