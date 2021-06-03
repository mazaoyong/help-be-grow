<template>
  <div class="student-popup">
    <van-cell
      v-for="student in studentList"
      :key="student.id"
      class="student-popup__student-item"
      :title="`${student.nickName || student.name}，${student.phoneNumber}`"
      :clickable="true"
      :border="false"
      @click="onStudentClick(student)"
    >
      <van-checkbox
        slot="right-icon"
        :value="selectedId === student.id"
        icon-size="18px"
        :checked-color="$theme.colors.main"
      />
    </van-cell>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Cell as VanCell, Checkbox as VanCheckbox } from 'vant';

export default Vue.extend({
  name: 'student-popup',

  components: {
    VanCell,
    VanCheckbox,
  },

  props: {
    value: Boolean,
    studentList: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      selectedId: -1,
    };
  },

  methods: {
    onStudentClick(student: any) {
      this.selectedId = student.id;
      this.$emit('selected', student);
    },
  },
});
</script>

<style lang="scss">
@import '~supv/examination/style/index';

.student-popup {
  position: absolute;
  width: 100%;
  height: 100%;

  &__student-item {
    padding: 16px;

    .van-checkbox {
      padding: 0;
    }
  }
}
</style>
