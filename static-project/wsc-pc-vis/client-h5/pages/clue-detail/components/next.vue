<template>
  <a
    class="next"
    href="javascript: void(0);"
    @click="onNext"
  >
    <span>下一条</span>
    <icon
      class="arrow-right"
      name="arrow"
      size="14px"
      color="#646566"
    />
  </a>
</template>

<script>
import { Toast } from 'vant';
import { Icon } from '@youzan/vis-ui';

export default {
  name: 'next',
  components: {
    'icon': Icon,
  },
  props: {
    clueId: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    onNext() {
      const { clueId } = this;
      this.$store.dispatch('clueDetailModule/getNextDetailById', { clueId })
        .then(res => {
          if (res.clueId) {
            window.location.replace(`/v4/vis/h5/edu/clue/clue-detail?clueId=${res.clueId}`);
          } else {
            Toast('当前已是最后一条');
          }
        })
        .catch(err => {
          Toast(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.next {
  display: block;
  position: fixed;
  right: 14px;
  bottom: 100px;
  padding-left: 15px;
  width: 80px;
  height: 26px;
  line-height: 26px;
  font-size: 13px;
  color: #646566;
  border-radius: 13px;
  background-color: #fff;
  box-shadow: 0 0 10px #ccc;
  .arrow-right {
    position: absolute;
    top: 7px;
    right: 10px;
  }
}
</style>
