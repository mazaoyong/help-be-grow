<template>
  <div class="student-item">
    <div class="student-item__body">
      <div class="student-item__student-name">
        {{ studentName }}
      </div>

      <table-list
        :list="infoList"
      />
    </div>
    <div class="student-item__aside">
      <vis-tool-tip
        v-if="checkCode !== 0"
        container-selector=".app-add-student__body"
      >
        <div class="student-item__status-text">
          <p class="student-item__status-text-title">
            {{ statusText }}
          </p>
          <van-icon
            name="question"
            class="student-item__status-text-icon"
          />
        </div>
        <div
          slot="content"
          class="student-item__status-text-extra"
        >
          <span>{{ statusExtraText }}</span>
          <span
            v-if="checkCode === 31"
            class="status-text-extra__go-cancel"
            @click="onGotoCalcel"
          >前往取消日程</span>
          <span
            v-if="checkCode === 31"
          >。</span>
        </div>
      </vis-tool-tip>
    </div>
  </div>
</template>

<script>
import TableList from '@youzan/vis-ui/lib/info-card/src/TableList';
import '@youzan/vis-ui/lib/info-card/index.css';
import { Icon } from 'vant';
import ToolTip from '../../../components/tooltip';

export default {
  name: 'student-item',

  components: {
    TableList,
    [Icon.name]: Icon,
    'vis-tool-tip': ToolTip,
  },

  props: {
    studentName: {
      type: String,
      default: '',
    },
    statusExtraText: {
      type: String,
      default: '',
    },
    checkCode: {
      type: Number,
      default: 0,
    },
    statusText: String,
    status: Number,
    courseType: Number,
    usedHour: Number,
    validHour: Number,
    validDate: String,
  },

  computed: {
    infoList() {
      return [
        { name: '已上课时', value: this.usedHour / 100 },
        { name: '剩余课时', value: this.validHour / 100 },
        { name: '有效期', value: this.validDate, hidden: !this.validDate },
      ];
    },
  },

  methods: {
    onGotoCalcel() {
      this.$emit('goToCancel');
    },
  },
};
</script>

<style lang="postcss">
.student-item {
  display: flex;

  &__body {
    flex: 1 1 auto;
  }

  &__aside {
    flex: 0 0 auto;
  }

  &__student-name {
    line-height: 22px;
    font-weight: 500;
    font-size: 16px;
    color: #323233;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__try-tag {
    padding: 0 5px;
    line-height: 17px;
    font-size: 12px;
    color: #00b389;
    border: 1px solid #00b389;
    border-radius: 2px;
  }

  &__status-text {
    font-size: 14px;
    color: #969799;
    display: flex;
    align-items: center;
    padding-right: 8px;

    &-title {
      line-height: 18px;
    }

    &-icon {
      margin-left: 8px;
      font-size: 13px;
      color: #a9a9a9;
      margin-top: -1px;
    }

    &-extra {
      color: #fff;
      font-size: 12px;
      line-height: 20px;

      .status-text-extra {
        &__go-cancel {
          color: #00b389;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
