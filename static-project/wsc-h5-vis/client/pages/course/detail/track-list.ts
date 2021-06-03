import number from '@youzan/utils/number';
import args from '@youzan/utils/url/args';
import { Timings, IConfig } from '@/common/directives/track';
import { MEDIA_TYPE } from '@/constants/course/media-type';

const getRequiredParams = (store: any) => ({
  // 专栏alias，undefined会被web-tracker给丢掉
  has_parent_permission: store.hasParentPermission,
  parent_alias: store.parentAlias,
  goods_id: store.goodsId,
  /** 这里good拼错了 */
  goods_alias: store.goodAlias,
  good_alias: store.goodAlias,
  has_permission: store.hasPermission,
  media_type: store.mediaType,
  kdt_id: Number(_global.kdt_id),
});

const LOG_INTERVAL = 10 * 1000; // 10s上报一次

// 在页面加载的时候，增加心跳检测
// 内容页：在页面加载完成触发
// 多媒体内容：在多媒体播放的时候触发
const heartBeatDetector: IConfig = {
  name: 'heartbeat',
  eventName: '学习时长',
  eventId: 'learn_duration',
  timing: Timings.Circulation,
  interval: LOG_INTERVAL,
  data(store) {
    const { 'paidContent:isPlaying': playingState = true } = store;
    if (playingState) {
      return {
        ...getRequiredParams(store),
        duration: LOG_INTERVAL,
      };
    }
    return 'TERMINATE';
  },
};

// 上一次触发埋点的阅读/播放进度
const progressStateStorage: Map<string, number> = new Map();
// 上一次阅读/播放进度
// let tempPrevProgress: number;

// 多媒体进度数据发生改变的时候触发上报
const dataChangeDetector: IConfig = {
  name: 'mediaProgress',
  eventName: '学习进度_多媒体',
  eventId: 'learn_progress_media',
  timing: Timings.ChangeByData,
  deps: ['media:duration', 'media:current'],
  data(store) {
    // 音视频没权限不上报
    if (store.hasPermission === 0) return 'TERMINATE';

    if (store['paidContent:isPlaying']) {
      const {
        'media:duration': duration,
        'media:current': current,
        goodAlias,
      } = store;

      const progress = Math.min(
        number.accMul(Number((current / duration).toFixed(2)), 100),
        100,
      );
      // tempPrevProgress = progress;

      const stashName = `mediaProgress:${goodAlias}`;
      const prevProgress = progressStateStorage.get(stashName) || 0;
      let passiveParams: Record<string, any> = getRequiredParams(store);
      if (progress !== prevProgress && progress === 100) {
        passiveParams.duration = LOG_INTERVAL;
      }
      if (progress - prevProgress >= 1) {
        progressStateStorage.set(stashName, progress);
        passiveParams.progress = progress;
        return passiveParams;
      }
    }
    return 'TERMINATE';
  },
};

const learnProgress = {
  content: [
    {
      name: 'contentProgress',
      eventName: '学习进度',
      eventId: 'learn_progress',
      timing: Timings.ViewDisplay,
      data(store, intersectionEntries) {
        if (
          store.mediaType !== MEDIA_TYPE.IMAGE_TEXT ||
          store.hasPermission === 0
        ) {
          return 'TERMINATE';
        }

        if (store.initGoodsInfo && intersectionEntries) {
          const curRatio = Math.min(
            number.accMul(intersectionEntries[0].contentDisplayRatio, 100),
            100,
          );
          // tempPrevProgress = curRatio;

          const stashName = `contentProgress:${store.goodAlias}`;
          const prevRatio = progressStateStorage.get(stashName) || 0;
          let passiveParams: Record<string, any> = getRequiredParams(store);
          // 100进度的时候需要上传一下学习时长
          if (curRatio !== prevRatio && curRatio === 100) {
            passiveParams.duration = LOG_INTERVAL;
          }
          if (curRatio - prevRatio >= 1) {
            progressStateStorage.set(stashName, curRatio);
            passiveParams.progress = curRatio;
            return passiveParams;
          }
        }
        return 'TERMINATE';
      },
    },
  ] as IConfig[],
  media: [dataChangeDetector] as IConfig[],
};

