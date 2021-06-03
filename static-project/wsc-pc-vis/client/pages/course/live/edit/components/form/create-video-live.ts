import * as Api from '../../../api';

interface CreateParam {
  name: string;
  desc: string;
  scene: 1 | 2;
  liveStartAt: string;
  liveType: number;
}

const checkCreateChannelLive = createId => {
  return new Promise((resolve, reject) => {
    let times = 40;
    const interval = 1000;

    const check = () => {
      Api.getAsyncCreateStatus({ createId })
        .then(({ status, channelId }) => {
          if (status === 1) {
            resolve(channelId);
            return;
          }

          if (times && status === 0) {
            times--;
            setTimeout(check, interval);
            return;
          }

          return reject();
        })
        .catch(() => {
          if (times) {
            times--;
            check();
            return;
          }
          throw new Error('频道创建失败，请稍后重试');
        });
    };

    check();
  });
};

export const createLiveChannel = (param: CreateParam) => {
  return Api.postAsyncCreateLive(param)
    .then(id => checkCreateChannelLive(id))
    .catch(error => {
      if (error) {
        throw error;
      }
      throw new Error('频道创建失败，请稍后重试');
    });
};
