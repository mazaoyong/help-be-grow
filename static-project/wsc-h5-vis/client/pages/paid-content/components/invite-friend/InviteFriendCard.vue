<template>
  <div>
    <div v-show="showCard" class="wrap">
      <div class="close-card" @click="closeCard">
        <img src="https://img01.yzcdn.cn/public_files/2018/05/08/8fa0a3aef0c668a35a7d87ed18fac486.png" :alt="showInviteCardPop">
      </div>
      <img :src="inviteCardSrc" :alt="title">
      <div class="press-save">
        <div class="press-save-btn">
          <img src="https://img01.yzcdn.cn/public_files/2017/09/12/ecc53ff7ea42dc8209b9445ee218f342.png" alt="">长按图片保存或发送给好友
          <p v-if="isDistribution" class="desc">
            邀请成功赚<span class="money">
              {{ distributionMoney / 100 | numberToCurrency }}
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant';
import { MEDIA_TEXT_MAP, INVITE_TEXT_MAP, DEFAULT_USER_INFO } from 'pct/constants';
import canvasUtils from './inviteFriendCardCanvasUtils';
import { getContentInfoText, uploadNetMaterial } from 'pct/utils';
import apis from 'pct/api';

export default {
  name: 'invite-friend-card',

  props: {
    cover: String,
    isColumn: Boolean,
    title: String,
    author: String,
    contentsCount: Number,
    mediaType: Number,
    audioDuration: Number,
    videoDuration: Number,
    userName: String,
    avatar: String,
    isDistribution: Boolean,
    distributionMoney: Number,
    inviteCardQrUrl: String,
    alias: String,
    showInviteCardPop: Boolean,
  },

  data() {
    return {
      showCard: false,
      inviteCardSrc: '',
    };
  },

  computed: {
    contentInfoText() {
      const { isColumn, contentsCount, mediaType, videoDuration, author } = this;
      return getContentInfoText({
        isColumn,
        contentsCount,
        mediaType,
        videoDuration,
        author,
      });
    },
    contentType() {
      if (this.isColumn) {
        return '专栏';
      }
      return MEDIA_TEXT_MAP[this.mediaType];
    },
    // 邀请文案
    inviteText() {
      if (this.isColumn) {
        return INVITE_TEXT_MAP.COLUMN;
      }
      return INVITE_TEXT_MAP[this.mediaType];
    },
  },

  updated() {
    if (this.showCard && this.inviteCardSrc) return;
    Toast.loading({
      mask: true,
      message: '加载中...',
    });
    this.drawInviteCardImg();
  },

  methods: {
    closeCard() {
      this.$emit('show-invite-card');
    },

    getDrawCardParam(qrSrc, avatar) {
      return {
        goodsImgSrc: this.cover,
        qrSrc: qrSrc,
        avatarSrc: avatar || DEFAULT_USER_INFO.avatar,
        contentType: this.contentType,
        title: this.title,
        contentInfoText: this.contentInfoText,
        nicname: this.userName || DEFAULT_USER_INFO.name,
        inviteText: this.inviteText,
      };
    },

    getSalesManParam() {
      return {
        kdt_id: window._global.kdt_id,
        buyer_id: window._global.buyer_id,
        type: 'paidcontent',
        redirect: this.inviteCardQrUrl,
        alias: this.alias,
      };
    },

    getSalesManQrUrl() {
      return new Promise((resolve, reject) => {
        const salesManParam = this.getSalesManParam();
        apis.getShareData(salesManParam)
          .then(data => {
            apis.getUndecodeQrSrc({ url: data.recommendUrl }, true)
              .then(data => {
                resolve(data.qrCode);
              })
              .catch(error => {
                console.error(error);
                Toast('获取二维码异常');
              });
          })
          .catch(error => {
            console.error(error, '获取分销员url异常');
            // Toast('获取分销员url异常');
          });
      });
    },

    getQrSrc() {
      return new Promise((resolve, reject) => {
        // 分销员需要充分销后台获取url
        if (this.isDistribution) {
          this.getSalesManQrUrl()
            .then(qrSrc => {
              resolve(qrSrc);
            })
            .catch(error => {
              console.warn(error, '获取分销员二维码异常');
            });
        } else {
          apis.getInviteData({ url: this.inviteCardQrUrl, isShortenUrl: true }, true)
            .then(data => {
              resolve(data);
            })
            .catch(error => {
              console.warn(error);
              Toast('获取二维码异常');
            });
        }
      });
    },

    uploadAvatar() {
      return new Promise((resolve, reject) => {
        uploadNetMaterial(this.avatar)
          .then(res => {
            let avatar;
            if (res.code === 0) {
              avatar = res.data.url;
            }
            resolve(avatar);
          })
          .catch(error => {
            console.warn(error, '上传头像失败');
          });
      });
    },

    // 绘制邀请卡
    drawInviteCardImg() {
      if (this.cover) {
        Promise.all([
          this.getQrSrc(),
          this.uploadAvatar(),
        ]).then(res => {
          const param = this.getDrawCardParam(res[0], res[1]);
          canvasUtils
            .drawInviteCard(param)
            .then(imgUrl => {
              this.inviteCardSrc = imgUrl;
              this.showCard = true;
              Toast.clear();
            })
            .catch((error) => {
              console.warn(error);
              Toast('生成图片出错');
            });
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  background-color: rgba(0, 0, 0, 0);

  img {
    width: 280px;
    height: 460px;
  }
}

@media only screen and (max-width: 320px) {
  .wrap {
    img {
      width: 240px;
      height: 420px;
    }
  }
}

.press-save {
  position: absolute;
}

.press-save-btn {
  position: relative;
  width: 280px;
  height: 14px;
  margin-top: 10px;
  font-size: 14px;
  line-height: 14px;
  color: #e5e5e5;
  text-align: center;

  img {
    width: 12.5px;
    height: 14px;
    margin-right: 5.5px;
    vertical-align: bottom;
  }
}

@media only screen and (max-width: 320px) {
  .press-save-btn {
    width: 240px;
  }
}

.close-card {
  position: absolute;
  top: -13px;
  right: -13px;

  img {
    width: 26px;
    height: 26px;
  }
}

.desc {
  margin-top: 10px;
}

.money {
  color: red;
}
</style>
