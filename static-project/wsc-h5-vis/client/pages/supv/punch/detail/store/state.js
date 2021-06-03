import Args from '@youzan/utils/url/args';

export default {
  alias: Args.get('alias') || '',
  gciId: Args.get('gciId') || Args.get('punchId') || '',
  taskId: Args.get('taskId') || '',
  diaryId: '',
  shareFansId: Args.get('shareFansId') || Args.get('si') || '',
  shareFansType: Args.get('shareFansType') || Args.get('st') || '',

  // 打卡详情的用户信息
  userInfo: {
    avatarUrl: 'https://img01.yzcdn.cn/public_files/2017/11/09/99e6bdb52bb2ef654383dde3b0324fbe.png?roundPic/radius/!50p',
    nickname: '匿名用户',
  },
  liked: false,
  diary: {},

  likeList: [],
  likeTotal: 0,
  teacherComments: [],
  teacherCommentsTotal: 0,
  stuComments: [],
  stuCommentsTotal: 0,

  taskName: '',
  gciName: '',
};
