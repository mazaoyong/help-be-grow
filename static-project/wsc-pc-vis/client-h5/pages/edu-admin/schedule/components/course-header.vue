<template>
  <div class="course-header">
    <div class="bg" />
    <div class="date">
      <vis-icon
        name="calendar-o"
        size="16px"
        color="#00b389"
      />
      <span>{{ header.date }}</span>
    </div>
    <div class="time">
      {{ header.time }}
    </div>
    <div v-if="header.eduCourseName" class="name">
      <custom-tag v-if="isTrial" class="name-tag" :tag-text="'试听'" />
      {{ header.eduCourseName }}
    </div>
    <div v-if="header.categoryName" class="name">
      {{ header.categoryName }}
    </div>
  </div>
</template>

<script>
import { Icon } from '@youzan/vis-ui';
import customTag from '../../../../components/custom-tag';

export default {
  name: 'course-header',
  components: {
    'vis-icon': Icon,
    'custom-tag': customTag,
  },
  props: {
    header: {
      type: Object,
      default: () => {
        return {};
      },
    },
    isTrial: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="scss" scoped>
.course-header {
  position: relative;
  padding: 23px 15px;
  width: 100%;
  height: 170px;
  border-radius: 4px;
  background: linear-gradient(to right, #01cb9c, #00b389);
  .bg {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 90px;
    height: 115px;
    background-image: url('https://b.yzcdn.cn/public_files/2019/03/13/25f83475adb101c0fa5d0cd4744b837b.png');
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: 100px 130px;
  }
  .date {
    display: inline-block;
    padding: 0 10px;
    height: 22px;
    line-height: 22px;
    background-color: #fff;
    border-radius: 11px;
    font-size: 12px;
    color: #00b389;
    .vis-icon {
      margin-right: 2px;
      vertical-align: -.2em;
    }
  }
  .time {
    font-size: 40px;
    font-weight: 500;
    color: #fff;
    line-height: 56px;
  }
  .name {
    font-size: 12px;
    color: #fff;
    line-height: 23px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;

    &-tag {
      vertical-align: middle;
    }
  }
}
</style>
