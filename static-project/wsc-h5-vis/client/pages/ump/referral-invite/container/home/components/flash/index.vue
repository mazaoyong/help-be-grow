<template>
  <div
    v-if="list.length"
    class="vis-flash"
  >
    <div
      v-for="(item) in localList"
      :key="item.index"
      :class="item.classes"
    >
      <vis-img-wrap
        :width="'28px'"
        :height="'28px'"
        :src="item.data.avatar || 'https://img01.yzcdn.cn/public_files/2017/10/23/1321da81aa84d0539b0d5af73fbbf53b.png'"
        :cover="true"
        class="item__avatar"
      />
      <p class="item__content">
        {{ item.data.content }}
      </p>
    </div>
  </div>
</template>

<script>
// 请注意文件名、最外层元素class和name属性要保持一致
import cloneDeep from 'lodash/cloneDeep';
import makeRandomString from '@youzan/utils/string/makeRandomString';
import { ImgWrap } from '@youzan/vis-ui';
const DIFF_TIME = 2000;

export default {
  name: 'vis-flash',

  components: {
    'vis-img-wrap': ImgWrap,
  },

  props: {
    list: {
      type: Array,
      default() {
        return [
        ];
      },
    },
  },

  data() {
    return {
      localList: [

      ],
      index: 0,
    };
  },

  watch: {
    list(newValue) {
      if (Array.isArray(newValue) && newValue.length) {
        this.init();
      }
    },
  },

  created() {
    if (this.list.length) {
      this.init();
    }
  },

  methods: {
    init() {
      const list = cloneDeep(this.list);

      this.localList = [];

      setInterval(() => {
        this.pushMsg(list[this.index % this.list.length]);

        this.removeMsg();
      }, DIFF_TIME);
      this.pushMsg(list[this.index % this.list.length]);
    },

    pushMsg(content) {
      this.index = this.index + 1;

      const msg = {
        classes: {
          'vis-flash__item': true,
          'middle': false,
          'end': false,
        },
        data: content,
        good: true,
        index: makeRandomString(8),
      };

      this.localList.push(msg);

      setTimeout(() => {
        msg.classes.end = false;
        msg.classes.middle = true;
      }, DIFF_TIME);

      // DIFF_TIME * 2 s后消失
      setTimeout(() => {
        msg.classes.middle = false;
        msg.classes.end = true;

        setTimeout(() => { msg.good = false; }, 500);

        setTimeout(() => {
          const hasMsgs = this.localList.slice(0, -3)
            .map(({ good }) => good)
            .reduce((left, right) => left || right);

          if (!hasMsgs) this.localList.splice(0, this.localList.length - 3);
        }, DIFF_TIME * 4);
      }, DIFF_TIME * 2);
    },

    removeMsg() {

    },
  },
};
</script>

<style lang="scss">
.vis-flash {
  position: relative;
  width: 250px;
  // top: 12px;
  // left: 12px;
  height: 40px;
  overflow: hidden;
  background-image:
    linear-gradient(
      93deg,
      rgba(255, 164, 16, .7) 0%,
      rgba(254, 170, 42, .5) 77%,
      rgba(254, 156, 9, 0) 100%
    );
  border-radius: 20px;

  &__item {
    position: absolute;
    bottom: -30px;
    left: 12px;
    display: flex;
    transition: all .4s;
    align-items: center;

    &.middle {
      opacity: 1;
      transform: translateY(-128%);
    }

    &.end {
      opacity: 0;
      transform: translateY(-220%);
    }

    .item {
      &__avatar {
        border-radius: 14px;
      }

      &__content {
        width: 200px;
        margin-left: 10px;
        overflow: hidden;
        font-size: 14px;
        line-height: 20px;
        color: #fff;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
