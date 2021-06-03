<template>
  <div
    class="live-room"
    :style="{
      height: htmlHeight + 'px'
    }"
  >
    <usability-status
      v-model="usabilityStatusDisplay"
    />

    <room-status
      v-if="!usabilityStatusDisplay"
      :num="joinNum"
      :room-status="roomStatus"
      :hide-live-room-num="hideLiveRoomNum"
      :user-type="userType"
    />

    <!-- 群聊直播界面 -->
    <main-area
      ref="main-area"
      :real-msg="receiveSocketMainItem"
      :audio-display="audioDisplay"
      @revoke="revokeChat"
      @delete="deleteChat"
      @reload="reloadChat"
      @audio-play="playAudio"
      @audio-end="endAudio('main', $event)"
      @reply="replyChat('main', $event)"
      @trigger-top-btn="triggerTopBtn"
    />

    <!-- 问题区域 -->
    <question-area
      ref="question-area"
      v-model="questionDisplay"
      :real-msg="receiveSocketQuestionItem"
      @revoke="revokeChat"
      @delete="deleteChat"
      @reload="reloadChat"
      @audio-play="playAudio"
      @audio-end="endAudio"
      @reply="replyChat('question', $event)"
    />

    <!-- 讨论区 -->
    <talk-area
      ref="talk-area"
      v-model="talkDisplay"
      :real-msg="receiveSocketTalkItem"
      :audio-display="audioDisplay"
      @revoke="revokeChat"
      @delete="deleteChat"
      @reload="reloadChat"
      @audio-play="playAudio"
      @audio-end="endAudio('talk', $event)"
      @reply="replyChat('talk', $event)"
    />

    <!-- 侧边栏操作区域 -->
    <side-nav
      :real-msg="receiveSocketCommentsItem"
      :show-top-btn="showTopBtn"
      @trigger-question="triggerQuestion"
      @trigger-talk="triggerTalk"
      @scroll-to-top="scrollToTop"
    />

    <!-- 回复提醒 -->
    <reply-tip
      v-model="replyTipDisplay"
      :item="replyData"
      :style="{
        bottom: replyTipBottom + 'px'
      }"
      @close="closeReplyTip"
    />

    <!-- 底部操作区域 -->
    <controll-footer
      :user-type="userType"
      :is-ask="isAsk"
      :class="[{
        'controll-footer--talk-active': talkDisplay && !operateDisplay
      }]"
      :is-room-forbid="isRoomForbid"
      :is-forbid="isForbid"
      @msg-send="sendMsg"
      @msg-parsed="parseMsg"
      @img-send="sendImg"
      @img-parsed="parseImg"
      @img-error:network="errorImg"
      @audio-send="sendAudio"
      @audio-parsed="parseAudio"
      @audio-error:network="errorAudio"
      @question-mode-changed="changeQuestionMode"
      @trigger-operate="triggerOperate"
      @trigger-talk="triggerTalk"
      @trigger-audio-display="triggerAudioDisplay"
    />

    <!-- 禁言 删除 action -->
    <mute-action
      v-model="muteDisplay"
      :is-muted="isOneForbid"
      :is-lecturer="isOneLecturerDelete"
      @click="handleMute"
    />

    <!-- 设置操作区域 -->
    <operate
      v-model="operateDisplay"
      :type="userType"
      :is-muted="isRoomForbid"
      @invite-friend="inviteFriend"
      @collect-room="collectRoom"
      @trigger-mute="triggerMute"
      @end-room="endRoom"
    />

    <!-- 邀请好友 -->
    <wx-share
      v-model="wxShareDisplay"
      :data="wxShareData"
    />

    <!-- 开始倒计时 -->
    <timer
      v-model="countDown"
      :start-time="remainStartTime"
      @end="countDownEnd"
    />
  </div>
</template>

<script>

import { Toast, Dialog } from 'vant';
import Client from '@youzan/imsdk_core';
import get from 'lodash/get';
import findIndex from 'lodash/findIndex';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import isPlainObject from 'lodash/isPlainObject';
import YZLocalStorage from 'zan-utils/browser/local_storage';
import UA from 'zan-utils/browser/ua_browser';
import { setShareData, ZNB } from '@youzan/wxsdk';
import apis from 'pct/api';

