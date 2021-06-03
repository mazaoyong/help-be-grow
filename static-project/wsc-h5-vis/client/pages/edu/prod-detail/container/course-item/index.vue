<template>
  <div class="vis-course-item">
    <van-collapse v-model="activeNames">
      <van-collapse-item
        :title="titleNo"
        :name="index"
        :is-link="list.length > 0"
      >
        <div class="item-detail-box">
          <div
            v-for="(item, index) in list"
            :key="index"
            class="item-detail"
          >
            {{ item.title }}
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
import { Collapse, CollapseItem } from 'vant';

export default {
  name: 'course-item',
  components: {
    'van-collapse': Collapse,
    'van-collapse-item': CollapseItem,
  },
  props: {
    index: {
      type: Number,
      default: 1,
    },
    title: {
      type: String,
      default: '',
    },
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      titleNo: `${this.index >= 9 ? this.index + 1 : `0${this.index + 1}`} | ${this.title}`,
      activeNames: [this.index],
    };
  },
};
</script>

<style lang="scss">
.van-collapse-item__title {
  &::after {
    border: none;
  }
}
.van-collapse-item--expanded {
  .van-collapse-item__content {
    padding: 0 15px 15px;
  }
}
.vis-course-item {
  width: 100%;
  .van-hairline--top-bottom::after {
    border: none;
  }
  .van-cell:not(:last-child)::after {
    border: none;
  }
  .van-collapse-item__content {
    padding: 0 15px 0 0;
  }
  .van-cell {
    padding: 13px 16px 11px 0;

    &:first-child {
      padding-top: 9px;
    }
  }
  .item-detail-box {
    background: #f7f8fa;
    border-radius: 4px;
  }
  .item-detail {
    padding: 12px 10px;
    font-size: 13px;
    color: #646566;
    letter-spacing: 0;
    text-align: justify;
    line-height: 15px;
    border-bottom: 1px solid #f2f2f2;
    &:last-child {
      border: none;
    }
  }
  .van-cell__right-icon {
    height: 12px;
    font-size: 12px;
    line-height: 12px;
  }
}
</style>
