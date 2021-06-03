<template>
  <!-- 海报start -->
  <vis-popup-close :show-pop="showPop" class="invite-poster" @close-pop="onClosePop">
    <img-wrap
      v-if="isInited"
      width="300px"
      height="431px"
      :src="posterImageUrl"
      class="invite-poster__card"
    />
    <div v-else class="invite-poster__loading">
      <van-loading size="60px" />
    </div>
    <div class="invite-poster__desc">
      长按图片可保存到相册
    </div>
  </vis-popup-close>
  <!-- 海报end -->
</template>
<script>
import { Toast, Loading } from 'vant';
import { PopupClose, ImgWrap, Canvas } from '@youzan/vis-ui';

import { getCommonWeappCode } from '@/common-api/utils';
import { getInvitePoster, getSnopshotByKey } from '../api';
import cdnDowngrade from '@/common/utils/cdn-downgrade';

const canvas = Canvas.coreDraw;
export default {
  name: 'invite-poster',

  components: {
    'van-loading': Loading,
    'vis-popup-close': PopupClose,
    ImgWrap,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    posterInfo: {
      // 海报信息
      type: Object,
      required: true,
    },
    inviteUrl: {
      // 邀请链接
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isInited: false,
      posterImageUrl: '',
      showPop: false,
    };
  },

  watch: {
    value(bool) {
      if (bool) {
        this.isInited = false;
        this.fetchQrcode()
          .then(qrUrl => {
            if (qrUrl) {
              this.initInvitePoster(qrUrl);
            } else {
              Toast('海报生成失败，请重试~');
            }
          })
          .catch(() => {
            Toast('海报生成失败，请重试~');
          });
      }
      this.showPop = bool;
    },
    showPop(bool) {
      this.$emit('input', bool);
    },
  },

  methods: {
    // 获取海报需要的二维码
    fetchQrcode() {
      // 小程序码
      const miniprogram = _global.miniprogram || {};
      const isWeapp = miniprogram.isWeapp;
      if (isWeapp) {
        const data = {
          page: `/packages/edu/webview/index`,
          targetUrl: encodeURIComponent(this.inviteUrl),
        };
        return getCommonWeappCode(data);
      } else {
        // 二维码
        const config = this.fetchQrcodeConfig();
        return new Promise((resolve, reject) => {
          canvas(config)
            .then(canvas => {
              const qrUrl = canvas.toDataURL('image/png');
              resolve(qrUrl);
            })
            .catch(() => {
              reject();
            });
        });
      }
    },

    // 获取海报redisKey
    initInvitePoster(qrUrl) {
      getInvitePoster({
        ...this.posterInfo,
        qrUrl,
      }).then(res => {
        if (res.redisKey) {
          this.transformPoster(res.redisKey);
        } else {
          Toast('海报生成失败，请重试~');
        }
      })
        .catch(() => {
          Toast('海报生成失败，请重试~');
        });
    },

    // 生成海报
    transformPoster(key) {
      /* eslint-disable no-new */
      new Promise((resolve, reject) => {
        let i = 5;
        const check = () => {
          setTimeout(() => {
            getSnopshotByKey({
              key,
            })
              .then(res => {
                if (res.img) {
                  this.posterImageUrl = res.img;
                  this.isInited = true;
                  resolve(res);
                } else if (i > 0 && res.type === 'pending') {
                  i--;
                  check();
                } else {
                  throw new Error('海报生成失败，请重试5~');
                }
              })
              .catch(e => {
                reject(e);
              });
          }, 1000);
        };
        check();
      });
    },

    onClosePop() {
      this.showPop = false;
    },

    fetchQrcodeConfig() {
      return {
        type: 'div',
        css: {
          width: '178px',
          height: '178px',
          backgroundColor: '#fff',
        },
        children: [
          {
            type: 'image',
            url: cdnDowngrade(this.posterInfo.qrUrl),
            css: {
              width: '178px',
              height: '178px',
            },
          },
          {
            type: 'image',
            url: cdnDowngrade(this.logo),
            css: {
              width: '36px',
              height: '36px',
              position: 'absolute',
              left: '71px',
              top: '71px',
            },
          },
        ],
      };
    },
  },
};
</script>
<style lang="scss">
@import "mixins/index.scss";

.invite-poster {
  .van-popup {
    background-color: transparent;
  }

  .van-icon {
    float: right;
    margin-bottom: 10px;
    font-size: 24px;
    color: $white;
  }

  .vis-popup__content {
    text-align: center;
  }

  &__card {
    background-color: $white;
    border-radius: 8px;
  }

  &__loading {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 300px;
    height: 431px;
    background-color: $white;
    border-radius: 8px;
  }

  &__desc {
    position: relative;
    display: inline-block;
    margin-top: 24px;
    font-size: 14px;
    line-height: 20px;
    color: $white;
    text-align: center;
  }
}
</style>
