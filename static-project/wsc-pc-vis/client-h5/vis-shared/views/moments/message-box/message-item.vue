<template>
  <div class="moments-message-item" @click="handleClick">
    <div class="message-avatar">
      <img-wrap
        :width="'42px'"
        :height="'42px'"
        :src="getAvatar"
        :fullfill="'!84x0.jpg'"
        :cover="true"
      />
    </div>
    <div class="message-content">
      <div class="message-content__name">
        {{ item.senderName }}
      </div>
      <div class="message-content__body">
        <van-icon
          v-if="getMessageType === 1"
          size="12px"
          name="dianzan-bold"
          color="#576b95"
        />
        <div v-else-if="getMessageType === 2">
          <span v-if="getReplyMessage.receiverName" class="content-prefix">
            回复
            <span style="color: #576b95; font-weight: bold">{{ getReplyMessage.receiverName }}</span>
            ：
          </span>
          {{ getReplyMessage.textSummary }}
        </div>
        <div v-else-if="getMessageType === 3">
          {{ getReplyMessage.textSummary || '提到了你' }}
        </div>
      </div>
      <div class="message-content__replyTime">
        {{ getReplyTime }}
      </div>
    </div>
    <div class="message-thumb">
      <img-wrap
        v-if="getThumb"
        :width="'58px'"
        :height="'58px'"
        :src="getThumb"
        :fullfill="'!116x0.jpg'"
        :cover="true"
      />
      <div v-else class="message-thumb__text">
        <text-box
          :line="3"
          :content="getTextSummary"
          :show-more="false"
          line-height="18px"
          font-size="14px"
          ellipsis="..."
        />
      </div>
    </div>
  </div>
</template>

<script>
import get from 'lodash/get';
import { Icon, ImgWrap } from '@youzan/vis-ui';
import { getFeedTime } from '../../../components/feed-card/feeds-card-operator/util';
import TextBox from '../../../components/text-box';
import { USER_AVATAR } from '../constants';

import constants from './constants';

export default {
  name: 'message-item',

  components: {
    'van-icon': Icon,
    'text-box': TextBox,
    'img-wrap': ImgWrap,
  },

  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    link: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      messageType: constants.MESSAGE_TYPES,
    };
  },

  computed: {
    getAvatar() {
      return get(this.item, 'senderAvatar') || USER_AVATAR;
    },
    getThumb() {
      return get(this.item, 'thumbUrl') || undefined;
    },
    getTextSummary() {
      return get(this.item, 'postSummary') || get(this.item, 'textSummary') || undefined;
    },
    getMessageType() {
      return get(this.item, 'messageType');
    },
    getReplyMessage() {
      const textSummary = get(this.item, 'textSummary');
      const receiverName = get(this.item, 'receiverName');

      return {
        receiverName,
        textSummary,
      };
    },
    getReplyTime() {
      return getFeedTime(get(this.item, 'createdAt'));
    },
  },

  methods: {
    handleClick() {
      this.link && (window.location.href = this.link);
    },
  },
};
</script>

<style lang="scss">
.moments-message-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  margin: 0 16px;
  border: 0;
  border-bottom: 1px;
  border-color: #EBEDF0;
  border-style: solid;

  .message-avatar {
    width: 42px;
    height: 42px;
    overflow: hidden;
    border-radius: 4px;

    img {
      width: 42px;
      height: 42px;
    }
  }

  .message-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 0 8px;

    &__name {
      margin-bottom: 4px;
      font-size: 14px;
      font-weight: bold;
      line-height: 18px;
      color: #576b95;
    }

    &__body {
      margin-bottom: 2px;
      font-size: 14px;
      line-height: 18px;
    }

    &__replyTime {
      font-size: 12px;
      line-height: 16px;
      color: #969799;
    }
  }

  .message-thumb {
    width: 58px;
    overflow: hidden;
    align-self: center;

    img {
      display: block;
      width: 100%;
    }

    &__text {
      height: 54px;
    }
  }
}
</style>
