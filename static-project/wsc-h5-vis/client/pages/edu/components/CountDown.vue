<template>
  <div class="countdown-container">
    <cap-countdown
      :start="start"
      :end="endAt"
      :time-separator="timeSeparator"
      :hide-zero-day="true"
      @countdown-ended="onCountdownEnded"
    />
  </div>
</template>

<script>
import { Countdown } from 'captain-ui';

export default {
  name: 'count-down',

  components: {
    [Countdown.name]: Countdown,
  },

  props: {
    endAt: {
      type: [Number, String],
      default: 0,
    },
    timeSeparator: {
      type: Array,
      default() {
        return ['天', '时', '分', '秒'];
      },
    },
  },

  data() {
    return {
      start: new Date().getMilliseconds(),
      end: new Date().getMilliseconds() + 24 * 60 * 60 * 1000,
    };
  },

  methods: {
    onCountdownEnded() {
      this.$emit('countdown-ended');
    },
  },
};
</script>

<style lang="scss">
.countdown-container {
  display: inline-block;

  .cap-countdown {
    &__day,
    &__hour,
    &__minute,
    &__second {
      background-color: #fff !important;
      color: #f44;
      margin: 0;
      padding: 0 1px;
    }
  }
}
</style>
