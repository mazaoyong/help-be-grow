<template>
  <div class="block-base-info">
    <div class="title-area">
      <div>
        <mini-font-tag
          v-if="titleTag"
          class="title-tag"
          :text="titleTag"
          :background-color="mainColor"
        />
        <span class="title">
          {{ goodsData.title }}
        </span>
      </div>
    </div>
    <p v-if="goodsData.subTitle" class="sell-point">
      {{ goodsData.subTitle }}
    </p>

    <div class="block-base-info__info-list">
      <info-item
        v-for="item in infoList"
        :key="item.name"
        :label="item.label"
        :value="item.value"
        :color="item.color"
        :tag="item.tag"
      />
    </div>
  </div>
</template>

<script>
import MiniFontTag from '@/components/mini-font-tag';
import InfoItem from '../../components/info-list/InfoItem';
import getInfoList from './getInfoList';

export default {
  name: 'block-base-info',

  components: {
    MiniFontTag,
    InfoItem,
  },

  rootState: ['goodsData', 'goodsType'],

  computed: {
    titleTag() {
      return this.goodsData.courseTypeName;
    },

    mainColor() {
      return this.$theme.colors.main;
    },

    infoList() {
      const { goodsType, goodsData, $theme } = this;
      return getInfoList(goodsType, goodsData, $theme);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.block-base-info {
  display: flex;
  flex-direction: column;

  &__info-list {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
}

.title-area {
  flex: 0 0 auto;
  position: relative;
  padding-right: 46px;

  .title-tag {
    padding: 0 2px;
    margin-right: 4px;
  }

  .title {
    font-size: 20px;
    font-weight: bold;
    line-height: 28px;
    color: $main-text-color;
    word-break: break-all;
    vertical-align: middle;
  }
}

.sell-point {
  @include multi-ellipsis(2);

  flex: 0 0 auto;
  margin-top: 4px;
  font-size: 16px;
  line-height: 24px;
  color: $main-text-color;
}
</style>
