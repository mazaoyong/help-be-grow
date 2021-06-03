import { ActionTree, Action, Commit } from 'vuex';
import { Toast, Dialog } from 'vant';
import {
  getLatestQuestion,
  getPrevQuestion,
  getNextQuestion,
  getQuestion,
  answerQuestion,
  submit,
} from 'supv/examination/apis';
import { QuestionType, AnswerMode, UserExamStatus } from 'supv/examination/types';
import { ExamState } from 'supv/examination/store/state';
import { AnswerState } from './state';
import { QuestionResponse } from 'supv/examination/apis/types';
import router from 'supv/examination/router';
import { handleOptionContent } from 'supv/examination/utils';

interface AnswerActions extends ActionTree<AnswerState, ExamState> {
  fetchLatestQuestion: Action<AnswerState, ExamState>;
  fetchPrevQuestion: Action<AnswerState, ExamState>;
  fetchNextQuestion: Action<AnswerState, ExamState>;
  submit: Action<AnswerState, ExamState>;
  saveAnswer: Action<AnswerState, ExamState>;
  fetchQuestionById: Action<AnswerState, ExamState>;
}

const actions: AnswerActions = {
  fetchLatestQuestion({ rootState, state, commit }) {
    const { examId, mode } = rootState;
    return getLatestQuestion({
      examId: examId,
      visitMode: mode,
    })
      .then((res) => handleQuestionResponse({ state, rootState, commit }, res))
      .catch((errMsg: string | Error) => {
        Toast(errMsg);
        router.replace({
          name: 'detail',
          query: {
            examId: examId + '',
            kdt_id: _global.kdt_id + '',
          },
        });
      });
  },

  fetchPrevQuestion({ state, rootState, commit }) {
    if (!state.currentQuestion) return;

    return getPrevQuestion({
      currentQuestionId: state.currentQuestion!.id as number,
      examId: rootState.examId,
      userExamId: rootState.userExamId,
      visitMode: rootState.mode,
    })
      .then((res) => handleQuestionResponse({ state, rootState, commit }, res))
      .catch((err: any) => console.error(err));
  },

  fetchNextQuestion({ state, rootState, commit }) {
    return getNextQuestion({
      currentQuestionId: state.currentQuestion!.id as number,
      examId: rootState.examId,
      userExamId: rootState.userExamId,
      visitMode: rootState.mode,
    })
      .then((res) => handleQuestionResponse({ state, rootState, commit }, res))
      .catch((err: any) => console.error(err));
  },

  fetchQuestionById({ state, rootState, commit }, questionId: number) {
    return getQuestion({
      currentQuestionId: questionId,
      examId: rootState.examId,
      userExamId: rootState.userExamId,
      visitMode: rootState.mode,
    })
      .then((res) => handleQuestionResponse({ state, rootState, commit }, res))
      .catch((err: any) => console.error(err));
  },

  /**
   * 手动提交
   */
  submit({ rootState, commit }, autoSubmit = false) {
    return submit({
      autoSubmit,
      userExamId: rootState.userExamId,
    })
      .then(res => {
        if (res) {
          const {
            examRemainMillisecond,
            submitSuccess,
          } = res;
          if (submitSuccess) {
            return Promise.resolve('');
          } else {
            if (examRemainMillisecond > 0) {
              commit('updateRemainMS', examRemainMillisecond);
            }
            return Promise.reject();
          }
        } else {
          return Promise.reject();
        }
      })
      .catch(errMsg => {
        console.error(errMsg);
      });
  },

  /**
   * 保存用户答题
   */
  saveAnswer({ state, rootState, commit, dispatch }) {
    if (!state.currentQuestion && state.isSaving) return;
    commit('updateIsSaving', true);

    const {
      currentQuestion = {},
      userAnswer,
    } = state;
    const {
      id: currentQuestionId,
      type,
    } = currentQuestion as any;

    const { examId, userExamId } = rootState;
    const params: any = {
      next: 0,
      currentQuestionId,
      examId,
      userExamId,
    };
    switch (type) {
      case QuestionType.FILL_BLANK:
        params.answerTexts = userAnswer;
        break;
      case QuestionType.JUDGE:
        params.correct = userAnswer;
        break;
      case QuestionType.SUBJECTIVE:
        params.answerTexts = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
        break;
      case QuestionType.SINGLE:
      case QuestionType.MULTIPLE:
        params.chooseOptionIds = userAnswer;
        break;
      default:
    }

    return answerQuestion(params)
      .then(res => {
        if (res) {
          return Promise.resolve(res);
        } else {
          return Promise.reject();
        }
      })
      .catch(errMsg => {
        Toast(errMsg);

        return Promise.reject(errMsg);
      })
      .finally(() => {
        commit('updateIsSaving', false);
        dispatch('fetchAnswerCard', null, { root: true });
      });
  },
};

