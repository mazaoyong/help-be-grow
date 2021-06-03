<template>
  <component :is="courseComponentName" />
</template>

<script>
import EduCourse from './components/edu-course';
import PctCourse from './components/pct-course';

export default {
  name: 'course-block',

  components: {
    EduCourse,
    PctCourse,
  },

  getters: ['isCourse'],

  computed: {
    courseComponentName() {
      return this.isCourse ? 'edu-course' : 'pct-course';
    },
  },
};
</script>
