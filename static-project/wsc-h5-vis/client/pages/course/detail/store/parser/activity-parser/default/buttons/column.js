import { isRetailMinimalistPartnerStore, isUnifiedPartnerStore } from '@youzan/utils-shop';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import pay from '@/pages/course/detail/store/pay';
import { handleSubmitCollectInfo } from '@/pages/course/detail/utils/submit-collect-info';
import { sendCheckSmsCaptcha } from '@/common/utils/checkSmsCaptcha';
import { openCollectInfoPopupHOF } from 'components/info-collect-popup';
import { redirectToShop } from './utils';

export default function(state, defaultButtonText, getters = {}) {
  const { goodsData, onlineCourseCollectSetting } = state;
  const { needCollectInfo = false } = getters;
  const { isOwnAsset, needOrder, sku } = goodsData;
  let infoCollectDto = {};

  const handleSendCaptcha = (mobile, callBack) => {
    const {
      alias: bizAlias,
    } = onlineCourseCollectSetting;

    sendCheckSmsCaptcha({
      mobile,
      bizAlias,
      scene: 1,
      callBack,
    });
  };

  const handleOpenPopup = (cb) => {
    const {
      alias: bizAlias,
      collectSetting: infoCollectionItems,
      needVerifyCode,
    } = onlineCourseCollectSetting;

    openCollectInfoPopupHOF({
      subtitle: '为了更好地服务你，提交报名信息后即可观看专栏内课程',
    })({
      props: {
        infoCollectionItems,
        infoCollectDto,
        needVerifyCode,
      },
      on: {
        sendCaptcha: handleSendCaptcha,
      },
    }).then(data => {
      const { attributeItems, values } = data;

      infoCollectDto = values;

      // 提交信息采集资料项（专栏）
      handleSubmitCollectInfo({
        attributeItems,
        bizAlias,
        scene: 1,
        onSuccess: () => {
          if (typeof cb === 'function') {
            cb();
          }
        },
        onFailed: () => $track.collect('collectInfoError', Date.now()),
      });
    });
  };

  // 未购买
  if (needOrder || !isOwnAsset) {
    return {
      buttons: [{
        text: defaultButtonText,
        action: () => {
          if (isRetailMinimalistPartnerStore || isUnifiedPartnerStore) {
            redirectToShop(_global.kdtId);
          } else {
            pay(ACTIVITY_TYPE.NO_ACTIVITY, null, sku.minPrice ? 'default' : 'zero-buy');
          }
        },
      }],
    };
  }

  // 已购买
  if (needCollectInfo) {
    return {
      buttons: [{
        text: '领取专栏',
        action: () => {
          const cb = () => {
            // 刷新页面
            setTimeout(location.reload.bind(location), 2000);
          };

          handleOpenPopup(cb);
        },
      }],
    };
  }
}
