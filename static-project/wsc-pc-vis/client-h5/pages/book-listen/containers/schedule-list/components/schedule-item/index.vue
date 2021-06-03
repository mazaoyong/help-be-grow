<template>
  <div class="schedule-item">
    <van-checkbox
      :name="lesson.lessonNo"
      checked-color="#00b389"
      icon-size="22px"
    >
      <div class="schedule-item__body">
        <div class="schedule-item__title">
          {{ lesson.lessonTime }}
        </div>
        <div class="schedule-item__subtitle">
          <span
            v-if="lesson.isTrial"
            class="schedule-item__subtitle-tag"
          >试听</span>
          <span>{{ lesson.lessonName || lesson.eduCourseName }}</span>
        </div>
        <template v-if="isEduHqStore">
          <p v-if="lesson.shopName" class="schedule-item__info">
            <span class="label">上课校区</span>
            <span class="value">{{ lesson.shopName }}</span>
          </p>
        </template>
        <template v-else>
          <p v-if="lesson.addressName" class="schedule-item__info">
            <span class="label">上课地点</span>
            <span class="value">{{ lesson.addressName }}</span>
          </p>
        </template>
        <p v-if="lesson.classroomName" class="schedule-item__info">
          <span class="label">教室</span>
          <span class="value">{{ lesson.classroomName }}</span>
        </p>
        <p v-if="lesson.teacherName" class="schedule-item__info">
          <span class="label">老师</span>
          <span class="value">{{ lesson.teacherName }}</span>
        </p>
      </div>
      <span v-if="lesson.appointNumLeft" class="schedule-item__tag">
        剩余名额
        <span>{{ lesson.appointNumLeft }}</span>
      </span>
      <span v-else-if="lesson.appointRule === 1" class="schedule-item__tag">
        已满员
      </span>
    </van-checkbox>
  </div>
</template>

<script>
import { Checkbox } from 'vant';
import { isEduHqStore } from '@youzan/utils-shop';

export default {
  name: 'schedule-item',

  components: {
    'van-checkbox': Checkbox,
  },

  props: {
    lesson: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  data() {
    return {
      isEduHqStore,
    };
  },
};
</script>

<style lang="postcss">
.schedule-item {
  position: relative;
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  background-color: #fff;
  border-radius: 4px;

  .van-checkbox {
    align-items: start;

    &__icon {
      margin-top: 11px;
      margin-left: 15px;
      vertical-align: top;
    }

    &__label {
      margin-left: 0;
    }
  }

  &__body {
    flex: 1;
    padding: 10px 10px 16px;
    margin-top: 0;
  }

  &__title {
    display: -webkit-box;
    overflow: hidden;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    color: #323233;
    text-align: left;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  &__subtitle {
    margin-top: 2px;
    overflow: hidden;
    font-size: 13px;
    line-height: 18px;
    color: #323233;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;

    &-tag {
      padding: 0 4px;
      margin-right: 4px;
      font-size: 10px;
      line-height: 16px;
      color: #00b389;
      background: rgba(0, 179, 137, .1);
      border-radius: 8px;
    }
  }

  &__tag {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 13px;
    color: #969799;

    span {
      color: #00b389;
    }
  }

  &__info {
    margin-top: 8px;
    font-size: 13px;
    text-align: left;

    .label {
      display: inline-block;
      width: 55px;
      margin-right: 20px;
      color: #969799;
    }

    .value {
      color: #323233;
    }
  }
}
</style>
