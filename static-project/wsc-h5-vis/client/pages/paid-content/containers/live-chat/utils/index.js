import randomString from 'zan-utils/string/makeRandomString';
import queryString from 'zan-utils/url/queryString';
import args from 'zan-utils/url/args';

import get from 'lodash/get';
import * as SafeLink from '@youzan/safe-link';

export const getRandomClient = (uid, num = 5) => {
  return uid + randomString(num) + (+new Date());
};

export const getRandomStr = (num = 7) => {
  return randomString(num);
};

export const reload = () => {
  const url = location.href;

  // 安卓 reload 需要改变 url，不然会有缓存
  const reloadUrl = args.add(url, {
    timestamplive: +new Date(),
  });
  SafeLink.redirect({
    url: reloadUrl,
    kdtId: window._global.kdt_id,
  });
};

export const getGlobalConfig = () => {
  const global = window._global;

  // test
  // global.verify_weixin_openid = 'oTtViszpvsDddNcWv8ykI5CO2oXo';
  // global.verify_weixin_openid = 'oTtVis_t2su0U01AL9Vl_Bk7ZH-s';
  // global.live_user_type = 2;
  // global.live_is_live_room_forbid = true;
  // global.live_live_status = 1;
  // global.live_lector_type = 2;
  // global.live_start_time = '2018-06-05 12:27:00';
  // end test

  global.live_forbidUidList = global.live_forbidUidList || [];

  const localtionSearch = queryString.parse(location.search) || {};

  const liveAlias = get(global, 'live_alias', localtionSearch.alias);
  const lecturerInfo = get(global, 'lecturerInfo') || {};
  const wxUid = liveAlias + (_global.buyer_id || (_global.visBuyer && _global.visBuyer.buyerId) || 0);

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

export const setGlobalConfig = (name, value) => {
  window._global[name] = value;
};

export const isOnlineVoice = (content) => {
  return content && content.search(/(\.amr|\.mp3|\.aac|\.m4a|\.speex)/) > -1;
};

export const linkify = (inputText) => {
  if (!inputText) return '';

  let replacedText = '';
  const TOP_LEVEL_DOMAIN = 'design|museum|travel|aero|arpa|asia|coop|info|jobs|mobi|name|biz|cat|com|edu|gov|int|mil|net|org|pro|tel|xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sk|sl|sm|sn|so|sr|ss|st|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw|dp';

  const REG_URL_STR = '(?:(https?|ftp):\\/\\/)?' + // 匹配协议，  $1
  '(?:(@)?' + // 作为向前查找的hack，   $2
  '(\\d{1,3}(?:\\.\\d{1,3}){3})|' + // 匹配ip，  $3
  '((?:[-a-z_0-9]{1,256}\\.){1,256}(?:' + TOP_LEVEL_DOMAIN + ')\\b)' + // 匹配域，  $4
  ')' + '(:\\d{1,5})?' + // 匹配端口,  $5
  '(\\/[-a-z_0-9@:%+.~&/=()!\'*$]*)?' + // 匹配路径 $6
  '(\\?[-a-z_0-9@:%+.~&/=()!\';{}*?$]*)?' + // 匹配查询参数   $7
  '(\\#[-a-z_0-9@:%+.~&/=()!\';{}*?#^$]*)?'; // 匹配锚点，   $8

  const REG_URL = new RegExp(REG_URL_STR, 'gi');

  replacedText = inputText.replace(REG_URL, function() {
    const match = RegExp['$&'];
    const protocol = /(https?|ftp)/gi;
    if (protocol.test(match)) {
      return '<a href="' + match + '" target="_blank">' + match + '</a>';
    }
    const domainUrl = 'http://' + match;
    return '<a href="' + domainUrl + '" target="_blank">' + match + '</a>';
  });

  return replacedText;
};
