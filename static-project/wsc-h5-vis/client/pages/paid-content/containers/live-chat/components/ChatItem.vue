<template>
  <div :id="`chat-item--${item.fromMsg.msgId}`" class="chat-item-container-wrap">
    <p
      v-if="showTime"
      class="chat-item-container-time"
    >
      {{ publishTime }}
    </p>
    <div
      class="chat-item-container clearfix"
      :class="{'chat-item-container--right': position === 'right'}"
    >
      <div class="avator">
        <img class="avator__img" :src="avatar" alt="avator">
      </div>

      <div class="chat-info">
        <div class="user-info">
          <span class="user-info__name">{{ nickname }}</span>
          <span class="user-info__title">{{ item.fromMsg.userType === 1 ? item.fromMsg.userDesc : '' }}</span>
        </div>

        <div class="content-info">
          <!-- 内容 -->
          <chat-reply
            :is-reply="isReply"
            :item="item"
            class="content-info__content"
          >
            <chat-text
              v-if="type === 'text'"
              :content="content"
              :is-reply="isReply"
              :item="item"
              :position="position"
              v-on="$listeners"
            />

            <chat-img
              v-if="type === 'image'"
              :content="content"
              :is-reply="isReply"
              :item="item"
            />

            <chat-audio
              v-if="type === 'voice'"
              :item="item"
              :content="content"
              :is-reply="isReply"
              :position="position"
              v-on="$listeners"
            />
          </chat-reply>

          <!-- 重新发送 -->
          <van-icon
            v-if="isError"
            class="content-info__reload"
            name="warn"
            @click="reloadMsg"
          />
          <!-- loading -->
          <div
            v-if="isLoading && !isError && type !== 'image'"
            class="content-info__loading"
          />
        </div>

        <!-- 删除 撤回 -->
        <p
          v-if="canRevoke"
          class="redo-info redo-info--revoke"
          @click="revokeChat"
        >
          撤回
        </p>
        <p
          v-if="canDelete"
          class="redo-info redo-info--delete"
          @click="deleteChat"
        >
          删除
        </p>
      </div>
    </div>
  </div>
</template>

<script>

import { Icon } from 'vant';
import format from 'date-fns/format';

import ChatItemText from './ChatItemText.vue';
import ChatItemImg from './ChatItemImg.vue';
import ChatItemAudio from './ChatItemAudio.vue';
import ChatItemReply from './ChatItemReply.vue';

import { getGlobalConfig } from '../utils/index';
import Bus from '../utils/bus';

const {
  userType,
  wxUid,
  lecturerType,
  avatar,
  nickname,
} = getGlobalConfig();

export default {

  name: 'chat-item',

  components: {
    'chat-text': ChatItemText,
    'chat-img': ChatItemImg,
    'chat-audio': ChatItemAudio,
    'chat-reply': ChatItemReply,
    [Icon.name]: Icon,
  },

  props: {
    item: Object,
    position: {
      type: String,
      default: 'left',
      validator(value) {
        return ['left', 'right'].indexOf(value) > -1;
      },
    },
  },

  data() {
    return {
      userType,
      lecturerType,
    };
  },

  computed: {
    avatar() {
      const { fromMsg } = this.item;
      if (fromMsg.wxUid === wxUid) {
        return avatar;
      }
      return fromMsg.avatar;
    },
    nickname() {
      const { fromMsg } = this.item;
      if (fromMsg.wxUid === wxUid) {
        return nickname;
      }
      return fromMsg.nickname;
    },
    type() {
      return this.item.fromMsg.msgType;
    },
    content() {
      let content;
      if (this.item.fromMsg.msgType === 'text') {
        content = this.item.fromMsg.content;
      } else {
        content = this.item.fromMsg.mediaUrl;
      }
      return content;
    },
    during() {
      return this.item.fromMsg.during || 1;
    },
    isReply() {
      return !!this.item.toMsg && !!this.item.toMsg.wxUid;
    },
    isLoading() {
      return this.item.isLoading;
    },
    isError() {
      return this.item.isError;
    },
    canDelete() {
      // 当前用户身份是讲师 并且此条不是讲师自己发的
      const uid = this.item.fromMsg.wxUid;
      const msgUserType = this.item.fromMsg.userType;
      if (wxUid !== uid && !this.isLoading && !this.isError) {
        if (+this.userType === 1 && +msgUserType !== 1) {
          return true;
        } else if (+lecturerType === 2 && +this.userType === 1) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    canRevoke() {
      const uid = this.item.fromMsg.wxUid;
      const msgId = this.item.fromMsg.msgId;
      return (wxUid === uid || _global.verify_weixin_openid === uid) && !this.isLoading && !this.isError && !!msgId;
    },
    publishTime() {
      const createTime = this.item.fromMsg.createTime;
      return createTime ? format(createTime, 'YYYY年M月D日 H:mm') : '';
    },
    showTime() {
      return this.item.showTime && this.item.fromMsg.createTime && this.item.showTime === this.item.fromMsg.createTime;
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
  },

  methods: {
    revokeChat() {
      this.$listeners.revoke(this.item);
    },
    deleteChat() {
      this.$listeners.delete(this.item);
    },
    reloadMsg() {
      this.$listeners.reload(this.item);
    },
    getDomOffsetTop() {
      return this.$el.offsetTop;
    },
  },

  provide() {
    return {
      getDomOffsetTop: this.getDomOffsetTop,
    };
  },
};
</script>

<style lang="scss" scoped>
  .chat-item-container-wrap {
    margin-top: 15px;
  }

  .chat-item-container-time {
    text-align: center;
    color: #999;
    font-size: 12px;
    line-height: 17px;
    margin: 15px auto 20px;
  }

  /* 居左注释 */
  .chat-item-container {
    box-sizing: border-box;
    overflow: hidden;
    padding-left: 15px;

    .avator {
      float: left;
      margin-right: 10px;

      &__img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }

    .content-info {
      user-select: auto;
    }

    .chat-info {
      float: left;

      .user-info {
        font-size: 12px;
        line-height: 17px;
        margin-bottom: 5px;

        &__name {
          color: #333;
          margin-right: 10px;
        }

        &__title {
          color: #999;
        }
      }

      .content-info {
        position: relative;

        &__reload {
          color: #f44;
          font-size: 20px;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: -30px;
        }

        &__loading {
          width: 20px;
          height: 20px;
          background: url('//b.yzcdn.cn/v2/image/loader@2x.gif') no-repeat center;
          background-size: 16px;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: -30px;
        }
      }
    }

    .redo-info {
      color: #0086ff;
      font-size: 12px;
      line-height: 17px;
      margin-top: 5px;
    }
  }

  /* 居右注释 */
  .chat-item-container--right {
    padding-left: 0;
    padding-right: 15px;

    .avator {
      float: right;
      margin-left: 10px;
      margin-right: 0;
    }

    .content-info {
      user-select: auto;
    }

    .chat-info {
      float: right;

      .user-info {
        text-align: right;
      }

      .content-info {
        &__reload {
          right: 0;
          left: -30px;
        }

        &__loading {
          right: 0;
          left: -30px;
        }
      }
    }

    .redo-info {
      text-align: right;
    }
  }
</style>
