import { findSimpleByUserId } from '../api';
export default {
  data() {
    return {
      studentList: [], // 学员列表
    };
  },

  computed: {
    // 学员文案
    students() {
      const len = this.studentList.length;
      if (len) {
        const list = this.studentList.slice(0, 2).map(item => (item.name)) || [];
        return len > 2 ? `${list.join('、')}等${len}人` : list.join('、');
      }
      return '';
    },
  },

  methods: {
    // 学生列表 参数{size}
    fetchStudentList(userId) {
      findSimpleByUserId({
        userId,
      })
        .then(list => {
          this.studentList = list || [];
        });
    },
  },

};
