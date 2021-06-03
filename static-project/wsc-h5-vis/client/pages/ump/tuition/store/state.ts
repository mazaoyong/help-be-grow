import { IInstanceInfo, ITemplateInfo } from '../types/activity';
import { IState } from '../types/store';

const state: IState = {

  source: '',

  userInfo: {
    username: _global.visBuyer.finalUsername,
    avatar: _global.visBuyer.finalAvatar,
  },

  shopInfo: {
    name: _global.shopMetaInfo.shopName,
  },

  hasInstance: false,

  isPopupGuideVisible: false,

  showProgressBlock: false,
  isFriendsBlock: false,

  isBoostPopupVisible: false,
  isCoursesPopupVisible: false,

  isPopupConfirmVisible: false,

  isPopupFriendsVisible: false,

  fromInstanceId: undefined,

  boostFriends: [],
  boostFriendsCount: 0,

  instanceInfo: {} as IInstanceInfo,

  templateInfo: {} as ITemplateInfo,

  isPopupShareVisible: false,

  courses: [],
  coursesCount: 0,

  // ===== temp =====
  tempCourseAlias: '',

  boostInfo: {},

  appIsReady: false,

  posterUrl: '',
};

export default state;
