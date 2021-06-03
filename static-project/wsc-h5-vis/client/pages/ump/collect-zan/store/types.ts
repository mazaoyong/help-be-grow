import {
  MutationTree,
  Mutation,
  GetterTree,
  Getter,
  ActionTree,
  Action,
} from 'vuex';
import {
  IZanDetail,
} from 'definitions/api/owl/ump/CollectZanFacade/getZanSetDetail';

export enum IZanStatus {
  PROMOTION_END,
  COURSE_INVALID,
  PROCESSING,
  COMPLETED,
}

export interface IZanState {
  alias: string;
  zanAlias: string;
  userInfo: {
    username: string;
    avatar: string;
  }
  shopInfo: any;
  evnInfo: any;

  inited: boolean;
  zanDetail: IZanDetail;
  goodsData: any;
  qrcodeUrl: string;
  posterUrl: string;
  shareCoverUrl: string;
  showShareGuide: boolean;
  showPoster: boolean;
  showHostDialog: boolean;
  showGuestDialog: boolean;
}

export interface IZanMutations extends MutationTree<IZanState> {
  updateInited: Mutation<IZanState>;
  updateZanDetail: Mutation<IZanState>;
  updateGoodsData: Mutation<IZanState>;
  updateQrcodeUrl: Mutation<IZanState>;
  updatePosterUrl: Mutation<IZanState>;
  updateShareCoverUrl: Mutation<IZanState>;
}

export interface IZanGetters extends GetterTree<IZanState, IZanState> {
  zanStatus: Getter<IZanState, IZanState>;
  isBuilder: Getter<IZanState, IZanState>;
  couponText: Getter<IZanState, IZanState>;
  // totalCount: Getter<IZanState, IZanState>;
  remainCount: Getter<IZanState, IZanState>;
  // currentCount: Getter<IZanState, IZanState>;
  // courseInfo: Getter<IZanState, IZanState>;
  isCourseReward: Getter<IZanState, IZanState>;
  isCouponReward: Getter<IZanState, IZanState>;
  countDownTime: Getter<IZanState, IZanState>;
  recordList: Getter<IZanState, IZanState>;
  progressTipText: Getter<IZanState, IZanState>;
  progressPercent: Getter<IZanState, IZanState>;
  mainAction: Getter<IZanState, IZanState>;
  viceAction: Getter<IZanState, IZanState>;
  actionTipText: Getter<IZanState, IZanState>;
  rules: Getter<IZanState, IZanState>;
}

export interface IZanActions extends ActionTree<IZanState, IZanState> {
  initState: Action<IZanState, IZanState>;
  getSharePoster: Action<IZanState, IZanState>;
  inviteFriend: Action<IZanState, IZanState>;
  supportFriend: Action<IZanState, IZanState>;
  createZan: Action<IZanState, IZanState>;
  openMpPopup: Action<IZanState, IZanState>;
  toHome: Action<IZanState, IZanState>;
  receiveReward: Action<IZanState, IZanState>;
  toCouponList: Action<IZanState, IZanState>;
  toCourse: Action<IZanState, IZanState>;
}
