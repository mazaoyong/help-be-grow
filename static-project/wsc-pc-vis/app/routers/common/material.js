module.exports = [
  [
    // 视频上传token获取
    'post',
    '/v4/vis/commom/material/videoUploadToken.json',
    'common.MaterialCenterController',
    'postVideoUploadTokenJson',
  ],
  [
    // 视频上传确认
    'post',
    '/v4/vis/commom/material/confirmVideoUpload.json',
    'common.MaterialCenterController',
    'postConfirmVideoUploadJson',
  ],
  [
    // 发布视频
    'post',
    '/v4/vis/commom/material/publishVideo.json',
    'common.MaterialCenterController',
    'postPublishVideoJson',
  ],

  [
    // 获取素材分组列表
    'get',
    '/v4/vis/commom/material/getCategoryList.json',
    'common.MaterialCenterController',
    'getCategoryList',
  ],

  [
    // 获取私有文件上传token
    'get',
    '/v4/vis/commom/material/getPrivateFileUploadToken.json',
    'common.MaterialCenterController',
    'getPrivateFileUploadToken',
  ],

  // 获取图片 token
  [
    // 获取私有文件上传token
    'POST',
    '/v4/vis/commom/material/getQiniuAggregateUploadToken.json',
    'common.UploadTokenController',
    'getQiniuAggregateUploadToken',
  ],

  [
    // 获取宽泛限制的七牛公开音频上传必须的授权令牌(定制化能力) 组件内部post请求
    'post',
    '/v4/vis/commom/material/getPublicBroadLimitAudioUploadToken.json',
    'common.MaterialCenterController',
    'getPublicBroadLimitAudioUploadToken',
  ],

  [
    // 查询是否在宽泛限制的七牛公开音频上传白名单，与上一个接口共同使用（定制化接口）
    'get',
    '/v4/vis/commom/material/checkPublicBroadLimitAudioUpload.json',
    'common.MaterialCenterController',
    'checkPublicBroadLimitAudioUpload',
  ],

  [
    // 抓取远程地址保存为通用存储七牛公开图片
    'post',
    '/v4/vis/commom/material/fetchPublicImage.json',
    'common.MaterialCenterController',
    'fetchPublicImage',
  ],

  [
    // 抓取创客贴图片，返回七牛地址
    'POST',
    '/v4/vis/commom/material/fetchCktImage.json',
    'common.QiniuImageWriteController',
    'fetchCktImage',
  ],
  [
    // 创客贴有赞云授权
    'GET',
    '/v4/vis/commom/material/fetchAppSubscribeInfo.json',
    'common.AppSubscribeInfoController',
    'fetchAppSubscribeInfo',
  ],
];
