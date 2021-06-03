<template>
  <van-dialog
    :title="title"
    :value="value"
    :show-cancel-button="canGoToCancel"
    cancel-button-text="前往取消"
    confirm-button-text="我知道了"
    confirm-button-color="#00B389"
    class="check-v-dubble-check-single-dialog"
    v-on="proxyListeners"
    @cancel="goToCancel"
    @confirm="onConfirm"
  >
    <div class="check-v-dubble-check-single-dialog__container">
      <div class="check-v-dubble-check-single-dialog__content">
        {{ content }}
      </div>
      <div class="check-v-dubble-check-single-dialog__sub">
        {{ sub }}
      </div>
    </div>
  </van-dialog>
</template>

<script>
import { Dialog } from 'vant';
import format from 'date-fns/format';
import OpenFreezeDetail from '@/vis-shared/views/edu-admin/freeze-detail';
import { findLockedPage, batchCancel } from '../../../apis';
import { STUDENT_CHECK_CODE } from '../../../contants';

export default {
  components: {
    'van-dialog': Dialog.Component,
  },

  props: {
    value: {
      type: Boolean,
      required: true,
    },
    proxyListeners: {
      type: Object,
      default: () => ({}),
    },
    students: {
      type: Array,
      default() {
        return [];
      },
    },
    kdtId: {
      type: [Number, String],
      default: 0,
    },
    info: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  data() {
    return {
    };
  },

  computed: {
    checkCode() {
      const { checkCode } = this.info;
      return checkCode;
    },
    isShortenTime() {
      const checkCode = this.checkCode;
      return checkCode === STUDENT_CHECK_CODE.ASSET_REMAINING_NOT_ENOUGH ||
        checkCode === STUDENT_CHECK_CODE.ASSET_REMAINING_ENOUGH;
    },
    title() {
      let title = '';
      if (this.isShortenTime) {
        title = '课时不足';
      } else if (this.checkCode === STUDENT_CHECK_CODE.ASSET_EXPIRE) {
        title = '课程已到期';
      } else if (this.checkCode === STUDENT_CHECK_CODE.STUDENT_REMOVED_FROM_LESSON) {
        title = '学员已被移除';
      }

      return title;
    },

    content() {
      const { timeCheckDetail } = this.info;
      const { assetEndTime } = timeCheckDetail || {};
      if (this.isShortenTime) {
        return '学员的课时已被变更。';
      } else if (this.checkCode === STUDENT_CHECK_CODE.ASSET_EXPIRE) {
        return `学员的课程有效期已被变更为${format(assetEndTime, 'YYYY-MM-DD')}。`;
      } else if (this.checkCode === STUDENT_CHECK_CODE.STUDENT_REMOVED_FROM_LESSON) {
        return '学员在该日程中已被移除。';
      }
      return '';
    },

    sub() {
      const { numCheckDetail, message, timeCheckDetail } = this.info;
      const { availableNum, consumeNum, lockedNum } = numCheckDetail || {};
      const { lessonTime } = timeCheckDetail || {};
      let text = '';
      if (this.isShortenTime) {
        const needRemoveLesson = this.checkCode === STUDENT_CHECK_CODE.ASSET_REMAINING_ENOUGH && lockedNum;
        text = `可用课时为${availableNum / 100}，本节课需扣除${consumeNum / 100}课时${needRemoveLesson ? '' : '。'}`;

        if (needRemoveLesson) {
          text += `，有${lockedNum / 100}课时已被其他日程冻结，可前往取消日程。`;
        }
      } else if (this.checkCode === STUDENT_CHECK_CODE.ASSET_EXPIRE) {
        text = `课程在上课日期（${format(lessonTime, 'YYYY-MM-DD')}）前已到期。`;
      } else if (this.checkCode === STUDENT_CHECK_CODE.STUDENT_REMOVED_FROM_LESSON) {
        text = `移除原因：${message}。`;
      }
      return text;
    },

    canGoToCancel() {
      const { numCheckDetail } = this.info;
      const { lockedNum } = numCheckDetail || {};
      return !!lockedNum && this.checkCode === STUDENT_CHECK_CODE.ASSET_REMAINING_ENOUGH;
    },

    tipContent() {
      const { numCheckDetail } = this.info;
      const { availableNum, consumeNum, lockedNum } = numCheckDetail || {};
      let text = '';
      if (this.isShortenTime && lockedNum) {
        text = `${consumeNum ? `本节课需扣减 ${consumeNum / 100} 课时，` : ''}剩余 ${availableNum / 100} 课时可用。\n有 ${lockedNum / 100} 课时已被冻结，可先将学员从日程中移除再操作。`;
      } else {
        text = '';
      }
      return text;
    },
  },

  methods: {
    goToCancel() {
      const { assetNo } = this.info;
      OpenFreezeDetail({
        props: {
          tip: this.tipContent,
          params: {
            kdtId: this.kdtId,
            assetNos: [assetNo],
          },
          fetchPromise: (params) => findLockedPage(params).then((res = {}) => {
            const list = res.content || [];
            list.forEach(o => {
              o.keyName = o.lessonNo;
            });
            return { list, hasNext: list.length === params.pageSize };
          }),
          removePromise: (selectedList) => {
            const req = {
              kdtId: this.kdtId,
              studentLessonNos: selectedList.map(o => o.studentLessonNo),
            };
            return batchCancel(req);
          },
        },
      })
        .then(res => {
          this.$listeners.finish();
        });
    },
    onConfirm() {
      this.$emit('finish');
    },
  },
};
</script>

<style lang="scss">
  .check-v-dubble-check-single-dialog {
    &__container {
      padding: 16px 24px;
    }

    &__content {
      font-size: 14px;
      line-height: 20px;
    }

    &__sub {
      font-size: 13px;
      color: #6f7071;
      margin-top: 8px;
    }
  }
</style>
