<template>
  <div class="action-bar">
    <div class="action-bar__check">
      <van-checkbox
        v-if="showAll"
        v-model="isChecked"
        checked-color="#00b389"
        :disabled="!validCount"
        @click="onCheckboxChange"
      >
        全选
      </van-checkbox>
      <span class="action-bar__statistics">
        <span>已选（{{ selectedCount }}）</span>
        <span v-if="appointmentLimit">，可选（{{ appointmentRemaining }}）</span>
      </span>
    </div>
    <div class="action-bar__confirm" @click="onConfirm">
      确定
    </div>
  </div>
</template>

<script>
import { Checkbox } from 'vant';

export default {
  name: 'action-bar',

  components: {
    'van-checkbox': Checkbox,
  },

  props: {
    selectedCount: {
      type: Number,
      default: 0,
    },
    remainingCount: {
      type: Number,
      default: 0,
    },
    appointmentLimit: {
      type: Number,
      default: 0,
    },
    appointmentRemaining: {
      type: Number,
      default: 0,
    },
    validCount: {
      type: Number,
      default: 0,
    },
    showAll: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      isChecked: false,
    };
  },

  watch: {
    remainingCount(newV) {
      if (this.selectedCount && newV === 0) {
        this.isChecked = true;
      } else {
        this.isChecked = false;
      }
    },

    validCount(newV) {
      if (!newV) {
        this.isChecked = false;
      }
    },
  },

  methods: {
    onConfirm() {
      this.$emit('confirm');
    },

    onCheckboxChange() {
      this.$emit(!this.isChecked ? 'select-all' : 'unselect-all');
    },
  },
};
</script>

<style lang="postcss">
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  height: 100%;
  background: #fff;

  &__check {
    display: flex;
    align-items: center;
  }

  &__statistics {
    margin-left: 8px;
    line-height: 18px;
    font-size: 13px;
    color: #969799;
  }

  &__confirm {
    padding: 0 21px;
    line-height: 26px;
    font-size: 16px;
    color: #fff;
    background: #00b389;
    border-radius: 13px;
  }
}
</style>
