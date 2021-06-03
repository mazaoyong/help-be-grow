import { Toast } from 'vant';
import openStudentStatus from '../../../student-stauts';
import openDialog from './single-dialog';
import { CHECK_TYPE, CHECK_NAME, SIGN_IN_TIP, STUDENT_CHECK_CODE } from '../../contants';
import { getBatchSignInResult, getSignInResult, businessBatchSignInV2 } from '../../apis';
import getActionResult from './get-action-result';

const dubbleCheck = (lessonNo, students, type, kdtId, signInAllStudents = false) => {
  return new Promise((resolve, reject) => {
    const batchStudent = students.length > 1 || signInAllStudents;

    businessBatchSignInV2({
      signInType: CHECK_TYPE[type],
      studentLessonNos: students.map(o => o.studentLessonNo),
      kdtId,
      signInAllStudents,
      lessonNo,
    })
      .then(res => {
        const taskNo = res;
        if (batchStudent) {
          if (students.length > 1) {
            Toast(`${students.length}名学员${type !== 'sign-in' ? '标记' : ''}${CHECK_NAME[type]}中...`);
          }

          // 调批量签到接口
          getActionResult(taskNo, type, kdtId, getBatchSignInResult)
            .then(res => {
              const { batchSignInResult } = res || {};
              const { failedNum, successNum, studentErrorDTOS = [] } = batchSignInResult || {};

              if (failedNum) {
                const summaryTitle = `${successNum} 名学员已${CHECK_NAME[type]}完成，${failedNum} 名学员失败。`;
                const detailTitle = `以下 ${failedNum} 名学员${CHECK_NAME[type]}失败`;
                const detailList = studentErrorDTOS.map(o => {
                  return {
                    name: o.studentName,
                    reason: o.msg,
                    extraReason: o.extMsg,
                  };
                });
                openStudentStatus({
                  props: {
                    summaryTitle,
                    detailTitle,
                    detailList,
                  },
                })
                  .then(() => {
                    // 批量学员状态点击确定
                    resolve({ success: true });
                  });
              } else {
                resolve({ success: true });
                setTimeout(() => {
                  Toast(`${SIGN_IN_TIP[type]}完成`);
                }, 0);
              }
            })
            .catch((err) => {
              resolve({ success: false });
              setTimeout(() => {
                err && Toast(err);
              }, 0);
            });
        } else {
          getActionResult(taskNo, type, kdtId, getSignInResult, students)
            .then(res => {
              if (res) {
                const { signInResult } = res || {};
                if (signInResult.checkCode === STUDENT_CHECK_CODE.PASS) {
                  resolve({ success: true });
                  setTimeout(() => {
                    Toast(`${SIGN_IN_TIP[type]}完成`);
                  }, 0);
                } else if (signInResult.checkCode === STUDENT_CHECK_CODE.OTHER) {
                  setTimeout(() => {
                    Toast(signInResult.message);
                  }, 0);
                  resolve({ success: false });
                } else {
                  openDialog({
                    props: {
                      info: signInResult,
                      students,
                      kdtId,
                    },
                    on: {
                      finish: () => {
                        // 单个签到逻辑
                        // 弹框 + 取消冻结
                        resolve({ success: false });
                      },
                    },
                  });
                }
              }
            })
            .catch(err => {
              resolve({ success: false });
              setTimeout(() => {
                err && Toast(err);
              }, 0);
            });
        }
      })
      .catch(err => {
        resolve({ success: false });
        setTimeout(() => {
          Toast(err);
        }, 0);
      });
  });
};

export default dubbleCheck;
