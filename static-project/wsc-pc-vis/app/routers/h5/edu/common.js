module.exports = [
  ['GET', '/v4/vis/h5/edu/getQrcode.json', 'h5.common.QrcodeController', 'getQrcodeJson'],
  ['GET', '/v4/vis/h5/edu/getWeappQrcode.json', 'h5.common.QrcodeController', 'getCommonWeappCode'],

  [
    // 视频上传token获取
    'post',
    '/v4/vis/h5/edu/commom/material/videoUploadToken.json',
    'common.MaterialCenterController',
    'postVideoUploadTokenJson',
  ],
  [
    // 视频上传确认
    'post',
    '/v4/vis/h5/edu/commom/material/confirmVideoUpload.json',
    'common.MaterialCenterController',
    'postConfirmVideoUploadJson',
  ],
  [
    // 发布视频
    'post',
    '/v4/vis/h5/edu/commom/material/publishVideo.json',
    'common.MaterialCenterController',
    'postPublishVideoJson',
  ],

  [
    // 获取素材分组列表
    'get',
    '/v4/vis/h5/edu/commom/material/getCategoryList.json',
    'common.MaterialCenterController',
    'getCategoryList',
  ],

  [
    // 获取私有文件上传token
    'get',
    '/v4/vis/h5/edu/commom/material/getPrivateFileUploadToken.json',
    'common.MaterialCenterController',
    'getPrivateFileUploadToken',
  ],

  // 获取图片 token
  [
    // 获取私有文件上传token
    'POST',
    '/v4/vis/h5/edu/commom/material/getQiniuAggregateUploadToken.json',
    'common.UploadTokenController',
    'getQiniuAggregateUploadToken',
  ],

  [
    // 获取图片上传授权token
    'post',
    '/v4/vis/h5/edu/commom/material/getUploadToken.json',
    'common.MaterialCenterController',
    'getUploadToken',
  ],
];
