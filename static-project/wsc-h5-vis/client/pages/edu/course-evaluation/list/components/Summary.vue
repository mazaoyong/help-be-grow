<template>
  <div class="evaluation-summary">
    <div class="tags">
      <div
        v-for="(tag, index) in tagList"
        :key="index"
        :class="['tags__item', tag.tagClass, { 'tags__item--active': index === tagIndex }]"
        @click="onSelect(tag.tagAlias, index)"
      >
        {{ tag.tagName }} ({{ tag.count }})
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'summary',

  props: {
    showPraiseRate: {
      type: Boolean,
      default: false,
    },
    tagList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },

  data() {
    return {
      tagIndex: 0,
    };
  },

  methods: {
    onSelect: function(tagAlias, index) {
      if (index !== this.tagIndex) {
        this.tagIndex = index;
        this.$emit('tag-change', tagAlias);
      }
    },
  },
};
</script>

<style lang="scss">
.evaluation-summary {

  .praise-rate {
    color: #333;
    height: 40px;
    font-size: 13px;
    font-weight: 500;
    line-height: 40px;
    position: relative;
    padding-left: 15px;
    background-color: #fff;

    &::after {
      right: 0;
      bottom: 0;
      left: 15px;
      content: '';
      position: absolute;
      pointer-events: none;
      box-sizing: border-box;
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
      border-bottom: 1px solid #e5e5e5;
    }

    &__value {
      color: #f44;
      margin-left: 10px;
    }
  }

  .tags {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 5px 15px 15px;
    box-sizing: border-box;
    background-color: #fff;

    &__item {
      height: 26px;
      color: #333;
      font-size: 12px;
      padding: 0 15px;
      margin-top: 10px;
      line-height: 26px;
      margin-right: 10px;
      border-radius: 20px;
      border: 1px solid transparent;
      background-color: #f2f3f5;
    }
  }
}
</style>
