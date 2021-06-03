<template>
  <div>
    <div class="wait-course-container">
      <div class="wait-course__header">
        <a
          v-if="waitList.length > 3"
          @click="onWaitList"
          class="wait-course__view-all"
        >
          查看全部
          <van-icon name="arrow" />
        </a>
        <h3 class="wait-course__title">
          待上课时间
        </h3>
      </div>
      <div class="wait-course--wrap">
        <!-- 意向体验课 -->
        <div v-if="targetCourse && targetCourse.courseTimeStamp" class="target-course">
          <div class="target-course__date">
            意向体验时间：{{ targetCourse.courseTimeStamp | formatDate }}
          </div>
          <div class="target-course__desc">
            这是您的意向上课时间，机构未确认，建议和机构确认后再前往上课
          </div>
        </div>

        <van-swipe
          v-else-if="waitList.length > 0"
          :loop="false"
          class="van-swipe--static"
        >
          <van-swipe-item
            v-for="(item, index) in threeList"
            :key="index"
          >
            <course-item
              :item="item"
              class="item__bg"
            />
          </van-swipe-item>
        </van-swipe>
        <template v-else>
          <div
            v-if="courseType === 1"
            class="wait-course__no-data-page"
          >
            <p>暂无上课日程</p>
          </div>
          <div
            v-else
            class="wait-course__no-data-page"
          >
            <p>机构还没有为你确认上课时间</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon, Swipe, SwipeItem } from 'vant';
import CourseItem from '../../../components/course-item';
import { format, getDay } from 'date-fns';

export default {
  name: 'wait-course',

  components: {
    'van-icon': Icon,
    'van-swipe': Swipe,
    'van-swipe-item': SwipeItem,
    CourseItem,
  },

  filters: {
    formatDate(ts) {
      if (!ts) return '';

      const cnDays = ['', '一', '二', '三', '四', '五', '六', '日'];
      const cnDay = cnDays[getDay(ts)];
      return format(ts, `YYYY[年]MM[月]DD[日] [周${cnDay}] HH:mm`);
    },
  },

  props: {
    waitList: {
      type: Array,
      default() {
        return [];
      },
    },
    assetNo: {
      type: String,
      default: '',
    },
    courseType: {
      type: Number,
      default: 1,
    },
    targetCourse: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
    threeList() {
      return this.waitList.slice(0, 3);
    },
  },

  methods: {
    onWaitList() {
      this.$router.push({
        name: 'CourseList',
        params: {
          assetNo: this.assetNo,
        },
      });
    },
  },
};
</script>

<style lang="scss">
.wait-course-container {
  position: relative;
  background-color: #fff;
  box-sizing: border-box;
  margin-top: 10px;
  padding-bottom: 20px;
  border-radius: 4px;
}

.wait-course__header {
  box-sizing: border-box;
  position: relative;
  height: 46px;
  padding: 13px 15px;
}

.wait-course__title {
  margin: 0;
  line-height: 20px;
  color: #323233;
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.wait-course__view-all {
  float: right;
  line-height: 18px;
  font-size: 13px;
  color: #969799;
  display: flex;
  justify-content: center;
  align-items: center;

  .van-icon-arrow {
    font-size: 8px;
    margin-left: 4px;
  }
}

.wait-course__no-data-page {
  background-color: #f7f7f7;
  text-align: center;
  line-height: 107px;
  font-size: 12px;
  color: #969799;
  border-radius: 4px;
}

.wait-course--wrap {
  padding: 0 10px;
  position: relative;

  .van-swipe--static {
    position: static;

    .van-swipe__indicators {
      bottom: -12px;
    }
  }

  .item__bg {
    background-color: #f7f7f7;
  }

  .course-item.item__bg .item-time {
    font-size: 13px;
  }
}

i.van-swipe__indicator {
  width: 8px;
  height: 2px;
  border-radius: 1px;
}

.target-course {
  padding: 16px 15px;
  background-color: #f7f7f7;
  border-radius: 4px;

  &__date {
    line-height: 18px;
    font-size: 13px;
    color: #323233;
    font-weight: 500;
  }

  &__desc {
    margin-top: 8px;
    line-height: 17px;
    font-size: 12px;
    color: #969799;
  }
}
</style>
