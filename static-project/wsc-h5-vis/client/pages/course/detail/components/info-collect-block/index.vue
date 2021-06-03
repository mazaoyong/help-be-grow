<template>
  <div v-if="isContent" :class="{ 'is-mask': showMaskType }">
    <div v-if="showMaskType" class="mask-blur" />
    <div class="info-collect-wrap">
      <img-wrap
        v-if="!showMaskType"
        width="128px"
        height="128px"
        :fullfill="`!origin.png`"
        disable-lazyload
        src="https://img.yzcdn.cn/upload_files/2020/12/30/FkJNVpwnTKuOm2Hn5czsFmkMCaeT.png"
      />
      <div class="info-collect__tips">
        {{ collectInfoTips }}
      </div>
      <div v-if="showCollectInfoBtn" class="info-collect__btn">
        <van-button
          :color="$theme.colors.main"
          text="提交报名信息"
          round
          @click="handleOpenPopup"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { Button } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';
import { sendCheckSmsCaptcha } from '@/common/utils/checkSmsCaptcha';
import { openCollectInfoPopupHOF } from 'components/info-collect-popup';
import { handleSubmitCollectInfo } from '@/pages/course/detail/utils/submit-collect-info';

export default {
  name: 'info-collect-block',

  components: {
    'van-button': Button,
    ImgWrap,
  },

  rootState: ['onlineCourseCollectSetting', 'goodsData'],

  rootGetters: ['isAudio', 'isContent'],

  props: {
    showCollectInfoBtn: {
      type: Boolean,
      default: true,
    },
    // 是否为遮罩类型，音视频播放器上方遮罩 | 内容简介正文
    showMaskType: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      infoCollectDto: {},
    };
  },

  computed: {
    collectInfoTips() {
      let action = '查看全文';
      if (this.showMaskType) {
        action = this.isAudio ? '收听音频课程' : '观看视频课程';
      }
      return `为了更好地服务你，提交报名信息即可${action}`;
    },
  },

  methods: {
    handleOpenPopup() {
      const {
        alias: bizAlias,
        collectSetting: infoCollectionItems,
        needVerifyCode,
      } = this.onlineCourseCollectSetting;

      openCollectInfoPopupHOF({
        subtitle: this.collectInfoTips,
      })({
        props: {
          infoCollectionItems,
          infoCollectDto: this.infoCollectDto,
          needVerifyCode,
        },
        on: {
          sendCaptcha: this.handleSendCaptcha,
        },
      }).then(data => {
        const { attributeItems, values } = data;

        this.infoCollectDto = values;

        // 提交信息采集资料项（内容）
        handleSubmitCollectInfo({
          attributeItems,
          bizAlias,
          scene: 1,
          onSuccess: () => setTimeout(location.reload.bind(location), 2000),
          onFailed: () => $track.collect('collectInfoError', Date.now()),
        });
      });
    },

    handleSendCaptcha(mobile, callBack) {
      const {
        alias: bizAlias,
      } = this.onlineCourseCollectSetting;

      sendCheckSmsCaptcha({
        mobile,
        bizAlias,
        scene: 1,
        callBack,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/* 音视频播放器遮罩样式 */
.is-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;

  .mask-blur {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    backdrop-filter: blur(3px);
  }

  .info-collect-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .info-collect {
      &__tips {
        color: #fff;
      }
      &__btn {
        padding-bottom: 0;
      }
    }
  }
}

/* 内容简介正文样式 */
.info-collect-wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .info-collect {
    &__tips {
      color: #999;
      font-size: 14px;
      padding: 8px 0 16px;
    }
    &__btn {
      padding-bottom: 16px;
    }
  }

  .van-button {
    padding: 0 44px;
    &__text {
      font-weight: 600;
    }
  }
}
</style>
