import { Notify } from 'zent';
import { videoCheck } from '../action-menu/api';
import { openVideoPlaybackDialog } from '../dialog/video-present-dialog';
import { openVideoRechargeDialog } from '../dialog/video-recharge-dialog';

/* 检查视频直播的余额校验 */
export function checkVideoAuthBase() {
  return new Promise((resolve, reject) => {
    videoCheck({ liveType: 5 })
      .then(data => {
        if (data.success) {
          return resolve(true);
        }
        reject(data);
      })
      .catch(error => Notify.error(error));
  });
}

export function checkVideoAuth() {
  return new Promise(resolve => {
    checkVideoAuthBase()
      .then(() => {
        resolve(true);
      })
      .catch(({ failCode, value }) => {
        const onSuccess = () => resolve(true);

        // 可赠送
        if (failCode === 1) {
          return openVideoPlaybackDialog({ present: value, onSuccess });
        }

        // 余额不足请充值
        if (failCode === 2) {
          return openVideoRechargeDialog();
        }

        return resolve(true);
      });
  });
}
