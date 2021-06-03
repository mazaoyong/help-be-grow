// @todo Visible 换成 visiblity

import { MutationTree } from 'vuex';
import { IInstanceInfo, ITemplateInfo } from '../types/activity';
import { ICourseItem } from '../types/course';

import { IState } from '../types/store';
import { IBoostUser } from '../types/user';

const mutations: MutationTree<IState> = {
  setAppIsReady(state, isReady: boolean) {
    state.appIsReady = isReady;
  },

  setPosterUrl(state, url:string) {
    state.posterUrl = url;
  },

  setSource(state, source:string) {
    state.source = source;
  },

  setIsPopupGuideVisible(state, visible: boolean) {
    state.isPopupGuideVisible = visible;
  },

  setCoursesPopupVisible(state, visible: boolean) {
    state.isCoursesPopupVisible = visible;
  },

  setIsFriendsPopupVisible(state, visible: boolean) {
    state.isPopupFriendsVisible = visible;
  },

  setIsPopupConfirmVisible(state, visible: boolean) {
    state.isPopupConfirmVisible = visible;
  },

  setPopupShareVisible(state, visible: boolean) {
    state.isPopupShareVisible = visible;
  },

  setFromInstanceId(state, id: string) {
    state.fromInstanceId = id;
  },

  setBoostPopupVisible(state, visible: boolean) {
    state.isBoostPopupVisible = visible;
  },

  setBoostFriends(state, boostFriends: IBoostUser[]) {
    state.boostFriends = boostFriends;
  },

  setBoostFriendsCount(state, boostFriendsCount) {
    state.boostFriendsCount = boostFriendsCount;
  },

  setBoostInfo(state, boostInfo) {
    state.boostInfo = boostInfo;
  },

  setTemplateInfo(state, templateInfo: ITemplateInfo) {
    state.templateInfo = templateInfo;
  },

  setInstanceInfo(state, instanceInfo: IInstanceInfo) {
    state.instanceInfo = instanceInfo;
  },

  setHasInstance(state, hasInstance: boolean) {
    state.hasInstance = hasInstance;
  },

  setCourses(state, courses: ICourseItem[]) {
    state.courses = courses;
  },
  setCoursesCount(state, count: number) {
    state.coursesCount = count;
  },

  setTempCourseAlias(state, alias:string) {
    state.tempCourseAlias = alias;
  },
};

export default mutations;
