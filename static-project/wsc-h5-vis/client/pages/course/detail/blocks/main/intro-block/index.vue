<template>
  <div v-if="showIntroBlock" v-tab="tab" class="intro-block">
    <info-block :title="title">
      <div
        ref="el"
        v-if="showIntroDetail"
        v-lazy-container="{ selector: '.js-richtext-lazy-img' }"
        @contextmenu="contextmenu($event)"
      >
        <!-- 添加埋点事件的任务配置 -->
        <vis-richtext
          v-track:view="learnProgressTask"
          :class="{ 'forbid-copy': forbidCopy }"
          :content="intro"
          :box-width="richtextWidth"
          class="intro"
          show-placeholder
        />
      </div>

      <info-collect-block v-if="showInfoCollectBlock" :show-collect-info-btn="isImageText" />

      <div v-else-if="isPreview" class="preview">
        <no-data />
        <p class="preview-tip">
          {{ previewTip }}
        </p>
      </div>
    </info-block>
  </div>
</template>

<script>
import { debounce, get } from 'lodash';
import { ImagePreview } from 'vant';
import { Richtext } from '@youzan/vis-ui';
import { weappRichtextFilter } from '@/common/utils/env';
import { ASSIST_TXT_TYPE } from '@/constants/course/assist-txt-type';
import { SELLER_TYPE } from '@/constants/course/seller-type';
import InfoBlock from '@/pages/course/detail/components/info-block';
import InfoCollectBlock from '@/pages/course/detail/components/info-collect-block';
import NoData from '@/pages/course/detail/components/no-data';
import { heartBeatDetector, learnProgress } from '@/pages/course/detail/track-list';
import { MEDIA_TYPE } from '@/constants/course/media-type';

