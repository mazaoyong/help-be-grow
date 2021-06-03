<template>
  <div :class="['timeline-item', image.length === 0 ? 'timeline-item__bg' : '']">
    <div class="timeline-item__img" v-if="image.length">
      <template v-if="image.length === 1">
        <van-icon v-if="extraContents[0].contentType === 2" name="play-circle-o" />
        <img
          class="timeline-item__img1"
          v-for="(src, index) in image"
          :key="index"
          :src="fillImage(src)"
          alt="image"
        />
      </template>

      <template v-else-if="image.length === 2">
        <img
          class="timeline-item__img2"
          v-for="(src, index) in image"
          :key="index"
          :src="fillImage(src)"
          alt="image"
        />
      </template>

      <div v-else-if="image.length === 3" class="img3">
        <div class="img3-left">
          <img
            style="width: 36px; height: 72px;"
            :src="fillImage(image[0])"
            alt="image"
          />
        </div>
        <div class="img3-right">
          <img
            class="timeline-item__img3"
            :src="fillImage(image[1])"
            alt="image"
          />
          <img
            class="timeline-item__img3"
            :src="fillImage(image[2])"
            alt="image"
          />
        </div>
      </div>

      <template v-else-if="image.length >= 4">
        <img
          class="timeline-item__img4"
          v-for="(src, index) in image.slice(0, 4)"
          :key="index"
          :src="fillImage(src)"
          alt="image"
        />
      </template>
    </div>
    <div class="timeline-item__desc">
      <div class="timeline-item__desc__content">
        {{ desc }}
      </div>
      <div class="timeline-item__desc__footer" v-if="image.length > 1">共{{ image.length }}张</div>
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant';
import fullfillImage from '@youzan/utils/fullfillImage'

export default {
  name: 'timeline-item',
  components: {
    'van-icon': Icon,
  },
  props: {
    extraContents: {
      type: Array,
      default: () => [],
    },
    desc: {
      type: String,
      default: '这是描述',
    },
    deleteImg: {
      type: String,
      default: 'https://img01.yzcdn.cn/public_files/2019/10/12/picture_delete.png',
    },
  },
  computed: {
    image() {
      return this.extraContents.map(item => {
        if (item.contentType === 2) {
          return item.videoDTO.coverUrl || this.deleteImg;
        }
        return item.url || this.deleteImg;
      });
    },
  },

  methods: {
    fillImage(url) {
      return fullfillImage(url, 'middle');
    }
  },
};
</script>

<style lang="scss">
.timeline-item {
  display: flex;
  margin-bottom: 10px;
  line-height: 20px;

  img {
    object-fit: cover;
  }

  &__bg {
    background-color: #F2F3F5;
    .timeline-item__desc {
      padding: 4px;
    }
  }

  &__img {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 76px;
    height: 76px;
    flex-wrap: wrap;
    position: relative;

    .van-icon-play-circle-o {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 24px;
      color: #fff;
      text-shadow: rgba(0, 0, 0, 0.7) 1px 1px 7px;
    }

    &1 {
      // display: flex;
      overflow: hidden;
      width: 100%;
      height: inherit;
    }

    &2 {
      overflow: hidden;
      width: 50%;
      height: inherit;
      padding: 1px;
    }

    .img3 {
      display: flex;
      overflow: hidden;
      height: 100%;
      width: 100%;

      &-left {
        width: 50%;
        height: 100%;
        margin-right: 2px;
      }

      &-right {
        display: flex;
        flex-direction: column;

        .timeline-item__img3 {
          width: 100%;
          height: 50%;
          margin-bottom: 2px;
        }
      }
    }

    &4 {
      overflow: hidden;
      width: 50%;
      height: 50%;
      padding: 1px;
    }
  }

  &__desc {
    flex: 1;
    padding: 2px;
    position: relative;

    &__content {
      font-size: 16px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }

    &__footer {
      position: absolute;
      left: 2px;
      top: 60px;
      font-size: 12px;
      color: #646566;
      line-height: 16px;
    }
  }
}
</style>
