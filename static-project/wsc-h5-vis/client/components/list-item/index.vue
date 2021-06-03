<template>
  <component
    :is="url ? 'a' : 'div'"
    class="item"
    :href="url"
  >
    <!-- 缩略图 -->
    <div class="item__thumbnail-container" :style="thumbnailStyle">
      <img-wrap
        v-if="thumbnailUrl"
        class="item__thumbnail"
        width="100%"
        height="100%"
        :src="thumbnailUrl"
        :need-track="needLog"
        :track-id="logId"
        :track-item-type="logItemType"
        :lazy-log-params="lazyLogParams"
        :fullfill="`!${thumbnailWidth * 2}x${thumbnailWidth * 2}.jpg`"
        :cover="isCover"
      />
      <div v-if="thumbnailIcon" class="item__thumbnail-icon">
        <img-wrap
          width="20px"
          height="20px"
          class="item__thumbnail-icon-image"
          :src="thumbnailIcon"
          :fullfill="'!40x40.jpg'"
        />
      </div>
      <div
        v-if="thumbnailTag"
        class="item__thumbnail-tag"
        :class="[thumbnailTagClass]"
        :style="{
          background: themeColor || 'rgba(0, 0, 0, .4)'
        }"
      >
        {{ thumbnailTag }}
      </div>
    </div>

    <!-- 内容 -->
    <div class="item__detail" :style="{ minHeight: `${thumbnailHeight}px` }">
      <div class="item__header item-row">
        <div class="item-col">
          <div class="item__title-bar">
            <div
              v-if="titleTag"
              :class="['item__title-tag', titleTagClass,
                       {
                         'item__title-tag--small': titleTag.length < 3,
                         'item__title-tag--large': titleTag.length === 5,
                       }
              ]"
            >
              <span>
                {{ titleTag }}
              </span>
            </div>
            <h4 :class="['item__title', {'last-learning': isLearning}]">
              {{ title }}
            </h4>
          </div>
          <p class="item__subtitle">
            {{ subtitle }}
          </p>
        </div>

        <div class="item__header-corner item-col">
          <span
            v-if="usePoints"
            :class="`item__header-corner__text ${ headerCornerTextClass || '' }`"
          >
            <span class="item__header-corner__text-points">
              {{ pointsInfo.points }}{{ pointsName || '积分' }}
            </span>
            <template v-if="pointsInfo.price && !pointsInfo.isFree">
              <br>
              <span class="item__header-corner__text-price">
                +{{ pointsInfo.price }}元
              </span>
            </template>
          </span>
          <span
            v-else-if="headerCornerText"
            :class="`item__header-corner__text ${ headerCornerTextClass || '' }`"
          >
            {{ headerCornerText }}
          </span>
          <span v-if="headerCornerTag && !usePoints" class="item__header-corner__tag">
            {{ headerCornerTag }}
          </span>
        </div>
      </div>

      <!-- footer -->
      <div class="item__footer item-row">
        <slot name="footer-left">
          <p
            :class="`item__status-list item-col ${ footerMarginTopClass || '' }`"
          >
            <template v-for="status in statusList">
              <span
                v-if="status"
                :key="status"
                class="item__status"
                :style="status.color ? 'color:' + status.color : ''"
              >
                {{ status.text ? status.text : status }}
              </span>
            </template>
          </p>
        </slot>

        <div class="item-col item__footer-corner">
          <div class="item__footer-corner__tag-wrap">
            <span v-if="footerCornerTag" class="item__footer-corner__tag">
              {{ footerCornerTag }}
            </span>
          </div>
          <div v-if="isPriceLineThroughVisible" class="item__footer-corner__original-price">
            ￥<s>{{ (price / 100).toFixed(2) }}</s>
          </div>
          <div
            v-if="footerCornerText"
          >
            <van-icon v-if="footerCornericon" class="item__footer-corner__icon" name="checked" />
            <span :class="`item__footer-corner__text ${ footerCornerTextClass || '' }`">{{ footerCornerText }}</span>
          </div>
          <!-- 专栏目录下内容锁 -->
          <div v-if="showFooterCornerLock" class="item__footer-corner__lock" />
        </div>
      </div>
    </div>
    <!-- 上次学到标签 -->
    <div v-if="isLearning" class="learning-tag">
      <span>上次学到</span>
    </div>
  </component>
