import { Action, ActionContext } from 'vuex';
import { Toast } from 'vant';
import { format, isAfter, isBefore, isSameDay } from 'date-fns';
import { get } from 'lodash';
import buildUrl from '@youzan/utils/url/buildUrl';
// import { setShareData, getShareLink } from '@youzan/wxsdk';

import * as SafeLink from '../utils/customSafeLink';
import { IStoreState, initialState, Role } from './state';
import handleCalendarDetail from '../utils/handleCalendarDetail';
import handleTaskDetail from '../utils/handleTaskDetail';
import handleDiaryList, { getCommentData, getFormattedLikeList } from '../utils/handleDiaryList';
import API from '../../apis';

interface IActionList {
  checkBoughtStatus: Record<string, any>;
  checkPunchState: boolean;
  checkDateTaskExist: Date | string | number;
  setChooseDate: { chooseDate: Date | string | number } & Record<string, any>;
  getCalendarList: {
    alias: string;
    taskDate: string;
  };
  handleClickTime: Date | string | number;
  getTaskDetail: {
    taskDate: string;
    alias: string;
  };
  getDiaryList: {
    taskId: number;
    role: Role;
  };
  getCommentList: {
    gciLogId: number;
  };
  postCommentOnDiary: {
    commentUserType: number;
    gciLogId: number;
    comment: string;
  };
  postComment: {
    commentUserType: number;
    gciLogId: number;
    comment: string;
    commentId: string;
  };
  getLikeList: {
    gciId: number;
    logId: number;
    page: number;
    size: number;
  };
  postLike: { gciId: number; gciLogId: number; status: boolean };
}

export type ActionType = Record<keyof IActionList, Action<IStoreState, IStoreState>>;
type FetchType<Params> = (params: Params) => Promise<any>;

