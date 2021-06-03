import Args from '@youzan/utils/url/args';

const { visBuyer, mp_account: mpAccount = {}, miniprogram = {} } = window._global;

export default {
  // 同步pc端新成员更多推荐商品配置，0不展示，1展示
  showRecommendGoods: 0,
  hasMp: mpAccount.id,
  isFollowMp: false,

  alias: Args.get('alias'),
  introducerUserId: Args.get('introducerUserId'),
  refereeUserId: Args.get('refereeUserId'),
  currentUserId: visBuyer.buyerId,
  from: Args.get('from') || '',

  introductionInfo: {},
  introducer: {},
  reward: {},
  rewardDetail: {},
  count: 0,
  inviteUserInfo: {
    avatar: 'https://img01.yzcdn.cn/public_files/2017/10/23/1321da81aa84d0539b0d5af73fbbf53b.png',
    name: '小伙伴',
  },
  referee: {},
  isShowCollectList: false,

  buttonInfo: {
    btnText: '',
    type: '',
  },
  tipInfo: '',
  gap: 0,

  fetched: false,
  activityError: '',
  isShowGuide: false,

  // 资料项
  infoCollect: {
    data: {},
    setting: [],
  },

  guideUrl: '',
  isShowActivityGuide: false,

  isShowSharePop: false,
  shareUrl: '',

  boostPoster: '',

  shareOptions: [
    {
      icon: 'https://b.yzcdn.cn/public_files/8edae756fd3b3cee8c53552fd2cd35f3.png',
      text: '微信好友',
      type: 'link',
    },
    {
      icon: 'https://b.yzcdn.cn/public_files/282e83b4f29079ace8c16c416867e9fd.png',
      text: '复制链接',
      type: 'copy',
    },
  ],

  isShowShareGuide: false,

  trackParams: {},

  isShowBoost: false,

  helperList: [],

  isWeapp: miniprogram.isWeapp || false,
};
