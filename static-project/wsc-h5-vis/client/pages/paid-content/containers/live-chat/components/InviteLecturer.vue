<template>
  <div
    v-if="display"
    class="invite-lecturer"
    :style="{
      'padding-top': paddingTop
    }">
    <div
      v-if="type === 'block'"
      class="invite-lecturer-block clearfix">
      <div class="invite-lecturer-block__intro">
        <p class="invite-lecturer-block__title">
          邀请直播讲师
        </p>
        <p class="invite-lecturer-block__desc">
          好友接受邀请后将会成为该直播的讲师
        </p>
      </div>
      <div
        class="invite-lecturer-block__btn"
        @click="inviteLecturer">
        邀请讲师
      </div>
    </div>

    <div
      v-if="type === 'fixed'"
      class="invite-lecturer-fixed"
      @click="inviteLecturer">
      邀请讲师
    </div>
  </div>
</template>

<script>
import { getGlobalConfig } from '../utils/index';

const {
  liveId,
  alias,
  title,
} = getGlobalConfig();

export default {
  name: 'invite-lecturer',

  props: {
    type: {
      type: String,
      default: 'fixed',
      validator(value) {
        return ['block', 'fixed'].indexOf(value) > -1;
      },
    },
    display: Boolean,
  },

  data() {
    return {
      hasBlock: false,
    };
  },

  computed: {
    paddingTop() {
      if (this.hasBlock && this.type === 'fixed') {
        return '110px';
      } else {
        return 0;
      }
    },
  },

  watch: {
    type(newValue) {
      if (newValue === 'block') {
        this.hasBlock = true;
      }
    },
  },

  methods: {
    inviteLecturer() {
      this.$router.push({
        path: '/lecturer',
        query: {
          alias,
          live_id: liveId,
          title,
        },
      });
    },
  },
};
</script>

<style lang="scss">
  .invite-lecturer {

    .invite-lecturer-block {
      height: 79px;
      margin: 30px 15px 0;
      border-radius: 2px;
      background-color: #fff;
      box-sizing: border-box;
      padding: 15px;

      &__intro {
        float: left;
      }

      &__title {
        line-height: 22px;
        color: #333;
        font-size: 16px;
        font-weight: bold;
      }

      &__desc {
        font-size: 12px;
        color: #666;
        line-height: 22px;
        margin-top: 5px;
      }

      &__btn {
        float: right;
        padding: 7px;
        background-color: #4b0;
        border-radius: 2px;
        color: #fff;
        font-size: 12px;
        margin-top: 13px;
      }
    }

    .invite-lecturer-fixed {
      position: fixed;
      right: 15px;
      top: 15px;
      background-color: rgba(0, 0, 0, .6);
      line-height: 25px;
      text-align: center;
      font-size: 12px;
      color: #fff;
      padding: 0 10px;
      border-radius: 2px;
      z-index: 9;
    }
  }

  @media only screen and (max-width: 320px) {

    .invite-lecturer {

      .invite-lecturer-block {

        &__btn {
          float: right;
          padding: 4px;
          background-color: #4b0;
          border-radius: 2px;
          color: #fff;
          font-size: 12px;
          margin-top: 13px;
        }
      }
    }
  }

</style>
