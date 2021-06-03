import { ajax } from '@youzan/vis-ui';
import SessionStorage from '@youzan/utils/browser/session_storage';
import { LIVE_TYPE } from '@/constants/course/live-type';
import { redirect } from '@/common/utils/custom-safe-link';
import openQrcodeDialog from '../../components/dialog-qrcode/index';
import { COLLECT_INFO_COMPLETED_KEY } from '../../constants';
import * as Toast from '../../components/toast';

const handleRedirectToLiveRoom = (goodsData: any) => {
  const { liveType, alias } = goodsData;
  // 如果是保利威直播
  if (liveType === LIVE_TYPE.POLYV_LIVE) {
    return ajax({
      url: '/wscvis/knowledge/getLiveLink.json',
      data: {
        alias,
      },
    })
      .then((res: { link: string}) => {
        if (res.link) {
          return redirect({
            url: res.link,
          });
        } else {
          return Promise.reject();
        }
      })
      .catch((errMsg: string) => {
        Toast.info(errMsg || '进入直播间失败，请稍后再试');
      });
  }

  // 如果是教育直播
  if (liveType === LIVE_TYPE.YZ_EDU_LIVE) {
    const { title, pictures, summary } = goodsData;

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
      .then((res: { link: string }) => {
        if (res.link) {
          return redirect({
            url: res.link,
          });
        } else {
          return Promise.reject();
        }
      })
      .catch((errMsg: string) => {
        Toast.info(errMsg || '进入直播间失败，请稍后再试');
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
};

/**
 * 添加会话状态，用于检查用户是否采集信息
 */
export const setCompleted = () => {
  SessionStorage.setItem(COLLECT_INFO_COMPLETED_KEY, '1');
};
export const removeCompleted = () => {
  SessionStorage.removeItem(COLLECT_INFO_COMPLETED_KEY);
};

/**
 * 信息采集后设置标识，并刷新页面
 */
function afterCollectInfo() {
  setCompleted();
  window.location.reload();
}

/**
 * 检查会话状态，判断是否需要检查信息采集状态
 *
 * @return {boolean}
 */
export const needCheckCollectInfo = () => {
  const completed = SessionStorage.getItem(COLLECT_INFO_COMPLETED_KEY) || false;
  return !!completed;
};

export const notifyCollectInfoStatus = (goodsData: any, needCollectInfo: boolean) => {
  if (needCheckCollectInfo()) {
    if (!needCollectInfo) {
      Toast.success('报名信息提交成功');

      setTimeout(() => handleRedirectToLiveRoom(goodsData), 2000);
    } else {
      Toast.error('未提交报名信息，请重试');
    }
    removeCompleted();
  }
};

export function toLiveRoom(goodsData: any, needCollectInfo: boolean) {
  if (needCollectInfo) {
    openQrcodeDialog({
      onCompleted: afterCollectInfo,
      props: {
        actionText: '提交',
        title: '扫码提交报名信息',
        subtitle: '为了更好地服务你，提交报名信息后即可观看直播课程',
        okText: '已完成提交',
      },
    });
  } else {
    handleRedirectToLiveRoom(goodsData);
  }
};
