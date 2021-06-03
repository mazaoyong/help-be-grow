import React, { FC, useState, useEffect, useMemo } from 'react';
import { closeDialog, Link } from 'zent';
import { PromotionDialog } from '@youzan/react-components';
import { url, fullfillImage, number } from '@youzan/utils';
import fetchWeappQrcode from 'fns/qrcode/fetch-weapp-code';
import { showBdappCode, getBdappCode } from 'common/api/request';
import { hasWeappBinded } from '../../constants';
import { getWapQrCode, getTuitionOffsetDetailById } from './api';

import './styles.scss';

const UNIQUE_PRIMOTION_DIALOG_ID = 'PROMOTION_DIALOG_UNIQUE_ID'; // 不可修改

const { accDiv } = number;

interface EventPromotionProps {
  id?: number;
  alias?: string;
  children: React.ReactNode;
  showBdapp?: boolean;
};

const createPoster = ({ codeImg, activity }) => (
  <div
    className="poster-container"
    style={{
      background: `url("${
        fullfillImage('/public_files/111dde93e8c1347cd80fcb616537e2f0.png', 'origin', { imgcdn: 'https://b.yzcdn.cn' })
      }")`,
      backgroundSize: 'cover',
      width: 300,
      height: 418,
      borderRadius: 6.5,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <span className="subtitle">
      最高可攒
      <span className="max-price">{accDiv((activity.maxTuition || 88888), 100.0)}</span>
      元
    </span>
    <div className="shop-info">
      <div className="logo">
        <img
          src={_global.shopInfo.logo}
          style={{
            width: 42,
            height: 42,
            borderRadius: '50%',
          }}
        />
      </div>
      <div className="desc">
        <p className="shop-name">
          {_global.shopName}
        </p>
        <p className="slogan">
          快来攒学费 多门课程可兑换
        </p>
      </div>
    </div>
    <div className="price">
      <div className="max-icon">
        <span className="content">最高</span>
      </div>
      <span className="max-price">{accDiv((activity.maxTuition || 88888), 100.0)}</span>
      <span className="suffix">元</span>
    </div>
    <div className="bottom">
      <img src={codeImg} style={{ width: 56, height: 56 }} />
      <div className="tips-container">
        <span className="tips">长按二维码即可参与攒学费</span>
        <div className="source">
          <span className="source-prefix">分享自</span>
          <span className="shop-name">{_global.shopName}</span>
        </div>
      </div>
    </div>
  </div>
);

const EventPromotion: FC<EventPromotionProps> = (props) => {
  const { id, alias, children, showBdapp } = props;

  const [bdapp, setBdapp] = useState(showBdapp);

  const h5Url = useMemo(() =>
    url.buildUrl(
      `/wscvis/ump/tuition/${alias}?kdt_id=${_global.kdtId}&from=tuition_offset`,
      'h5',
      _global.kdtId,
    ), [alias]);
  const weappUrl = useMemo(() =>
    url.args.add('/packages/edu/webview/index', {
      targetUrl: url.buildUrl(
        `/wscvis/ump/tuition/${alias}?kdt_id=${_global.kdtId}&from=tuition_offset`,
        'h5',
      ),
    }), [alias]);

  useEffect(() => {
    if (showBdapp === undefined) { // 不来自于列表页（来自于新建、编辑成功页）
      showBdappCode()
        .then(res => {
          res && res.mpId && setBdapp(true);
        });
    }

    return () =>
      closeDialog(UNIQUE_PRIMOTION_DIALOG_ID);
  }, [showBdapp]);

  return (
    <Link
      style={{ cursor: 'pointer' }}
      className="common-link"
      onClick={() => PromotionDialog.openPromotionDialog({
        supportH5: true,
        supportWeapp: hasWeappBinded,
        supportBaiduApp: bdapp,
        weappConfig: {
          hasBoundApp: hasWeappBinded,
          hasOrderedApp: hasWeappBinded,
        },
        mode: 'poster',
        h5Url,
        weappUrl,
        baiduAppUrl: weappUrl,
        getQrCode: () => getWapQrCode({ url: h5Url, isShortenUrl: true }),
        // @ts-ignore
        getWeappCode: () => fetchWeappQrcode(weappUrl).then((data: string = '') => `data:image/png;base64,${data}`),
        getBaiduAppCode: () => getBdappCode({ path: weappUrl, businessType: 1 }).then((data: string = '') => `data:image/png;base64,${data}`),
        getActivity: () => getTuitionOffsetDetailById({ id }),
        className: 'event-promotion-dialog',
        createPoster,
      })}
    >
      {children}
    </Link>
  );
};

export default EventPromotion;
