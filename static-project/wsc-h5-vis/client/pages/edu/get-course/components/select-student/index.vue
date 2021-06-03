<template>
  <section>
    <vis-card extend-style="padding: 0 12px;margin-bottom: 10px;">
      <vis-label
        left-content="学员信息"
        no-right
        extend-left-style="font-size: 14px; font-weight: bold; color: #111;"
      />
      <vis-label
        :right-content="stuContent"
        left-content="学员"
        show-arrow
        no-right
        @click="onChooseStudent"
      />
    </vis-card>
    <!-- 学员列表弹窗 开始 -->
    <van-actionsheet
      v-model="visible"
      title="选择学员"
    >
      <vis-student-list
        :student-list="student.list"
        :checked-student="student.current"
        @confirmStudent="onConfirmStudent"
      />
    </van-actionsheet>
    <!-- 学员列表弹窗 结束 -->
  </section>
</template>
<script>
import * as SafeLink from '@youzan/safe-link';
import { Toast, ActionSheet } from 'vant';
import Args from 'zan-utils/url/args';

import VisCard from '../../../components/card';
import VisLabel from '../../../components/label';
import StudentList from '../../../order-confirm/container/student-list';
import API from '../../../api';

const origin = 'https://h5.youzan.com';
const kdtId = _global.kdt_id || Args.get('kdt_Id') || 0;

export default {
  name: 'select-student',

  components: {
    'vis-card': VisCard,
    'vis-label': VisLabel,
    'van-actionsheet': ActionSheet,
    'vis-student-list': StudentList,
  },

  data() {
    return {
      visible: false,
      student: {
        list: [],
        name: '',
        phone: '',
        current: Args.get('checkedStudent') || '',
      },
      cache: {
        student: {},
      },
    };
  },

  computed: {
    stuContent() {
      return this.student.name ? `${this.student.name} ${this.student.phone}` : '选择学员';
    },
  },

  mounted() {
    if (this.student.current !== '') {
      this.getStudentDetail();
    }
  },

  methods: {
    // 点击学员唤起学员弹窗
    onChooseStudent() {
      API.getStudentList().then(res => {
        const { data = [] } = res || {};
        this.student.list = data;
        if (this.student.list.length > 0) {
          this.visible = true;
        } else {
          SafeLink.redirect({
            url: `${origin}/wscvis/edu/student-edit.html?kdt_id=${kdtId}&callback_url=${encodeURIComponent(window.location.href)}`,
            kdtId,
          });
        }
      }).catch(err => {
        this.student.list = [];
        SafeLink.redirect({
          url: `${origin}/wscvis/edu/student-edit.html?kdt_id=${kdtId}&callback_url=${encodeURIComponent(window.location.href)}`,
          kdtId,
        });
        Toast(err);
      });
    },
    // 选择学员
    onConfirmStudent(alias) {
      this.student.current = String(alias) || '';
      this.getStudentDetail();
      setTimeout(() => {
        this.visible = false;
      }, 500);
    },
    // 获取学员详情
    getStudentDetail(alias) {
      const loadingToastInst = Toast.loading({
        duration: 0,
        forbidClick: true,
        message: '加载中...',
      });
      API.getStudentDetail({
        alias: alias || this.student.current || '',
      })
        .then(res => {
          if (res && res.data) {
            const { data } = res;
            this.student.current = String(data.id) || '';
            this.student.name = data.name || '';
            this.student.phone = data.mobile || '';
            this.$emit('choose-student', this.student);
            this.cache.student = data;

            loadingToastInst.clear();
          }
        })
        .catch(err => {
          loadingToastInst.clear();
          Toast(err);
        });
    },
  },
};
</script>
