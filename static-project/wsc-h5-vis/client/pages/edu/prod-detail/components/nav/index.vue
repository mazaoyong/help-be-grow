<template>
  <div class="vis-nav">
    <span
      v-for="(item, index) in list"
      :key="item"
      :class="index == selectIndex ? 'item-active' : '' "
      class="item"
      @click="onClickNavItem(index)"
    >
      {{ item }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'nav',
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      selectIndex: 0,
      liftOffsetTopArr: [],
    };
  },
  mounted() {
    window.onscroll = () => {
      let liftNavBoxs = '';
      if (!liftNavBoxs) {
        this.liftNavBoxs = liftNavBoxs = document.getElementsByClassName('lift-nav-box') || '';
      }
      if (!liftNavBoxs) {
        return;
      }
      if (
        liftNavBoxs &&
        liftNavBoxs.length > 0 &&
        this.liftOffsetTopArr.length === 0
      ) {
        for (let i = 0, len = liftNavBoxs.length; i < len; i++) {
          this.liftOffsetTopArr.push({
            index: i,
            offsetTop: liftNavBoxs[i].offsetTop,
          });
        }
      }

      const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
      if (!liftNavBoxs || !liftNavBoxs.length) {
        return;
      }
      for (let i = 0, len = this.liftOffsetTopArr.length; i < len; i++) {
        if (scrollTop < this.liftOffsetTopArr[0].offsetTop - 46) {
          this.selectIndex = 0;
          return;
        }
        if (
          scrollTop > this.liftOffsetTopArr[i].offsetTop - 46 &&
          scrollTop < this.liftOffsetTopArr[i + 1].offsetTop - 46
        ) {
          this.selectIndex = i;
          return;
        }
        if (scrollTop >= this.liftOffsetTopArr[len - 1].offsetTop - 46) {
          this.selectIndex = len - 1;
          return;
        }
      }
    };
  },
  methods: {
    onClickNavItem(index) {
      if (!this.liftNavBoxs) { // 主动触发scroll事件
        const e = window.document.createEvent('UIEvents');
        e.initUIEvent('scroll', true, false, window, 0);
        window.dispatchEvent(e);
      }
      if (this.liftOffsetTopArr.length > 0 && this.liftOffsetTopArr[index]) {
        window.scrollTo(0, this.liftOffsetTopArr[index].offsetTop - 46);
      }
      setTimeout(() => {
        this.selectIndex = index;
      }, 100);
    },
  },
};
</script>

<style lang="scss">
.vis-nav {
  position: -webkit-sticky;
  position: sticky;
  z-index: 1;
  top: 0;
  display: flex;
  width: 100%;
  height: 44px;
  background-color: #fff;
  border-bottom: 1px solid #f2f2f2;
  .item {
    display: block;
    flex: 1;
    font-size: 14px;
    color: #969799;
    text-align: center;
    height: 44px;
    line-height: 44px;
  }
  .item-active::after {
    display: block;
    margin: -3px auto 0;
    content: '';
    width: 50px;
    height: 3px;
    background-color: #f44;
    border-radius: 100px;
  }
}
</style>
