import { IConfig, Timings } from '@/common/directives/track';
import { getOriginInfo } from './utils';

const enterpage: IConfig = {
  name: 'enterTuition',
  eventId: 'enterpage',
  eventName: '浏览页面',
  timing: Timings.EnterPage,
  data() {
    const origin = getOriginInfo();
    const alias = location.pathname.split('/').pop();
    if (!alias) return 'TERMINATE';
    return {
      ...origin,
      alias,
      desc: '浏览攒学费C端页面',
      fromInstanceId: origin.origin_value,
    };
  },
};

const postTuitionInfo: IConfig = {
  name: 'tuitionInfo',
  eventId: 'tuition_info',
  eventName: '攒学费基本信息',
  eventType: 'custom',
  timing: Timings.ChangeByData,
  maxTimes: 1,
  deps(_, curStore) {
    return curStore.tuitionInfoReady === 'true';
  },
  data(store) {
    return {
      desc: '上传攒学费活动的基本信息',
      acName: store['tuition:name'],
      acId: store['tuition:id'],
      acState: '',
      needInfoCollect: store.needInfoCollect,
    };
  },
};

// 点击「邀请按钮」然后根据action的值，
// 设置事件为发起或者参与某个活动，事件
// 触发最大次数为2（创建和分享各统计一次）
const invokedMap: Record<string, boolean> = {
  join: false,
  share: false,
};
const createOrShareTuition: IConfig = {
  name: 'createOrShareTuition',
  eventName: '发起或邀请参加攒学费',
  eventId: 'create_or_share_tuition',
  timing: Timings.Interaction,
  maxTimes: 2,
  data(store) {
    const action: string = store['action:type'];
    const hasInvoked = invokedMap[action];
    // 如果不在触发列表中
    if (invokedMap[action] === undefined || hasInvoked) {
      return 'TERMINATE';
    }
    invokedMap[action] = true;
    return {
      desc: (action === 'join' ? '发起' : '邀请参加') + '攒学费',
      action,
      activity: 'tuition',
      url: '',
      state: store['tuition:id'],
    };
  },
};

const submitCollectedInfo: IConfig = {
  name: 'submitCollectedInfo',
  eventName: '提交信息采集',
  eventId: 'submit_info_collect',
  // 因为无法绑定dom，所以默认为点击事件是不合法的
  eventType: 'custom',
  timing: Timings.Interaction,
  maxTimes: 1,
  data(store) {
    return {
      desc: '攒学费页面提交信息采集',
      action: 'submit-info-collect',
      activity: 'tuition',
      url: '',
      state: store['action:type'],
    };
  },
};

const shareTuition: IConfig = {
  name: 'shareTuition',
  eventId: 'share_tuition',
  eventName: '分享攒学费活动',
  eventType: 'custom',
  timing: Timings.Interaction,
  maxTimes: 1,
  data(store) {
    const shareType = store['share:type'];
    if (!shareType) return 'TERMINATE';
    let posterInfo = {};
    if (shareType === 'poster') {
      posterInfo = {
        pType: store['poster:type'] || '',
        pId: store['poster:id'] || '',
        pUrl: store['poster:url'] || '',
      };
    }
    return {
      desc: `通过${shareType}方式分享攒学费`,
      url: store['share:url'],
      type: shareType,
      ...posterInfo,
    };
  },
};

const tuitionTopPhase: IConfig = {
  name: 'tuitionTopPhase',
  eventId: 'tuition_top_phase',
  eventName: '是否达到最大阶段',
  timing: Timings.ChangeByData,
  deps: ['tuition:isTopPhase'],
  maxTimes: 1,
  data(store) {
    const _phaseTop = store['tuition:isTopPhase'];
    return {
      desc: `活动${_phaseTop === 'true' ? '已经' : '还未'}达到最高阶段`,
      tTop: _phaseTop,
    };
  },
};

const boostTuition: IConfig = {
  name: 'boostTuition',
  eventId: 'boost_tuition',
  eventName: '助力攒学费',
  timing: Timings.Interaction,
  data: {
    desc: '助力他人攒学费',
    action: 'boost',
    activity: 'tuition',
    url: '',
    state: getOriginInfo().origin_value,
  },
};

export default [
  enterpage,
  postTuitionInfo,
  createOrShareTuition,
  submitCollectedInfo,
  shareTuition,
  tuitionTopPhase,
  boostTuition,
];
