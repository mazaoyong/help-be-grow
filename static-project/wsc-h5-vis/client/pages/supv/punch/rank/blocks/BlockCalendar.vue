<template>
  <div class="block-calendar">
    <div class="block-calendar__card">
      <div class="block-calendar__card__header">
        <van-icon name="clock-o" :size="14" color="#999" />
        <span class="title__task-count">共{{ taskCount }}天</span>
        <span v-if="startAt" class="title__date-range">
          ({{ startAt | formateDate('.') }}-{{ endAt | formateDate('.') }})
        </span>
      </div>
      <punch-calendar
        :time="time"
        :date-status-list="dateStatusList"
        @select="onSelected"
      />
      <div class="block-calendar__card__footer">
        <span class="punch-status"><span class="gray" />缺打卡</span>
        <span class="punch-status"><span class="yellow" />补打卡</span>
        <span class="punch-status"><span class="green" />已打卡</span>
      </div>
    </div>

    <div v-if="taskContent && taskContent.length" class="block-calendar__card card--detail">
      <div class="block-calendar__title">
        {{ taskName }}
      </div>
      <div class="block-calendar__date">
        {{ taskDate | formateDate }}
      </div>
      <div class="block-calendar__content">
        <task-content :task-content="taskContent" />
      </div>
      <div class="block-calendar__mask" />
      <div
        class="block-calendar__button"
        @click="onGoDetail"
      >
        查看详情
        <van-icon name="arrow" :size="12" />
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant';
import { createNamespacedHelpers } from 'vuex';
import * as SafeLink from '@youzan/safe-link';
import buildUrl from '@youzan/utils/url/buildUrl';
import {
  format,
} from 'date-fns';
import TaskContent from 'supv/punch/components/task-content';
import PunchCalendar from '../components/punch-calendar';
import {
  UPDATE_TASK_DATE,
} from '../store/modules/calendar/mutation-types';

const {
  mapState, mapGetters, mapActions, mapMutations,
} = createNamespacedHelpers('calendar');

export default {
  name: 'block-calendar',

  filters: {
    formateDate(dateStr, sep = '') {
      if (!dateStr) return '';

      const date = new Date(dateStr.replace(/-/g, '/'));
      return sep ? format(date, `YYYY${sep}MM${sep}DD`) : format(date, 'YYYY[年]M[月]D[日]');
    },
  },

  components: {
    'van-icon': Icon,
    PunchCalendar,
    TaskContent,
  },

  computed: {
    ...mapState([
      'alias',
      'taskDate',
      'startAt',
      'endAt',
      'taskCount',
      'dateStatusList',
      'taskName',
      'taskContent',
    ]),
    ...mapGetters([
      'time',
    ]),
  },

  created() {
    this.fetchDetail();
  },

  methods: {
    ...mapMutations([
      UPDATE_TASK_DATE,
    ]),
    ...mapActions([
      'fetchDetail',
      'fetchTaskContent',
    ]),

    onSelected(date) {
      this[UPDATE_TASK_DATE](format(date, 'YYYY/MM/DD'));
      this.fetchTaskContent();
    },

    onGoDetail() {
      const kdtId = _global.kdt_id;
      SafeLink.redirect({
        url: buildUrl(
          `/wscvis/supv/punch/task?kdt_id=${kdtId}&alias=${this.alias}&current_date=${this.taskDate.replace(/\//g, '-')}`,
          'h5',
          kdtId,
        ),
        kdtId: kdtId,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.block-calendar {
  &__card {
    margin: 20px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, .1);

    &__header {
      height: 40px;
      font-size: 13px;
      line-height: 40px;
      border-bottom: 1px solid #f2f2f2;

      ::v-deep .van-icon-clock-o {
        margin: 0 5px 0 15px;
        vertical-align: -2px;
      }

      .title {
        &__task-count {
          color: #333;
        }

        &__date-range {
          color: #999;
        }
      }
    }

    &__footer {
      display: flex;
      height: 40px;
      font-size: 13px;
      line-height: 40px;
      border-top: 1px solid #f2f2f2;
      flex-direction: row-reverse;

      .punch-status {
        display: inline-block;
        width: 54px;
        margin-right: 15px;
        line-height: 40px;
        color: #999;

        &:first-child {
          margin-right: 10px;
        }

        span {
          display: inline-block;
          width: 8px;
          height: 8px;
          margin-right: 4px;
          border-radius: 4px;

          &.green {
            background-color: #00b389;
          }

          &.yellow {
            background-color: #ffbb17;
          }

          &.gray {
            background-color: #999;
          }
        }
      }
    }
  }

  .card--detail {
    position: relative;
    padding: 15px;
  }

  &__title {
    display: -webkit-box;
    overflow: hidden;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  &__date {
    height: 30px;
    font-size: 13px;
    line-height: 30px;
    color: #999;
  }

  &__content {
    max-height: 115px;
    min-height: 64px;
    overflow: hidden;
  }

  &__button {
    height: 20px;
    margin-top: 25px;
    font-size: 14px;
    line-height: 20px;
    color: #00b389;

    ::v-deep .van-icon {
      font-weight: 700;
      vertical-align: -1px;
    }
  }

  &__mask {
    position: absolute;
    bottom: 60px;
    left: 0;
    width: 100%;
    height: 64px;
    background-image: linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%);
  }
}
</style>
