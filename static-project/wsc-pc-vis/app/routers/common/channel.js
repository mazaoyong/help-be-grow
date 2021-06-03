module.exports = [
  [
    // 查询小程序码
    'GET',
    '/v4/vis/channel/weappqrcode',
    'common.ChannelsController',
    'wxaGetCodeUnlimit',
  ],
  [
    'GET',
    '/v4/vis/channel/getMpVersion.json',
    'common.ChannelsController',
    'getMpVersionJson',
  ],
  [
    'GET',
    '/v4/vis/channel/getBaiduAppCode.json',
    'common.ChannelsController',
    'getBaiduAppCodeJson',
  ],
];
