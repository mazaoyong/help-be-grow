const recommendGift = {
  helpedCount: 3,
  phasedRewardDetails: [
    { helpCount: 9,
      phaseNo: 1,
      rewardName: '1号超级大礼包',
      presentList: [
        { id: 1, name: '礼包1' },
        { id: 2, name: '礼包2' },
        { id: 3, name: '礼包3' },
      ],
      couponList: [
        { id: 4, name: '优惠券1' },
        { id: 5, name: '优惠券2' },
        { id: 6, name: '优惠券3' },
      ],
      bonusPoint: 100,
    },
    { helpCount: 12,
      phaseNo: 2,
      rewardName: '2号超级大礼包',
      couponList: [
        { id: 7, name: '优惠券1' },
        { id: 8, name: '优惠券2' },
        { id: 9, name: '优惠券3' },
      ],
      bonusPoint: 100 },
    { helpCount: 14,
      phaseNo: 3,
      rewardName: '3号超级大礼包',
      presentList: [
        { id: 10, name: '礼包1' },
        { id: 11, name: '礼包2' },
        { id: 12, name: '礼包3' },
      ] },
  ],
  currentPhase: 0,
};

const recommendGoods = [
  {
    img: 'https://img01.yzcdn.cn/upload_files/2020/11/09/FkzxokzJMBKlqxnITaLf5s7eeanS.png',
    title: '经典乐高LEGO课程初级版之经典乐高LEGO课程初级版之',
    price: 99.99,
    goodsId: '123456',
  },
];

export {
  recommendGift,
  recommendGoods,
};
