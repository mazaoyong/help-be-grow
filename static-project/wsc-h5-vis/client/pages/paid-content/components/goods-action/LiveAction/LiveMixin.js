import { LIVE_ACTION_TYPE } from 'pct/constants';
import { LIVE_TYPE } from 'constants/course/live-type';

export default {
  props: {
    isFocus: Boolean,
    isEnded: Boolean,
    isStarted: Boolean,
  },

  computed: {
    paidState() {
      // liveType = 4 为保利威直播，重构时增加枚举
      if (
        this.liveType === LIVE_TYPE.POLYV_LIVE ||
        this.liveType === LIVE_TYPE.YZ_EDU_LIVE
      ) {
        return LIVE_ACTION_TYPE.PAID_DEFAULT;
      }
      if (this.isEnded) return LIVE_ACTION_TYPE.PAID_ENDED;
      if (this.isStarted) return LIVE_ACTION_TYPE.PAID_DEFAULT;

      if (this.isFocus) {
        return LIVE_ACTION_TYPE.PAID_DEFAULT;
      } else {
        return LIVE_ACTION_TYPE.PAID_UNFOCUS;
      }
    },
    unPaidState() {
      if (
        this.isEnded &&
        this.liveType !== LIVE_TYPE.POLYV_LIVE &&
        this.liveType !== LIVE_TYPE.YZ_EDU_LIVE
      ) {
        return LIVE_ACTION_TYPE.UNPAID_ENDED;
      }
      // 零元
      if (+this.originPrice === 0) return LIVE_ACTION_TYPE.ZERO_BUY;

      return LIVE_ACTION_TYPE.UNPAID_DEFAULT;
    },
  },
};