const actions: ActionType = {
  // 检测购买状态，会将参数信息向下透传
  async checkBoughtStatus({ state }, payload: IActionList['checkBoughtStatus']) {
    const { bought } = state;
    return bought ? Promise.resolve(payload || {}) : Promise.reject();
  },

  // 检测打卡状态（是否打卡完成），会将参数信息向下透传
  async checkPunchState({ state }) {
    return get(state, 'task.config.isCompleted', false);
  },

  // 手动设置时间，用于在初始化的时候依据参数初始化打卡状态
  async setChooseDate({ commit }, payload: IActionList['setChooseDate']) {
    const { chooseDate, ...params } = payload;
    if (chooseDate) {
      await commit('SET_CALENDAR', { chooseDate });
    }
    return Promise.resolve(params);
  },

  // 检查日期是否落在打卡区间内
  async checkDateTaskExist({ state, commit }, payload: IActionList['checkDateTaskExist']) {
    const { calendar } = state;
    const currentDate = payload || calendar.chooseDate || new Date();
    if (
      (calendar.endDate && isAfter(currentDate, calendar.endDate)) ||
      (calendar.startDate && isBefore(currentDate, calendar.startDate))
    ) {
      Toast('该日期不在打卡日期范围内');
      return Promise.reject();
    } else if (isAfter(currentDate, new Date())) {
      Toast('此日期打卡任务还未开始');
      commit('SET_TASK', { task: { hasTask: false } });
      return Promise.reject();
    }
    return Promise.resolve();
  },

  // ⚠️重置打卡日历内容，然后在发起请求重新渲染
  async handleClickTime({ commit, state, dispatch }, chooseDate: IActionList['handleClickTime']) {
    // 获取上个state的chooseDate
    const prevChooseDate = state.calendar.chooseDate;
    const allowStudentView = state.allowStudentView;

    const formattedTime = format(chooseDate, 'YYYY-MM-DD');
    await commit('SET_CALENDAR', {
      hasInit: true,
      chooseDate: formattedTime,
    });

    if (prevChooseDate && !isSameDay(prevChooseDate, chooseDate)) {
      // 初始化内容
      await commit('SET_TASK', initialState.task);
      await commit('SET_MY_DIARY', initialState.myDiary);
      await commit('SET_DIARY_LIST', initialState.diaryList);
      await commit('SET_PAGE_INFO', initialState.pageInfo);

      // 更新任务详情
      await dispatch('getTaskDetail', { taskDate: formattedTime });
      if (!allowStudentView) {
        if (!(await dispatch('checkPunchState'))) {
          return;
        }
      }

      // 获取打卡日历列表
      const config = state.task.config;
      await dispatch('getDiaryList', config);
    }
  },

  async getCalendarList({ commit, dispatch }, payload: IActionList['getCalendarList']) {
    const { alias } = payload;
    await commit('SET_ALIAS', alias);

    const getCalendarDetail: FetchType<IActionList['getCalendarList']> = API.getCalendarDetail;
    await getCalendarDetail(payload)
      // 设置购买信息
      .then(handleCalendarDetail.handleBoughtStatus(commit))
      // 设置学员是否允许未打卡查看
      .then(handleCalendarDetail.handleViewStatus(commit))
      // 设置学员是否允许编辑的权限
      .then(handleCalendarDetail.handleEditStatus(commit))
      // 设置日历信息
      .then(handleCalendarDetail.handleCalendarData(commit))
      // 设置用户信息
      .then(handleCalendarDetail.handleUserInfo(commit))
      .catch((err: any) => {
        Toast(err || '网络错误');
        if (err === '未加入群打卡') {
          const kdtId = _global.kdt_id;
          setTimeout(() => {
            SafeLink.redirect({
              url: buildUrl(`/wscvis/supv/punch/introduction?kdt_id=${kdtId}&alias=${alias}`, 'h5', kdtId),
              kdtId: kdtId,
            });
          }, 3000);
        }
      });

    // 检查当前时间是否落在打卡区间
    await dispatch('checkDateTaskExist');
  },

  async getTaskDetail({ commit, dispatch, state }, payload: IActionList['getTaskDetail']) {
    // 检查当前时间是否落在打卡区间
    await dispatch('checkDateTaskExist', payload.taskDate);

    const { alias } = state;
    const getTaskDetailMethod: FetchType<IActionList['getTaskDetail']> = API.getTaskDetail;
    await getTaskDetailMethod(Object.assign({ alias }, payload))
      // 设置按钮文案以及配色等信息
      .then(handleTaskDetail.handleButtonSetting(commit))
      // 设置我的打卡信息
      .then(handleTaskDetail.handleMyDiaryData(commit))
      // 设置打卡任务信息，任务id和打卡是否完成等
      .then(handleTaskDetail.handleTaskConfig(commit))
      // 设置打卡内容信息
      .then(handleTaskDetail.handleTaskContent(commit))
      // 根据内容信息预渲染内容并判断是否需要折叠
      .then(handleTaskDetail.handleTaskContentCollapse(commit))
      .catch(() => {
        Toast.fail('获取打卡任务出错，请重试');
      });
  },

  async getDiaryList({ commit, state }, payload: IActionList['getDiaryList']) {
    const { diaryList, pageInfo, fetchDiary } = state;
    const { total = -1, page, prePage } = pageInfo;

    const isSamePage = prePage === page;
    const isValidReq = Boolean(payload.taskId);
    if (isSamePage || !isValidReq || fetchDiary) {
      return undefined;
    }

    commit('SET_FETCH_DIARY', true);

    if (total === -1 || diaryList.length < total) {
      const getDiaryListMethod: FetchType<IActionList['getDiaryList']> = API.getDiaryList;

      const alias = state.alias;
      const role = state.user.role;
      const defaultQuery = { alias, role, ...pageInfo, ...state.task.config };
      const query = Object.assign({}, payload, defaultQuery);

      await getDiaryListMethod(query)
        .then(handleDiaryList.increasePage(commit))
        .then(handleDiaryList.dataAdaptor())
        .then((res) => {
          if (res === undefined) {
            return handleDiaryList.resetDiaryList(commit)();
          } else {
            const method = page > 1 ? handleDiaryList.updateDiaryList(commit) : handleDiaryList.setDiaryList(commit);
            return method(res);
          }
        })
        .catch((errMsg: string) => Toast(errMsg));

      await commit('SET_FETCH_DIARY', false);
      return undefined;
    } else {
      return undefined;
    }
  },

  /**
   * 评论点赞相关的actions
   */

  getCommentList({ state }, payload: { gciLogId: number }) {
    const getTeacherComment: FetchType<IActionList['getCommentList']> = API.getTeacherComments;
    const getStudentComment: FetchType<IActionList['getCommentList']> = API.getStudentsComments;

    const taskId = get(state, 'task.config.taskId');
    const query = {
      gciLogId: payload.gciLogId,
      taskId,
      page: 1, // 固定分页和单页数据量，因为只展示8条
      size: 10,
    };

    return Promise.all([getTeacherComment(query), getStudentComment(query)]).then(
      ([teacherCommentRes, studentCommentRes]) => {
        const formattedData = getCommentData({
          stuComments: studentCommentRes,
          teacherComments: teacherCommentRes,
        });
        return formattedData;
      },
    );
  },

  async getLikeList(_ctx, payload: { gciId: number; gciLogId: number }) {
    let page = 1;
    const LIKE_CHUNK_SIZE = 20;
    const getLikeAPI: FetchType<IActionList['getLikeList']> = API.getLikeList;
    const query: IActionList['getLikeList'] = {
      gciId: payload.gciId,
      logId: payload.gciLogId,
      size: LIKE_CHUNK_SIZE,
      page,
    };

    try {
      let likeList: any[] = [];
      const { content, total } = await getLikeAPI(query);
      if (total > 0) {
        likeList = likeList.concat(content);

        if (likeList.length < total) {
          const chunkSize = Math.ceil(total / LIKE_CHUNK_SIZE) - 1;
          const chunkList = new Array(chunkSize).fill(0).map(() => {
            page += 1;
            const currentQuery = Object.assign({}, query, { page });
            return getLikeAPI(currentQuery);
          });

          const fullLikeList = await Promise.all(chunkList)
            .then((resList: any[]) => {
              let temp: any[] = [];
              resList.forEach((res) => {
                const { content: chunkContent } = res;
                temp = temp.concat(chunkContent);
              });
              return temp;
            })
            .catch((err: Error) => Promise.reject(err));

          likeList = likeList.concat(fullLikeList);
        }
      }

      return getFormattedLikeList(total > 0, likeList);
    } catch (err) {
      Toast(err.message);
      return Promise.reject();
    }
  },

  postCommentOnDiary(ctx, { diaryId, content }) {
    const postCommentOnDiary: FetchType<IActionList['postCommentOnDiary']> = API.postCommentOnDiary;
    postCommentOnDiary({
      commentUserType: 1,
      comment: content,
      gciLogId: diaryId,
    })
      .then((res: any) => {
        if (res) partialUpdateDiaryList(diaryId, ctx);
        else Toast('评论失败');
      })
      .catch((errMsg: string) => Toast(errMsg));
  },

  postComment(ctx, { diaryId, content, commentId = '' }) {
    const postComment: FetchType<IActionList['postComment']> = API.postComment;
    postComment({
      commentUserType: 1,
      comment: content,
      gciLogId: diaryId,
      commentId,
    })
      .then((res: any) => {
        if (res) partialUpdateDiaryList(diaryId, ctx);
        else Toast('评论失败');
      })
      .catch((errMsg: string) => Toast(errMsg));
  },

  /**
   * 点赞相关的actions
   */

  postLike(ctx, payload: IActionList['postLike']) {
    const { gciId, gciLogId, status = true } = payload;
    const postLikeMethod: FetchType<{ gciLogId: number }> = status ? API.postLike : API.postCancelLike;

    postLikeMethod({ gciLogId }).then((res) => {
      if (res) partialUpdateLikeList(gciId, gciLogId, status, ctx);
      else Toast(status ? '' : '取消' + '点赞失败');
    });
  },
};

