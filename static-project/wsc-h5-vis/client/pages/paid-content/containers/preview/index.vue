<template>
  <div class="content-container--preview">
    <div v-if="fetched">
      <template v-if="!deleted">
        <component
          :is="componentName"
          :content-data="contentData">
          <content-info
            slot="content-info"
            :class="`${componentName}__content-info`"
            :content-data="contentData"
          />
        </component>
      </template>
      <template v-else>
        <no-data class="paid-content__no-data--fullpage">
          <div>该内容已经删除</div>
        </no-data>
      </template>
    </div>
    <no-data v-if="notAllowed" class="paid-content__no-data--fullpage">
      <div>无法访问</div>
    </no-data>
  </div>
</template>

<script>
import { Toast } from 'vant';
import UA from 'zan-utils/browser/ua_browser';
import ImageTextContent from './components/ImageTextContent';
import AudioContent from './components/AudioContent';
import VideoContent from './components/VideoContent';
import ContentInfo from './components/ContentInfo';
import NoData from '../../components/NoData';
import { MEDIA_TYPE } from 'pct/constants';
import { includes } from 'lodash';
import apis from 'pct/api';
import mixinVisPage from 'common/mixins/mixin-vis-page';

const allowedReferrers = [
  '//www.youzan.com/v2/fenxiao/market/detail/',
  '//admin.youzan.com/v2/fenxiao/market/detail/',
  '//www.youzan.com/v4/fenxiao/fxmarket/detail/',
  '//admin.youzan.com/v4/fenxiao/fxmarket/detail/',
];

export default {
  name: 'content-show',

  config: {
    title: 'this.title',
    hideCopyright: true,
    pc: {
      hideQrcode: true,
    },
  },

  components: {
    ContentInfo,
    NoData,
    ImageTextContent,
    AudioContent,
    VideoContent,
  },

  mixins: [mixinVisPage],

  data() {
    return {
      contentData: {},
      fetched: false,
      deleted: null,
      notAllowed: false,
      alias: '',
      title: '内容详情',

      isColumn: false,
    };
  },

  computed: {
    componentName() {
      switch (this.contentData.mediaType) {
        case MEDIA_TYPE.IMAGE_TEXT:
          return 'image-text-content';
        case MEDIA_TYPE.AUDIO:
          return 'audio-content';
        case MEDIA_TYPE.VIDEO:
          return 'video-content';
        default:
          return '';
      }
    },
  },

  created() {
    if (UA.isMobile() ||
      !this.referrerIsValid()
    ) {
      this.notAllowed = true;
      return;
    }

    this.init(this.$route.query.alias);
  },

  methods: {
    referrerIsValid() {
      return document.referrer &&
        allowedReferrers.some((ref) => includes(document.referrer, ref));
    },

    init(alias = '') {
      this.alias = alias;
      this.fetchContentData({ alias });
    },

    // 获取内容详情
    fetchContentData(params) {
      // 获取内容详情
      return apis.getPreviewContent(params).then((data = {}) => {
        let { sellerContentText = {}, sellerContent = {}, mainVideoModel = {} } = data;
        // 返回的会存在null的情况
        mainVideoModel = mainVideoModel || {};
        const { mediaType } = sellerContent;
        const parseData = Object.assign(sellerContent, {
          content: +mediaType === 2 ? sellerContent.content || '' : sellerContentText.content || '',
          audioText: sellerContentText.content || '',
          videoText: sellerContentText.content || '',
          videoUrl: mainVideoModel.videoUrl || '',
          videoId: mainVideoModel.videoId || '',
        });

        this.contentData = parseData;

        const { title } = this.contentData;
        this.title = title;

        this.fetched = true;
      }).catch((errMsg) => {
        this.deleted = true;
        this.fetched = true;
        Toast(errMsg || '获取数据失败！');
        console.log(`获取数据失败！${errMsg}`);
      });
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';

.content-container--preview {
  box-shadow: 0 0 5px #e1e1e1;
}

.content__loading-wrap {
  padding: 30px;
}

.content__loading {
  margin: 0 auto;
}

.content__column-cell {
  margin-top: 10px;

  .van-cell__title {
    position: relative;
    padding-left: 40px;
  }

  .van-cell__text {
    display: block;
    height: 24px;

    @include multi-ellipsis(1);
  }

  .van-cell__value--link {
    min-width: 80px;
    line-height: 38px;
  }
}

.content__column-img-wrap {
  position: absolute;
  left: 10px;
  margin: auto;
  width: 30px;
  height: 40px;
}

.content__column-img {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  max-width: 100%;
  max-height: 100%;
}
</style>
