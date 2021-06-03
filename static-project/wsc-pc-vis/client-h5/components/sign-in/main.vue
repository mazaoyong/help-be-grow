<template>
  <vis-popup-confirm
    :value="value"
    :title="title"
    @confirm="confirm"
    @cancel="cancel"
    v-on="proxyListeners"
  >
    <v-confirm-content
      :data="contentData"
      :start-time="startTime"
      :students="students"
      :kdt-id="kdtId"
      :type="type"
      :sign-in-all-students="signInAllStudents"
    />
  </vis-popup-confirm>
</template>

<script>
import { Toast } from 'vant';
import { PopupConfirm } from '@youzan/vis-ui';
import ConfirmContentView from './views/confirm/main.vue';
import { CHECK_TEXT, CHECK_TYPE } from './contants';
import dubbleCheck from './views/dubble-check';
import { getBatchSignInTip, getSignInTip } from './apis';

export default {
  components: {
    'vis-popup-confirm': PopupConfirm,
    'v-confirm-content': ConfirmContentView,
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
    name: {
      type: String,
      default: '',
    },
    students: {
      type: Array,
      default() {
        return [];
      },
    },
    lessonNo: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    kdtId: {
      type: [String, Number],
      default: 0,
    },
    startTime: {
      type: Number,
      default: 0,
    },
    signInAllStudents: {
      type: Boolean,
      default: false,
    },
    signInAllStudentsNumber: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      contentData: {},
    };
  },

  computed: {
    batchStudent() {
      return this.students.length > 1 || this.signInAllStudents;
    },
    title() {
      const studentsLength = this.signInAllStudents ? this.signInAllStudentsNumber : this.students.length;
      const name = this.batchStudent ? `${studentsLength}名学员` : `“${(this.students[0] || {}).studentName}”`;
      return `确定${name}${CHECK_TEXT[this.type]}？`;
    },
  },

  mounted() {
    if (this.batchStudent) {
      getBatchSignInTip({
        lessonNo: this.lessonNo,
        kdtId: this.kdtId,
        signInType: CHECK_TYPE[this.type],
        studentLessonNos: this.students.map(o => o.studentLessonNo),
      })
        .then(res => {
          this.contentData = res;
        })
        .catch(err => {
          Toast(err);
        });
    } else {
      getSignInTip({
        lessonNo: this.lessonNo,
        kdtId: this.kdtId,
        signInType: CHECK_TYPE[this.type],
        studentLessonNo: this.students.map(o => o.studentLessonNo)[0],
      })
        .then(res => {
          this.contentData = res;
        })
        .catch(err => {
          Toast(err);
        });
    }
  },

  methods: {
    confirm() {
      console.log('点击了确认');
      dubbleCheck(this.lessonNo, this.students, this.type, this.kdtId, this.signInAllStudents)
        .then(({ success }) => {
          // 签到成功
          console.log('签到', success);
          this.$emit('resolve', { success });
        });
    },
    cancel() {
      console.log('点击了取消');
    },
  },
};
</script>

<style lang="scss">

</style>