// 局部更新comments
function partialUpdateDiaryList(diaryId: number, ctx: ActionContext<IStoreState, IStoreState>) {
  const { commit, dispatch } = ctx;
  const { index, isMyDiary } = findCurrentDiary(diaryId, ctx);
  dispatch('getCommentList', { gciLogId: diaryId })
    .then(({ commentList, commentNumber }) => {
      commit('SET_SPECIFIC_COMMENT_LIST', {
        isMyDiary,
        commentList,
        index,
        commentNumber,
      });
    })
    .catch((errMsg: string) => Toast(errMsg));
}

// 局部更新点赞数量
function partialUpdateLikeList(
  gciId: number,
  diaryId: number,
  status: boolean,
  ctx: ActionContext<IStoreState, IStoreState>,
) {
  const { commit, dispatch } = ctx;
  const { index, isMyDiary } = findCurrentDiary(diaryId, ctx);
  dispatch('getLikeList', { gciId, gciLogId: diaryId }).then((like: any[]) => {
    commit('SET_SPECIFIC_LIKE_LIST', {
      isMyDiary,
      likeList: like,
      index,
      hasLike: status,
    });
  });
}

function findCurrentDiary(
  diaryId: number,
  ctx: ActionContext<IStoreState, IStoreState>,
): { index: number; isMyDiary: boolean } {
  let index = -1;
  const { state } = ctx;
  const { diaryList, myDiary } = state;
  const isMyDiary = myDiary.id === diaryId;
  if (!isMyDiary && diaryList.length > 0) {
    index = diaryList.findIndex((diary) => diary.id === diaryId);
  }
  return { index, isMyDiary };
}

export default actions;
