<template>
  <div
    v-if="!pause"
    class="danmu-container">
    <div
      v-for="(item, index) in items"
      :key="index"
      :class="item.classes">
      <img
        :src="item.data.avatar"
        class="danmu-container__avator">
      <div
        class="danmu-container__desc">
        {{ item.data.content || '' }}
      </div>
    </div>
  </div>
</template>

<script>
const DIFF_TIME = 2000;
export default {
  name: 'danmu',

  props: {
    realMsg: Object,
    pause: Boolean,
  },

  data() {
    return {
      items: [],
      localItems: [],
    };
  },

  watch: {
    realMsg(newValue) {
      this.localItems.push(newValue);
    },
  },

  mounted() {
    setInterval(() => {
      const localItems = this.localItems;
      if (localItems.length) {
        this.pushMsg(this.localItems.shift());
      }
    }, DIFF_TIME);
  },

  methods: {
    pushMsg(json) {
      const msg = {
        classes: ['danmu-container__item', 'clearfix'],
        data: json.fromMsg,
        good: true,
      };

      this.items.push(msg);

      // DIFF_TIME s 后进入中间状态
      setTimeout(() => {
        msg.classes.push('middle');
      }, DIFF_TIME);

      // DIFF_TIME * 2 s后消失
      setTimeout(() => {
        msg.classes.splice(2);
        msg.classes.push('end');

        setTimeout(() => { msg.good = false; }, 500);

        setTimeout(() => {
          if (this.items.length <= 2) return;

          const hasMsgs = this.items.slice(0, -2)
            .map(({ good }) => good)
            .reduce((left, right) => left || right);

          if (!hasMsgs) this.items.splice(0, this.items.length - 2);
        }, DIFF_TIME * 2);
      }, DIFF_TIME * 2);
    },
  },
};
</script>

<style lang="scss">
  .danmu-container {
    position: absolute;
    bottom: 120px;
    right: 0;

    &__item {
      width: 128px;
      opacity: .9;
      position: absolute;
      right: 0;
      bottom: 0;
      transition: all .4s;

      &.middle {
        opacity: .3;
        transform: translateY(-110%);
      }

      &.end {
        opacity: 0;
        transform: translateY(-110%);
      }
    }

    &__avator {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      float: right;
      margin-left: 8px;
    }

    &__desc {
      max-width: 90px;
      border-radius: 2px;
      box-sizing: border-box;
      padding: 8px 10px;
      background-color: rgba(0, 0, 0, .6);
      color: #fff;
      font-size: 14px;
      line-height: 22px;
      max-height: 56px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      float: right;
    }
  }
</style>
