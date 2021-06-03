<template>
  <div class="enrollment-poster">
    <img :src="imageUrl">
    <div class="enrollment-poster-share" @click="toggleWxShareMask">
      <vis-icon name="share" size="14px" :color="mainColor" />
      <span>分享</span>
      <vis-icon name="arrow" size="14px" color="#646566" />
    </div>
    <share-mask
      v-if="showWxShare"
      :is-mini-app="false"
      @close="toggleWxShareMask"
    />
  </div>
</template>

<script>
import { get } from 'lodash';
import { Icon as VisIcon } from '@youzan/vis-ui';
import api from './api';
import { url } from '@youzan/utils';
import ShareMask from './components/ShareMask';
import { setShareData } from '@youzan/wxsdk';
import fullfillImage from 'zan-utils/fullfillImage';
import mixinVisPage from 'common/mixins/mixin-vis-page';
import ZNB from '@youzan/znb';
import $ from 'zepto';
const SHAREICONURL = 'https://img01.yzcdn.cn/public_files/f12cce4195f0315c3db63f6daa9e0840.png!small.jpg';
export default {
  name: 'enrollment-poster',
  config: {
    log: {
      auto: false,
      type: 'eduposter',
    },
  },
  components: {
    'share-mask': ShareMask,
    VisIcon,
  },
  mixins: [
    mixinVisPage,
  ],
  data() {
    return {
      posterData: null,
      showWxShare: false,
    };
  },
  computed: {
    mainColor() {
      return get(this, '$theme.colors.main', '#00b389');
    },

    imageUrl() {
      return this.posterData ? fullfillImage(this.posterData.templatePicUrl) : '';
    },
  },
  created() {
    $('.container').css('min-height', 0);
    this.setShareLink();
    const id = url.args.get('id');
    // 设置埋点
    const resourceAlias = url.args.get('resourceAlias');
    let params = {};
    if (resourceAlias) {
      params = {
        source: 'enrollment_poster',
        sourceID: resourceAlias,
      };
    }
    /* const logger = window.yzlogInstance;
    logger.log({
      et: 'display',
      ei: 'enterpage',
      en: document.title,
      ts: Date.now(),
      pi: window._global.kdt_id,
      pt: 'eduposter',
      params: {
        spm: `eduposter.${window._global.kdt_id}`,
        ...params,
      },
    }); */
    this.$log('enterpage', params);

    // 获取详情
    api.getById(id).then(data => {
      this.posterData = data;
    });
  },
  methods: {
    toggleWxShareMask() {
      this.showWxShare = !this.showWxShare;
    },
    // 设置分享链接
    setShareLink() {
      const shareOptions = {
        title: '我发现了一门有意思的课程，快来一起报名吧',
        desc: '扫码报名，发现惊喜',
        cover: SHAREICONURL,
        imgUrl: SHAREICONURL,
      };
      // 业务方可能设置了setBizShare,默认使用wxsdk的setShareData
      if (_global.setBizShare) {
        ZNB.configShare(shareOptions).catch(() => {});
      } else {
        setShareData(shareOptions);
      }
    },
  },
};
</script>

<style lang="scss">
.enrollment-poster img {
  width: 100%;
}

.enrollment-poster-share {
  position: fixed;
  right: 0;
  bottom: 120px;
  padding: 11px 12px 11px 8px;
  font-size: 14px;
  line-height: 14px;
  background: #fff;
  border-bottom-left-radius: 17px;
  border-top-left-radius: 17px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, .12);
  box-sizing: border-box;

  span {
    margin: 0 2px 0 4px;
  }
}
</style>
