<template>
  <div class="timeline-list">
    <div
      v-for="(feeds, index) in dayFeeds"
      :key="index"
    >
      <timeline-day
        v-if="Array.isArray(feeds)"
        :feeds="feeds"
        :delete-img="deleteImg"
        @clickItem="clickItem"
      />
      <div
        v-else
        class="timeline-year"
      >
        {{ feeds }}年
      </div>
    </div>
  </div>
</template>

<script>
import TimelineDay from './timeline-day';
import { isSameDay, endOfDay, getYear, isSameYear } from 'date-fns';

export default {
  name: 'timeline-list',
  components: {
    'timeline-day': TimelineDay,
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    deleteImg: {
      type: String,
      default: 'https://img01.yzcdn.cn/public_files/2019/10/12/picture_delete.png',
    },
  },
  data() {
    return {
    };
  },
  computed: {
    dayFeeds() {
      const res = [];
      const days = Array.from(new Set(this.list.map(item => endOfDay(item.createdAt).toString())));

      let lastDay = new Date();
      for (const day of days) {
        if (!isSameYear(lastDay, day)) {
          res.push(getYear(day));
          lastDay = day;
        }
        res.push(
          this.list.filter(feed => isSameDay(feed.createdAt, day)),
        );
      }
      return res;
    },
  },
  methods: {
    clickItem(feed) {
      this.$emit('clickItem', feed);
    },
  },
};
</script>
<style lang="scss">
.timeline-list {
  margin: 0 16px;
}
.timeline-year {
  font-size: 26px;
  margin-top: 40px;
  margin-bottom: 16px;
}
</style>