</template>

<script>
import { ImgWrap } from '@youzan/vis-ui';
import { Icon } from 'vant';
/* eslint-disable vue/require-default-prop */
export default {
  name: 'list-item',

  components: {
    ImgWrap,
    'van-icon': Icon,
  },

  props: {
    // item 跳转地址
    url: String,
    // 上次学到内容alias
    isLearning: Boolean,
    // 缩略图 url
    thumbnailUrl: String,
    thumbnailWidth: {
      type: Number,
      default: 110,
    },
    thumbnailHeight: {
      type: Number,
      default: 64,
    },
    thumbnailIcon: String,
    thumbnailTag: String,
    thumbnailTagClass: String,
    themeColor: {
      type: String,
      default: '',
    },
    // 是否需要进行埋点
    needLog: Boolean,
    // 埋点标识
    logId: Number,
    logItemType: String,
    lazyLogParams: {
      type: String,
      default: '{}',
    },
    title: String,
    titleTag: String,
    titleTagClass: String,
    subtitle: String,
    statusList: Array,
    headerCornerTag: String,
    headerCornerText: String,
    headerCornerTextClass: String,
    footerCornerTag: String,
    footerCornerText: String,
    footerCornerTextClass: String,
    price: Number,
    footerMarginTopClass: String,
    isPriceLineThroughVisible: [Boolean, Number],
    footerCornericon: [Boolean, Number],
    showFooterCornerLock: {
      type: Boolean,
      default: false,
    },
    // 图片展示contain或者cover
    isCover: {
      type: Boolean,
      default: true,
    },
    // 是否使用积分
    usePoints: {
      type: Boolean,
      default: false,
    },
    // 积分信息，含points和price
    pointsInfo: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    thumbnailStyle() {
      return {
        width: `${this.thumbnailWidth}px`,
        height: `${this.thumbnailHeight}px`,
      };
    },
    pointsName() {
      return window._global.visPointsName;
    },
  },
};
</script>

<style lang="scss">
@import 'var';
@import 'mixins/index.scss';

.item {
  padding: 12px 16px;
}

