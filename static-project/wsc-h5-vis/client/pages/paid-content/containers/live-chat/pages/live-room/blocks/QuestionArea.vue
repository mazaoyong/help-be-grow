<template>
  <van-popup
    v-model="displayValue"
    position="bottom"
    class="question-container"
    @click-overlay="close">
    <van-tabs
      v-model="active"
      :line-width="45"
      class="question-container__tabs"
      @click="tabsClick">
      <van-tab
        v-for="(item, index) in tabs"
        :key="index"
        :title="item.title">
        <div
          v-if="item.type === 'ask' && newMsgCount > 3"
          class="question-container__new-msg-tip"
          @click="scrollToTop">
          <p>{{ newMsgCount }}个新问题</p>
        </div>

        <chat
          :ref="`chat${item.type}`"
          v-model="loading[type]"
          class="question-container__list"
          :finish="listFinish[type]"
          type="bottom"
          @scroll="handleScroll"
          @move="handleMove"
          @loadmore="loadmore">
          <div
            v-if="noData[item.type]"
            class="question-container__no-data">
            <div class="question-container__no-data-icon" />
            <p>{{ item.type === 'ask' ? '暂无待回答的问题' : '你还没有回答任何问题' }}</p>
          </div>
          <question-item
            v-for="jtem in list[item.type]"
            :key="`chatItem${jtem.fromMsg.msgId || jtem.fromMsg.clientId}`"
            :type="item.type"
            :item="jtem"
            v-on="$listeners"
          />
        </chat>
      </van-tab>
    </van-tabs>
  </van-popup>
</template>

<script>
import { Popup, Tab, Tabs, Toast } from 'vant';

import get from 'lodash/get';
import findIndex from 'lodash/findIndex';
import throttle from 'lodash/throttle';
import UA from 'zan-utils/browser/ua';

import Chat from '../../../components/Chat.vue';
import QuestionItem from '../../../components/QuestionItem.vue';
import { getGlobalConfig } from '../../../utils/index';
import apis from 'pct/api';
import { LIVE_LIST_DEFAULT_LEN } from 'pct/constants';

const {
  liveId,
  wxUid,
} = getGlobalConfig();

let questionInit;

