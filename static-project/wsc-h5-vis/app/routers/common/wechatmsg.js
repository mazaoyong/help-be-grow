module.exports = [
  // 查询是否关注公众号 && 能否发送公众号消息
  ['GET', '/wscvis/edu/push/isMpTemplateMsgAvailable.json', 'common.WechatMsgController', 'isMpTemplateMsgAvailable'],
  // 根据scene获取一次性订阅消息模版ids
  ['GET', '/wscvis/edu/push/getTemplate.json', 'common.WechatMsgController', 'getTemplate'],
  // 消息中心回调
  ['POST', '/wscvis/edu/push/subscriptionCallback.json', 'common.WechatMsgController', 'subscriptionCallback'],
  // V2包含templateName（二期好友助力使用）
  ['GET', '/wscvis/edu/push/getTemplateV2.json', 'common.WechatMsgController', 'getTemplateV2'],
  // 二期一次性订阅消息结合下面保存配置使用
  ['GET', '/wscvis/edu/push/shouldPullUpMsgDialog.json', 'common.WechatMsgController', 'shouldPullUpMsgDialog'],
  ['POST', '/wscvis/edu/push/saveMsgConfig.json', 'common.WechatMsgController', 'saveMsgConfig'],
];