.item {
  position: relative;
  display: block;
  padding: 15px;
  overflow: hidden;
  background: #fff;

  &-row {
    display: flex;
  }

  &-col {
    flex: 1 1 auto;
    max-width: 100%;
    overflow: hidden;

    &:last-child {
      flex: 0 0 auto;
    }

    &:first-child {
      flex: 1 1 auto;
    }
  }

  &__thumbnail-container {
    position: relative;
    float: left;
  }

  &__thumbnail {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    overflow: hidden;
    border-radius: 3px;
  }

  &__thumbnail-tag {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #fff;
    font-size: 10px;
    border-radius: 50%;
    background: rgba(0, 0, 0, .4);
  }

  &__thumbnail-icon {
    position: absolute;
    right: 5px;
    bottom: 5px;

    &-image {
      display: block;
      width: 20px;
      height: 20px;

      img {
        object-fit: initial !important;
      }
    }
  }

  &__detail {
    position: relative;
    padding-left: 10px;
    overflow: hidden;
  }

  &__title-bar {
    display: flex;
    line-height: 0;
  }

  &__title {
    flex: 1 1 auto;
    display: inline-block;
    line-height: 18px;
    vertical-align: middle;
    color: #323233;
    font-size: 14px;
    font-weight: bold;

    @include ellipsis;
  }

  &__title-tag {
    position: relative;
    flex: 0 0 auto;
    align-self: center;
    width: 38px;
    height: 14px;
    margin-right: 4px;
    overflow: hidden;
    background: #969799;
    border-radius: 2px;

    &--small {
      width: 28px;
    }

    &--large {
      width: 58px;
    }

    span {
      display: inline-block;
      padding: 4px 8px;
      line-height: 20px;
      white-space: nowrap;
      color: #fff;
      font-size: 20px;
      font-weight: 700;
      background: transparent;
      transform: scale(.5);
      transform-origin: left top;
    }
  }

  &__subtitle {
    width: 75%;
    margin-top: 8px;
    line-height: 12px;
    color: $c-gray-dark;
    font-size: 12px;

    @include ellipsis;
  }

  &__header-corner {
    line-height: 18px;
    text-align: right;

    &__text {
      line-height: 14px;
      text-align: right;
      color: #f44;
      font-size: 14px;
    }

    &__tag {
      display: block;
      margin-top: 5px;
      padding: 2.5px 5px;
      line-height: 10px;
      color: #f44;
      font-size: 10px;
      border-radius: 2.5px;
      background: rgba(255, 68, 68, .1);
      transform: scale(.8);
      transform-origin: right top;
    }
  }

  &__footer {
    position: absolute;
    bottom: 0;
    width: calc(100% - 10px);
  }

  &__status-list {
    /* line-height: 0; */
  }

  .margin-top {
  margin-top: 11px;
  }

  &__status {
    display: inline-block;
    padding: 0 8px;
    line-height: 12px;
    vertical-align: middle;
    color: $c-gray-dark;
    font-size: 12px;
    border-right: 1px solid $c-gray-light;

    &:first-of-type {
      padding-left: 0;
    }

    &:last-of-type {
      border-right: none;
    }
  }

  &__footer-corner {
    position: relative;
    overflow: visible;

    &__tag-wrap {
      position: absolute;
      top: -28px;
      right: 0;
    }

    &__tag {
      display: inline-block;
      padding: 4px 10px;
      line-height: 20px;
      white-space: nowrap;
      color: $red;
      font-size: 20px;
      border-radius: 2px;
      background: rgba(255, 68, 68, .1);
      transform: scale(.5);
      transform-origin: right bottom;
    }

    &__original-price {
      color: #9b9b9b;
      font-size: 12px;
    }

    &__text {
      line-height: 12px;
      text-align: right;
      color: $c-gray-dark;
      font-size: 12px;
      margin-top: 3px;
      float: right;
    }

    &__icon {
      line-height: 12px;
      text-align: right;
      font-size: 12px;
      margin-top: 3px;
      margin-right: 2px;
      color: #323233;
    }

    .text-red {
      color: $c-red;
    }

    .text-black {
      color: #323233;
    }

    &__lock {
      width: 18px;
      height: 18px;
      background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAcCAYAAAB75n/uAAAAAXNSR0IArs4c6QAAAXdJREFUSA3tVrFKxEAQnUnkOLh8gYU/EBCRkA+wEGz8imtsxUqwEm08bG38D8HCxiqLJyLkB2z8gTs4D+I4k73h1mSjTVIcZOGYvZm3b2bfDkMQ/lnGvMUAxZgIDglgR+AI8IEIjwDhfZru5X9RMNa/8jwfzOeLWyY9IaLAh0LEbya4G42Gp3EcL70Yn1PIZ7PFAwEd+OJVHwI+RdHwyJfEW5mtfE3OBM8B4vFWCNvyk734NJEUImf0v2trEonmBMW7ysJE12m6fyFyuAclbszrJZOfi9/KFe5W38RzA3lQq7lU6SNXwjK2uok9U4zdImRfSyDdoiDulJtq5RoTW1bNGPW5Z9VXT7BqRQEEAb0osMm6GG1jF1tLAECRApIk+dR9k/2NWZ9VvCeBhtqxm58As2x6xcPljNts0I4oloU7bAkEE8zM9Kttci1UkgRdkUsS4d78R+5voA3TaHuJGqXRQC+RKtFo+QuEp15Hqxx25UjtIImO6x/soIZqz8JYVQAAAABJRU5ErkJggg==') center / 12px 14px no-repeat;
    }
  }

  .learning-tag {
    position: absolute;
    border-bottom-right-radius: 2px;
    border-bottom-left-radius: 2px;
    top: 0;
    right: 15px;
    background-color: #00b389;
    font-size: 12px;
    text-align: center;
    color: #ffffff;

    span {
      transform: scale(0.667);
      display: block;
    }
  }
}
</style>
