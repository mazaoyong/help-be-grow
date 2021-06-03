<template>
  <div class="address-list">
    <van-radio-group
      class="address-list__content"
      icon-size="18"
      :checked-color="$theme.colors.main"
      :value="addressId"
    >
      <van-cell
        v-for="(item, index) in formatedAddressList"
        :key="index"
        class="address-list__item"
        v-bind="item"
        :border="false"
        :color="$theme.colors.main"
        @click="onClickCell(item)"
      >
        <span slot="icon" class="address-list__block--left">
          <van-icon
            name="location-o"
            size="18"
            @click="onClickIcon(item, $event)"
          />
          <span class="address-list__distance">{{ item.distanceDesc }}</span>
        </span>

        <template slot="title">
          <span class="custom-title">{{ item.title }}</span>
          <mini-font-tag
            v-if="index === 0 && item.distance"
            class="address-list__tag"
            text="离我最近"
            line-height="16px"
            :color="$theme.colors.main"
            :background-color="lightColor"
          />
        </template>

        <van-radio
          slot="right-icon"
          class="address-list__radio"
          :class="{ 'address-list__radio--show': addressId === item.id }"
          :name="item.id"
        />
      </van-cell>
    </van-radio-group>
  </div>
</template>

<script>
import { Cell, Icon, Radio, RadioGroup } from 'vant';
import MiniFontTag from 'components/mini-font-tag';
import { fns } from '@youzan/vue-theme-plugin';
import * as SafeLink from '@/common/utils/custom-safe-link';

export default {
  name: 'address-list',

  components: {
    'van-icon': Icon,
    'van-cell': Cell,
    'van-radio': Radio,
    'van-radio-group': RadioGroup,
    MiniFontTag,
  },

  props: {
    addressList: {
      type: Array,
      default: () => [],
    },

    chosenAddressId: {
      type: Number,
      default: undefined,
    },
  },

  data() {
    return {
      addressId: this.chosenAddressId,
    };
  },

  computed: {
    formatedAddressList() {
      return this.addressList.map(
        ({ id, name, addressWrapDTO = {}, distance }) => {
          const label = [
            addressWrapDTO.province,
            addressWrapDTO.city,
            addressWrapDTO.district,
            addressWrapDTO.address,
          ].join('');

          return {
            id,
            title: name,
            label,
            distance,
            distanceDesc: distance ? this.formatDistabce(distance) : '',
          };
        }
      );
    },

    lightColor() {
      return fns.hexToRgba(this.$theme.colors.main, 0.1);
    },
  },

  methods: {
    onClickCell(item) {
      this.addressId = item.id;

      setTimeout(() => {
        this.$emit('resolve', item);
      }, 500);
    },

    // 点击地址列表弹窗的具体地址，跳转到地图页面
    onClickIcon(item, event) {
      event.stopPropagation();
      const { id } = item;
      if (id) {
        const storeIds = JSON.stringify([id]);
        SafeLink.redirect({
          url: `/wscvis/edu/map`,
          query: { storeIds },
        });
      }
    },

    formatDistabce(distance) {
      return distance >= 1000
        ? `${parseFloat(distance / 1000)}km`
        : `${distance}m`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.address-list {
  &__block--left {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: $disabled-color;
    width: 58px;
  }

  &__tag {
    vertical-align: text-top;
    padding: 0;
    margin-left: 4px;
  }

  &__item {
    padding-top: 12px;
    padding-bottom: 12px;
  }

  &__distance {
    @include mini-font;
    min-height: 20px;
  }

  &__radio {
    padding: 0 16px 0px 8px;
    visibility: hidden;

    &--show {
      visibility: visible;
    }
  }

  .van-cell {
    padding-left: 0;
    padding-right: 0;
  }

  .van-cell__title {
    height: 62px;
  }
}
</style>
