import args from '@youzan/utils/url/args';
import { FROM_PAGE_TYPE } from '../constants';
import { redirect } from '@/common/utils/custom-safe-link';

export default {
  state: {
    fromPage: args.get('fromPage'),
    alias: args.get('alias'),
  },
  actions: {
    goProfitDetail({ state }) {
      redirect({
        url: '/wscvis/ump/referral-invite/profit',
        query: { alias: state.alias, fromPage: state.fromPage },
      });
    },
  },
  mutations: {
  },
  getters: {
    isCourseEntry: state => {
      return state.fromPage === FROM_PAGE_TYPE.COURSE;
    },
    isUserCenterEntry: state => {
      return state.fromPage === FROM_PAGE_TYPE.USER_CENTRT;
    },
  },
};
