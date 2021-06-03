<template>
  <get-course
    v-if="!loading"
    :alias="aliasList"
    :on-submit="onSubmit"
  />
</template>

<script>
import map from 'lodash/map';
import { Toast } from 'vant';
import { mapState } from 'vuex';
import GetCourse from 'components/get-course';
import * as SafeLink from '@youzan/safe-link';

export default {
  name: 'present-list',

  components: {
    [GetCourse.name]: GetCourse,
  },

  computed: {
    ...mapState(['loading', 'list', 'orderNo', 'alias']),

    aliasList() {
      return map(this.list, item => item.alias);
    },
  },

  methods: {
    // 跳转到赠品列表
    redirectToPresent() {
      setTimeout(() => {
        SafeLink.redirect({
          url: `/wscump/presents?kdt_id=${_global.kdt_id}`,
          kdtId: _global.kdt_id,
        });
      }, 3000);
    },
    onSubmit(data) {
      return new Promise((resolve, reject) => {
        this.$store.dispatch('receivePresent', {
          data,
          success: res => {
            if (res && res.data && res.data.successNum) {
              Toast.success('领取成功');
            } else {
              Toast.success(res.msg || '你来晚了，赠品已经领完了');
            }
            this.redirectToPresent();
          },
          fail: err => {
            resolve();
            Toast.fail(err.msg || '你来晚了，赠品已经领完了');
            if (Number(err.code) === 320500011) {
              this.redirectToPresent();
            }
          },
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
