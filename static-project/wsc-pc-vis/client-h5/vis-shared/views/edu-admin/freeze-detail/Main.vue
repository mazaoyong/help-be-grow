<template>
  <vis-standard-popup
    title="冻结课时明细"
    :value="value"
    closeable
    class="vis-c-freeze-detail"
    :buttons="buttons"
    v-on="proxyListeners"
  >
    <van-notice-bar
      color="#323233"
      left-icon="info"
      wrapable
      :scrollable="false"
      class="vis-c-freeze-detail__notice-bar"
    >
      <span
        class="vis-c-freeze-detail__notice-bar-text"
      >{{ tip }}</span>
    </van-notice-bar>
    <vis-select-list
      :params="params"
      :request="fetchPromise"
      :checked-color="themeMainColor"
      type="multi"
      list-class="vis-c-freeze-detail__select-list"
      list-item-class="vis-c-freeze-detail__select-list-item"
      @selectedChange="onChanged"
    >
      <vis-info-card
        slot-scope="{item}"
        :title="item.lessonName"
        :subtitle="genTime(item.startTime, item.endTime)"
        :footer-list="genFooterList(item)"
        class="vis-c-freeze-detail__select-list-item-infocard"
      />
    </vis-select-list>
  </vis-standard-popup>
</template>

<script>
import { Popup, InfoCard } from '@youzan/vis-ui';
import { NoticeBar, Toast } from 'vant';
import format from 'date-fns/format';
import SelectList from './select-list';

export default {
  components: {
    'vis-standard-popup': Popup,
    'van-notice-bar': NoticeBar,
    'vis-select-list': SelectList,
    'vis-info-card': InfoCard,
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
    tip: {
      type: String,
      default: '',
    },
    params: {
      type: Object,
      default() {
        return {};
      },
    },
    fetchPromise: {
      type: Function,
      required: true,
    },
    removePromise: {
      type: Function,
      required: true,
    },
    buttonText: {
      type: String,
      default: '移除',
    },
    removeSuccessText: {
      type: String,
      default: '移除成功',
    },
    themeMainColor: {
      type: String,
      default: '#00b389',
    },
  },

  data() {
    return {
      selected: [],
    };
  },

  computed: {
    buttons() {
      return [
        {
          text: this.buttonText,
          class: 'vis-c-freeze-detail__main-btn',
          color: this.themeMainColor,
          onClick: () => {
            if (this.selected.length) {
              this.removePromise(this.selected)
                .then(res => {
                  if (res) {
                    setTimeout(() => {
                      Toast(this.removeSuccessText);
                    }, 0);
                    this.$emit('resolve', 'success');
                  } else {
                    this.$emit('resolve', 'fail');
                  }
                })
                .catch(err => {
                  this.$emit('resolve', 'fail');
                  Toast(err || '操作失败');
                });
            } else {
              Toast('请至少选择一个日程');
            }
          },
        },
      ];
    },
  },

  methods: {
    onChanged(res) {
      console.log('选择了什么结果', res);
      this.selected = res;
    },
    genTime(startTime, endTime) {
      const day = format(startTime, 'YYYY-MM-DD');
      const start = format(startTime, 'HH:mm');
      const end = format(endTime, 'HH:mm');
      return `${day}  ${start}-${end}`;
    },
    genFooterList(conf) {
      return [
        { name: '冻结课时', value: conf.lockNum / 100, hidden: !conf.lockNum },
        { name: '上课教室', value: conf.classroomName, hidden: !conf.classroomName },
        { name: '老师', value: conf.teacherName, hidden: !conf.teacherName },
      ];
    },
  },
};
</script>

<style lang="scss">
  .vis-c-freeze-detail {
    background-color: #f7f8fa;

    .vis-standard-popup__content {
      padding-bottom: 20px;
    }

    &__main-btn {
      color: #fff;
    }

    &__notice-bar {
      position: absolute;
      z-index: 9;

      &-text {
        white-space: pre-wrap;
      }

      .van-notice-bar__left-icon {
        color: #f1924e;
      }
    }

    &__select-list {
      margin-top: 64px;
      overflow: hidden;

      &-item {
        margin: 12px 12px 0;
        background-color: #fff;
        padding: 16px;
        border-radius: 4px;

        .van-checkbox__icon {
          align-self: flex-start;
          margin-top: 4px;
        }

        .van-checkbox__label {
          flex: 1;
        }

        &-infocard {
          margin-top: 0;
          padding: 0;
        }
      }
    }
  }
</style>
