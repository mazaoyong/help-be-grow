import { ActionTree, Action } from 'vuex';
import {
  getDetail,
} from 'supv/examination/apis';
import { ExamState } from 'supv/examination/store/state';
import { weappRichtextFilter } from '@/common/utils/env';
import { DetailState } from './state';

const miniprogram = window._global.miniprogram || {};
const isWeapp = miniprogram.isWeapp;

interface DetailActions extends ActionTree<DetailState, ExamState> {
  fetchExamDetail: Action<DetailState, ExamState>;
}

const actions: DetailActions = {
  fetchExamDetail({ rootState, commit }) {
    return getDetail({
      examId: rootState.examId,
    })
      .then(res => {
        if (res) {
          const {
            collectSetting,
            examDTO: {
              picture: {
                coverUrl,
              },
              title,
              duration,
              questionCount,
              joinUserAvatars: userAvatars,
              totalScore: score,
              detail,
              status,
              openCourseSettingDetail: hasLimit,
              countdownSeconds: leftSeconds,
              publishStatus,
            },
            userJoinInfo: {
              userExamStatus,
              canJoinExam,
              canJoinExamStudentIds: studentIds,
              canRejoinCount,
              nextRejoinSeconds: reexamLeftSeconds,
              userExamId,
            },
          } = res;

          commit('updateUserExamId', userExamId, { root: true });
          commit('updateCoverUrl', coverUrl);
          commit('updateTitle', title);
          commit('updateDuration', duration);
          commit('updateQuestionCount', questionCount);
          commit('updateUserAvatars', userAvatars);
          commit('updateScore', score / 100);
          commit('updateDetail', isWeapp ? weappRichtextFilter(detail) : detail);
          commit('updateStatus', status);
          commit('updateUserExamStatus', userExamStatus);
          commit('updateCanJoinExam', canJoinExam);
          commit('updateHasLimit', hasLimit);
          commit('updateStudentIds', studentIds);
          commit('updateLeftSeconds', leftSeconds * 1000);
          commit('updatePublishStatus', publishStatus);
          commit('updateCanReexam', !!canRejoinCount);
          commit('updateReexamLeftSeconds', reexamLeftSeconds * 1000);
          commit('updateInfoCollectorSettings', collectSetting);
        } else {
          commit('updateValid', false);
        }

        return res;
      })
      .catch(errMsg => {
        console.log(errMsg);
        commit('updateValid', false);
      });
  },
};

export default actions;
