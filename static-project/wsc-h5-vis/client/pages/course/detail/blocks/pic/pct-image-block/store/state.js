import { PLAY_STATUS } from '../constants';

export default {
  // 网络类型，默认为 wifi，不弹出播放提示
  networkType: 'wifi',

  // 音视频播放状态
  playStatus: PLAY_STATUS.BEFORE_PLAY,

  // 音视频是否即将播放结束
  willFinish: false,

  // 用户是否取消自动播放下一篇
  cancelNext: false,

  // 标识是否需要自动播放，在知识付费自动播放下一篇时会置为 true
  autoplay: false,
};
