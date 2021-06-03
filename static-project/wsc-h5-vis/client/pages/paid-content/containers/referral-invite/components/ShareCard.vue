<template>
  <div class="share-card">
    <van-icon
      name="close"
      color="#fff"
      @click="onCloseShareCard"
    />
    <img :src="shareCardUrl">
    <p class="share-card__footer">
      长按图片保存或发送给好友
    </p>
  </div>
</template>

<script>
import { Icon } from 'vant';

export default {
  name: 'share-card',

  components: {
    'van-icon': Icon,
  },

  props: {
    shareCardUrl: String,
  },

  methods: {
    onCloseShareCard() {
      this.$emit('closeShareCard');
    },
  },
};
</script>

<style lang="scss">
.share-card {

  img {
    width: 100%;
  }

  .van-icon-close {
    float: right;
    padding-bottom: 10px;
    font-size: 22px;
  }

  &__footer {
    margin-top: 30px;
    color: #fff;
    font-size: 14px;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAcCAMAAABIzV/hAAAAqFBMVEUAAAD////z8/P////19fXz8/Py8vL09PT////z8/Pz8/Pz8/Pz8/P09PT19fXz8/Pz8/Py8vL09PTy8vLz8/Pz8/P////z8/Py8vL09PT19fX29vb19fX4+Pj39/f4+Pjz8/Pz8/P09PTz8/P09PTz8/Pz8/Pz8/P09PT09PTz8/P09PTz8/Pz8/Pz8/Pz8/P19fXz8/Pz8/Pz8/Pz8/P09PTy8vLz8/MVBQlwAAAAN3RSTlMADPoDGNnzhAfut+k9Lif25aFF3tOvEOPKWU03MyEdFMCkmo1uxbt6c2FUQs6oknxJK3+VZl5l1bo3xQAAAbpJREFUKM9d0Ndy4zAMBdAriuq9Wb3LvTvJ4v//bMlsvPbkPGiGAC6GIn7Uj0xzmJ4Pl8rEm9U2J2szb5edcU5In/xXxwqmo/o8+Y+QyudBLTmg1IfdfP06doApz/+bcaQT6ZpDRMPnCi/HhLStJytmW9osuD63Kx+0aSD0ja8A4AY73f91TsEivkuhk6DNHtCkgStXDJYHc9bZeVd5bjmFdO5gbkQRZzHA14HBnzfa504sVoUc4w1+mDeAZ9inYapU9DaL0Y+tnCs0Dp6RlU2jRpoLNdN9fNuyWgT1RYXgamwPRdtA6pkBJUk6qF7pmjBH5uJGMYQ/xGHIYEFEYSUiKZBGELI1VOcigmmseDZrcCQXhgWhiODRETu9A2CmGVTrigPJZ8sNxNRiHETwDiMUwxe4JO+ozajJQ7SGSXtUYqppsWcKgCECp+p7PJmwcmxR7HIbwlhAZQtudMdD7xHrYZTpCYcgs7bYZs3oHVtFe1lvrgokTgccRGQbtLgxm+ON0cB0IvmrCmIriJbDl4uXT4rhW0UHZZcGRBne2I6P2rFKFUCv4N0qzRV0NmnGCr/xDzlbR06FH38Bl/IoIctuu10AAAAASUVORK5CYII=);
    background-repeat: no-repeat;
    background-size: contain;
    background-position: 5%;
  }
}
</style>
