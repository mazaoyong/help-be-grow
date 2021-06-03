module.exports = [
  ['GET', '/wscvis/getFooter.json', 'common.FooterController', 'getFooterJson'],

  // 获取用户昵称头像等信息
  ['GET', '/wscvis/getWechatUserInfoByUserId.json', 'common.UserInfoController', 'getWechatUserInfoByUserIdJson'],

  ['GET', '/wscvis/getShopServicePhoneJson.json', 'common.UserInfoController', 'getShopServicePhoneJson'],

  // 查询用户信息 获取教育封装的 visBuyer 对象，也即 global 中的 visBuyer 对象
  ['GET', '/wscvis/getSessionUserInfo.json', 'common.UserInfoController', 'getSessionUserInfo'],

  // 查询用户是否关注公众号，获取公众号二维码
  ['GET', '/wscvis/getMpFollowStatus.json', 'common.MpController', 'getMpFollowStatus'],

  // 查询店铺小程序信息
  ['GET', '/wscvis/getWeappInfo.json', 'common.WeappController', 'getWeappInfo'],

  // 查询店铺自定义积分
  ['GET', '/wscvis/getCustomPointName.json', 'common.ShopBasicInfo', 'getCustomPointName'],

  // 查询店铺元信息
  ['GET', '/wscvis/getShopMetaInfo.json', 'common.ShopBasicInfo', 'getShopMetaInfo'],

  // 落地页
  // 购买注意事项
  ['GET', '/wscvis/edu/attentions-in-purchase', 'edu.DirectController', 'getAttentionsInPurchaseIndex'],

  // 获取图片 token
  ['GET', '/wscvis/getPubImgUploadToken.json', 'common.UploadController', 'getPubImgUploadToken'],

  // 获取音频 token
  ['GET', '/wscvis/getAudiaUploadToken.json', 'common.UploadController', 'getAudiaUploadToken'],
  // 上报性能数据
  ['POST', '/wscvis/log/perf.json', 'common.LogController', 'logPerf'],
  // 根据商品id或者别名查询商品的基本信息
  ['GET', '/wscvis/findSimpleCourseList.json', 'common.ProductCommonController', 'findSimpleCourseListJson'],
  // 根据pct alias 查询goodsid
  ['GET', '/wscvis/product-common/getByAlias.json', 'common.ProductCommonController', 'getByAlias'],

  // 根据 goodsId 获取店铺公众号二维码
  ['GET', '/wscvis/getMpQrcode.json', 'common.QRController', 'getMpQrcodeJson'],

  // 新版获取wsc-h5-components的接口
  ['GET', '/wscvis/common/get-components.json', 'common.H5Component', 'getComponentsJson'],

  // 通用的 client 端日志上报接口
  ['POST', '/wscvis/log/skynet.json', 'common.LogController', 'skynetJson'],

  // 获取图片 token
  [
    // 获取私有文件上传token
    'POST',
    '/wscvis/getQiniuAggregateUploadToken.json',
    'common.UploadController',
    'getQiniuAggregateUploadToken',
  ],

  [
    // 视频上传token获取
    'post',
    '/wscvis/videoUploadToken.json',
    'common.UploadController',
    'postVideoUploadTokenJson',
  ],
  [
    // 视频上传确认
    'post',
    '/wscvis/confirmVideoUpload.json',
    'common.UploadController',
    'postConfirmVideoUploadJson',
  ],
  [
    // 发布视频
    'post',
    '/wscvis/publishVideo.json',
    'common.UploadController',
    'postPublishVideoJson',
  ],

  [
    // 抓取远程地址保存为通用存储七牛公开图片
    'post',
    '/wscvis/fetchPublicImage.json',
    'common.MaterialCenterController',
    'fetchPublicImage',
  ],
  [
    // 获得上传 Token
    'post',
    '/wscvis/getUploadToken.json',
    'common.MaterialCenterController',
    'getUploadToken',
  ],
  ['post', '/wscvis/track/api/leavepage', 'common.LogController', 'leavepageLog'],
  [
    'GET',
    '/wscvis/checkAuthMobile',
    'common.CheckAuthMobileController',
    ['platformAcl', 'appShopConfig', 'simpleLogin', 'getIndexHtml'],
  ],

  // 意见反馈页面
  ['GET', '/wscvis/feedback', 'common.CommonPageController', 'getFeedbackHTML'],
];
