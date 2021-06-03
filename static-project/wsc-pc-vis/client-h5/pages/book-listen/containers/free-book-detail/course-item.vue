<template>
  <div class="course-item">
    <div class="time-range">{{ lessonTime }}</div>
    <div class="course-name">{{ lessonName || eduCourseName }}</div>
    <div class="rest">
      剩余名额
      <span class="num">{{ appointNumLeft }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'lessonTime',
    'lessonName',
    'eduCourseName',
    'appointNumLeft',
    'addressName',
    'appointRule',
    'className',
    'classroomName',
    'eduCourseId',
    'kdtId',
    'lessonNo',
    'maxAppointNum',
    'shopName',
    'teacherName',
  ],
};
</script>

<style lang="postcss" scoped>
.course-item {
  position: relative;
  color: #323233;
  background-color: #f7f8fa;
  border-radius: 4px;
  height: 67px;

  &:not(:last-child) {
    margin-bottom: 10px;
  }

  .time-range {
    font-size: 16px;
    font-weight: bold;
    line-height: 36px;
    padding-left: 15px;
  }

  .course-name {
    font-size: 14px;
    line-height: 27px;
    padding-left: 15px;
  }

  .rest {
    position: absolute;
    right: 15px;
    top: 10px;
    font-size: 13px;
    color: #969799;

    .num {
      color: #00b389;
    }
  }
}
</style>
