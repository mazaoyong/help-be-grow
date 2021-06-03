<template>
  <div class="course-item">
    <p
      v-if="item.startTime"
      class="item-time"
    >
      {{ getTimeStr(item.startTime, item.endTime) }}
    </p>
    <p class="item-class">
      <span class="item-class__title">
        教室：
      </span>
      <span class="item-class__value">
        {{ item.classroomName ? item.classroomName : '-' }}
      </span>
    </p>
    <p class="item-class">
      <span class="item-class__title">
        课节：
      </span>
      <span class="item-class__value">
        {{ item.lessonName ? item.lessonName : '-' }}
      </span>
    </p>
    <!-- 意向上课时间由于后端还未确认，暂不展示此模块 -->
    <!-- <template v-else>
      <div v-if="item.courseAttendDTO && item.courseAttendDTO.courseTime">
        <div class="item-time">
          {{ getAttendTime(item.courseAttendDTO.courseTime) }}
        </div>
        <p class="item-attend__desc">
          这是您的意向上课时间，机构未确认，建议和机构确认后在前往上课
        </p>
      </div>
    </template> -->
  </div>
</template>
<script>
import formatDate from '@youzan/utils/date/formatDate';
import getCurrentWeek from '@youzan/utils/date/getCurrentWeek';

export default {
  name: 'course-item',

  components: {
  },

  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  computed: {
  },

  methods: {
    getTimeStr(start, end) {
      const startYMD = formatDate(start, 'YYYY年MM月DD日');
      var date = new Date(start);
      const week = getCurrentWeek(date);
      let H = date.getHours();
      H = H < 10 ? `0${H}` : `${H}`;
      let M = date.getMinutes();
      M = M < 10 ? `0${M}` : `${M}`;
      var endDate = new Date(end);
      let endH = endDate.getHours();
      endH = endH < 10 ? `0${endH}` : `${endH}`;
      let endM = endDate.getMinutes();
      endM = endM < 10 ? `0${endM}` : `${endM}`;
      return `${startYMD}  ${week}  ${H}:${M}-${endH}:${endM}`;
    },
    getAttendTime(start) {
      const startYMD = formatDate(start, 'YYYY年MM月DD日');
      var date = new Date(start);
      const week = getCurrentWeek(date);
      let H = date.getHours();
      H = H < 10 ? `0${H}` : `${H}`;
      let M = date.getMinutes();
      M = M < 10 ? `0${M}` : `${M}`;
      return `意向体验时间：${startYMD}  ${week}  ${H}:${M}`;
    },
  },
};
</script>
<style lang="scss">
.course-item {
  padding: 16px 15px;
  border-radius: 4px;

  .item-time {
    font-size: 16px;
    color: #323233;
    line-height: 22px;
    margin-bottom: 3px;
    font-weight: 500;
  }

  .item-attend__desc {
    font-size: 12px;
    color: #969799;
    line-height: 17px;
  }

  .item-class {
    font-size: 12px;
    color: #969799;
    line-height: 17px;
    margin-top: 4px;
  }

  .item-tag {
    display: inline-block;
    position: absolute;
    right: 15px;
    bottom: 16px;
    font-size: 14px;
    color: #969799;
  }

  .item-class {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
