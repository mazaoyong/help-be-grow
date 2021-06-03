<template>
  <div
    v-if="contentData.mediaType === 1 || contentData.assistTxtType !== 1"
    class="content-richtext"
    :class="[hidePartContent ? 'limit-height' : '', forbidCopy ? 'no-userselect' : '']"
  >
    <h3
      v-if="showTitle"
      class="content-richtext__title"
    >
      内容简介
    </h3>
    <div v-show="filterRichContent || showBuyTip" class="content-richtext__wrapper">
      <div
        v-if="filterRichContent"
        id="rich-content"
        class="content-richtext__content custom-richtext"
        @contextmenu="onContextMenu"
        v-html="filterRichContent"
      />
      <div v-if="showBuyTip" class="content-richtext__buy-tip">
        <div class="buy-tip__tip">
          <img-wrap
            class="buy-tip__tip__img"
            :width="'80px'"
            :height="'80px'"
            src="https://img01.yzcdn.cn/public_files/2019/01/04/f2cf2b542863ce5cd844f164d45e3859.png"
            disable-lazyload
          />
          <span>{{ contentTip }}</span>
        </div>
      </div>
    </div>

    <!-- 隐藏部分详情内容，仅在点击<显示全部>后展开 -->
    <div
      v-if="hidePartContent"
      class="content-richtext__showmore"
      @click="onButtonToggle"
    >
      <span>查看全部</span>
      <van-icon name="arrow-down" />
    </div>
  </div>
</template>

<script>
import { ImagePreview, Icon } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';
import { MEDIA_TYPE } from 'pct/constants';
import { weappRichtextFilter } from '@/common/utils/env';

// 辅助图文展示类型：1：无辅助图文  2：购买前显示完整图文 3：购买前仅显示图文简介，购买后显示图文详情
const SHOW_TYPE = {
  NONE: 1,
  ENTIRE: 2,
  PREVIEW: 3,
};
const { miniprogram = {} } = _global;
const isWeapp = miniprogram.isWeapp;