export default {
  name: 'question-area',

  components: {
    'van-popup': Popup,
    'van-tabs': Tabs,
    'van-tab': Tab,
    chat: Chat,
    'question-item': QuestionItem,
  },

  props: {
    value: Boolean,
    realMsg: Object,
  },

  data() {
    return {
      displayValue: false,
      active: 1,
      throttledFetchData: null,
      localDiffHeight: 0, // 待回答区滚动差值
      showMsgCount: false,
      startAskCount: 12, // 开始计数待回答个数的阈值
      scrollHeight: 0,
      page: {
        ask: '',
        answer: '',
      },
      loading: {
        ask: false,
        answer: false,
      },
      listFinish: {
        ask: false,
        answer: false,
      },
      tabs: [{
        title: '待回答',
        type: 'ask',
      }, {
        title: '已回答',
        type: 'answer',
      }],
      list: {
        ask: [],
        answer: [],
      },
      noData: {
        ask: false,
        answer: false,
      },
      newMsgCount: 0,
    };
  },

  computed: {
    type() {
      return +this.active === 0 ? 'ask' : 'answer';
    },
  },

  watch: {
    value(newVlaue) {
      this.displayValue = newVlaue;

      // vant-tabs hack bug
      this.active = 0;

      if (!questionInit) {
        questionInit = true;
        this.fetchData();
      }
    },
    active(newValue) {
      this.noData.ask = false;
      this.noData.answer = false;
      this.page[this.type] = '';
      this.throttledFetchData();
    },
    realMsg(newValue) {
      console.log('[QuestionArea] watch realMsg', newValue);
      if (newValue.fromMsg.msgCat === 1) {
        // 待回答消息
        // 判断是否撤回或删除
        if ([2, 3].indexOf(newValue.status) > -1) {
          this.list.ask = this.list.ask.filter(item => item.fromMsg.msgId !== newValue.fromMsg.msgId);
        } else if (newValue.status === 1) {
          // 添加
          const index = findIndex(this.list.ask, (item) => item.fromMsg.msgId === newValue.fromMsg.msgId);
          console.log('[QuestionArea] watch realMsg ask index', index);
          if (index === -1) {
            this.noData.ask = false;
            const newValueCopy = Object.assign({
              areaName: 'ask',
            }, newValue);
            this.list.ask.unshift(newValueCopy);

            // 计算差值复原定位
            if (this.$refs.chatask) {
              if (this.$refs.chatask[0].getScrollHeight() > 0) {
                this.newMsgCount = this.newMsgCount + 1;
                const heightPre = this.$refs.chatask[0].getContentHeight();
                this.$nextTick()
                  .then(() => {
                    const heightCurr = this.$refs.chatask[0].getContentHeight();
                    const diffHeight = heightCurr - heightPre;
                    this.localDiffHeight = this.localDiffHeight + diffHeight;
                    this.$refs.chatask[0].scrollTo(this.localDiffHeight);
                  });
              }
            }
          }
        }
      } else if (newValue.fromMsg.userType === 1 && wxUid === newValue.fromMsg.wxUid) {
        // 讲师发言
        // 已回答
        // 判断是否撤回或删除
        if ([2, 3].indexOf(newValue.status) > -1) {
          this.list.answer = this.list.answer.filter(item => item.fromMsg.msgId !== newValue.fromMsg.msgId);
        } else if (newValue.status === 1 && (newValue.toMsg && newValue.toMsg.msgId)) {
          // 添加
          const index = findIndex(this.list.answer, (item) => item.fromMsg.msgId === newValue.fromMsg.msgId);
          console.log('[QuestionArea] watch realMsg answer index', index);
          if (index === -1) {
            const newValueCopy = Object.assign({
              areaName: 'answer',
            }, newValue);
            this.noData.answer = false;
            this.list.answer.unshift(newValueCopy);
          }

          // 判断待回答列表是否有这项，有的话待回答删除此项
          console.log('[QuestionArea] watch realMsg answer 回答列表有这项');
          const indexAsk = findIndex(this.list.ask, (item) => item.fromMsg.msgId === newValue.toMsg.msgId);
          console.log('[QuestionArea] watch realMsg ask index', indexAsk);
          if (indexAsk > -1) {
            this.list.ask.splice(indexAsk, 1);
          }
        }
      }
    },
  },

  created() {
    this.throttledFetchData = throttle(this.fetchData, 600, {
      trailing: true,
      leading: false,
    });
  },

  methods: {
    close() {
      this.$emit('input', false);
    },
    tabsClick(ev) {
      console.log('[QuestionArea]->tabsClick ', ev);
    },
    handleScroll(ev) {
      const y = Math.abs(ev.listOffset.y);
      if (y < 20) {
        this.localDiffHeight = y;
        this.newMsgCount = 0;
      }
      this.scrollHeight = y;
    },
    handleMove(ev) {
      if (this.type === 'ask') {
        this.localDiffHeight = this.scrollHeight;
      }
    },
    loadmore(ev) {
      console.log('loadmodddre', ev);
      this.fetchData();
    },
    fetchData() {
      const firstFetch = !this.page[this.type];
      const query = {
        live_id: liveId,
        msg_site: 3,
        page_size: LIVE_LIST_DEFAULT_LEN,
        q_status: this.type === 'ask' ? 1 : 2,
        msg_id: this.page[this.type],
      };
      const pageType = this.type;
      apis.getLiveMsgList(query, !!this.page[this.type])
        .then(data => {
          this.loading[pageType] = false;

          if (!Array.isArray(data.msgList)) {
            return false;
          }
          // 服务端的数据是 新 -> 旧
          const currList = get(data, 'msgList', []);
          currList.forEach(item => {
            item.areaName = pageType;
          });

          // 长度为0 且是第一次请求 展示无数据图案
          if (currList.length === 0 && !this.page[pageType]) {
            this.noData[pageType] = true;
          }
          this.list[pageType] = firstFetch ? currList : this.list[pageType].concat(currList);

          if (currList.length < LIVE_LIST_DEFAULT_LEN) {
            this.listFinish[pageType] = true;
          }

          this.$nextTick()
            .then(() => {
              this.page[pageType] = get(currList[currList.length - 1], 'fromMsg.msgId');
            });
        })
        .catch(msgError => {
          this.loading[pageType] = false;
          let _errorMsg = msgError;
          if (!UA.isWeixin()) {
            _errorMsg = '为了更好的观看和互动体验，请在微信中访问直播';
          }
          Toast(_errorMsg || '未知错误');
        });
    },
    scrollToTop() {
      this.newMsgCount = 0;
      this.localDiffHeight = 0;
      this.$refs.chatask[0].scrollTo(0);
    },
  },
};
</script>

<style lang="scss">
  .question-container {
    &__tabs {
      .van-tab--active {
        color: #333;
      }

      .van-tabs__line {
        background-color: #4b0;
      }
    }

    &__list {
      height: 450px;
      background-color: #f8f8f8;
    }

    &__no-data {
      box-sizing: border-box;
      padding-top: 120px;
      text-align: center;
      font-size: 14px;
      color: #999;
    }

    &__no-data-icon {
      background-image: url(data:image/png;base64,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);
      background-size: cover;
      width: 117px;
      height: 80px;
      margin: 0 auto 15px;
    }

    &__new-msg-tip {
      padding: 4px 21px 4px 38px;
      background-color: rgba(0, 0, 0, .6);
      border-radius: 26px;
      color: #fff;
      font-size: 12px;
      position: absolute;
      top: 55px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 99;

      &:before {
        content: '';
        width: 12px;
        height: 16px;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAUCAYAAACXtf2DAAAAAXNSR0IArs4c6QAAAOxJREFUOBHtlDEOwjAMRRvGCg4Bggswd6vEzBXhEhyAnY2JCa7Awlaeq1qKElqnTUcifZmm9vutG1MUiatpmgpd0DKxJD2tg7+Jsq5oPhNg8uQK//Bb1jwmgHz4mesteiJZeSYAQvhCmsr+BuWZBPAT1y1cv1qWiQX3TNbkjnuTVPgkEwve3Y/mgH37TRLhelSj0zNoMhLeOwe9Jtyo0RHttbca2QuP6uAckF+iAxLeTjk/Iwkh/D8H7d+A35ZogsNe0kb7iGpR0HMT7tXZJlPhSSa5cMvEYVCTtEIv59xNC6ZEWCV1FZJ4h/f4AgAbvlsEourBAAAAAElFTkSuQmCC);
        background-size: 12px;
        left: 21px;
        top: 8px;
        position: absolute;
        background-repeat: no-repeat;
      }

      > p {
        line-height: 17px;
      }
    }
  }

  @media only screen and (max-width: 320px) {

    .question-container {

      &__list {
        height: 300px;
      }
    }
  }

</style>
