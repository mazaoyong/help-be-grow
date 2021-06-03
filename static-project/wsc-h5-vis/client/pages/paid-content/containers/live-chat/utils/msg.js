import * as utils from './index';
import eventBus from './bus';

const getGlobalConfig = utils.getGlobalConfig;

const globalConfig = getGlobalConfig();
const {
  wxUid,
  avatar,
  nickname,
  kdtId,
  liveId,
  userDesc,
} = globalConfig;

let {
  userType,
} = globalConfig;

let msgCat = 2;
let toMsg = null;
let toMsgID = '';
let msgSite;
let userDescStr = userDesc;

eventBus.$on('user-type', (ev) => {
  if (typeof ev.userType !== 'undefined') {
    userType = ev.userType;
  }
});
eventBus.$on('msg-type', (ev) => {
  console.log('[utils msg] msg-type', ev);
  const replyData = ev.replyData;
  const msgSiteName = ev.msgSite;

  // 消息发出的区域
  const msgSiteNameMap = {
    'talk-area': 1,
    'main-area': 2,
  };
  msgSite = msgSiteNameMap[msgSiteName];

  // 消息类型
  // 1 提问
  // 2 普通
  // 3 讲话回复
  msgCat = ev.isAsk ? 1 : 2;

  if (replyData) {
    toMsg = {
      ...replyData.fromMsg,
    };
    toMsgID = replyData.fromMsg.msgId;

    if (userType === 1) {
      msgCat = 3;
    }
  } else {
    toMsg = null;
    toMsgID = '';
  }

  userDescStr = ev.userDesc;
});

export const newMsg = ({
  msgType = 'text',
  content = '',
  during = 0,
} = {}) => {
  let msgMediaUrl = '';
  let msgContent = '';
  if (msgType === 'text') {
    msgContent = content;
  } else {
    msgMediaUrl = content;
  }
  return {
    fromMsg: {
      wxUid: wxUid, // openid
      msgId: '',
      msgType,
      mediaUrl: msgMediaUrl,
      content: msgContent,
      during,
      avatar,
      nickname,
      clientId: utils.getRandomClient(wxUid),
      userType: userType,
      msgCat,
      msgSite: msgSite || (userType === 1 ? 2 : 1),
      status: 1,
      userDesc: userDescStr,
    },
    toMsg,
    msgId: toMsgID,
    status: 1, // 1正常 2撤回 3删除 4控制
    liveId: liveId,
    kdtId,
    isLoading: true,
    isError: false,
  };
};
