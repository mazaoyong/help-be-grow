<template>
  <div class="recieved-present-list">
    <div
      v-for="(pre, index) in presentList"
      :key="index"
      class="recieved-present-list__item"
    >
      <list-item
        :url="pre.url"
        :thumbnail-url="pre.imageUrl"
        :thumbnail-icon="pre.thumbnailIcon"
        :need-log="true"
        :title="pre.title"
        :title-tag="presentTag"
        :title-tag-class="presentTagClass"
        :subtitle="pre.summary"
        :is-cover="false"
      />
    </div>
    <div
      v-if="recievedPresent.length > 3 && recievedPresent.length !== presentList.length"
      class="recieved-present-list__more"
      @click="onShowAllPresent"
    >
      展开全部
    </div>
  </div>
</template>

<script>
import ListItem from 'components/list-item';

export default {
  name: 'recieved-present-list',

  components: {
    ListItem,
  },

  props: {
    recievedPresent: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },

  data() {
    return {
      presentTag: '赠品',
      presentTagClass: 'theme-tag',
      presentList: [],
    };
  },

  mounted() {
    this.presentList = this.recievedPresent.slice(0, 3);
  },

  methods: {
    onShowAllPresent() {
      this.presentList = this.recievedPresent;
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';
.recieved-present-list {
  margin-top: 10px;
  background-color: #fff;

  &__item {
    .item-col {
      display: inline-flex;
      height: 64px;
      flex-direction: column;
      justify-content: space-between;
    }

    .theme-tag {
      border-radius: 9px;
      align-self: baseline;

      span {
        color: inherit !important;
      }
    }

    .item__title {
      white-space: normal;
      line-height: 14px;

      @include multi-ellipsis(2);
    }
  }

  &__more {
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-size: 13px;
    color: #969799;
  }
}
</style>
