<template>
  <div class="invite-poster__card">
    <img-wrap
      :src="posterBg"
      :loading-img="posterBg"
      :cover="false"
      width="100%"
      height="100%"
      :disable-fullfill="true"
      class="invite-poster__card-preview no-save"
      v-if="type === 'custom'"
    />

    <default-poster
      v-if="type === 'default'"
      :avatar="posterInfo.avatar"
      :name="posterInfo.name"
      :qr-code="posterInfo.qrCode"
      :poster="posterBg"
      :shop-name="posterInfo.shopName"
      :new-stu-reward-tip="newStuRewardTip"
    />

    <define-poster
      v-if="type === 'definition'"
      :avatar="posterInfo.avatar"
      :name="posterInfo.name"
      :qr-code="posterInfo.qrCode"
      :poster="posterBg"
    />

    <div v-show="type === 'custom'" class="invite-poster__card-custom">
      <custom-poster
        :qrCode="posterInfo.qrCode"
        :userName="posterInfo.name"
        :new-stu-reward-tip="newStuRewardTipSimple"
      />
    </div>
  </div>
</template>
<script>
import { ImgWrap } from '@youzan/vis-ui';

import CustomPoster from './custom-poster';

import DefaultPoster from '../../../components/__posters__/default/Poster';

import DefinePoster from '../../../components/__posters__/definition/Poster';

export default {
  name: 'poster-card',

  components: {
    CustomPoster,
    ImgWrap,
    DefaultPoster,
    DefinePoster,
  },

  props: {
    type: {
      type: String,
      required: true,
    },

    posterBg: {
      type: String,
      required: true,
    },

    posterInfo: {
      type: Object,
      default() {
        return {};
      },
    },

    newStuRewardTip: {
      type: String,
    },

    newStuRewardTipSimple: {
      type: String,
    },
  },

  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
@import 'mixins/index.scss';

.invite-poster {
  &__card {
    position: relative;
    height: 100%;

    &-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    &-custom {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      @include flex-column(initial, initial);
    }

    &-preview {
      &.no-save {
        pointer-events: none;
      }
    }

    .introduce-poster {
      transform: scale(0.85);
      transform-origin: 0 0;
    }
  }
}
</style>
