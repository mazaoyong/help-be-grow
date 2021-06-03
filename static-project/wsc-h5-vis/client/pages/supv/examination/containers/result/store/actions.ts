import { ActionTree, Action } from 'vuex';
import { getMpFollowStatus, getMpQrcode } from '@/common-api/utils/index';
import { getResult } from 'supv/examination/apis';
import { ExamState } from 'supv/examination/store/state';
import router from 'supv/examination/router';
import { ExamStatus } from 'supv/examination/types';
import { ResultState } from './state';

interface ResultActions extends ActionTree<ResultState, ExamState> {
  fetchExamResult: Action<ResultState, ExamState>;
}

const actions: ResultActions = {
  fetchExamResult({ rootState, commit }) {
    return getResult({
      examId: rootState.examId,
      userExamId: rootState.userExamId || 0,
    })
      .then(res => {
        if (res) {
          const {
            examTitle = '考试结果',
            displayType = 1,
            examResult: {
              finalScore: studentScore = 0,
              state = 2,
            } = {},
            examUser: {
              name: studentName = '',
            } = {},
            userExam: {
              joinEndTime: completedTime = 0,
            } = {},
            joinInfo: {
              canJoinExam = false,
              canRejoinCount = 0,
              nextRejoinSeconds: reexamLeftSeconds = 0,
              canJoinExamStudentIds: studentIds = [],
            } = {},
            examDTO: {
              publishStatus = 1,
              status = ExamStatus.STARTED,
            } = {},
          } = res;
          // 是否展示答题卡
          // 1 答题后立即展示 2 批阅完成展示 3 不展示
          const showAnswerCard = displayType === 1 ||
            (displayType === 2 && state === 2);

          document.title = examTitle;

          commit('updateStatus', state);
          commit('updateExamStatus', status);
          commit('updateStudentName', studentName);
          commit('updateStudentScore', studentScore / 100);
          commit('updateCompletedTime', completedTime);
          commit('updateShowAnswerCard', showAnswerCard);
          commit('updateCanReexam', !!canRejoinCount);
          commit('updateCanJoinExam', canJoinExam);
          commit('updateReexamLeftSeconds', reexamLeftSeconds * 1000);
          commit('updatePublishStatus', publishStatus);
          commit('updateReexamStudentId', studentIds[0]);
        } else {
          router.push({
            name: 'invalid',
          });
        }
      })
      .catch(() => {
        router.push({
          name: 'invalid',
        });
      });
  },

  fetchMpFollowStatus() {
    return getMpFollowStatus()
      .then((res: any) => {
        if (res) {
          return res.isFollow;
        }
      })
      .catch(() => {
        // Toast('获取公众号关注状态失败');
      });
  },

  fetchQrcodeUrl({ commit }, mpId = 0) {
    getMpQrcode({
      mp_id: mpId,
    })
      .then((res: any) => {
        if (res.qrcodeUrl) {
          commit('updateQrcode', res.qrcodeUrl);
        }
      })
      .catch(() => {
        // Toast('获取公众号二维码失败');
      });
  },
};

export default actions;
