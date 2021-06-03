<template>
  <div class="picker">
    <div class="picker__images">
      <template
        v-for="(item, index) in imageList"
      >
        <div
          :key="index"
          class="image-item_wrap"
        >
          <div
            :class="[currentIndex === index ? 'choosed' : '', item.type === 'dynamic' ? 'dynamic' : '', 'image-item']"
            :style="{backgroundImage: 'url(' + (item.poster ? item.poster.replace(
              /\/\/img.yzcdn.cn/,
              '//img01.yzcdn.cn'
            ) : item.poster) + ')'}"
            @click="onClickImg(index)"
          />
        </div>
      </template>
    </div>
    <slot />
  </div>
</template>

<script>
import { Swipe, SwipeItem } from 'vant';

export default {
  name: 'image-picker',

  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
  },

  props: {
    imageList: Array,
  },

  data() {
    return {
      currentIndex: 0,
    };
  },

  methods: {
    onClickImg(index) {
      this.currentIndex = index;
      this.$emit('change', index);
    },
  },
};
</script>

<style lang="scss">
  .picker {
    height: 110px;
    background: #fff;
    box-shadow: 0 -2px 4px 0 #d6d6d6;

    &__images {
      display: flex;
      padding: 10px;
      overflow-x: auto;
      justify-content: space-between;
      align-items: center;
      -webkit-overflow-scrolling: touch;

      & ::-webkit-scrollbar {
        display: none;
      }

      .image-item {
        width: 60px;
        height: 60px;
        margin: 0 5px;
        background-repeat: no-repeat;
        background-size: contain;

        &.dynamic {
          background-position: center;
          background-size: cover;
        }
      }

      img {
        width: 60px;
        height: 60px;
      }

      .choosed {
        border: 5px solid #efeff2;
        border-radius: 3px;
      }
    }
  }
</style>
