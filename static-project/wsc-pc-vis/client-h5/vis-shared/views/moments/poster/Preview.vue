<template>
  <div class="moments-poster">
    <div class="moments-poster__preview">
      <img
        v-show="showedPreviewImg"
        class="moments-poster__preview-img"
        :src="showedPreviewImg"
      >
      <p class="moments-poster__preview-desc">
        长按上方图片保存并发送朋友圈
      </p>
    </div>
    <div
      v-if="visualImgsCount > 1"
      class="moments-poster__change-cover"
      @click="changeImg"
    >
      <div
        class="moments-poster__change-cover-icon"
      />
      <span>换封面</span>
      <span>（{{ currentVisualImgIndex + 1 }}/{{ visualImgsCount }}）</span>
    </div>
    <div class="moments-poster__footer">
      <div class="moments-poster__footer-wrapper">
        <div
          v-for="(item, index) in smallImgs"
          :key="item"
          class="moments-poster__footer-container"
          :class="{
            'moments-poster__footer-container--active': index === currentIndex
          }"
          @click="currentIndex = index"
        >
          <img class="moments-poster__footer-container-img" :src="item" alt="small preview">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import drawImg from './drawImg';
import { bgs, smallImgs } from './constants';

export default {
  name: 'preivew',

  props: {
    config: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  data() {
    return {
      smallImgs: smallImgs,

      currentIndex: 0,

      currentVisualImgIndex: 0,
      visualImgsCount: 0,

      showedPreviewImg: bgs[0], // 默认显示第一张背景图
    };
  },

  computed: {
  },

  watch: {
    currentIndex(newValue) {
      this.draw(newValue, this.currentVisualImgIndex);
    },
    config(newValue) {
      this.visualImgsCount = (newValue.extraContents || []).length;
      this.draw(this.currentIndex, this.currentVisualImgIndex);
    },
  },

  methods: {
    draw(index, visualIndex) {
      drawImg(index, visualIndex, this.config)
        .then(res => {
          console.log(res.toDataURL('image/jpg'));
          this.showedPreviewImg = res.toDataURL('image/jpg');
        });
    },
    changeImg() {
      if (this.currentVisualImgIndex === this.visualImgsCount - 1) {
        this.currentVisualImgIndex = 0;
      } else {
        this.currentVisualImgIndex = this.currentVisualImgIndex + 1;
      }
      this.draw(this.currentIndex, this.currentVisualImgIndex);
    },
  },
};
</script>

<style lang="scss">
  .moments-poster {
    background-color: rgb(247, 248, 250);
    padding-top: 20px;
    padding-bottom: 100px;

    &__preview {
      min-height: 400px;
      margin: 0 75px 0;
    }

    &__preview-img {
      width: 100%;
    }

    &__preview-desc {
      font-size: 14px;
      color: #323233;
      margin-top: 9px;
      text-align: center;
      line-height: 20px;
    }

    &__change-cover {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #848484;
      height: 20px;
      margin-top: 32px;
    }

    &__change-cover-icon {
      width: 16px;
      height: 16px;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAcCAMAAAA3HE0QAAAAdVBMVEUAAADBwcGrq6uqqqqsrKyqqqqqqqqqqqqpqampqamqqqqsrKyurq67u7uqqqqqqqqqqqqpqamqqqqrq6uqqqqrq6usrKypqampqampqamqqqqrq6urq6usrKyurq6ysrKqqqqqqqqrq6uurq6wsLCxsbGpqammTEP+AAAAJnRSTlMAA2TrSvma9MW7fCcIBu/joI+DdGA7Iefct6RsWEAZDtCwqjAWC03g3WcAAADxSURBVCjPhdDZkoIwEIXhRkwQEdkXxwXX//0fcRKoAmZA+C5IpU6TdFp6TSiL9qoqF3PgvJJ75UpefM83GModi3bJ6IcTs/z+zgvzjlebftI0bO94bEayp2srAlOgIWu7UHY3aGJgJ3JTsDd9zsxBA1tJQd3MLq/udhn7RBDbF/yI5ciEhlpqyBbm44mCy0KBKxWkk+TQLYl9hm8//5yUth2FEWg5M7njhWncVORAIY3bjnTMqbuK2B7e1aG3b2cQREDsvLxj0bUyL5EwlFammONJr9QuU88/fQXX7SD3AP8gX91X8mAlF2fHw+RL3tL7BTcWJzOgSRW4AAAAAElFTkSuQmCC);
      background-size: 16px;
      margin-right: 6px;
    }

    &__footer {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 83px;
      overflow-x: auto;
      background-color: #fff;
      z-index: 999;
      display: flex;
      align-items: center;
    }

    &__footer-wrapper {
      display: flex;
      align-items: center;
      padding: 0 12px;
      background-color: #fff;
    }

    &__footer-container {
      width: 54px;
      height: 69px;
      border-radius: 3px;
      border: 3px solid transparent;
      box-sizing: border-box;
      margin-right: 4px;

      &:last-child {
        margin-right: 0;
      }

      &--active {
        border-color: #d2d3d6;
      }
    }

    &__footer-container-img {
      width: 48px;
    }
  }
</style>