export default {
  name: 'content-richtext',

  components: {
    ImgWrap,
    'van-icon': Icon,
  },

  props: {
    contentData: Object,
    isOwned: Boolean,
    // 是否显示底部推荐商品
    showBottomRecommends: Boolean,
    isAllowSingleBuy: Boolean,
  },

  data() {
    return {
      fakeText: `<p style="text-align:center">此图文为付费内容，购买后即可查看</p>
        <p style="text-align:center">此图文为付费内容，购买后即可查看</p>
        <p style="text-align:center">此图文为付费内容，购买后即可查看</p>
        <p style="text-align:center">此图文为付费内容，购买后即可查看</p>
        <p style="text-align:center">此图文为付费内容，购买后即可查看</p>
        <p style="text-align:center">此图文为付费内容，购买后即可查看</p>`,
      // 底部推荐时，显示更多按钮
      showMoreBtn: false,
    };
  },

  computed: {
    showBuyTip() {
      return !this.isOwned &&
        (
          (this.contentData.mediaType === 1) ||
          (this.contentData.mediaType !== 1 && this.contentData.assistTxtType === 3)
        );
    },

    // 是否显示内容简介标题
    showTitle() {
      const contentData = this.contentData;
      if (contentData.isPaid && contentData.assistTxtType === 3) {
        return false;
      }
      return (contentData.mediaType !== 1 && this.richContent) ||
        (contentData.assistTxtType === 3 && !this.isOwned);
    },

    richContent() {
      if (this.isOwned || this.contentData.assistTxtType === SHOW_TYPE.ENTIRE) {
        switch (this.contentData.mediaType) {
          case MEDIA_TYPE.IMAGE_TEXT:
            return this.contentData.content;
          case MEDIA_TYPE.AUDIO:
            return this.contentData.audioText;
          case MEDIA_TYPE.VIDEO:
            return this.contentData.videoText;
          default:
            return this.contentData.content;
        }
      } else if (
        this.contentData.mediaType === MEDIA_TYPE.IMAGE_TEXT ||
        this.contentData.assistTxtType === SHOW_TYPE.PREVIEW
      ) {
        switch (this.contentData.mediaType) {
          case MEDIA_TYPE.IMAGE_TEXT:
            return this.contentData.preview;
          case MEDIA_TYPE.AUDIO:
            return this.contentData.audioPreviewText;
          case MEDIA_TYPE.VIDEO:
            return this.contentData.videoPreviewText;
          default:
            return this.contentData.content;
        }
      }
      return '';
    },

    filterRichContent() {
      return isWeapp ? weappRichtextFilter(this.richContent) : this.richContent;
    },

    hidePartContent() {
      return false;
      // return this.showMoreBtn && this.showBottomRecommends;
    },

    contentTip() {
      if (this.isAllowSingleBuy) {
        return this.isFreeGoods ? '领取后查看全部内容' : '订阅后查看全部内容';
      } else {
        return this.isFreeGoods ? '领取专栏后查看全部内容' : '订阅专栏后查看全部内容';
      }
    },

    // 是否为免费商品
    isFreeGoods() {
      return +this.contentData.sellerType === 2
        ? +this.contentData.columnDetail.price === 0
        : +this.contentData.price === 0;
    },

    forbidCopy() {
      return (this.isOwned || this.contentData.assistTxtType === SHOW_TYPE.ENTIRE) &&
        this.contentData.copyPicture === 0;
    },
  },

  watch: {
    richContent(newValue) {
      if (newValue) {
        // 初始化图片预览功能
        this.$nextTick(() => {
          this.initImagePreviewer();
        });
      }
    },
  },

  mounted() {
    this.contentHeightCheck();
  },

  methods: {
    // 高度检查
    contentHeightCheck() {
      console.log('contentHeightCheck');
      let maxCheck = 10;
      const heightChecker = () => {
        // console.log('check');
        maxCheck--;
        if (!document.getElementById('rich-content') && maxCheck > 0) {
          setTimeout(() => {
            heightChecker();
          }, 1000);
        } else if (document.getElementById('rich-content') &&
          document.getElementById('rich-content').clientHeight > 150
        ) {
          this.showMoreBtn = true;
        }
      };
      heightChecker();
    },

    initImagePreviewer() {
      const images = document.querySelectorAll('#rich-content img');
      const imageList = Array.from(images);
      const imageUrlList = imageList.map(img => {
        return img.src;
      });
      imageList.forEach((img, index) => {
        img.addEventListener('click', () => {
          ImagePreview({
            images: imageUrlList,
            startPosition: index,
            showIndex: true,
            showIndicators: true,
          });
        });
      });
    },

    onButtonToggle() {
      this.showMoreBtn = !this.showMoreBtn;
    },

    onContextMenu(e) {
      if (this.forbidCopy) {
        e.preventDefault();
      }
    },
  },
};
</script>

<style lang="scss">
.content-richtext {
  position: relative;
  margin-top: 10px;
  background-color: #fff;

  &.no-userselect {
    -webkit-user-select: none !important;
    user-select: none !important;

    img {
      pointer-events: none !important;
    }

    a {
      display: inline-block;
    }

    p {
      -webkit-user-select: none !important;
      user-select: none !important;
    }

    span {
      -webkit-user-select: none !important;
      user-select: none !important;
    }
  }

  &.limit-height {
    height: 250px;
    overflow: hidden;
  }

  &__title {
    padding: 15px 0 0 15px;
    font-size: 16px;
    font-weight: 700;
    line-height: 22px;
  }

  &__wrapper {
    min-height: 200px;
  }

  &__content.custom-richtext {
    padding: 15px 15px 10px;
    margin-bottom: 0;

    p { margin-bottom: 0; }
  }

  &__buy-tip {
    position: relative;
    padding: 20px 0 40px;

    .buy-tip {
      &__tip {
        display: flex;
        padding: 40px;
        font-size: 14px;
        color: #999;
        background: linear-gradient(180deg, rgba(255, 255, 255, .8), rgba(255, 255, 255, 1));
        flex-direction: column;
        align-items: center;
      }

      &__tip__img {
        margin-bottom: 12px;
      }
    }
  }

  &__showmore {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    height: 44px;
    padding: 0 15px;
    font-size: 14px;
    line-height: 18px;

    /* background: linear-gradient(180deg, rgba(255, 255, 255, .8), rgba(255, 255, 255, 1)); */
    background-color: #fff;
    box-shadow: 0 -20px 20px 0 #fff;
    justify-content: center;
    align-items: center;

    .van-icon {
      margin-left: 2px;
    }
  }
}

.limit-height {
  height: 250px;
  overflow: hidden;
}
</style>
