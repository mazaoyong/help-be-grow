<template>
  <div class="student-list">
    <van-radio-group
      class="student-list__content"
      icon-size="16"
      :checked-color="$theme.colors.main"
      :value="studentId"
    >
      <student-item
        v-for="student in studentList"
        :key="student.alias"
        :student="student"
        :is-checked="+studentId === student.id"
        :editable="editable"
        @select="onSelect"
      />
    </van-radio-group>
  </div>
</template>

<script>
import { RadioGroup } from 'vant';
import StudentItem from './student-item';

export default {
  name: 'student-list',

  components: {
    'van-radio-group': RadioGroup,
    StudentItem,
  },

  props: {
    studentList: {
      type: Array,
      default: () => [],
    },
    chosenStudentId: {
      type: Number,
      default: undefined,
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      studentId: this.chosenStudentId,
    };
  },

  methods: {
    onSelect(student) {
      this.studentId = student.id;
      setTimeout(() => {
        this.$emit('resolve', student);
      }, 500);
    },
  },
};
</script>
