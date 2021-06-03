<template>
  <div class="earn-title">
    <p class="resume">
      {{ title }}
    </p>
    <p class="date">
      {{ time }}
      <span class="status-text" :style="{color: statusColor}">{{ statusText }}</span>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    time: {
      type: String,
      default: '',
    },
    status: {
      type: Number,
      default: 3,
    },
  },
  computed: {
    statusText() {
      const statusMapText = {
        3: '',
        0: '待结算',
        1: '已结算',
        2: '已发放',
      };
      return statusMapText[this.status];
    },
    statusColor() {
      const statusMapColor = {
        3: '',
        0: '#FF5A06',
        1: '#CACACA',
        2: '#CACACA',
      };
      return statusMapColor[this.status];
    },
  },
};
</script>

<style lang="scss" scoped>
.resume {
  font-size: 14px;
  color: #39393A;
  font-weight: bold;
  line-height: 20px;
}
.date {
  font-size: 12px;
  color: #CACACA;
  line-height: 20px;
}
</style>
