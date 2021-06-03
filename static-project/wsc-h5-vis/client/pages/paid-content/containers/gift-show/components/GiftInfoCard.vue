<template>
  <div class="card-wrap">
    <div class="card-contain">
      <div
        v-if="showTip"
        class="error-container"
      >
        <img
          class="err-img"
          src="https://b.yzcdn.cn/public_files/2018/11/19/bfc666f3eb05081b88d7353f43e18123.png"
          alt=""
        >
        <p class="err-tip">
          {{ errTip }}
        </p>
      </div>
      <div
        v-else
        class="card-img"
      >
        <img
          v-if="isShowGiftImg"
          class="present-icon"
          src="https://b.yzcdn.cn/public_files/2018/06/03/71e7dbe831235c17d2bfbcb6f85ca05c.png"
          alt=""
        >
        <span class="content-type">
          <p>{{ contentType }}</p>
        </span>
        <img-wrap
          :width="'100%'"
          :height="'140px'"
          :src="cover"
          :fullfill="'!180x180.jpg'"
          :cover="false"
        />
      </div>
      <div class="card-content">
        <div class="card-info">
          <h1>{{ title }}</h1>
          <p v-if="contentInfoText">{{ contentInfoText }}</p>
        </div>
        <img
          v-if="isShowReceiveOverImg"
          class="receive-over-img"
          src="https://b.yzcdn.cn/public_files/2018/05/18/96ddb6ca98a021fb4706caa6d0c081ee.png"
          alt=""
        >
      </div>
      <div class="card-footer-wrap">
        <div class="card-footer">
          <img :src="userAvatar" class="avatar-img">
          来自 <p class="user-name">
            {{ userName || '匿名用户' }}
          </p>的礼物
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ImgWrap } from '@youzan/vis-ui';
import { MEDIA_TEXT_MAP, RECEIVE_GIFT_STATUS, DEFAULT_USER_INFO } from 'pct/constants';
import { getContentInfoText } from 'pct/utils';

export default {

  name: 'gift-info-card',

  props: {
    cover: String,
    title: String,
    author: String,
    isColumn: Boolean,
    mediaType: Number,
    audioDuration: Number,
    videoDuration: Number,
    avatar: String,
    userName: String,
    receivGiftStatus: Number,
    contentsCount: Number,
    showTip: Boolean,
    errTip: String,
  },

  components: {
    ImgWrap,
  },

  computed: {
    contentInfoText() {
      const { isColumn, contentsCount, mediaType, videoDuration, audioDuration, author } = this;
      return getContentInfoText({
        isColumn,
        contentsCount: contentsCount,
        mediaType,
        videoDuration,
        audioDuration,
        author,
      });
    },
    contentType() {
      if (this.isColumn) {
        return '专栏';
      }
      return MEDIA_TEXT_MAP[this.mediaType];
    },
    userAvatar() {
      return this.avatar || DEFAULT_USER_INFO.avatar;
    },
    isShowGiftImg() {
      return this.receivGiftStatus !== RECEIVE_GIFT_STATUS.PAIED;
    },
    isShowReceiveOverImg() {
      return this.receivGiftStatus === RECEIVE_GIFT_STATUS.RECEIVED_FAIL;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.card-wrap {
  border-radius: 4px;
  box-sizing: border-box;
  width: 81%;
  height: 320px;
  margin-top: 30px;
  background: url(/public_files/2018/06/03/a45a65a990c90c8d7a41ef148a6aa06c.png);
  background-size: 100% 320px;

  .card-contain {
    position: relative;
    height: 100%;
    padding: 9px 9px 0;
  }

  .error-container {
    margin-top: 55px;
    text-align: center;

    .err-img {
      width: 100px;
      height: 100px;
      margin-bottom: 10px;
    }

    .err-tip {
      font-size: 14px;
      color: #a0a1a3;
    }
  }

  .card-img {
    position: relative;
    width: 96%;
    margin: 5px;
    overflow: hidden;

    .present-icon {
      position: absolute;
      width: 60px;
      top: -5px;
      left: -6px;
      z-index: 1;
    }

    .card-img {
      width: 100%;
      height: 140px;
      border-radius: 4px 4px 0 0;
    }

    .card-cover-img {
      position: absolute;
      top: 50%;
      left: 50%;
      max-width: 100%;
      transform: translate(-50%, -50%);

      &-old {
        position: absolute;
        top: 12px;
        left: 50%;
        height: calc(100% - 24px);
        border-radius: 4px;
        transform: translateX(-50%);
      }
    }

    .content-type {
      position: absolute;
      right: 0;
      top: 20px;
      border-top-left-radius: 25px;
      border-bottom-left-radius: 25px;
      background-color: rgba(0, 0, 0, .4);
      width: 44px;
      height: 20px;
      text-align: center;
      z-index: 1;

      p {
        line-height: 1.7;
        font-size: 12px;
        color: #fff;
        margin-left: 3px;
      }
    }
  }

  .card-content {
    display: flex;
    justify-content: space-between;

    .card-info {
      padding: 18px;

      h1 {
        color: #4a4a4a;
        font-size: 16px;
        margin-bottom: 10px;

        @include multi-ellipsis(2);
      }

      p {
        font-size: 12px;
        color: #999;
        margin: 10px 10px 10px 0;
      }
    }

    .receive-over-img {
      width: 54px;
      height: 54px;
      margin-top: -5px;
    }
  }

  .card-footer-wrap {
    position: absolute;
    right: 15px;
    bottom: 50px;

    .card-footer {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      float: right;
      color: #999;
      margin-right: 15px;
      font-size: 12px;
    }

    .avatar-img {
      width: 24px;
      height: 24px;
      border-radius: 12px;
      margin-right: 8px;
    }

    .user-name {
      padding-left: 5px;
      padding-right: 5px;
      color: #333;
    }
  }
}
</style>
