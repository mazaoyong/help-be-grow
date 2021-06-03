import { get, each } from 'lodash';
import { COURSE_SELL_TYPE } from '@/constants/course/course-sell-type';
import { CERT_TYPE } from '@/constants/course/cert-type';

export default {
  list(state, getters, rootState) {
    const list = [];
    if (getters.certTip) {
      list.push({
        tag: '证书',
        tip: getters.certTip,
      });
    }
    if (rootState.goodsData.rewards && getters.rewardsTip) {
      list.push({
        tag: '奖励',
        tip: getters.rewardsTip,
      });
    }
    // 关联考试提示
    if (getters.examTip) {
      list.push({
        name: 'exam',
        tag: '考试',
        tip: getters.examTip,
        hasMore: true,
      });
    }
    return list;
  },

  certTip(state, getters, rootState) {
    const map = {
      [CERT_TYPE.START]: '购买课程即可领取入学证书',
      [CERT_TYPE.GRADUATE]: '课程结束后即可领取毕业证书',
      [CERT_TYPE.BOTH]: '入学证书、毕业证书等你来领',
    };
    return map[rootState.goodsData.certType];
  },

  rewardsTip(state, getters, rootState) {
    const { pointsName } = rootState.shopConfig;
    const { courseSellType } = rootState.goodsData;
    const hasReward = [0, 0, 0];
    let fullStr = '';
    let rewardStr = [];
    let courseTime = 0;
    let course = [];
    let point = 0;
    let ticket = [];
    rootState.goodsData.rewards.forEach(reward => {
      const rewardNodeType = get(reward, 'rewardConditionDTO.rewardNodeType');
      const awardDTOList = get(reward, 'awardDTOList');
      // 1消课 2入学 3毕业
      if (rewardNodeType === 1) {
        hasReward[0] = 1;
      }
      if (rewardNodeType === 2) {
        hasReward[1] = 1;
      }
      if (rewardNodeType === 3) {
        hasReward[2] = 1;
      }
      each(awardDTOList, award => {
        switch (award.awardType) {
          // 优惠券
          case 1:
            const ticketName = get(award, 'voucherCouponAwardDetailDTO.title');
            ticketName && ticket.push(ticketName);
            break;
          // 同一线下课时长
          case 2:
            courseTime += courseSellType === COURSE_SELL_TYPE.COUNT ? award.awardValue / 100 : award.awardValue;
            break;
          // 线下课赠品
          case 3:
            const courseName = get(award, 'trialCourseProductAwardDetailDTO.title');
            courseName && course.push(courseName);
            break;
          // 积分
          case 4:
            point += award.awardValue;
            break;
        }
      });
    });
    if (courseTime) {
      rewardStr.push(`${courseTime}${courseSellType === COURSE_SELL_TYPE.COUNT ? '课时' : '天有效期'}`);
    }
    if (course.length) {
      rewardStr.push(course.join('、'));
    }
    if (point) {
      rewardStr.push(`${point}${pointsName}`);
    }
    if (ticket.length) {
      rewardStr.push(ticket.join('、'));
    }
    rewardStr = rewardStr.join('、');
    switch (hasReward.join('')) {
      case '010':
        fullStr = `购买课程即可领取${rewardStr}入学奖励`;
        break;
      case '001':
        fullStr = `课程结束后即可领取${rewardStr}毕业奖励`;
        break;
      case '100':
        fullStr = `一边学习一边领取${rewardStr}消课奖励`;
        break;
      case '011':
      case '110':
      case '101':
      case '111':
        fullStr = `${rewardStr}等你来领`;
        break;
      default:
    }
    return fullStr;
  },

  examTip(state, getters, rootState) {
    if (!rootState.goodsData.isOwnAsset &&
      rootState.courseExam && rootState.courseExam.hasExam
    ) {
      return '参与测评，检验学习效果';
    }
    return '';
  },
};