import ChatControll from './blocks/ChatControll.vue';
import SideNav from './blocks/SideNav.vue';
import QuestionArea from './blocks/QuestionArea.vue';
import TalkArea from './blocks/TalkArea.vue';
import MainArea from './blocks/MainArea.vue';
import Operate from './blocks/Operate.vue';

import ReplyTip from '../../components/ReplyTip.vue';
import MuteAction from '../../components/MuteAction.vue';
import WxShare from '../../components/WxShare.vue';
import RoomStatus from '../../components/RoomStatus.vue';
import UsabilityStatus from '../../components/UsabilityStatus.vue';
import TimeCount from '../../components/Timer.vue';

import ImgHandler from '../../utils/imgHandler';
import WxAudio from '../../utils/wxAudio';
import { getGlobalConfig, setGlobalConfig } from '../../utils/index';
import { newMsg } from '../../utils/msg';

import { getPaidContentShareLink } from 'pct/utils/share';
import { redirectToLock } from '../../../../utils/lock';
import bus from '../../utils/bus';

import preventScrollMixin from '../../mixins/prevent-scroll.js';
import mixinVisPage from 'common/mixins/mixin-vis-page';

const {
  wxUid,
  socketToken: carmenToken,
  userType,
  avatar,
  nickname,
  liveId,
  kdtId,
  isLiveRoomForbid,
  liveForbidUidList,
  title = '直播间',
  alias,
  userDesc,
  summary,
  cover,
  liveStatus,
  startTime,
  liveOnLineNum,
} = getGlobalConfig();

const REPLY_TIP_BOTTOM = 163;

let socketClosedBefore = false; // socket 是否断过

console.log('初始化全局参数', {
  avatar,
  nickname,
  userType,
  wxUid,
  carmenToken,
});

