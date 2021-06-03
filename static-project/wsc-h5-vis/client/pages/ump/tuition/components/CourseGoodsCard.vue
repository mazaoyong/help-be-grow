<template>
  <div class="course-goods-card" @click="$emit('click')">
    <section class="cover">
      <img-wrap
        width="110px"
        height="62px"
        :fullfill="`!small.jpg`"
        :src="imageUrl"
        :cover="false"
      />
      <mini-font-tag
        v-if="tagText"
        :text="tagText"
        class="img-tag"
        height="16px"
        background-color="rgba(50, 50, 51, .8)"
      />
    </section>
    <section class="info">
      <h2 class="title">
        {{ title }}
      </h2>
      <section class="other">
        <div>
          <div v-if="soldNum" class="sold-num">
            {{ soldNum }} 人学过
          </div>
          <div v-if="showPrice">
            <span class="price">
              <vis-current-price
                :price="[price]"
                :mini-symbol="false"
                :mini-decimals="false"
              />
              <span v-if="price!==maxPrice" class="begin">起</span>
            </span>
            <van-tag
              v-if="priceTag"
              color="rgba(255, 74, 0, 0.1)"
              text-color="#FF3200"
            >
              {{ priceTag }}
            </van-tag>
          </div>
        </div>
        <span class="action">{{ buttonText }}</span>
      </section>
    </section>
  </div>
</template>

<script>
import Vue from 'vue';
import { Tag as VanTag } from 'vant';
import { ImgWrap, PriceLabel } from '@youzan/vis-ui';
import MiniFontTag from '@/components/mini-font-tag';
import { MEDIA_TYPE_DESC } from '@/constants/course/media-type';
import { OWL_TYPE_DESC } from '@/constants/course/owl-type';
import { COURSE_TYPE_DESC } from '@/constants/course/course-type';

const { CurrentPrice: VisCurrentPrice } = PriceLabel;

export default Vue.extend({
  components: {
    ImgWrap,
    MiniFontTag,
    VisCurrentPrice,
    VanTag,
  },

  props: {
    imageUrl: {
      type: String,
      default: '',
    },
    goodsAlias: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
    },
    soldNum: {
      type: Number,
      default: 0,
    },
    mediaType: {
      type: Number,
      default: undefined,
    },
    owlType: {
      type: Number,
      default: undefined,
    },
    courseType: {
      type: Number,
      default: undefined,
    },
    maxPrice: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: '',
    },
    buttonText: {
      type: String,
      default: '',
    },
    priceTag: {
      type: String,
      default: '',
    },
    showPrice: {
      type: Boolean,
      default: true,
    },
  },

  computed: {

    tagText() {
      // 优先判断 mediaType
      if (this.mediaType !== undefined) {
        return MEDIA_TYPE_DESC[this.mediaType];
      }
      if (this.courseType !== undefined) {
        return COURSE_TYPE_DESC[this.courseType];
      }
      if (this.owlType !== undefined) {
        return OWL_TYPE_DESC[this.owlType];
      }
      return '';
    },

    mainColor() {
      return this.$theme.colors.main;
    },
  },
});
</script>

<style lang="scss" scoped>
@import "mixins/index.scss";
/*  */

.course-goods-card {
  padding: 8px;
  display: flex;
  .cover {
    border-radius: 4px;
    overflow: hidden;
    margin-right: 8px;
    flex-shrink: 0;
    flex-grow: 0;
    position: relative;
    .img-tag {
      position: absolute;
      right: 4px;
      bottom: 4px;
      padding: 0;
      ::v-deep .tag {
        transform: scale(0.6666666);
      }
    }
  }
  .info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    .title {
      font-size: 14px;
      color: #323233;
      /* color: rgba($color: #FF4A00, $alpha: 0.1); */
      line-height: 18px;
      font-weight: 500;
      word-break: break-all;
      @include multi-ellipsis(1);
    }
    .other {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      .price {
        margin-right: 2px;
        .begin {
          font-size: 10px;
          color: #ff4a00;
          line-height: 14px;
        }
      }
      .sold-num {
        font-size: 10px;
        color: #969799;
        margin-bottom: 6px;
      }
      .action {
        font-size: 13px;
        font-weight: 500;
        color: #ffffff;
        background-image: linear-gradient(
          90deg,
          #ff6713 0%,
          #ff6713 0%,
          #ff551f 100%
        );
        border-radius: 999px;
        padding: 6px 8px;
        display: inline-block;
      }
    }
  }
}
</style>
