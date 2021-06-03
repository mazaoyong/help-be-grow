<template>
  <chat
    ref="chat"
    v-model="loading"
    class="main-area"
    :finish="listFinish"
    :padding="audioDisplay ? 166 : 0"
    type="up"
    :last-old-item-id="lastOldItemId"
    @scroll="handleScroll"
    @loadmore="loadmore"
    @update-last-old-item="updateLastOldItem"
  >
    <template slot="top">
      <invite-lecturer
        v-if="fetched"
        :type="inviteLecturerType"
        :display="lecturerType === 2 && userType === 1"
      />

      <live-notice
        :type="userType"
        :lecturer-type="lecturerType"
      />

      <back-to-audio
        v-model="displayBackToAudio"
        @back="backToAudio"
      />

      <div v-if="showNewAlert" class="new-alert-btn" @click="onNewAlertClick">
        <vis-icon name="db-arrow-down" font-size="12px" color="#00b389" />
        {{ newItemAmount }}条新消息
      </div>
    </template>

    <!-- 自上而下加载的列表 -->
    <template slot="header">
      <chat-item
        v-for="item in topMsgList"
        :key="`chatItem${item.fromMsg.msgId || item.fromMsg.clientId}`"
        ref="chatItem"
        :item="item"
        v-on="$listeners"
      />
    </template>

    <!-- 自下而上加载的列表 -->
    <chat-item
      v-for="item in list"
      :key="`chatItem${item.fromMsg.msgId || item.fromMsg.clientId}`"
      ref="chatItem"
      :item="item"
      v-on="$listeners"
      @audio-playing="handleAudioPlay"
    />

    <!-- 新消息列表 -->
    <template slot="footer">
      <chat-item
        v-for="item in newMsgList"
        :key="`chatItem${item.fromMsg.msgId || item.fromMsg.clientId}`"
        ref="chatItem"
        :item="item"
        v-on="$listeners"
      />
    </template>
  </chat>
</template>

<script>
import { Toast } from 'vant';
import { Icon } from '@youzan/vis-ui';

import findIndex from 'lodash/findIndex';
import get from 'lodash/get';

import Chat from '../../../components/Chat.vue';
import ChatItem from '../../../components/ChatItem.vue';
import InviteLecturer from '../../../components/InviteLecturer.vue';
import LiveNotice from '../../../components/LiveNotice.vue';

import apis from 'pct/api';
import {
  getGlobalConfig,
  // reload
} from '../../../utils/index';
import { LIVE_LIST_DEFAULT_LEN } from 'pct/constants';
// import UA from 'zan-utils/browser/ua';
import checkRead from '../../../utils/checkRead';
import formatTime, { formatLastTime } from '../../../utils/formatTime';
import Bus from '../../../utils/bus';

import backToAudioMixins from '../../../mixins/back-to-audio.js';

const {
  liveId,
  userType,
  lecturerType,
} = getGlobalConfig();

const INVITE_SCROLL_HEIGHT = 200;

