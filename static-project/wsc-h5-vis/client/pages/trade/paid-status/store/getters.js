import get from 'lodash/get';
import { PAY_STATE } from '../constants';

export default {
  // 带边框主按钮
  mainBtn(state) {
    return state.btnList[0];
  },
  // 主按钮下面的按钮
  viceBtnList(state) {
    const { btnList, btnUmpMap } = state;
    // 优先级，按优先级注入活动按钮
    const btnUmpIndex = ['recommend-gift', 'introduction'];
    const viceBtns = btnList.slice(1);
    viceBtns.forEach((btn, btnIndex) => {
      if (btn.businessType === 'ump-replace') {
        for (let i = 0; i < btnUmpIndex.length; i++) {
          const key = btnUmpIndex[i];
          if (btnUmpMap[key]) {
            viceBtns[btnIndex] = { ...btn, ...btnUmpMap[key] };
            break;
          }
        }
      }
    });

    return viceBtns;
  },

  showReward(state) {
    return get(state, 'rewardInfo.payAwardList.length', 0);
  },

  // 如果不展示营销层、广告层和导购层，剩余元素撑满全屏
  isFullMode({
    payState,
    presentInfo,
    joinGroupSetting,
    showRecommend,
  }, { showReward }) {
    return payState === PAY_STATE.PAID &&
      !presentInfo && !showReward && !joinGroupSetting && !showRecommend && !_global.isGuang;
  },
};
