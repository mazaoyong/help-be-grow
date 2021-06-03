<template>
  <div class="moments-feeds__header">
    <div
      class="moments-feeds__header-bgCover"
      :style="{backgroundImage: `url(${fillImage})`}"
      @click="changeImg"
    />

    <div
      v-if="canChangeBg && !backgroundImage && mounted"
      class="moments-feeds__header-change"
      @click="changeImg"
    >
      <span>去设置自己喜欢的封面吧</span>
      <vis-icon name="arrow" size="12px" color="#fff" />
    </div>

    <div
      class="moments-feeds__header-user"
      @click="jumpTimeline"
    >
      <label class="name">{{ userName }}</label>
      <img-wrap
        class="avatar"
        :width="'70px'"
        :height="'70px'"
        :src="userAvatar || defaultAvatar"
        :fullfill="'!70x0.jpg'"
        :cover="true"
      />
    </div>
  </div>
</template>
<script>
import * as SafeLink from '@youzan/safe-link';
import { Icon, ImgWrap } from '@youzan/vis-ui';
import { Toast } from 'vant';
import fullfillImage from '@youzan/utils/fullfillImage';

import ChangeImg from '../../../components/change-img';
import { USER_AVATAR } from '../constants';

const DEFAULT_BG = 'https://b.yzcdn.cn/public_files/4ba197b21a2de76c8f48d7bf0879ca0e.jpg';

export default {
  name: 'vis-shared-moments-header',

  components: {
    'vis-icon': Icon,
    'img-wrap': ImgWrap,
  },

  props: {
    userName: {
      type: String,
      default: '',
    },
    backgroundImage: {
      type: String,
      default: '',
    },
    userAvatar: {
      type: String,
      default: '',
    },
    canChangeBg: {
      type: Boolean,
      default: true,
    },
    canUserLink: {
      type: Boolean,
      default: true,
    },
    link: {
      type: String,
      default: '',
    },
    tokenUrl: {
      type: String,
      default: '',
    },
    mounted: {
      type: Boolean,
      default: false,
    },
    moduleName: {
      type: String,
      default: '家校圈',
    },
  },

  data() {
    return {
      localBg: this.backgroundImage ? this.backgroundImage.replace('img.yzcdn.cn', 'img01.yzcdn.cn') : DEFAULT_BG ,
      defaultAvatar: USER_AVATAR,
    };
  },

  watch: {
    backgroundImage(newValue) {
      this.localBg = newValue.replace('img.yzcdn.cn', 'img01.yzcdn.cn');
    },

    mounted() {
      !this.backgroundImage && (this.localBg = DEFAULT_BG);
    },
  },

  computed: {
    fillImage() {
      return fullfillImage(this.localBg, 'origin');
    },
  },

  methods: {
    jumpTimeline(e) {
      (this.canUserLink && this.link) && SafeLink.redirect({
        url: this.link,
        kdtId: window._global.kdt_id || window._global.kdtId,
      });

      e && e.stopPropagation();
    },

    changeImg() {
      this.canChangeBg && ChangeImg({
        title: `更换${this.moduleName}封面`,
        tokenUrl: this.tokenUrl,
        maxSize: 10 * 1024 * 1024,
      })
        .then((res = []) => {
          const img = (res[0] || {});
          this.$emit('change', img);
        })
        .catch(() => {
          Toast('上传头像失败');
        });
    },
  },
};
</script>

<style lang="scss">
.moments-feeds__header {
  position: relative;
  height: 256px;
  overflow: hidden;

  &-bgCover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 240px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }

  &-change {
    height: 30px;
    border-radius: 15px;
    background-color: rgba(0, 110, 84, .5);
    display: flex;
    padding: 0 12px;
    align-items: center;
    color: #fff;
    position: absolute;
    font-size: 12px;
    line-height: 14px;
    left: 12px;
    top: 12px;
    box-sizing: border-box;
  }

  &-user {
    position: absolute;
    right: 0;
    bottom: 0;
    height: 70px;
    max-width: 100%;
    box-sizing: border-box;
    padding: 0 16px;
    line-height: 70px;
    display: flex;
    align-items: center;

    .name {
      margin-right: 12px;
      font-size: 18px;
      font-weight: bold;
      color: #fff;
      vertical-align: top;
      font-weight: bold;
      text-shadow: 1px 1px 1px rgba(0, 0, 0, .5);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .avatar {
      display: block;
      overflow: hidden;
      border-radius: 4px;
      width: 70px;
      height: 70px;
      min-width: 70px;
    }
  }
}
</style>
