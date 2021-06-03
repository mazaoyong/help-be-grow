<template>
  <div class="invite-popup__pay-card">
    <span class="invite-popup__content-type">
      <p>{{ contentType }}</p>
    </span>
    <img :src="cover" class="invite-popup__pay-card-img">
    <div class="invite-popup__pay-card-wrap">
      <div class="invite-popup__pay-card-info">
        <h1>{{ title }}</h1>
        <p>{{ contentInfoText }}</p>
        <div class="invite-popup__pay-card-footer">
          <van-button
            type="danger"
            size="large"
            @click="payForFriend">
            付费送好友
          </van-button>
          <p>{{ everyContentFriendCount }}个免费名额已用完，付费购买送给TA</p>
          <svg class="invite-popup__icon-close" @click="closePopup">
            <use class="abc" xlink:href="#icon_close" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Button } from 'vant';
import { MEDIA_TEXT_MAP } from 'pct/constants';
import { getContentInfoText } from 'pct/utils';

export default {

  name: 'invite-friend-pop-inner',

  components: {
    'van-button': Button,
  },

  props: {
    everyContentFriendCount: {
      type: Number,
      default: 10,
    },
    cover: String,
    title: String,
    author: String,
    mediaType: Number,
    audioDuration: Number,
    videoDuration: Number,
  },

  computed: {
    contentInfoText() {
      const { mediaType, videoDuration, author } = this;
      return getContentInfoText({
        isColumn: false,
        mediaType,
        videoDuration,
        author,
      });
    },
    contentType() {
      return MEDIA_TEXT_MAP[this.mediaType];
    },
  },

  methods: {
    closePopup() {
      this.$emit('invite-friend');
    },

    payForFriend() {
      this.$emit('pay-for-friend');
    },
  },
};
</script>

<style lang="scss">
.invite-popup {
  background-color: rgba(0, 0, 0, 0);
  color: #fff;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 35%;

  &__pay-card {
    border-radius: 10px;
    width: 305px;
    height: 400px;
    background: #fff;
  }

  &__content-type {
    position: absolute;
    right: 0;
    top: 20px;
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
    background-color: rgba(0, 0, 0, .4);
    width: 44px;
    height: 20px;
    text-align: center;

    p {
      line-height: 1.7;
      margin-left: 3px;
    }
  }

  &__pay-card-img {
    width: 100%;
    height: 50%;
    border-radius: 5px 5px 0 0;
  }

  &__pay-card-wrap {
    width: 100%;
    height: 50%;
    background: #fff;
    border-radius: 0 0 5px 5px;
  }

  &__pay-card-info {
    padding: 18px;

    h1 {
      color: #4a4a4a;
      font-size: 16px;
      margin-bottom: 10px;
    }

    p {
      color: #999;
      margin: 10px 10px 10px 0;
    }
  }

  &__pay-card-footer {
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__icon-close {
    width: 35px;
    height: 35px;
    position: relative;
    top: 45px;
  }
}

@media only screen and (max-width: 320px) {

  .invite-popup__pay-card {
    width: 260px;
    height: 350px;
  }
}
</style>
