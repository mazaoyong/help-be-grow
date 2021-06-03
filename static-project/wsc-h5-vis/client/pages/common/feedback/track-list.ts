import { IConfig, Timings } from '@/common/directives/track';

const taskList: IConfig[] = [
  {
    name: 'uploadUserInfo',
    eventId: 'userInfo',
    eventName: '[Track]用户信息',
    timing: Timings.ChangeByData,
    maxTimes: 1,
    data(store) {
      return {
        userInfo: store['user:userInfo'],
        source: store['user:source'],
        feedback: store['feedback'],
      };
    },
  },
];

export default taskList;
