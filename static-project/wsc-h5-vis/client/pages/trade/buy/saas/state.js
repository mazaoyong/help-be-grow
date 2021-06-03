import { pick } from 'lodash';

const openState = {
  // 购买对象相关
  goodsList({ state }) {
    const { list = [] } = state.goods || {};
    // extra info 视需求再加吧
    return list.map((goods) =>
      pick(goods, [
        'title',
        'imgUrl',
        'alias',
        'num',
        'payPrice',
        'goodsId',
        'skuId',
        'owlType',
      ]));
  },
  // 支付相关
  payment({ state }) {
    const {
      pay = {},
    } = state;
    const {
      realPay = 0,
      orderPromotions: promotions = [],
      itemPay = 0,
    } = pay;
    return {
      goodsPay: itemPay /* 商品金额 */,
      realPay: realPay /* 应付/实付金额，扣减各种优惠后 */,
      promotions /* 优惠 */,
    };
  },
  // 学习相关
  studyInfo({ state }) {
    const { student, infoCollect, appointment, classAddress, classTime } = state;
    return {
      // 学员信息
      student: pick(student, ['chosenId', 'list']),
      // 信息采集
      infoCollect: pick(infoCollect, ['data']),
      // 预约信息
      appointment,
      // 上课地点信息
      classAddress: pick(classAddress, ['chosenId', 'list']),
      // 上课时间信息
      classTime,
    };
  },
};

export { openState };
