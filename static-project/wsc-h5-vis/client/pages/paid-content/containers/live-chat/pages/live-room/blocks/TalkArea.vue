<template>
  <van-popup
    v-model="displayValue"
    position="bottom"
    class="talk-container"
    @click-overlay="close">
    <div class="talk-container__header">
      <p>讨论区（{{ list.length }}）</p>
      <van-icon
        class="talk-container__header-close-icon"
        name="close"
        @click="close"
      />
    </div>
    <back-to-audio
      v-model="displayBackToAudio"
      @back="backToAudio"
    />
    <chat
      ref="chat"
      v-model="loading"
      class="talk-container__list"
      :finish="listFinish"
      type="up"
      :padding="audioDisplay ? 166 : 0"
      @scroll="handleScroll"
      @loadmore="loadmore">
      <chat-item
        v-for="item in list"
        :key="`chatItem${item.fromMsg.msgId || item.fromMsg.clientId}`"
        ref="chatItem"
        :item="item"
        :position="wxUid === item.fromMsg.wxUid ? 'right' : 'left'"
        v-on="$listeners"
        @audio-playing="handleAudioPlay"
      />
    </chat>
  </van-popup>
</template>

<script>
import { Popup, Icon, Toast } from 'vant';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import UA from 'zan-utils/browser/ua';

import Chat from '../../../components/Chat.vue';
import ChatItem from '../../../components/ChatItem.vue';
import apis from 'pct/api';
import { getGlobalConfig } from '../../../utils/index';
import { LIVE_LIST_DEFAULT_LEN } from 'pct/constants';
import checkRead from '../../../utils/checkRead';
import formatTime, { formatLastTime } from '../../../utils/formatTime';
import Bus from '../../../utils/bus.js';

import backToAudioMixins from '../../../mixins/back-to-audio.js';

const {
  liveId,
  wxUid,
} = getGlobalConfig();

let firstInit = false;

export default {
  name: 'talk-area',

  components: {
    'van-popup': Popup,
    'van-icon': Icon,
    chat: Chat,
    'chat-item': ChatItem,
  },

  mixins: [backToAudioMixins],

  props: {
    value: Boolean,
    realMsg: Object,
    audioDisplay: Boolean,
  },

  data() {
    return {
      loading: false,
      listFinish: false,
      page: '',
      displayValue: false,
      wxUid: wxUid,
      list: [],
    };
  },

  watch: {
    value(newVlaue) {
      this.displayValue = newVlaue;

      if (!firstInit) {
        firstInit = true;
        this.fetchData();
      }
    },
    realMsg(newValue) {
      const newValueCopy = Object.assign({
        areaName: 'talk',
      }, newValue);
      console.log('[TalkArea] watch realMsg', newValueCopy);
      if ([2, 3].indexOf(newValue.status) > -1) {
        // 如果是删除或者撤回
        this.list = this.list.filter(item => (
          (item.fromMsg.msgId !== newValue.fromMsg.msgId) &&
          (item.fromMsg.clientId !== newValue.fromMsg.clientId)
        ));
      } else if (newValue.status === 1) {
        // 添加
        const index = findIndex(this.list, (item) => item.fromMsg.clientId === newValue.fromMsg.clientId);
        console.log('[TalkArea] watch realMsg index', index);
        if (index === -1) {
          this.list.push(newValueCopy);
          formatLastTime(this.list);

          // 底部自动滚动
          if (this.$refs.chat && this.$refs.chat.reachBottom(200)) {
            this.$nextTick()
              .then(() => {
                this.$refs.chat.scrollToBottom();
              });
          }
        } else {
          const oldValue = this.list[index];
          this.list[index] = {
            ...oldValue,
            fromMsg: newValueCopy.fromMsg,
          };
          formatLastTime(this.list, index);
        }
      }
    },
  },

  created() {
    Bus.$on('socket-open', () => {
      this.page = '';
      this.fetchData();
    });
  },

  mounted() {
  },

  methods: {
    close() {
      this.$emit('input', false);
    },
    loadmore(ev) {
      console.log('talk loadmore', ev);
      this.fetchData();
    },
    handleScroll(ev) {
      this.handleScrollWrap();
    },
    fetchData() {
      const firstFetch = !this.page;
      const query = {
        live_id: liveId,
        user_type: 1,
        msg_site: 1,
        page_size: LIVE_LIST_DEFAULT_LEN,
        msg_id: this.page,
      };
      apis.getLiveMsgList(query, !!this.page)
        .then(data => {
          // 服务端的数据是 新 -> 旧
          if (!Array.isArray(data.msgList)) {
            return false;
          }
          const currList = data.msgList.reverse();
          checkRead(currList);
          formatTime(currList);
          currList.forEach(item => {
            item.areaName = 'talk';
          });

          this.list = currList.concat(firstFetch ? [] : this.list);
          const heightPre = this.$refs.chat.getContentHeight();

          if (currList.length < LIVE_LIST_DEFAULT_LEN) {
            this.listFinish = true;
          }

          this.$nextTick()
            .then(() => {
              this.loading = false;

              // 第一次请求 页面置底
              if (!this.page) {
                this.$refs.chat.scrollToBottom();
              } else {
              // 除第一次请求 复原
                const heightCurr = this.$refs.chat.getContentHeight();

                const diffHeight = heightCurr - heightPre;
                this.$refs.chat.scrollTo(diffHeight);
              }

              this.page = get(currList[0], 'fromMsg.msgId');
            });
        })
        .catch(msgError => {
          this.loading = false;
          let _errorMsg = msgError;
          if (!UA.isWeixin()) {
            _errorMsg = '为了更好的观看和互动体验，请在微信中访问直播';
          }
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
  },
};
</script>

<style lang="scss">
  .talk-container {
    &__list {
      height: 400px;
      margin-bottom: 50px;
      background-color: #f8f8f8;
    }

    &__header {
      position: relative;
      text-align: center;
      font-size: 15px;
      height: 50px;
      background-color: #fff;
      line-height: 50px;
    }

    &__header-close-icon {
      position: absolute;
      right: 20px;
      top: 17px;
      font-size: 17px;
      color: #999;
    }
  }
</style>
