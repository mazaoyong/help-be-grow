<template>
  <div class="question-item">
    <template v-if="type === 'ask'">
      <div class="ask">
        <div class="ask__content">
          <span class="ask__content-name">
            {{ item.fromMsg.nickname }}：
          </span>
          <span>{{ item.fromMsg.content }}</span>
        </div>
        <div
          class="ask__reply"
          @click="reply">
          回复
        </div>
      </div>
    </template>
    <template v-if="type === 'answer'">
      <div class="answer">
        <div class="answer__question">
          <span class="answer__question-name">
            {{ item.toMsg && item.toMsg.nickname }}：
          </span>
          <span>{{ item.toMsg && item.toMsg.content }}</span>
        </div>
        <div class="answer__answer">
          <chat-text
            v-if="msgType === 'text'"
            :content="content"
            is-reply
            :item="item"
          />

          <chat-img
            v-if="msgType === 'image'"
            :content="content"
            :item="item"
          />

          <chat-audio
            v-if="msgType === 'voice'"
            :item="item"
            :content="content"
            is-reply
            v-on="$listeners"
          />
          <p
            class="answer__answer-revoke"
            @click="revoke">
            撤回
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import ChatItemText from './ChatItemText.vue';
import ChatItemImg from './ChatItemImg.vue';
import ChatItemAudio from './ChatItemAudio.vue';

export default {
  name: 'question-item',

  components: {
    'chat-text': ChatItemText,
    'chat-img': ChatItemImg,
    'chat-audio': ChatItemAudio,
  },

  props: {
    type: {
      default: 'ask',
      type: String,
      validator(value) {
        return ['ask', 'answer'].indexOf(value) > -1;
      },
    },
    item: Object,
  },

  data() {
    return {

    };
  },

  computed: {
    msgType() {
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
  },

  methods: {
    revoke() {
      this.$listeners.revoke(this.item);
    },
    reply() {
      console.log(this.item);
      this.$listeners.reply(this.item);
    },
  },
};
</script>

<style lang="scss">
  .question-item {
    background-color: #fff;
    border-radius: 2px;
    box-sizing: border-box;
    margin: 10px 15px 0;

    .ask {
      padding: 10px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      &__content {
        font-size: 14px;
        color: #333;
        line-height: 20px;
        width: 74%;
      }

      &__content-name {
        color: #999;
      }

      &__reply {
        font-size: 12px;
        color: #fff;
        background-color: #4b0;
        border-radius: 2px;
        padding: 7px 10px;
      }
    }

    .answer {
      padding: 10px;
      color: #333;
      font-size: 14px;

      &__question {
        padding-bottom: 8px;
        border-bottom: 1px solid #e5e5e5;
        line-height: 20px;
      }

      &__question-name {
        color: #999;
      }

      &__answer {
        padding-top: 8px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }

      &__answer-content {
        width: 85%;
        line-height: 20px;
      }

      &__answer-revoke {
        color: #38f;
        font-size: 12px;
      }
    }
  }
</style>
