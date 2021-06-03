<template>
  <div
    @click="onClick"
    class="vis-sku-label"
  >
    <span class="content">
      {{ content }}
    </span>
    <span
      v-if="isEduSingleStore && num"
      class="num"
    >
      共{{ num }}个
    </span>
    <span
      v-if="!isEduSingleStore && campusName"
      class="num"
    >
      {{ campusName }}
    </span>
    <span class="icon icon-arrow-right" />
  </div>
</template>

<script>
export default {
  name: 'label',
  props: {
    content: {
      type: String,
      default: '',
    },
    num: {
      type: Number,
      default: 0,
    },
    campusName: {
      type: String,
      default: '',
    },
    isEduSingleStore: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss">
.vis-sku-label {
  position: relative;
  display: flex;
  width: 100%;
  height: 46px;
  line-height: 46px;
  border-bottom: 1px solid #f2f2f2;

  &:last-child {
    border-bottom: 0;
  }

  .content {
    position: relative;
    width: 70%;
    height: 46px;
    line-height: 46px;
    text-align: left;
    font-size: 13px;
    color: #323233;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .num {
    position: absolute;
    right: 20px;
    top: 0;
    height: 46px;
    line-height: 46px;
    font-size: 13px;
    color: #666;
  }
  .icon {
    position: absolute;
    width: 16px;
    height: 16px;
    background-position: center center;
    background-size: 16px 16px;
    background-repeat: no-repeat;
    &-arrow-right {
      top: 14px;
      right: 2px;
      background-image: url('https://b.yzcdn.cn/public_files/2018/10/16/0cdbdc2e12a1113eec5fb3efaf9b4b5d.png');
    }
  }
}
</style>
