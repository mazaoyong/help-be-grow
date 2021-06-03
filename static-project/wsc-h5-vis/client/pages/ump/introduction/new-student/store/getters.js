import { get } from 'lodash';
import formatDate from '@youzan/utils/date/formatDate';
import { classifyAwards, getAwardTip } from '../../utils';
import { BOOST_STATUS, REWARD_TYPE, GET_REWARD_STATUS } from '../../constants';

export default {
  pageStyle(state) {
    return state.introductionInfo.pageStyle || 1;
  },
  awardDesc(state) {
    return get(state, 'introductionInfo.refereeAward.awardDesc', {});
  },
  timeStr(state) {
    const { introductionInfo = {} } = state;
    return `${formatDate(introductionInfo.startAt, 'YYYY.MM.DD')} - ${formatDate(
      introductionInfo.endAt,
      'YYYY.MM.DD',
    )}`;
  },
  refereeAward(state) {
    const awards = get(state, 'introductionInfo.refereeAward.awards', []);
    return classifyAwards(awards);
  },
  progress(state) {
    const rewardDetail = get(state, 'rewardDetail', {});
    const { collectNum = 10, joinNum = 0, zanStatus } = rewardDetail;
    // 如果进度大于50，调整进度基数，使得进度看起来更快
    const base = 0.7;
    let percent = joinNum / collectNum;
    percent = percent >= 0.5 ? percent * (1 - base) + base : percent;
    percent = percent > 1 ? 1 : percent;
    percent = percent * 100;

    return zanStatus === BOOST_STATUS.BOOSTED ? 100 : percent;
  },
  needBoost(state) {
    const type = get(state, 'reward.type', 1);
    return type === REWARD_TYPE.BOOST;
  },
  newStuAwardDesc(state) {
    const { introductionInfo } = state;
    const awards = get(introductionInfo, 'refereeAward.awards', []);
    return getAwardTip(awards);
  },
  mainBtnType(state) {
    const { buttonInfo, reward } = state;
    const { status } = reward;
    if (status === GET_REWARD_STATUS.HAS_GOT) {
      return '';
    }
    switch (buttonInfo.btnType) {
      case 'share':
      case 'getReward':
      case 'submitInfo':
        return 'large';
      default:
        return '';
    }
  },
};
