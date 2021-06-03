<template>
  <div class="lesson-item">
    <p class="item-time">
      {{ getTimeStr(startTime, endTime) }}
    </p>
    <p class="item-class">
      <span class="item-class__title">
        教室
      </span>
      <span class="item-class__value">
        {{ classroomName ? classroomName : '-' }}
      </span>
    </p>
    <p class="item-class">
      <span class="item-class__title">
        消耗课时
      </span>
      <span class="item-class__value">
        {{ consumeCourseTime ? consumeCourseTime / 100 : '-' }}
      </span>
    </p>
    <p class="item-class">
      <span class="item-class__title">
        签到人
      </span>
      <span class="item-class__value">
        {{ signInOperator }}
      </span>
    </p>
    <em class="item-tag">
      {{ tagStatus }}
    </em>
  </div>
</template>
<script>
import formatDate from '@youzan/utils/date/formatDate';
import getCurrentWeek from '@youzan/utils/date/getCurrentWeek';

export default {
  name: 'lesson-item',

  components: {
  },

  props: {
    startTime: Number,
    endTime: Number,
    classroomName: String,
    consumeCourseTime: Number,
    tagStatus: String,
    signInOperator: String,
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
  },
};
</script>
<style lang="scss">
.lesson-item {
  padding: 16px 15px;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: #fff;
  position: relative;

  .item-time {
    font-size: 16px;
    color: #323233;
    line-height: 22px;
    margin-bottom: 8px;
    font-weight: 500;
  }

  .item-class {
    font-size: 13px;
    color: #969799;
    line-height: 18px;
    margin-top: 8px;

    &__title {
      display: inline-block;
      min-width: 52px;
      margin-right: 14px;
    }

    &__value {
      color: #323233;
    }
  }

  .item-tag {
    display: inline-block;
    position: absolute;
    right: 15px;
    bottom: 16px;
    font-size: 14px;
    color: #969799;
  }
}
</style>
