<template>
  <vis-popup
    v-model="value"
    title="购买课程可参加以下考试"
    :buttons="[]"
    @input="$emit('input', $event)"
  >
    <exam-list :alias="alias" />
  </vis-popup>
</template>

<script>
import { Popup as VisPopup } from '@youzan/vis-ui';
import ExamList from './ExamList';

export default {
  name: 'exam-popup',

  components: {
    VisPopup,
    ExamList,
  },

  props: {
    value: Boolean,
    alias: {
      type: String,
      default: '',
    },
  },
};
</script>
