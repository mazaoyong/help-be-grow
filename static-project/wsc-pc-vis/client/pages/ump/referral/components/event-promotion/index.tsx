import React, { FC } from 'react';
import { Notify } from 'zent';
import cx from 'classnames';
import { PromotionDialog, BlankLink } from '@youzan/react-components';
import buildUrl from '@youzan/utils/url/buildUrl';
import fen2yuan from 'fns/fen2yuan';
import fetchWeappQrcode from 'fns/qrcode/fetch-weapp-code';
import { getBdappCode } from 'common/api/request';
import { RewardTypeEnum, RewardTypeMap, RewardTypeUnitMap, IRewardItem } from 'definitions/api/owl/pc/CommonActivityPCFacade/getRewardByPage';
import { useStoreBy } from '../../store';
import { getCouponName, getSuffixCouponName } from '../../utils';
import { IActivityDetail } from '../../types';
import { hasWeappBinded, POINTS_NAME } from '../../constants';
import { getQrcode, getDetailByActivityId } from '../../api/list';

import './styles.scss';

const phasedImageMap = {
  [RewardTypeEnum.POINT]:
    'https://img.yzcdn.cn/upload_files/2020/11/30/FvEP4EaR-qwlWhKGm8XltQlAhywe.png',
  [RewardTypeEnum.COUPON]:
    'https://img.yzcdn.cn/upload_files/2020/11/30/Fqfh8RY1TglZlLAVGYV_ao_fWJiD.png',
  [RewardTypeEnum.PRESENT]:
    'https://img.yzcdn.cn/upload_files/2020/11/30/Ftu_AhLrGpFCRDmaFi6ETOfRJcTI.png',
};

interface EventPromotionProps {
  id: number;
  url: string;
  name: string;
}

interface IPhasedBlockProps {
  type: RewardTypeEnum;
  list?: IRewardItem[];
  bonusPoint?: number;
}

const PhasedBlock: FC<IPhasedBlockProps> = ({ type, list = [], bonusPoint = 0 }) => {
  return type === RewardTypeEnum.POINT || list.length ? (
    <div className="poster-phased-block">
      <div className="phased-icon">
        <img src={phasedImageMap[type]} />
      </div>
      <ul className="phased-list">
        {list.slice(0, 3).map((item) => (
          <li key={item.id} className="phased-list-item">
            <div className="phased-name">
              {type === RewardTypeEnum.COUPON ? getCouponName(item) : item.name}
            </div>
            {type === RewardTypeEnum.COUPON && (
              <div className="phased-type">{getSuffixCouponName(item.type)}</div>
            )}
            <div className="phased-count">× {item.quantity}</div>
          </li>
        ))}
        {list.length > 3 && (
          <li className="phased-list-item phased-list-item-red">
            <div className="phased-name">
              等
              {list.reduce((total, item) => {
                return total + item.quantity;
              }, 0)}
              {RewardTypeUnitMap[type]}
              {RewardTypeMap[type]}
            </div>
          </li>
        )}

        {!!bonusPoint && type === RewardTypeEnum.POINT && (
          <li className="phased-list-item">
            <div className="phased-name">
              {bonusPoint}
              {POINTS_NAME}
            </div>
          </li>
        )}
      </ul>
    </div>
  ) : null;
};

