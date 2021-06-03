import { REWARDS_TYPE_DEFAULT_DATA } from '../constants';
const model = {
  // 活动名称
  activityName: '',
  // 活动时间
  activityTime: [],
  // 线下课
  courseProduct: {
    courseName: '', // 名称
    alias: '',
    courseSellType: 1, // 售卖方式，按课时：1，按时段：2，按期：3，自定义：0
    price: 0, // spu价格
    picURL: '',
    url: '',
    isRelatedStartCer: false, // 是否关联入学证书
    isRelatedEndCer: false, // 是否关联毕业证书
    rewardNode: [], // 已设置的奖励节点
    activityId: null, // 关联活动id
  },
  // 商家是否有服务号
  // isPoints: false,
  rewardNode: REWARDS_TYPE_DEFAULT_DATA['processing'],
  awardType: 1, // 送优惠券：1，送积分：2，送课程赠品: 3
  // 优惠券列表
  coupon: [],
  // 积分数
  pointNumber: 1,
  // 课程类型
  courseType: 1, // 同一课程：1，不同课程：2，
  // 赠送天数
  givenClassTime: 1,
  // 体验课名称
  trialCourse: {
    courseName: '', // 名称
    alias: '',
    price: 0, // spu价格
    picURL: '',
    url: '',
  },
  // 详情页展示奖励
  awardDisplay: true, // 展示：1，不展示：0
  isStockIndependent: true,

  campusList: [],
  campusType: 0,
};

export default model;
