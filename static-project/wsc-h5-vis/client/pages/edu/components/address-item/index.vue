<template>
  <div
    class="vis-address-item"
  >
    <div
      @click="onClick"
      class="item-left"
    >
      <span class="vis-icon vis-icon-address" />
      <span class="item-text">地图</span>
    </div>
    <div class="item-right">
      <div class="item-min">
        <span class="address">
          {{ address }}
        </span>
        <span
          v-if="distance"
          class="distance"
        >
          {{ distance }}
        </span>
      </div>
      <div class="item-detail">
        {{ detail }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'address-item',
  props: {
    address: {
      type: String,
      default: '',
    },
    distance: {
      type: String,
      default: '',
    },
    detail: {
      type: String,
      default: '',
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
.vis-address-item {
  box-sizing: border-box;
  padding: 15px 0;
  width: 100%;
  border-bottom: 1px solid #f2f2f2;
  background-color: #fff;
  .item-left {
    position: relative;
    float: left;
    width: 25px;
    .vis-icon-address {
      position: absolute;
      top: 10px;
      left: 50%;
      margin-left: -6px;
      width: 12px;
      height: 14px;
      background-image: url('https://b.yzcdn.cn/public_files/2018/10/18/9a5b98e6af91c08ce714da97cae2f510.png');
      background-size: 12px 14px;
      background-position: center center;
      background-repeat: no-repeat;
    }
    .item-text {
      position: absolute;
      top: 30px;
      left: 0;
      width: 25px;
      display: inline-block;
      font-size: 8px;
      text-align: center;
      color: #666;
    }
  }
  .item-right {
    margin-left: 36px;
    overflow: hidden;
    .item-min {
      display: flex;
      position: relative;
      height: 30px;
      line-height: 30px;
      .address {
        display: block;
        flex: 1;
        font-size: 14px;
        color: #111;
        line-height: 27px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .distance {
        display: block;
        flex: 1;
        font-size: 12px;
        color: #999;
        text-align: right;
        line-height: 30px;
      }
    }
    .item-detail {
      font-size: 13px;
      color: #666;
      line-height: 16px;
      text-align: justify;
    }
  }
}
</style>