export default {
  components: {
    NoData,
    InfoBlock,
    InfoCollectBlock,
    'vis-richtext': Richtext,
  },

  data() {
    return {
      showIntroDetail: false,
      learnProgressTask: learnProgress.content,
    };
  },

  rootState: ['goodsData', 'env', 'contentProgress'],
  rootGetters: [
    'isOfflineCourse',
    'isColumn',
    'isContent',
    'isImageText',
    'isAudio',
    'isVideo',
    'isLive',
    'needCollectInfo',
    'realIntro',
  ],

  computed: {
    richtextWidth() {
      // 富文本容器的宽度
      const box = document.body.querySelector('.intro-block');
      const boxWidth = (box && box.clientWidth) || 375;
      return boxWidth - 32;
    },

    showInfoCollectBlock() {
      return this.needCollectInfo && !this.goodsData.needOrder;
    },

    showIntroBlock() {
      return this.intro || this.isPreview || this.showInfoCollectBlock;
    },

    tab() {
      if (this.isOfflineCourse) {
        return {
          index: 4,
          title: '课程详情',
        };
      }
      if (this.isColumn) {
        return {
          index: 1,
          title: '专栏介绍',
          onShow: () => {
            // 专栏已购买时，会默认切换到专栏目录tab，在rich-text组件mounted事件中，腾讯视频iframe高度会设置为0，这里重设
            const qqVideos = Array.prototype.slice.call(document.querySelectorAll('.edui-faked-video'));
            if (qqVideos.length) {
              const videoHeight = Math.floor(qqVideos[0].getBoundingClientRect().width * 0.75);
              qqVideos.forEach((el) => {
                el.style.height = `${videoHeight}px`;
              });
            }
          },
        };
      }
      return null;
    },

    title() {
      if (this.isOfflineCourse) {
        return '详情介绍';
      }
      if (this.isAudio || this.isVideo) {
        if (this.goodsData.assistTxtType === ASSIST_TXT_TYPE.PREVIEW && !this.goodsData.isOwnAsset) {
          return '内容简介';
        }
      }
      if (this.isLive) {
        return '直播介绍';
      }
      return '';
    },

    isPreview() {
      if (!this.goodsData.isOwnAsset) {
        if (this.isImageText) {
          return true;
        }
        if (this.isAudio || this.isVideo) {
          if (this.goodsData.assistTxtType === ASSIST_TXT_TYPE.PREVIEW) {
            return true;
          }
        }
      }
      return false;
    },

    previewTip() {
      let tip = '';
      if (this.goodsData.sku.minPrice) {
        tip += '订阅';
      } else {
        tip += '领取';
      }
      if (this.goodsData.sellerType === SELLER_TYPE.COLUMN) {
        tip += '专栏';
      }
      tip += '后查看全部内容';
      return tip;
    },

    intro() {
      if (this.isColumn && !this.realIntro) {
        return '你还没有设置专栏详情哦';
      }
      return this.env.isWeapp ? weappRichtextFilter(this.realIntro) : this.realIntro;
    },

    forbidCopy() {
      if (this.isContent) {
        return !this.goodsData.copyPicture;
      }
      return false;
    },

    startAt() {
      const progress = this.contentProgress[`c-${this.goodsData.alias}`] || {};
      if (progress) {
        let current = progress.current;
        if (progress.total - current < 1) {
          current = 0;
        }
        return current;
      }
      return 0;
    },
  },

  watch: {
    'goodsData.alias': function() {
      window.removeEventListener('scroll', this.scrollListener);
      // vue-router切换到下一个内容的时候，vue-lazyload的触发时机要早于DOM mounted的时机
      // 所以就需要，在下一个周期进行初始化，以保证后面ref能够拿到正确的DOM；并且forceUpdate
      // 强制更新，让lazyload重新触发。
      this.$nextTick(() => {
        this.init();
        this.$forceUpdate();
      });
    },
  },

  created() {
    if (this.forbidCopy) {
      const body = document.body;
      if (body && body.style) {
        body.style['-webkit-user-select'] = 'auto';
        body.style['user-select'] = 'auto';
      }
    }
    // safari 下，富文本内容如果包含腾讯视频，vue mounted事件就无法触发，导致专栏目录无法查看
    // https://jira.qima-inc.com/browse/ONLINE-183837
    // 目前也没排查到具体原因，暂时通过延后富文本的展示来解决
    this.$nextTick(() => {
      this.showIntroDetail = true;
      this.$nextTick(() => {
        this.init();

        // 在页面滚动完成之后，如果用户拥有这个商品，就挂载心跳检测埋点
        if (this.goodsData.isOwnAsset && this.goodsData.mediaType === MEDIA_TYPE.IMAGE_TEXT) {
          // 获取时间戳
          this.$track.addTask(heartBeatDetector);
        }
      });
    });
  },

  mounted() {
    this.$rootDispatch('initContentProgress');
    this.$rootDispatch('initColumnProgress');
  },

  methods: {
    init() {
      if (this.$refs.el) {
        const images = this.$refs.el.querySelectorAll('img');
        console.log(images);
        const imageList = Array.from(images);
        const imageUrlList = imageList.map((img) => {
          const src = get(img, 'dataset.src', get(img, 'src', ''));
          // 点击预览时使用原图，确保可以放大看清
          return src.replace(/!\d+x\d+.\w+$/g, '');
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

        if (this.isImageText && this.goodsData.isOwnAsset) {
          this.$rootDispatch('updateColumnProgress', {
            alias: this.goodsData.alias,
            title: this.goodsData.title,
          });

          if (this.startAt) {
            window.scrollTo(0, this.$refs.el.getBoundingClientRect().y + this.startAt);
          }

          this.scrollListener = debounce(() => {
            const rect = this.$refs.el.getBoundingClientRect();
            const progress = {
              total: rect.height,
              current: -rect.top,
              percent: Math.ceil((-rect.top * 100) / rect.height),
            };
            if (progress.current < 0) {
              progress.current = 0;
              progress.percent = 0;
            }
            if (progress.total - progress.current < window.innerHeight) {
              progress.current = progress.total;
              progress.percent = 100;
            }
            this.$rootDispatch('updateContentProgress', progress);
          }, 400);
          window.addEventListener('scroll', this.scrollListener);
        }
      }
    },

    contextmenu(e) {
      if (this.forbidCopy) {
        e.preventDefault();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.intro-block {
  position: relative;
  min-height: 200px;
  margin-bottom: 8px;
  background-color: $white;

  .intro {
    padding: 12px 16px;
    font-size: 14px;
    line-height: 24px;
    color: $main-text-color;

    ::v-deep img {
      width: 100%;
    }

    ::v-deep video {
      width: 100%;
    }

    &.forbid-copy {
      user-select: none !important;

      ::v-deep img {
        pointer-events: none !important;
      }

      ::v-deep a {
        display: inline-block;
      }

      ::v-deep p {
        user-select: none !important;
      }

      ::v-deep span {
        user-select: none !important;
      }
    }
  }

  .preview {
    padding: 32px 0 80px;

    .preview-tip {
      margin-top: 12px;
      font-size: 14px;
      color: $disabled-color;
      text-align: center;
    }
  }
}
</style>
