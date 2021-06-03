import { Toast } from 'vant';
import { redirect } from '@/common/utils/custom-safe-link';
import { ajax } from '@youzan/vis-ui';
import { LIVE_TYPE } from '@/constants/course/live-type';
import { LIVE_STATUS } from '@/constants/course/live-status';
import { SELLER_TYPE } from '@/constants/course/seller-type';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import { checkAndLogin } from '@/common/utils/login';
import openQrcodePop from '@/pages/course/detail/components/qrcode-pop';
import log from '@/pages/course/detail/utils/log';
import pay from '@/pages/course/detail/store/pay';
import { handleSubmitCollectInfo } from '@/pages/course/detail/utils/submit-collect-info';
import { sendCheckSmsCaptcha } from '@/common/utils/checkSmsCaptcha';
import { openCollectInfoPopupHOF } from 'components/info-collect-popup';

export default function(state, defaultButtonText, getters = {}) {
  const { env, goodsData, mpFollowed, onlineCourseCollectSetting } = state;
  const { needCollectInfo = false } = getters;
  const { alias, sellerType, liveType, liveStatus, isOwnAsset, focusQr,
    column, sku, title, summary, pictures = [], needOrder } = goodsData;

  let infoCollectDto = {};

  const toLiveRoom = () => {
    checkAndLogin(() => {
      if (env.isSwanApp) {
        Toast('请在微信中使用直播功能');
        return;
      }
      if (liveType === LIVE_TYPE.POLYV_LIVE) {
        return ajax({
          url: '/wscvis/knowledge/getLiveLink.json',
          data: {
            alias,
          },
        })
          .then(res => {
            if (res.link) {
              redirect({
                url: res.link,
              });
            } else {
              return Promise.reject();
            }
          })
          .catch(error => {
            Toast(error || '进入直播间失败，请稍后再试');
          });
      }
      if (liveType === LIVE_TYPE.YZ_EDU_LIVE) {
        // 当前不在iframe中，直接跳到room
        if (top === self) {
          // TODO room 页需要通过 alias 查 simple 商详接口，链接上只留 alias，保证连接参数尽量精简
          return redirect({
            url: '/wscvis/course/live/video/room',
            query: {
              alias,
              // 直播间分享信息URL传入
              title,
              cover: pictures[0] && pictures[0].url,
              summary,
            },
          });
        }
        return ajax({
          url: '/wscvis/course/live/video/getEduLiveLink.json',
          data: {
            alias,
          },
        })
          .then(res => {
            if (res.link) {
              return redirect({
                url: res.link,
              });
            } else {
              return Promise.reject();
            }
          })
          .catch(error => {
            Toast(error || '进入直播间失败，请稍后再试');
          });
      }
      redirect({
        url: '/wscvis/knowledge/index',
        query: {
          page: 'liveroom',
          sg: 'live',
          alias,
        },
      });
    });
  };

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
      subtitle: '为了更好地服务你，提交报名信息后即可观看直播课程',
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

      // 提交信息采集资料项（直播）
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

  // 保利威直播可以在pc端访问
  if (!env.isMobile && liveType !== LIVE_TYPE.POLYV_LIVE && liveType !== LIVE_TYPE.YZ_EDU_LIVE) {
    return {
      buttons: [{
        text: '请在微信中访问',
      }],
    };
  }

  const buttons = [];

  // 有绑定的专栏
  if (sellerType === SELLER_TYPE.COLUMN || sellerType === SELLER_TYPE.BOTH) {
    buttons.push({
      text: '查看专栏',
      url: `/wscvis/course/detail/${column.alias}?kdt_id=${_global.kdt_id || ''}`,
    });
  }

  if (
    (needOrder || !isOwnAsset) &&
    (sellerType === SELLER_TYPE.SINGLE || sellerType === SELLER_TYPE.BOTH)
  ) {
    buttons.push({
      text: defaultButtonText,
      action: () => {
        pay(ACTIVITY_TYPE.NO_ACTIVITY, null, sku.minPrice ? 'default' : 'zero-buy');
      },
    });

    return {
      buttons,
    };
  }

  if (isOwnAsset) {
    if (liveStatus === LIVE_STATUS.UNSTART) {
      if (mpFollowed || !focusQr) {
        buttons.push({
          text: needCollectInfo ? '查看直播' : '进入直播间',
          action: () => {
            const cb = () => {
              log({
                et: 'custom',
                ei: 'to_live_room',
                en: '进入直播间',
              });
              toLiveRoom();
            };

            needCollectInfo ? handleOpenPopup(cb) : cb();
          },
        });
        return {
          buttons,
        };
      }
      buttons.push({
        text: '开启直播提醒',
        action: () => {
          log({
            et: 'custom',
            ei: 'live_remind',
            en: '开启直播提醒',
          });
          openQrcodePop({
            props: {
              title: '直播开始提醒',
              qrCode: focusQr,
              tip: '长按扫码并关注\n开启直播提醒',
            },
          });
        },
      });
      return {
        buttons,
      };
    }
    if (liveStatus === LIVE_STATUS.LIVING ||
      (liveStatus === LIVE_STATUS.REWATCH &&
        (liveType === LIVE_TYPE.POLYV_LIVE || liveType === LIVE_TYPE.YZ_EDU_LIVE))) {
      buttons.push({
        text: needCollectInfo ? '查看直播' : '进入直播间',
        action: () => {
          const cb = () => {
            log({
              et: 'custom',
              ei: 'to_live_room',
              en: '进入直播间',
            });
            toLiveRoom();
          };

          needCollectInfo ? handleOpenPopup(cb) : cb();
        },
      });
      return {
        buttons,
      };
    }

    buttons.push({
      text: '回看直播内容',
      action: () => {
        const cb = () => {
          log({
            et: 'custom',
            ei: 'live_replay',
            en: '回看直播内容',
          });
          toLiveRoom();
        };

        needCollectInfo ? handleOpenPopup(cb) : cb();
      },
    });
    return {
      buttons,
    };
  }

  // 兜底仅专栏售卖
  return {
    buttons,
  };
}
