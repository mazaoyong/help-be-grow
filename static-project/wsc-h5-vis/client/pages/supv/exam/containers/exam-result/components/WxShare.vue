<template>
  <van-popup
    v-model="displayValue"
    class="invite-friend">
    <div
      class="invite-friend__wrap"
      @click="closePopup">
      <icon symbol="share_book" class="invite-friend__icon" />
      <p class="invite-friend__data">
        {{ data }}
      </p>
    </div>
  </van-popup>
</template>

<script>
import { Popup } from 'vant';
import svgIcon from 'components/svg-icon';
import popupMixins from '../../../mixins/popup.js';

export default {
  name: 'wx-share',

  components: {
    icon: svgIcon,
    [Popup.name]: Popup,
  },

  mixins: [popupMixins],

  props: {
    data: {
      type: String,
      default: '',
    },
  },

  data() {
    return {

    };
  },

  methods: {
    close() {
      console.log('sdasdas');
    },
  },
};
</script>

<style lang="scss">
  .invite-friend {
    overflow: hidden;
    background-color: transparent;
    width: 100%;
    height: 100%;

    &__wrap {
      width: 100%;
      height: 100%;
    }

    &__data {
      text-align: center;
      color: #fff;
      font-size: 14px;
      padding-top: 237px;
    }

    &__icon {
      width: 220px;
      height: 192px;
      position: absolute;
      right: 38px;
      top: 15px;
    }
  }
</style>
