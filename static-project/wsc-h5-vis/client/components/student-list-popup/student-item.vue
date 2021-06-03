<template>
  <van-cell
    class="student-item"
    :title="title"
    :clickable="true"
    :label="errorMessage"
    :border="false"
    title-class="student-item__title"
    label-class="student-item__label"
    @click="onCellClick"
  >
    <div v-if="editable" slot="icon" class="student-item__icon--left">
      <van-icon
        class="student-item__icon--edit"
        name="edit"
        size="18"
        @click.stop="onEditClick"
      />
    </div>

    <van-radio
      slot="right-icon"
      class="student-item__radio"
      :class="{ 'student-item__radio--show': isChecked }"
      :name="student.id"
    />
  </van-cell>
</template>

<script>
import { Cell, Icon, Radio } from 'vant';
import { redircetToEdit, checkStudentIsCompleted } from '../../utils';

export default {
  components: {
    'van-cell': Cell,
    'van-icon': Icon,
    'van-radio': Radio,
  },

  props: {
    student: {
      type: Object,
      default: () => ({}),
    },

    isChecked: {
      type: Boolean,
      default: false,
    },

    editable: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    title() {
      return this.student.name + '，' + this.student.mobile;
    },

    isCompleted() {
      return checkStudentIsCompleted(this.student.customAttributeItems);
    },

    errorMessage() {
      if (this.student.classId) {
        return '学员已加入该班级，无法重复报名';
      }

      if (!this.isCompleted) {
        return '学员信息不全，请补充';
      }

      return '';
    },
  },

  methods: {
    onEditClick() {
      redircetToEdit(this.student.id);
    },
    onCellClick() {
      if (this.student.classId) {
        return;
      }

      if (this.isCompleted) {
        return this.$emit('select', this.student);
      }

      redircetToEdit(this.student.id);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

$cell-height: 56px;

.student-item {
  padding: 0;
  align-items: stretch;

  &__title {
    line-height: 20px;
    height: $cell-height;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__label {
    line-height: 16px;
    margin-top: 4px;
    color: #fa1919;
  }

  &__icon--edit {
    color: $disabled-color;
    padding: 8px;
  }

  &__icon--left {
    padding-left: 8px;
    line-height: $cell-height;
    display: flex;
    align-items: center;
  }

  &__radio {
    padding: 0 16px 0px 8px;
    visibility: hidden;

    &--show {
      visibility: visible;
    }
  }

  .van-icon {
    vertical-align: text-bottom;
  }
}
</style>