export default {
  name: 'main-area',

  components: {
    chat: Chat,
    'chat-item': ChatItem,
    'invite-lecturer': InviteLecturer,
    'live-notice': LiveNotice,
    'vis-icon': Icon,
  },

  mixins: [backToAudioMixins],

  props: {
    realMsg: Object,
    audioDisplay: Boolean,
  },

  data() {
    return {
      userType,
      loading: false,
      listFinish: false, // 没有更多数据了
      fetched: false,
      inviteLecturerType: 'fixed',
      lecturerType,
      page: '',
      lastOldItemId: -1, // 未展示的新消息id
      showNewAlert: false, // 显示新消息提醒
      newItemAmount: 0, // 未展示的新消息数量
      topListMsgId: '',
      topMsgList: [],
      list: [],
      newMsgList: [],
    };
  },

  computed: {
    allList() {
      return [
        ...this.topMsgList,
        ...this.list,
        ...this.newMsgList,
      ];
    },
  },

  watch: {
    realMsg(newValue) {
      const newValueCopy = Object.assign({
        areaName: 'main',
        areaType: 'socket',
      }, newValue);
      console.log('[MainArea] watch realMsg', newValueCopy);
      if ([2, 3].indexOf(newValue.status) > -1) {
        // 如果是删除或者撤回
        console.log('[MainArea] watch realMsg 是否删除 msgId', newValue.fromMsg.msgId);
        console.log('[MainArea] watch realMsg 是否删除 clientId', newValue.fromMsg.clientId);

        // 可能出现撤回 lastOldItemId 的情况，需要更新下
        const needUpdate = newValue.fromMsg.msgId === this.lastOldItemId;

        // 检查旧消息底部列表
        this.list = this.list.filter((item, index) => {
          if (needUpdate && item.fromMsg.msgId === this.lastOldItemId) {
            const lastOldItem = this.list[index - 1];
            if (lastOldItem) {
              this.lastOldItemId = lastOldItem.fromMsg.msgId;
            }
          }

          return (item.fromMsg.msgId !== newValue.fromMsg.msgId) &&
            (item.fromMsg.clientId !== newValue.fromMsg.clientId);
        });

        // 检查新消息列表
        this.newMsgList = this.newMsgList.filter((item, index) => {
          if (needUpdate && item.fromMsg.msgId === this.lastOldItemId) {
            const lastOldItem = this.newMsgList[index - 1] || this.list[this.list.length - 1];
            if (lastOldItem) {
              this.lastOldItemId = lastOldItem.fromMsg.msgId;
            }
          }

          return (item.fromMsg.msgId !== newValue.fromMsg.msgId) &&
            (item.fromMsg.clientId !== newValue.fromMsg.clientId);
        });
      } else if (newValue.status === 1) {
        // 添加
        const index = findIndex(this.list, (item) => item.fromMsg.clientId === newValue.fromMsg.clientId);
        const newIndex = findIndex(this.newMsgList, (item) => item.fromMsg.clientId === newValue.fromMsg.clientId);

        console.log('[MainArea] watch realMsg index', index);
        if (index === -1 && newIndex === -1) {
          this.newMsgList.push(newValueCopy);
          formatLastTime(this.newMsgList);

          // 底部自动滚动
          if (this.$refs.chat && this.$refs.chat.reachBottom(200)) {
            // 如果直接滚动到底部，记录最后一个已展示的消息id
            const lastOldItem = this.newMsgList[this.newMsgList.length - 1];
            this.lastOldItemId = lastOldItem.fromMsg && lastOldItem.fromMsg.msgId;

            this.$nextTick()
              .then(() => {
                this.$refs.chat.scrollToBottom();
              });
          } else {
            // 如果没有滚动到底部，未展示消息数量+1，展示新消息提醒
            this.newItemAmount++;
            this.showNewAlert = true;
          }
        } else if (index !== -1) {
          const oldValue = this.list[index];
          this.list.splice(index, 1, {
            ...oldValue,
            fromMsg: newValueCopy.fromMsg,
            areaName: 'main',
            areaType: 'socket',
          });
          formatLastTime(this.list, index);
        } else {
          const oldValue = this.newMsgList[index];
          this.newMsgList.splice(index, 1, {
            ...oldValue,
            fromMsg: newValueCopy.fromMsg,
            areaName: 'main',
            areaType: 'socket',
          });
          formatLastTime(this.newMsgList, index);
        }
      }
    },
  },

  created() {
    Bus.$on('user-type', (ev) => {
      if (typeof ev.userType !== 'undefined') {
        this.userType = ev.userType;
      }
    });
  },

  mounted() {
    this.fetchData();
    Bus.$on('socket-open', () => {
      this.page = '';
      this.fetchData();
    });
  },

  destroyed() {
    // 移除事件 不然该事件一直存在会不合时宜地触发 fetchData
    Bus.$off('socket-open');
  },

  methods: {
    handleScroll(ev) {
      if (Math.abs(ev.listOffset.y) > INVITE_SCROLL_HEIGHT) {
        this.inviteLecturerType = 'fixed';
      } else if (Math.abs(ev.listOffset.y) <= INVITE_SCROLL_HEIGHT) {
        this.inviteLecturerType = 'block';
      }
      this.handleScrollWrap();

      // 判断是否需要展示置顶按钮
      this.$emit('trigger-top-btn',
        !!(
          (!this.topMsgList.length && !this.listFinish) ||
          (this.$el.scrollTop > window.innerHeight && (this.listFinish || this.topMsgList.length))
        )
      );
    },
    loadmore(direction) {
      console.log('loadmore', direction);
      this.fetchData(direction);
    },
    fetchData(direction = 'up') {
      const isUp = direction === 'up';
      const firstFetch = isUp ? !this.page : !this.topListMsgId;
      const query = {
        live_id: liveId,
        user_type: 1,
        msg_site: 2,
        page_size: LIVE_LIST_DEFAULT_LEN,
        msg_id: isUp ? this.page : this.topListMsgId,
        sort: isUp ? 0 : 1,
      };
      apis.getLiveMsgList(query, !firstFetch)
        .then(data => {
          // if (!UA.isWeixin()) {
          //   return Toast('为了更好的观看和互动体验，请在微信中访问直播');
          // }

          // 服务端的数据是 新 -> 旧
          if (!Array.isArray(data.msgList)) {
            return false;
          }
          const currList = data.msgList.reverse();
          checkRead(currList);
          formatTime(currList);
          currList.forEach(item => {
            item.areaName = 'main';
          });

          if (firstFetch) {
            if (this.$refs.chat.getScrollHeight() > INVITE_SCROLL_HEIGHT) {
              this.inviteLecturerType = 'fixed';
            } else {
              this.inviteLecturerType = 'block';
            }

            // 标记新消息提醒节点
            if (currList.length && isUp) {
              const lastOldItem = currList[currList.length - 1];
              this.lastOldItemId = lastOldItem.fromMsg && lastOldItem.fromMsg.msgId;
            }
          }

          // 判断是否已经加载完
          // 向上滚动加载 list
          if (isUp) {
            if (currList.length) {
              const msgId = get(currList, '[0].fromMsg.msgId', 0);
              const index = findIndex(this.topMsgList, (item) => item.fromMsg && item.fromMsg.msgId === msgId);
              if (index > -1) {
                this.topMsgList.splice(index, this.topMsgList.length - index);
                this.listFinish = true;
              }
            }
          } else {
            const msgId = get(this, 'list[0].fromMsg.msgId', 0);
            const index = findIndex(currList, (item) => item.fromMsg && item.fromMsg.msgId === msgId);
            if (index > -1) {
              currList.splice(index, currList.length - index);
              this.listFinish = true;
            }
          }
          if (!this.listFinish && currList.length < LIVE_LIST_DEFAULT_LEN) {
            this.listFinish = true;
          }

          if (isUp) {
            this.list = currList.concat(firstFetch ? [] : this.list);
          } else {
            this.topMsgList = this.topMsgList.concat(currList);
          }
          this.fetched = true;

          const heightPre = this.$refs.chat.getContentHeight();
          this.$nextTick()
            .then(() => {
              this.loading = false;

              // 第一次请求 页面置底
              if (firstFetch) {
                if (isUp) {
                  this.$refs.chat.scrollToBottom();
                } else {
                  this.$refs.chat.scrollToTop();
                }
              } else if (isUp) {
              // 除第一次请求 复原
                const heightCurr = this.$refs.chat.getContentHeight();

                const diffHeight = heightCurr - heightPre;
                this.$refs.chat.scrollTo(diffHeight);
              }

              // 记录列表加载 id
              if (isUp) {
                this.page = get(currList[0], 'fromMsg.msgId');
              } else {
                this.topListMsgId = get(currList[currList.length - 1], 'fromMsg.msgId');
              }
            });
        })
        .catch(msgError => {
          this.loading = false;
          let _errorMsg = msgError;
          // if (!UA.isWeixin()) {
          //   _errorMsg = '为了更好的观看和互动体验，请在微信中访问直播';
          // }
          Toast(_errorMsg || '未知错误');
        });
    },

    // 暴露上层的方法
    scrollToBottom() {
      this.$nextTick()
        .then(() => {
          this.$refs.chat.scrollToBottom();
        });
    },

    updateLastOldItem() {
      const lastOldItem = this.newMsgList[this.newMsgList.length - 1];
      if (lastOldItem) {
        this.lastOldItemId = lastOldItem.fromMsg && lastOldItem.fromMsg.msgId;
      }
      this.newItemAmount = 0;
      this.showNewAlert = false;
    },

    onNewAlertClick() {
      this.$refs.chat.scrollToItem(this.lastOldItemId);
      this.updateLastOldItem();
    },

    scrollToTop() {
      this.$refs.chat.scrollToTop();
      // 直接置顶不会触发滚动事件，需手动设置邀请讲师组件展示样式
      this.inviteLecturerType = 'block';
      this.$emit('trigger-top-btn', false);
      if (!this.topMsgList.length && !this.listFinish) {
        this.fetchData('down');
      }
    },
  },
};
</script>

<style lang="scss">
  .main-area {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 50px;
  }

  .new-alert-btn {
    position: fixed;
    bottom: 65px;
    right: 55px;
    z-index: 100;
    padding: 0 12px;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    color: #00b389;
    background: #fff;
    border-radius: 15px;
    box-shadow: 0 2px 4px rgba(50, 50, 51, .05);
  }
</style>
