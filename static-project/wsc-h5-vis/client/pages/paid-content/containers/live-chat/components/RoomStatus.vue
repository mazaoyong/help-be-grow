<template>
  <div :class="['room-status', `room-status--${type}`]">
    <p
      v-if="type === 'undo'">
      即将开始{{ !hideLiveRoomNum ? `·${num}人` : (userType === 1 ? `·${num}人` : '') }}
    </p>

    <p
      v-if="type === 'do'">
      直播中{{ !hideLiveRoomNum ? `·${num}人` : (userType === 1 ? `·${num}人` : '') }}
    </p>

    <p
      v-if="type === 'end'">
      已结束
    </p>
  </div>
</template>

<script>
export default {
  name: 'room-status',

  props: {
    num: {
      type: [String, Number],
      default: ' ',
    },
    roomStatus: [String, Number],
    hideLiveRoomNum: Boolean,
    userType: Number,
  },

  data() {
    return {
    };
  },

  computed: {
    type() {
      const map = {
        1: 'undo',
        2: 'do',
        3: 'end',
      };
      return map[this.roomStatus];
    },
  },
};
</script>

<style lang="scss">
  .room-status {
    box-sizing: border-box;
    line-height: 24px;
    color: #fff;
    font-size: 12px;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    padding: 0 10px;
    position: fixed;
    left: 0;
    top: 15px;
    z-index: 1;
    min-width: 60px;
    text-align: center;

    &--undo {
      background: linear-gradient(115deg, #00ffb3, #072991);
    }

    &--do {
      background: linear-gradient(115deg, #ff4f00, #f00);
    }

    &--end {
      background: rgba(0, 0, 0, .6);
    }
  }
</style>