function handleQuestionResponse(
  store: {
    state: AnswerState;
    rootState: ExamState;
    commit: Commit;
  },
  data: QuestionResponse,
) {
  if (data) {
    const {
      state,
      rootState,
      commit,
    } = store;

    const {
      mode,
      examId,
    } = rootState;
    const {
      started,
    } = state;

    const {
      correct,
      currentQuestionId,
      question,
      answerTexts = [],
      chooseOptionIds = [],
      userExamDTO: {
        remainMillisecond = -1,
        userExamId = 0,
        state: userExamStatus = UserExamStatus.NOT_COMMITED,
      } = {},
      fillCount,
      examTitle,
      serialNo,
      hasPrev,
      hasNext,
      userAnswerReview: {
        correct: userCorrect = false,
        examAnswer: {
          answers = [''],
          analysis: reviewContent = '',
        } = {},
        review: {
          comment: teacherComment = '',
        } = {},
        score: userScore = 0,
        standardAnswer = {},
        userAnswer: {
          fills = [],
        } = {},
        paperState = 1,
      } = {},
    } = data;

    // 用户如果已提交
    if (mode === AnswerMode.ANSWER && userExamStatus === UserExamStatus.COMMITED) {
      return showCommitedDialog(examId, userExamId);
    }

    // 如果未初始化/未开始计时
    if (!started) {
      document.title = examTitle;

      if (mode === AnswerMode.ANSWER) {
        // 设置计时器
        commit('updateRemainMS', remainMillisecond);

        // 设置 userExamId
        commit('updateUserExamId', userExamId, { root: true });
      }
    }

    // 设置是否有上下一题
    commit('updateHasPrev', hasPrev);
    commit('updateHasNext', hasNext);
    // 回填用户回答
    let userAnswer;
    switch (question.type) {
      case QuestionType.JUDGE:
        userAnswer = correct;
        break;
      case QuestionType.SINGLE:
      case QuestionType.MULTIPLE:
        userAnswer = chooseOptionIds;
        break;
      case QuestionType.SUBJECTIVE:
        userAnswer = answerTexts;
        break;
      case QuestionType.FILL_BLANK:
        userAnswer = mode === AnswerMode.REVIEW ? fills : answerTexts;
        break;
      default:
        break;
    }
    commit('updateUserAnswer', userAnswer);
    // 设置参考答案
    // commit('updateReference', getOriginRichText(answers[0]));

    const ricttextId = question.questionId + Date.now();

    // 设置当前题目信息
    const content = handleOptionContent(question.title, ricttextId, {
      addListener: true,
    });
    let options: any[] = [];
    if (question.type === QuestionType.JUDGE ||
      question.type === QuestionType.SINGLE ||
      question.type === QuestionType.MULTIPLE
    ) {
      options = question.type === QuestionType.JUDGE
        ? [
          { content: '<div>对</div>', correct: true },
          { content: '<div>错</div>', correct: false },
        ] : question.options.map((option, index) => ({
          content: handleOptionContent(option.content || '', ricttextId, {
            addStyle: true,
            addListener: true,
          }),
          id: option.optionId,
          no: String.fromCharCode(65 + index),
        }));
    }
    let correctAnswer;
    if (mode === AnswerMode.REVIEW) {
      // 设置批阅状态
      commit('updateReviewing', paperState === 1);

      switch (question.type) {
        case QuestionType.SINGLE:
        case QuestionType.MULTIPLE:
          correctAnswer = standardAnswer!.options;
          break;
        case QuestionType.FILL_BLANK:
        case QuestionType.SUBJECTIVE:
          correctAnswer = standardAnswer!.contents;
          break;
        case QuestionType.JUDGE:
          correctAnswer = standardAnswer!.correct;
          break;
        default:
      }
    }
    const newQuestion = {
      id: currentQuestionId,
      type: question.type,
      no: serialNo + 1,
      score: question.score / 100,
      content,
      options,
      // 根据填空数生成填空
      blankCount: fillCount,

      correct: mode === AnswerMode.REVIEW ? userCorrect : correct,
      correctAnswer,
      userAnswer,
      userScore: userScore / 100,
      reference: handleOptionContent(answers[0], ricttextId, {
        addListener: true,
      }),
      reviewContent: handleOptionContent(reviewContent, ricttextId, {
        addListener: true,
      }),
      teacherComment,
    };
    commit('updateCurrentQuestion', newQuestion);
    commit('updateQuestionList', newQuestion);

    commit('updateStarted', true);
  } else {
    router.replace({
      name: 'detail',
      query: {
        examId: store.rootState.examId + '',
        kdt_id: _global.kdt_id + '',
      },
    });
  }
}

function showCommitedDialog(examId: number, userExamId: number) {
  Dialog.confirm({
    title: '提示',
    message: '试卷已提交',
    confirmButtonText: '我知道了',
    confirmButtonColor: '#00b389',
    showCancelButton: false,
  })
    .then(() => {
      router.replace({
        name: 'result',
        query: {
          examId: examId + '',
          userExamId: userExamId + '',
          kdt_id: _global.kdt_id + '',
        },
      });
    });
}

export default actions;
