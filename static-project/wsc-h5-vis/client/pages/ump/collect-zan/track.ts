import { Track, Timings, IConfig } from '@/common/directives/track';

const configs = [
  {
    name: 'generatePoster',
    eventId: 'generate_poster',
    eventName: '生成海报',
    eventType: 'custom',
    timing: Timings.Interaction,
    data(store) {
      return {
        activityId: store.activityId,
        posterType: store.posterType,
        rewardType: store.rewardType,
        supporterCount: store.supporterCount,
      };
    },
  },
  {
    name: 'guestWant',
    eventId: 'guest_want',
    eventName: '我也要好礼',
    eventType: 'custom',
    timing: Timings.Interaction,
    data(store) {
      return {
        activityId: store.activityId,
        posterType: store.posterType,
        rewardType: store.rewardType,
        supporterCount: store.supporterCount,
      };
    },
  },
  {
    name: 'guestEnter',
    eventId: 'guest_enter',
    eventName: '助力者访问活动页',
    eventType: 'custom',
    timing: Timings.Interaction,
    data(store) {
      return {
        source: store.source,
      };
    },
  },
] as IConfig[];

const track = new Track({
  attachTimestamp: true,
  configs,
  logClient: window.yzlogInstance,
  globalPageType: 'collectzan',
});

type ITrack = Track & { trigger: (name: string) => void };

(track as ITrack).trigger = (name: string) => {
  const task = track.getCurrentTask(Timings.Interaction, name);
  let config;
  if (task && (config = task.config)) {
    track.invokeTask(config, track.getStore(config));
  }
};

export default track as ITrack;
