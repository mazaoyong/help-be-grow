import { IConfig, Timings } from '@/common/directives/track';

const submitHomeworkConfig: IConfig = {
  name: 'submit_homework',
  eventName: '提交作业',
  eventId: 'submit_homework',
  timing: Timings.Interaction,
  data(store) {
    return {
      from: store['homework:pageType'],
      component: 'writeHomework',
      ...store['assignment:contentCount'],
    };
  },
};

const shareHomeworkConfig: IConfig = {
  name: 'share_homework',
  eventName: '分享作业',
  eventId: 'share_homework',
  pageType: 'assignment',
  timing: Timings.Interaction,
  data(store) {
    return {
      type: store['assignment:shareType'],
    };
  },
};

const configs: IConfig[] = [
  submitHomeworkConfig,
  shareHomeworkConfig,
];

export default configs;
