<template>
  <div class="check-v-confirm">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="check-v-confirm__item"
    >
      <div class="check-v-confirm__item-circle" />
      <p class="check-v-confirm__item-text">
        {{ item.text }}
      </p>
      <p
        v-if="item.type === 2 || item.type === 3"
        class="check-v-confirm__item-link"
        @click="item.fn"
      >
        {{ item.extra }}
      </p>
    </div>
    <div
      v-if="!isReachTime"
      class="check-v-confirm__tip"
      :style="{
        paddingTop: list.length ? '8px' : 0
      }"
    >
      <van-icon
        name="warning"
        color="#f1924e"
        size="16px"
        class="check-v-confirm__tip-icon"
      />
      <span>上课日期未到，请谨慎操作</span>
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant';
import format from 'date-fns/format';
import endOfToday from 'date-fns/end_of_today';
import getTime from 'date-fns/get_time';
import openLessonList from '../lesson-list';
import openStudentList from '../student-list';
import { SIGN_IN_TYPE } from '../../contants';

export default {
  components: {
    'van-icon': Icon,
  },
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    students: {
      type: Array,
      default() {
        return [];
      },
    },
    startTime: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: '',
    },
    kdtId: {
      type: [Number, String],
      default: 0,
    },
    signInAllStudents: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {

    };
  },

  computed: {
    isBatchStudent() {
      return this.signInAllStudents || this.students.length > 1;
    },

    list() {
      // 还需要操作类型，不同操作类型不同展示
      const {
        signInTipType,
        consumeNum,
        activeTime,
        activeStudentNum,
        cancelStudentLessonNum,
        activeStudentNames,
        assetNo,
        assetNos,
      } = this.data;
      let list = [];

      const consumeNumView = {
        type: 0,
        text: `需扣除${consumeNum / 100}课时。`,
      };

      const time = format(+activeTime, 'MM月DD日');
      const activeTimeView = {
        type: 1,
        text: `课程${time}开始生效。`,
      };

      const activeStudentNumView = this.isBatchStudent ? (
        activeStudentNum ? {
          type: 2,
          text: `${activeStudentNum}名学员的课程${time}开始生效。`,
          extra: '查看学员',
          fn: () => {
            console.log('点击学员');
            openStudentList({
              props: {
                studentNames: activeStudentNames,
              },
            });
          },
        } : null
      ) : activeTimeView;

      const cancelStudentLessonNumView = {
        type: 3,
        text: `${time}前的 ${cancelStudentLessonNum} 个日程将自动失效。`,
        extra: '查看上课日程',
        fn: () => {
          console.log('点击课程');
          openLessonList({
            props: {
              assetNos: this.isBatchStudent ? assetNos : [assetNo],
              kdtId: this.kdtId,
              endTime: activeTime,
            },
          });
        },
      };

      if (signInTipType === SIGN_IN_TYPE.SIGN_IN_ACTIVE_CANCEL_CONSUME) {
        list = [
          consumeNumView,
          activeStudentNumView,
          cancelStudentLessonNumView,
        ];
      } else if (signInTipType === SIGN_IN_TYPE.SIGN_IN_ACTIVE_CONSUME) {
        list = [
          consumeNumView,
          activeStudentNumView,
        ];
      } else if (signInTipType === SIGN_IN_TYPE.SIGN_IN_ACTIVE_CANCEL) {
        list = [
          activeStudentNumView,
          cancelStudentLessonNumView,
        ];
      } else if (signInTipType === SIGN_IN_TYPE.SIGN_IN_ACTIVE) {
        list = [
          activeStudentNumView,
        ];
      } else if (signInTipType === SIGN_IN_TYPE.SIGN_IN_CONSUME) {
        list = [
          consumeNumView,
        ];
      } else if (signInTipType === SIGN_IN_TYPE.SIGN_IN) {
        list = [
        ];
      }

      list[0] && (list[0].text = `确定后${list[0].text}`);

      return list;
    },
    isReachTime() {
      return getTime(endOfToday()) > this.startTime;
    },
  },
};
</script>

<style lang="scss">
  .check-v-confirm {
    margin-top: 10px;

    &__item {
      display: flex;
      align-items: center;
      color: #323233;
      margin-bottom: 16px;
      padding-left: 16px;
      flex-wrap: wrap;

      &-circle {
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background-color: #00b389;
        margin-right: 8px;
        margin-left: -16px;
      }

      &-text {
        font-size: 16px;
        line-height: 22px;
      }

      &-link {
        color: #00b389;
      }
    }

    &__tip {
      font-weight: bold;
      font-size: 13px;
      line-height: 17px;
      display: flex;
      align-items: center;

      &-icon {
        margin-right: 8px;
        margin-top: -2px;
      }
    }
  }
</style>
