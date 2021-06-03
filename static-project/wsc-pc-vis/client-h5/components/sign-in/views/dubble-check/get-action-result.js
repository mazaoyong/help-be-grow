import { TimingTask } from 'utils';
import { Toast } from 'vant';
import { SIGN_IN_TIP } from '../../contants';
import { logSignIn } from '../../log';

export default (taskNo, signInType, targetKdtId, ajaxFn, students) => {
  return new Promise((resolve, reject) => {
    // 签到分为两个阶段：0～3秒无toast提示，3～10秒有toast提示，因此分为两个定时任务
    // 第一个定时任务，0～3秒内签到完成则直接返回
    const timingTask1 = new TimingTask(3000);
    timingTask1.start(() => {
      ajaxFn({
        taskNo,
        kdtId: targetKdtId,
      }).then(res => {
        if (res.actionStatus === 1) { // 执行成功
          timingTask1.stop();
          resolve(res);
          // Toast(`${SIGN_IN_TIP[signInType]}完成`);
          // this.$bus.$emit('updateStudentList');
        } else if (res.actionStatus === -1) { // 执行失败
          timingTask1.stop();
          // Toast(res.globalActionMsg);
          reject(res.globalActionMsg);
        }

        // 统计埋点
        if (signInType === 'sign-in') {
          logSignIn();
        }
      });
    }).catch(() => { // 超时捕获
      // 第一个定时任务，3～10秒内签到，有toast提示
      Toast({
        message: `${students.length}名学员${SIGN_IN_TIP[signInType]}中`,
        duration: 0,
      });
      const timingTask2 = new TimingTask(7000);
      timingTask2.start(() => {
        ajaxFn({
          taskNo,
          kdtId: targetKdtId,
        }).then(res => {
          if (res.actionStatus === 1) { // 执行成功
            timingTask2.stop();
            Toast.clear();
            // Toast(`${SIGN_IN_TIP[signInType]}完成`);
            // this.$bus.$emit('updateStudentList');
            resolve(res);
          } else if (res.actionStatus === -1) { // 执行失败
            timingTask2.stop();
            Toast.clear();
            // Toast(res.globalActionMsg);
            // this.$bus.$emit('updateStudentList');
            reject(res.globalActionMsg);
          }

          // 统计埋点
          if (signInType === 'sign-in') {
            logSignIn();
          }
        });
      }).catch(() => { // 超时捕获
        Toast.clear();
        // this.$bus.$emit('updateStudentList');
        reject();
      });
    });
  });
};
