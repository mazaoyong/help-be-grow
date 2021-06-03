<template>
  <div>
    <teacher-item
      v-for="teacher in teacherList"
      :key="teacher.id"
      :data="teacher"
      :kdt-id="kdtId"
    />
  </div>
</template>

<script>
import TeacherItem from '../teacher-item';

export default {
  components: {
    TeacherItem,
  },

  props: {
    teacherList: {
      type: Array,
      default: () => [],
    },
    kdtId: {
      type: Number,
      required: true,
    },
  },
};
</script>
