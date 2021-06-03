<template>
  <div v-if="showTuitionPopover" class="tuition-container">
    <div class="tuition" @click="handleClick">
      <img
        class="tuition-red"
        src="https://img01.yzcdn.cn/upload_files/2020/09/24/FsrcDNej5PHMz6Y0LfHPjezkXGzh.png"
      >
      <span>
        攒学费换课程，最高抵扣
        <span v-theme:color.main class="tuition-discount">{{
          maxTuition / 100
        }}</span>
        元
      </span>
      <van-icon
        class="tuition-icon"
        name="arrow"
        color="#fff"
        size="14"
      />
      <van-icon
        class="tuition-icon tuition-icon-clear"
        name="cross"
        color="#fff"
        size="14"
        @click.stop="onClose"
      />
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant';
import { mapGetters } from 'vuex';
import { redirect } from '@/common/utils/custom-safe-link';

export default {
  name: 'tuition',

  components: {
    'van-icon': Icon,
  },

  rootGetters: ['maxTuition'],

  rootState: ['activityData'],

  computed: {
    ...mapGetters(['showTuitionPopover']),
  },

  methods: {
    onClose() {
      this.$rootDispatch('closeTuitionPopover');
    },

    handleClick() {
      const { activityAlias = '' } = this.activityData || {};
      redirect({
        url: `wscvis/ump/tuition/${activityAlias}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.tuition-container {
  position: fixed;
  right: 8px;
  bottom: 50px;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);

  .tuition {
    display: flex;
    padding: 8px 12px;
    font-size: 15px;
    line-height: 20px;
    color: #fff;
    text-align: right;
    background-color: rgba(50, 50, 50, .8);
    border-radius: 20px;
    align-items: center;

    &-icon {
      &-clear {
        padding: 3px;
        margin-left: 9px;
        background-color: #7d7e80;
        border-radius: 50%;
      }
    }

    &-discount {
      font-weight: 500;
    }

    &-red {
      width: 15px;
      height: 19px;
      margin-right: 8px;
      animation: breath 400ms linear 400ms infinite;
    }

    @keyframes breath {
      from {
        transform: scale(1.5);
      }

      50% {
        transform: scale(1);
      }

      to {
        transform: scale(1.5);
      }
    }
  }
}
</style>
