<template>
  <div class="timeline-day">
    <div class="timeline-day__date">
      <template v-if="today(feeds[0].createdAt)">
        <span class="timeline-day__date-day" style="font-size: 20px;">
          今天
        </span>
      </template>
      <template v-else-if="yesterday(feeds[0].createdAt)">
        <span class="timeline-day__date-day" style="font-size: 20px;">
          昨天
        </span>
      </template>
      <template v-else>
        <span class="timeline-day__date-day">
          {{ getDay }}
        </span>
        <span class="timeline-day__date-month">
          {{ getMonth }}
        </span>
      </template>
    </div>
    <div
      class="timeline-day__content"
    >
      <div
        @click="$emit('clickItem', feed)"
        v-for="(feed, index) in feeds"
        :key="index"
      >
        <timeline-item
          :extraContents="feed.extraContents"
          :desc="feed.textContent"
          :deleteImg="deleteImg"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { isToday, isYesterday } from 'date-fns';
import TimelineItem from './timeline-item';

export default {
  name: 'timeline-day',
  components: {
    'timeline-item': TimelineItem,
  },
  props: {
    feeds: {
      type: Array,
      default: () => [],
    },
    deleteImg: {
      type: String,
      default: 'https://img01.yzcdn.cn/public_files/2019/10/12/picture_delete.png',
    },
  },
  computed: {
    getDay() {
      const date = new Date(this.feeds[0].createdAt).getDate();
      if (date < 10) {
        return `0${date}`;
      }
      return date;
    },
    getMonth() {
      return `${new Date(this.feeds[0].createdAt).getMonth() + 1}月`;
    },
  },
  methods: {
    today(date) {
      return isToday(date);
    },
    yesterday(date) {
      return isYesterday(date);
    },
  },
};
</script>

<style lang="scss" scoped>
.timeline-day {
  display: flex;
  width: 100%;
  flex-direction: row;
  margin-top: 26px;

  &__date {
    width: 93px;
    padding-right: 22px;

    &-day {
      font-weight: bold;
      font-size: 26px;
    }

    &-month {
      font-size: 14px;
    }
  }

  &__content {
    flex: 1;
    overflow: hidden;
    word-break: break-all;
  }
}
</style>
