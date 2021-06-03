<template>
  <component
    :is="env.isMobile && sticky ? 'van-sticky' : 'div'"
    v-if="next && total"
    :offset-top="44"
  >
    <div class="next">
      <a
        class="next-content"
        :href="url"
        :style="{ color: mainColor, borderColor: mainColor, backgroundColor: bgColor }"
        @click="click"
      >
        <span class="next-title">{{ next.tip }}</span>
        <van-icon class="next-icon" name="arrow" />
      </a>
    </div>
  </component>
</template>

<script>
import { Sticky, Icon } from 'vant';
import { fns } from '@youzan/vue-theme-plugin';
import storeName from '../../name';

export default {
  storeName,

  components: {
    'van-sticky': Sticky,
    'van-icon': Icon,
  },

  data() {
    return {
      sticky: false,
    };
  },

  state: ['next', 'total'],
  rootState: ['kdtId', 'env'],

  computed: {
    url() {
      return `/wscvis/course/detail/${this.next.alias}?kdt_id=${this.kdtId}`;
    },

    mainColor() {
      return this.$theme.colors.main;
    },

    bgColor() {
      return fns.hexToRgba(this.mainColor, 0.1);
    },
  },

  created() {
    this.$dispatch('initNext');
  },

  methods: {
    click() {
      this.$rootDispatch('updateColumnProgress', {
        title: this.next.title,
        alias: this.next.alias,
      });
    },

    // tab 切换会出现 sticky 样式 bug，所以在切换到另一个 tab 时，这里取消 sticky
    useSticky() {
      this.sticky = true;
    },
    noSticky() {
      this.sticky = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.next {
  display: block;
  padding: 0 16px;
  background-color: $white;

  .next-content {
    position: relative;
    display: block;
    padding: 12px 40px 12px 12px;
    font-size: 13px;
    line-height: 18px;
    border-style: solid;
    border-width: 1px;
    border-radius: 4px;
  }

  .next-title {
    @include ellipsis;
    display: block;
    font-weight: 500;
  }

  .next-icon {
    position: absolute;
    top: 14px;
    right: 16px;
  }
}
</style>