let estimateUploadTimes = 0;
const curKdtId = _global.kdtId || _global.kdt_id;
const whiteKdtIdList = [42861461, 42095703, 16719442, 1984620, 42807301];
const commonTrackConfig: IConfig[] = [
  // 商详页进入页面埋点
  {
    name: 'eduDetailEnterpage',
    eventName: '商详进入信息采集',
    eventId: 'edu_detail_enterpage',
    timing: Timings.ChangeByData,
    deps: 'activity_data',
    data(store) {
      return {
        is_own: store.is_own,
        media_type: store.media_type,
        prior_activity: store.prior_activity,
        activity_list: store.activity_list,
        activity_data: store.activity_data,
      };
    },
  },
  {
    name: 'learnTimeStatistic',
    eventName: '学习次数',
    eventId: 'learn',
    eventType: 'custom',
    timing: Timings.ChangeByData,
    maxTimes: 1,
    deps(_, curStore) {
      if (whiteKdtIdList.includes(Number(curKdtId))) {
        // 权限是最后设置的，所以根据这个来在条件判断之前上报一次
        if (estimateUploadTimes === 0 && curStore.hasPermission !== undefined) {
          const addonMsg = '[TRACK] 学习次数';
          window.yzStackLog &&
            window.yzStackLog.log({
              name: 'track-logger',
              message: addonMsg,
              level: 'info',
              extra: curStore,
            });
          estimateUploadTimes += 1;
        }
      }
      const { mediaType, hasPermission, goodAlias } = curStore;
      const isMedia =
        mediaType === MEDIA_TYPE.AUDIO || mediaType === MEDIA_TYPE.VIDEO;
      const curPermission = Boolean(hasPermission);
      const curAlias = goodAlias !== undefined;
      if (isMedia) {
        const isPlaying = curStore['paidContent:isPlaying'] || false;
        return curPermission && isPlaying;
      }
      return curPermission && curAlias;
    },
    data(store) {
      return {
        ...getRequiredParams(store),
        start_learn: 1,
      };
    },
  },
  {
    /** 需要统计从邀请卡跳转到海报时候用户是从哪个海报进来的 */
    name: 'inviteCardStatistic',
    eventName: '邀请卡片类型',
    eventId: 'invite_card_type',
    eventType: 'display',
    timing: Timings.ChangeByData,
    deps: 'goodAlias',
    data(store) {
      const aliasMatcher = window.location.pathname.match(/\/(\w+)$/);
      const eduParams = args.get('edu');
      if (eduParams && aliasMatcher) {
        const [origin, value] = eduParams.split('::');
        if (origin === 'INVITE_CARD') {
          return {
            ...getRequiredParams(store),
            origin,
            origin_value: value,
          };
        }
      }
      return 'TERMINATE';
    },
  },
  /** 商详页信息采集提交失败 */
  {
    name: 'collectInfoFailed',
    eventName: '提交信息采集失败',
    eventId: 'collect_info_failed',
    eventType: 'custom',
    timing: Timings.ChangeByData,
    deps: 'collectInfoError',
  },
  {
    /* 商详 推荐有奖 分享按钮 点击 */
    name: 'recommendShareBtn',
    timing: Timings.Interaction,
    eventId: 'recommend_share_btn',
    eventName: '推荐有奖分享按钮点击',
  },
  {
    /* 商详 推荐有奖 分享popup 展示 */
    name: 'recommendSharePopup',
    timing: Timings.Interaction,
    eventId: 'recommend_share_popup_display',
    eventName: '推荐有奖分享popup展示',
  },
  {
    /* 商详 推荐有奖 分享popup 按钮点击 */
    name: 'recommendSharePopupClick',
    timing: Timings.Interaction,
    eventId: 'recommend_share_popup_click',
    eventName: '推荐有奖分享popup按钮点击',
    data(store) {
      return {
        clickName: store['recommend_share_popup_click:clickName'],
      };
    },
  },
];

export function resetTrackState() {
  progressStateStorage.clear();
  estimateUploadTimes = 0;
}
export default commonTrackConfig;
export { learnProgress, heartBeatDetector };