const createPoster = (data: IActivityDetail) => ({ codeImg }) => {
  const {
    commissionPrice,
    decreasePrice,
    phasedRewardDetails,
    originalPrice,
    hasCommissionReward,
    hasPhasedReward,
  } = data;
  const rewardList = phasedRewardDetails || [];

  const rewardItem = rewardList[rewardList.length - 1];
  const { rewardName, bonusPoint, couponList = [], presentList = [] } = rewardItem || {};

  return (
    <div className="poster">
      {/* 店铺信息 */}
      <div className="shop-info">
        <div className="shop-info-avatar">
          <img src={_global.shopInfo.logo} />
        </div>
        <span className="shop-info-name">{_global.shopName}</span>
      </div>

      {/* 海报标题 */}
      <div className={cx('poster-title', { 'poster-title-normal': originalPrice !== 0 })}>
        {originalPrice === 0 ? (
          <img src="https://img.yzcdn.cn/upload_files/2020/11/30/Fm8ibZ9Ywwob5RoqBjRUO8bACUfD.png" />
        ) : (
          <img src="https://img.yzcdn.cn/upload_files/2020/11/30/Fkp2iZ38lYawrdAK6MKfZGrlzaym.png" />
        )}
      </div>

      {/* 奖励内容 */}
      <div className="poster-block">
        {/* 分佣奖励 */}
        {hasCommissionReward && (
          <div className="poster-commission">
            <div>每邀请一位好友下单你最高获得</div>
            <div className="poster-commission-price">
              ￥<span className="price-num">{fen2yuan(commissionPrice)}</span>
            </div>
            <div className="poster-commission-discount">
              好友最高立减 <span className="price-num">¥{fen2yuan(decreasePrice)}</span>
            </div>
          </div>
        )}

        {/* 阶梯奖励 */}
        {hasPhasedReward && !!rewardList.length && (
          <div className="poster-phased">
            <div className="poster-phased-title">
              <div className="phased-desc">邀请好友{rewardList.length > 1 ? '最高' : ''}可获得</div>
              <div className={cx('phased-content', { 'phased-content-red': !hasCommissionReward })}>
                {rewardName || '课程大礼包'}
              </div>
            </div>

            <PhasedBlock type={RewardTypeEnum.PRESENT} list={presentList} />
            <PhasedBlock type={RewardTypeEnum.COUPON} list={couponList} />
            {!!bonusPoint && <PhasedBlock type={RewardTypeEnum.POINT} bonusPoint={bonusPoint} />}
          </div>
        )}
      </div>

      {/* 二维码 */}
      <div className="poster-block">
        <div className="poster-qrcode">
          <div className="poster-qrcode-desc">
            <div className="tips">长按二维码立即参与活动</div>
            <div className="link">
              <span>邀请越多，奖励越多</span>
              <i className="icon"></i>
            </div>
          </div>
          <div className="poster-qrcode-img">
            <img src={codeImg} />
          </div>
        </div>
      </div>
    </div>
  );
};

const EventPromotion: FC<EventPromotionProps> = (props) => {
  const { id, url, name, children } = props;
  const h5Url = buildUrl(url, '', _global.kdtId);
  const [showBdapp] = useStoreBy('hasBdApp');
  const weappUrl = `packages/edu/webview/index?targetUrl=${encodeURIComponent(url)}`;

  const openDialog = async () => {
    try {
      const result = await getDetailByActivityId({ activityId: id });
      PromotionDialog.openPromotionDialog({
        className: 'referral-promotion-dialog',
        supportH5: true,
        supportWeapp: hasWeappBinded,
        supportBaiduApp: showBdapp,
        h5Url: h5Url,
        weappUrl: weappUrl,
        baiduAppUrl: weappUrl,
        mode: 'poster',
        onClose: () => {},
        createPoster: createPoster(result),
        getActivity: () => Promise.resolve({}),
        getQrCode: () => getQrcode(h5Url, { isShortenUrl: true }),
        getWeappCode: () =>
          // @ts-ignore
          fetchWeappQrcode(weappUrl).then((data: string = '') => `data:image/png;base64,${data}`),
        getBaiduAppCode: () =>
          getBdappCode({ path: weappUrl, businessType: 1 }).then(
            (data: string = '') => `data:image/png;base64,${data}`,
          ),
        getDownloadFileName: () => {
          return `${name}-${Date.now()}`;
        },
        renderTip: () => {
          return (
            <div className="poster-tip">
              分享链接和图片，让更多人看见&nbsp;
              <BlankLink href={`${_global.url.help}/displaylist/detail_4_4-2-13449`}>
                查看教程
              </BlankLink>
            </div>
          );
        },
        weappConfig: {
          hasOrderedApp: hasWeappBinded,
          hasBoundApp: hasWeappBinded,
        },
      });
    } catch (e) {
      Notify.error(e);
    }
  };

  return <a onClick={openDialog}>{children || '推广'}</a>;
};

export default EventPromotion;
