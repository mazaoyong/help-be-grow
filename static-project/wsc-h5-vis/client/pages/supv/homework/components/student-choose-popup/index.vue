<template>
  <div class="student-choose-popup">
    <van-radio-group v-model="radio">
      <van-cell-group>
        <van-cell
          v-for="student in studentList"
          :key="student.userId"
          :title="student.name + ', ' + student.mobile"
          clickable
          @click="$emit('resolve', student.userId)"
        >
          <template #right-icon>
            <van-radio :name="student.userId" />
          </template>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
// @ts-ignore
import { Popup } from '@youzan/vis-ui';
import { Radio, RadioGroup, Cell, CellGroup } from 'vant';

const StudentChoosePopup = defineComponent({
  props: {
    studentList: {
      type: Array,
      required: true,
      default: [],
    },
  },
  components: {
    'van-radio-group': RadioGroup,
    'van-radio': Radio,
    'van-cell': Cell,
    'van-cell-group': CellGroup,
  },
  setup(props, ctx) {
    const radio = ref(0);

    return {
      radio,
    };
  },
});

export default StudentChoosePopup;

export const openStudentChoosePopup = Popup.getOpenPopup(StudentChoosePopup, {
  props: {
    closeable: false,
    title: '选择学员',
    'close-on-click-overlay': false,
  },
});
</script>

<style lang="scss" scoped>
.student-choose-popup {
  .van-cell {
    height: 56px;
  }

  .van-cell:not(:last-child)::after {
    display: none;
  }

  [class*=van-hairline]::after {
    display: none;
  }

  .van-radio {
    float: right;
  }
}
</style>
