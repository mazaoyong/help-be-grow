<template>
  <div class="bought-course-item">
    <div class="header">
      <span class="name">{{ name }}</span>
      <span class="status">{{ statusText }}</span>
    </div>
    <div class="body">
      <div
        v-if="startTime && endTime"
        class="content-item"
      >
        <span class="left">有效期</span>
        <span
          v-if="eduCourseValidDescription"
          class="right right-one-line"
        >
          {{ eduCourseValidDescription }}
        </span>
        <span
          v-else
          class="right right-one-line"
        >
          {{ startTime | formatTime }} - {{ endTime | formatTime }}
        </span>
      </div>
      <div
        v-if="remaining && total"
        class="content-item"
      >
        <span class="left">剩余课时</span>
        <span class="right right-one-line">{{ remaining/100 }}/{{ total/100 }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns';

const statusArr = ['', '已学完', '未开始', '进行中'];

export default {
  name: 'bought-course-item',
  props: {
    name: {
      type: String,
      default: '-',
    },
    status: { // 1:已学完, 2:未开始,3:进行中
      type: Number,
      default: 1,
    },
    eduCourseValidDescription: {
      type: String,
      default: '',
    },
    startTime: {
      type: String,
      default: '',
    },
    endTime: {
      type: String,
      default: '',
    },
    remaining: { // 剩余课时
      type: Number,
      default: 0,
    },
    total: { // 总课时
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      statusText: statusArr[this.status],
    };
  },
  filters: {
    formatTime(time) {
      return format(time, 'YYYY-MM-DD');
    },
  },
};
</script>

<style lang="scss" scoped>
.bought-course-item {
  margin: 0 15px;
  padding-bottom: 5px;
  background-color: #fff;
  border-bottom: 1px solid #f2f2f2;
  .header {
    height: 54px;
    clear: both;
    .name {
      display: block;
      float: left;
      height: 54px;
      line-height: 54px;
      font-size: 16px;
      font-weight: bold;
      color: #323233;
    }
    .status {
      display: block;
      float: right;
      height: 54px;
      line-height: 54px;
      font-size: 13px;
      color: #323233;
    }
  }
  .body {
    .content-item {
      display: flex;
      margin-bottom: 10px;
      .left {
        display: block;
        margin-right: 10px;
        width: 62px;
        font-size: 13px;
        color: #969799;
      }
      .right {
        display: block;
        flex: 1;
        flex-wrap: wrap;
        font-size: 13px;
        color: #323233;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap
      }
    }
  }
}
</style>
