import get from 'lodash/get';
import randomString from 'zan-utils/string/makeRandomString';
import queryString from 'zan-utils/url/queryString';

const getGlobalConfig = () => {
  const global = window._global;

  global.live_forbidUidList = global.live_forbidUidList || [];

  const localtionSearch = queryString.parse(location.search) || {};

  const lecturerInfo = get(global, 'lecturerInfo') || {};
  const wxUid = localtionSearch.alias + (_global.buyer_id || (_global.visBuyer && _global.visBuyer.buyerId) || 0);

  return {
    wxUid,
    // wxUid: global.verify_weixin_openid,
    socketToken: global.carmen_token,
    userType: global.live_user_type,
    avatar: lecturerInfo.wxAvatar || get(global, 'youzan_fans_picture', '') || '//img01.yzcdn.cn/public_files/2018/04/24/defaultAvatar.png',
    nickname: lecturerInfo.wxNickname || get(global, 'youzan_fans_nickname', ''),
    kdtId: global.kdt_id,
    liveId: global.live_id,
    isForbid: global.live_is_forbid,
    isLiveRoomForbid: global.live_is_live_room_forbid,
    liveStatus: global.live_live_status,
    lecturerType: global.live_lector_type,
    liveForbidUidList: global.live_forbidUidList,
    liveOnLineNum: global.live_online_num || 0,
    alias: localtionSearch.alias,
    title: global.live_title,
    userDesc: global.live_user_desc,
    summary: global.live_summary,
    cover: global.live_cover,
    startTime: global.live_start_time,
    lecturerInfo: global.lecturerInfo,
  };
};

const globalConfig = getGlobalConfig();

const {
  wxUid,
  avatar,
  nickname,
  kdtId,
  liveId,
  userType,
  userDesc,
} = globalConfig;

let msgCat = 2;
let toMsg = null;
let toMsgID = '';

const getRandomClient = (uid, num = 5) => {
  return uid + randomString(num) + (+new Date());
};

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
      clientId: getRandomClient(wxUid),
      userType,
      msgCat,
      msgSite: userType === 1 ? 2 : 1,
      status: 1,
      userDesc,
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