export default {
  name: 'live-room',

  config: {
    title: 'this.title',
    hideCopyright: true,
  },

  components: {
    'controll-footer': ChatControll,
    'side-nav': SideNav,
    'question-area': QuestionArea,
    'talk-area': TalkArea,
    'main-area': MainArea,
    'reply-tip': ReplyTip,
    operate: Operate,
    'mute-action': MuteAction,
    'wx-share': WxShare,
    'room-status': RoomStatus,
    'usability-status': UsabilityStatus,
    'timer': TimeCount,
  },

  mixins: [mixinVisPage, preventScrollMixin],

  data() {
    return {
      title: '直播间',
      htmlHeight: 667,
      questionDisplay: false,
      talkDisplay: false,
      replyTipDisplay: false,
      operateDisplay: false,
      muteDisplay: false, // 删除撤回 action
      wxShareDisplay: false,
      audioDisplay: false,
      usabilityStatusDisplay: false,
      client: null,
      userType,
      isOneLecturerDelete: false, // 是否是讲师被点了删除
      userDesc, // 讲师名称
      replyData: null, // 回复的消息
      deleteData: null, // 待删除的消息
      revokeData: null, // 待撤回的消息
      isAsk: false, // 发言是否提问
      receiveSocketItem: null, // 实时 socket 消息
      receiveSocketMainItem: null,
      receiveSocketQuestionItem: null,
      receiveSocketTalkItem: null,
      receiveSocketCommentsItem: null,
      isRoomForbid: isLiveRoomForbid, // 当前房间禁言
      isOneForbid: false, // 是否有人被禁言
      isForbid: liveForbidUidList.indexOf(wxUid) > -1, // 当前学员是否被禁言
      wxShareData: '',
      currReadMsgList: [],
      readMsgObj: {},
      replyTipBottom: 65, // 回复提示的高度 会随着语音弹框变化
      roomStatus: liveStatus, // 直播状态
      joinNum: liveOnLineNum, // 直播在线人数
      countDown: liveStatus === 1, // 进入直播间的倒计时
      remainStartTime: startTime, // 距离开始的倒计时
      socketOpen: false, // socket 链接状况
      hideLiveRoomNum: true, // 直播间人数信息隐藏标识

      showTopBtn: false, // 显示置顶按钮
    };
  },

  params: {
    alias: String,
  },

  watch: {
    replyData(newValue) {
      this.replyTipDisplay = !!newValue;
    },
    receiveSocketItem(newValue) {
      if (newValue.liveStatus === 3) {
        // 直播已结束
        this.roomStatus = 3;
        return false;
      }
      if (newValue.status === 4 && userType === 1) {
        // 消息操作 status 状态4 并且当前用户是讲师
        const forbidJson = newValue.userForbid;
        if (forbidJson.enable === 0) {
          if (forbidJson.wxUid) {
            const liveForbidUidList = getGlobalConfig().liveForbidUidList;
            console.log('更新的 禁言列表', liveForbidUidList);
            setGlobalConfig('live_forbidUidList', [...liveForbidUidList, forbidJson.wxUid]);
          }
        }
      } else if (newValue.status === 4 && userType === 2) {
        // 消息操作 status 状态4 并且当前用户是学员
        const forbidJson = newValue.userForbid;
        if (forbidJson.enable === 0) {
          if (forbidJson.isLiveRoomForbid) {
            this.isRoomForbid = true;
          }

          // 如果禁言是自己
          if (forbidJson.wxUid === wxUid) {
            this.isForbid = true;
          }
        } else {
          if (!forbidJson.isLiveRoomForbid) {
            this.isRoomForbid = false;
          }
        }
      } else if (+newValue.status === 5) { // 在线人数
        this.joinNum = newValue.onLineNum;
      } else if (+newValue.status === 6) {
        // 强制下线
        this.userType = 2;
        this.client.close(false);
        bus.$emit('user-type', {
          userType: this.userType,
        });
        this.isForbid = true;
      } else {
        // 替换讲师名称
        if (newValue.fromMsg.userDesc !== this.userDesc) {
          this.userDesc = newValue.fromMsg.userDesc;
          this.setMsgType();
        }

        // 界面消息渲染
        // 主区 socket 消息
        if (get(newValue, 'fromMsg.userType') === 1) {
          this.receiveSocketMainItem = newValue;
        }

        // 讨论区 socket 消息
        this.receiveSocketTalkItem = newValue;

        // 问题区 socket 消息
        this.receiveSocketQuestionItem = newValue;

        // 弹幕 socket 消息 来自学员并且消息类型为正常
        if (newValue.fromMsg.userType === 2 && newValue.status === 1) {
          this.receiveSocketCommentsItem = newValue;
        }
      }
    },
    socketOpen(newValue) {
      this.usabilityStatusDisplay = !newValue;
    },
  },

  beforeRouteEnter(to, from, next) {
    // 修改讲师信息后，需要刷新重新获取window._global数据
    if (from.name === 'LecturerEdit') {
      location.reload();
    }
    if (!UA.isMobile() || navigator.userAgent.indexOf('windowswechat') > -1) {
      next({ name: 'LiveDetail', query: { alias: to.query.alias } });
    }
    next();
  },

  created() {
    // 直播间人数信息隐藏判断
    const liveVisibilityConfigs = get(window._global, 'live_visibility_configs');
    if (liveVisibilityConfigs && Array.isArray(liveVisibilityConfigs)) {
      this.setHideLiveRoomNum(liveVisibilityConfigs);
    } else {
      this.hideLiveRoomNum = false;
    }
  },

  destroyed() {
    this.client = null;
  },

  mounted() {
    this.htmlHeight = window.document.documentElement.getBoundingClientRect().height;

    ZNB.getEnv().then(env => {
      if (env.platform === 'swan') {
        Toast('请在微信中使用直播功能');
      } else {
        // 风控锁
        apis.getLiveDetail({
          alias: this.$route.query.alias,
        }).then(data => {
          if (data.isLock) {
            redirectToLock(document.title);
            return;
          }
          // 添加进入页面埋点
          // 没设logId，也没有配config.log 会自动调getGoodsId接口
          if (data.goodsId) {
            this.$setLogId(data.goodsId);
          }
          this.$log('enterpage', { alias: data.alias });

          this.init();
        }).catch(() => {
          this.init();
        });
      }
    }).catch(() => {
      Toast('获取环境失败，请重试');
    });
  },
  methods: {
    // 获取存储在本地的已读消息
    getMsgLocalstorage() {
      const json = YZLocalStorage.getItem('yz_live_chat_read_list') || '{}';
      this.readMsgObj = JSON.parse(json);
    },
    wsInit() {
      let wsUrl = 'wss://im-mercury-ws.youzan.com';
      const runMode = get(window, '_global.run_mode');
      if (runMode === 'qatest') {
        wsUrl = 'wss://mercury-ws-qa.qima-inc.com';
      } else if (runMode === 'pre' || runMode === 'dev') {
        wsUrl = 'wss://mercury-ws.qima-inc.com';
      }
      const userId = String(wxUid);
      // socket 初始化
      this.client = new Client(
        {
          token: carmenToken,
          endpoint: 'wap',
          userId,
          role: 'group',
        },
        {
          url: wsUrl,
          beatInterval: 8000,
          // 其他设置
        },
      );

      this.client.connect();
      this.client.on('receiveMessage', (json) => {
        console.log('socket 消息接收', json);
        let item;
        try {
          item = JSON.parse(json.content);
        } catch (error) {
        }
        if (isPlainObject(item)) {
          this.receiveSocketItem = item;
        }
      });
      this.client.on('authFail', () => {
        Toast('登录失败，请尝试刷新页面');
      });
      this.client.on('authSuccess', () => {
        console.log('authSuccess');
        this.socketOpen = true;
      });
      this.client.on('passivityLogout', () => {
        Toast('被强制下线，请尝试刷新页面');
      });
      this.client.on('close', () => {
        console.log('socket 断开');
        socketClosedBefore = true;
        this.socketOpen = false;
        Toast('直播已断开，正在重新连接');
      });
      this.client.on('error', () => {
        console.log('socket 断开');
        this.socketOpen = false;
        Toast('直播已断开，正在重新连接');
      });
      this.client.on('open', () => {
        console.info('[Index] socket 连接成功');
        this.socketOpen = true;
        socketClosedBefore && bus.$emit('socket-open');
      });
    },

    init() {
      this.title = title;

      this.wsInit();

      this.getMsgLocalstorage();
      setShareData({
        notShare: false,
        desc: summary,
        // eslint-disable-next-line max-len
        link: getPaidContentShareLink(`${location.origin}${location.pathname}${location.search}#/livedetail?alias=${alias}`, {
          name: 'livedetail',
          query: {
            alias: alias,
          },
        }),
        title,
        cover: cover,
      });

      this.htmlHeight = window.document.documentElement.getBoundingClientRect().height;
    },

    // 直播间信息隐藏逻辑判断
    setHideLiveRoomNum(liveConfigs) {
      if (liveConfigs.length > 0) {
        for (let i = 0; i < liveConfigs.length; i++) {
          if (liveConfigs[i].itemType === 4 && liveConfigs[i].field === 'on_line_num') {
            if (liveConfigs[i].showType === 3 && liveConfigs[i].partShowType === 1) {
              this.hideLiveRoomNum = true;
            } else {
              this.hideLiveRoomNum = false;
            }
          }
        }
      } else {
        this.hideLiveRoomNum = false;
      }
    },

    /**
     * 操作消息列表条目的反馈
     */
    revokeChat(item) {
      console.log('撤回消息', item);
      const itemCopy = cloneDeep(item) || {};
      const status = 2;
      itemCopy.status = status;
      itemCopy.msgId = itemCopy.fromMsg.msgId;
      itemCopy.fromMsg.status = status;
      itemCopy.liveId = liveId;
      itemCopy.kdtId = kdtId;

      this.revokeData = itemCopy;

      Dialog.confirm({
        message: '撤回消息？',
        confirmButtonText: '撤回',
      }).then(() => {
        this.sendSocket(this.revokeData, this.revokeData.status);
      });
    },
    deleteChat(item) {
      console.log('删除消息', item);
      const itemCopy = cloneDeep(item);
      const status = 3;
      const liveForbidUidList = getGlobalConfig().liveForbidUidList;
      console.log('删除消息 被禁言列表', liveForbidUidList);

      itemCopy.status = status;
      itemCopy.msgId = itemCopy.fromMsg.msgId;
      itemCopy.fromMsg.status = status;
      itemCopy.liveId = liveId;
      itemCopy.kdtId = kdtId;

      this.deleteData = itemCopy;

      if (liveForbidUidList.indexOf(itemCopy.msgId) > -1) {
        this.isOneForbid = true;
      } else {
        this.isOneForbid = false;
      }

      if (itemCopy.fromMsg.userType === 1) {
        this.isOneLecturerDelete = true;
      } else {
        this.isOneLecturerDelete = false;
      }

      this.muteDisplay = true;
    },
    reloadChat(item) {
      console.log('点击重载 重新加载消息', item);
      const reloadMap = {
        'image': () => {
          ImgHandler.uploadImg({
            msgObj: item,
          });
        },
        'voice': () => {
          WxAudio.uploadVoice({
            msgObj: item,
            localId: item.fromMsg.mediaUrl,
          });
        },
        'text': () => {
          this.sendSocket(item, 1);
        },
      };
      const textMap = {
        'image': '图片',
        'voice': '语音',
        'text': '消息',
      };
      Dialog.confirm({
        message: `${textMap[item.fromMsg.msgType]}发送失败，是否重新发送？`,
        confirmButtonText: '重新发送',
      }).then(() => {
        this.replaceWindow(item, {
          isLoading: true,
          isError: false,
        });
        reloadMap[item.fromMsg.msgType]();
      });
    },
    playAudio(item) {
      console.info('开始播放语音 item.hasRead', item, item.hasRead);

      // 缓存已读
      if (!item.hasRead) {
        this.currReadMsgList.push(item.fromMsg.msgId);
        this.$set(item, 'hasRead', true);
        const storageJson = this.readMsgObj;
        storageJson[liveId] = [...(storageJson[liveId] || []), ...this.currReadMsgList];
        YZLocalStorage.setItem('yz_live_chat_read_list', JSON.stringify(storageJson));
      }
    },
    endAudio(type, msg) {
      console.log('结束播放语音', type, msg);

      if (['talk', 'main'].indexOf(type) > -1) {
        const list = this.$refs[`${type}-area`].allList;
        const index = findIndex(list, (item) => item.fromMsg.msgId === msg.fromMsg.msgId);
        const nextMsg = find(list, (item) => item.fromMsg.msgType === 'voice', index + 1); // !item.hasRead
        console.log('结束播放语音 找到下条音频', index, nextMsg);
        nextMsg && bus.$emit('play', nextMsg);
      }
    },
    replyChat(type, item) {
      console.log('回复某条信息', type, item);
      if (type === 'question') {
        this.questionDisplay = false;
      }
      this.isAsk = false;
      this.replyData = item;
      this.setMsgType();
    },

    /**
     * 底部操作回调
     */
    sendMsg(msg) {
      console.log('开始发送文字', msg);
      this.putWindow(msg);
    },
    parseMsg(msg) {
      console.log('发送文字 解析成功', msg);
      this.sendSocket(msg, 1);
    },

    sendImg(data) {
      console.log('开始发送图片', data);
      this.putWindow(data);
    },
    parseImg(data) {
      console.log('上传图片 拿到图片 cdn', data);
      this.sendSocket(data, 1);
    },
    errorImg(data) {
      console.log('上传图片 网络错误', data);
      this.replaceWindow(data, {
        isLoading: false,
        isError: true,
      });
    },

    sendAudio(data) {
      console.log('开始发送音频', data.fromMsg.mediaUrl);
      this.putWindow(data);
    },
    parseAudio(data) {
      console.log('上传音频 拿到 url', data.fromMsg.content);

      // cdn 资源生成太慢 此处 hack 1s 等待
      setTimeout(() => {
        this.sendSocket(data, 1);
      }, 1000);
    },
    errorAudio(data) {
      console.log('上传音频 网络错误', data);
      this.replaceWindow(data, {
        isLoading: false,
        isError: true,
      });
    },
    changeQuestionMode(data) {
      console.log('修改是否提问 mode', data);
      this.isAsk = data;

      // 选择提问时将回复信息删除
      if (data) {
        this.replyData = null;
      }
      this.setMsgType();
    },
    triggerOperate() {
      console.log('点击底部设置按钮', true);
      this.operateDisplay = true;
    },
    triggerAudioDisplay(value) {
      this.audioDisplay = value;
      if (value) {
        this.replyTipBottom = this.replyTipBottom + REPLY_TIP_BOTTOM;
      } else {
        this.replyTipBottom = this.replyTipBottom - REPLY_TIP_BOTTOM;
      }
    },

    /**
     * 对消息的处理
     */
    proxySendMessage(data) {
      if (this.socketOpen) {
        return this.client.sendMessage(data);
      } else {
        try {
          window.yzStackLog && window.yzStackLog.log({
            name: 'live-room-sentsocket-error',
            message: 'socket 状态不正确',
            extra: {
              data,
            },
            level: 'warn',
          });
        } catch (error) {
        }
        return new Promise((resolve) => {
          this.client.once('authSuccess', resolve);
        }).then(() => {
          try {
            window.yzStackLog && window.yzStackLog.log({
              name: 'live-room-sentsocket-again',
              message: 'socket 重连，重新发送消息',
              extra: {
                data,
              },
              level: 'info',
            });
          } catch (error) {
          }
          return this.client.sendMessage(data);
        });
      }
    },
    sendSocket(data, status) {
      const buyerUid = alias + _global.visBuyer.buyerId;
      data.buyerUid = buyerUid;
      data.toBuyerUid = get(data, 'fromMsg.buyerUid');
      data.fromBuyerUid = buyerUid;

      console.log(`socket 发送消息`, data);
      this.proxySendMessage({
        to: get(data, 'fromMsg.wxUid'),
        msgType: 'text',
        content: JSON.stringify(data),
        cId: 1,
        mId: 9,
        version: 1,
        mv: 0,
      })
        .then(json => {
          console.log('socket 发送成功', JSON.stringify(json) || 'success');
          if (status === 1) {
            this.replaceWindow(data, {
              isLoading: false,
              isError: false,
            });
          } else if ([2, 3].indexOf(status) > -1) { // 撤回 删除
            this.removeWindow(data);
          } else if (status === 4) {
            // 房间禁言
            if (!get(data, 'userForbid.wxUid')) {
              this.isRoomForbid = get(data, 'userForbid.isLiveRoomForbid');
            };
          }
        })
        .catch(msg => {
          console.log('socket 发送失败', msg || 'error');
          if (status === 1) {
            this.replaceWindow(data, {
              isLoading: false,
              isError: true,
            });
          } else if (status === 2) { // 撤回 删除
            Toast('撤回消息失败');
          } else if (status === 3) { // 撤回 删除
            Toast('删除消息失败');
          } else if (status === 4) { // 控制
            // 如果是结束直播
            if (data.liveStatus === 3) {
              Toast('结束直播失败');
            } else {
              // 如果是房间禁言
              if (!get(data, 'userForbid.wxUid')) {
                Toast('禁言失败');
                this.isRoomForbid = !get(data, 'userForbid.isLiveRoomForbid');
              };
            }
          }
        });
    },

    putWindow(data) {
      console.log('[LiveRoom] => 本地消息发送到屏幕', data);
      const areaName = this.getListInstanceName();
      if (areaName === 'main-area') {
        this.$refs[areaName].newMsgList.push(data);
      } else {
        this.$refs[areaName].list.push(data);
      }

      // 当前用户发完消息 回复就要置空
      // 60 代表连续发送的音频，不用置空
      if (+data.fromMsg.duration !== 60) {
        this.replyData = null;
        this.setMsgType();
      }

      // 当前用户发完消息 当前屏幕需要置底
      this.$refs[areaName].scrollToBottom();
    },

    // 发送消息时替换当前屏幕上的本地数据
    replaceWindow(data, config) {
      const areaName = this.getListInstanceName();
      let list;
      if (areaName === 'main-area') {
        list = this.$refs[areaName].newMsgList;
      } else {
        list = this.$refs[areaName].list;
      }
      const index = findIndex(list, (o) => o.fromMsg.clientId === data.fromMsg.clientId);
      console.log('[LiveRoom->replaceWindow] => index ', index);

      data = {
        ...data,
        ...config,
      };
      list.splice(index, 1, data);
      console.log('[LiveRoom] => 替换屏幕上本地的消息', data);
    },

    // 删除屏幕上的消息
    removeWindow(data) {
      const areaName = this.getListInstanceName();
      console.log('[LiveRoom] => 删除屏幕上远程的消息', data);
      let index = -1;
      let list;
      if (areaName === 'main-area') {
        index = findIndex(this.$refs[areaName].list, (o) => o.fromMsg.msgId === data.fromMsg.msgId);
        list = this.$refs[areaName].list;
        if (index === -1) {
          index = findIndex(this.$refs[areaName].newMsgList, (o) => o.fromMsg.msgId === data.fromMsg.msgId);
          list = this.$refs[areaName].newMsgList;
        }
        if (index === -1) {
          index = findIndex(this.$refs[areaName].topMsgList, (o) => o.fromMsg.msgId === data.fromMsg.msgId);
          list = this.$refs[areaName].topMsgList;
        }
      } else {
        index = findIndex(this.$refs[areaName].list, (o) => o.fromMsg.msgId === data.fromMsg.msgId);
        list = this.$refs[areaName].list;
      }

      console.log('[LiveRoom->removeWindow] => index ', index);

      // 如果撤回操作来自讲师的已回答
      if (data.areaName === 'answer' && +data.status === 2) {
        this.$refs['question-area'].list.answer =
          this.$refs['question-area'].list.answer.filter(msg => msg.fromMsg.msgId !== data.fromMsg.msgId);
      }
      list.splice(index, 1);
    },

    // 计算发送的聊天区域实例
    // 只会实时传到主区或讨论区，剩下的区域依靠 socket 消息把实体绘制到屏幕上
    getListInstanceName() {
      let name;
      if (this.userType === 1) {
        if (this.talkDisplay) {
          name = 'talk-area';
        } else {
          name = 'main-area';
        }
      } else if (this.userType === 2) {
        name = 'talk-area';
      }
      console.log('[LiveRoom] 计算消息发送的实例名称', name);
      return name;
    },

    setMsgType() {
      const msgMode = this.isAsk;
      const replyData = this.replyData;
      const msgSite = this.getListInstanceName();
      const userDesc = this.userDesc;

      bus.$emit('msg-type', {
        isAsk: msgMode,
        replyData,
        msgSite,
        userDesc,
      });
    },

    /**
     * 侧边栏操作
     */
    triggerQuestion() {
      console.log('[LiveRoom->triggerQuestion] => this.questionDisplay', this.questionDisplay);
      this.questionDisplay = true;
    },
    triggerTalk() {
      console.log('[LiveRoom->triggerTalk] => this.talkDisplay', this.talkDisplay);
      this.talkDisplay = true;
      this.setMsgType();
    },
    triggerTopBtn(showTopBtn) {
      // console.log('显示置顶按钮', showTopBtn);
      this.showTopBtn = showTopBtn;
    },

    /**
     * 回复提醒逻辑
     */
    closeReplyTip() {
      this.replyData = null;
      this.setMsgType();
    },

    /**
     * 删除禁言 action
     */
    handleMute(type) {
      console.log('[LiveRoom->handleMute] => type', type);
      // 禁言
      if (type === 2) {
        Dialog.confirm({
          title: '删除消息并禁言学员？',
          message: '禁言后该学员在本次直播中将无法恢复发言状态',
          confirmButtonText: '禁言',
        }).then(() => {
          const deleteData = this.deleteData;
          this.sendSocket(deleteData, deleteData.status);

          const copy = cloneDeep(deleteData);
          copy.status = 4;
          copy.userForbid = {
            enable: 0,
            wxUid: copy.fromMsg.wxUid,
          };
          this.sendSocket(copy, copy.status);
        });
      } else if (type === 1) {
        const deleteData = this.deleteData;
        this.sendSocket(deleteData, deleteData.status);
      }
    },

    /**
     * 底部设置操作区域逻辑
     */
    inviteFriend() {
      console.log('LiveRoom inviteFriend 点击邀请好友');
      this.wxShareData = '邀请好友看直播';
      this.wxShareDisplay = true;
    },
    collectRoom() {
      console.log('LiveRoom collectRoom 点击收藏店铺');
      this.wxShareDisplay = true;
      this.wxShareData = '点击...选择『收藏图标』收藏即可';
    },
    triggerMute(e) {
      console.log('LiveRoom triggerMute 点击直播禁言', e);
      const msg = newMsg();
      msg.status = 4;
      msg.fromMsg.status = 4;
      msg.userForbid = {
        enable: e ? 0 : 1,
        isLiveRoomForbid: !!e,
      };
      this.sendSocket(msg, msg.status);
    },
    endRoom() {
      Dialog.confirm({
        title: '确定要结束直播？',
        message: '直播结束后用户还可以回看本次直播内容',
        confirmButtonText: '结束直播',
      }).then(() => {
        console.log('LiveRoom endRoom 点击结束直播');
        const msg = newMsg();
        msg.liveStatus = 3;
        msg.status = 4;
        msg.fromMsg.status = 4;
        this.sendSocket(msg, msg.status);
      });
    },

    // 倒计时结束
    countDownEnd() {
      this.countDown = false;
      this.roomStatus = 2; // 左上角状态变为开始
      // setTimeout(reload, 1000);
    },

    scrollToTop() {
      this.$refs['main-area'].scrollToTop();
    },
  },
};
</script>

<style lang="scss">
  .live-room {
    position: relative;

    &__chat {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
    }
  }

  .controll-footer--talk-active {
    z-index: 20000;
  }
</style>
<style>
  html {
    height: 100%;
  }
</style>
