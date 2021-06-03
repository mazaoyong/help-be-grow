<template>
  <div class="change-bottom">
    <div
      class="change-bottom__data"
    >
      <detail-item
        v-for="(item, index) in detailList"
        :key="index"
        :item-title="item.itemTitle"
        :item-content="item.itemContent"
      />
    </div>

    <div class="change-bottom__else">
      <detail-item
        :item-title="'操作人'"
        :item-content="operator"
      />
      <detail-item
        :item-title="'备注'"
        :item-content="remark"
      />
    </div>
  </div>
</template>
<script>
import DetailItem from './detail-item';
export default {
  name: 'detail-bottom',
  components: {
    DetailItem,
  },
  props: {
    changeTime: {
      type: String,
      default: '',
    },
    validity: {
      type: String,
      default: '',
    },
    oldClass: {
      type: String,
      default: '',
    },
    courseDetail: {
      type: String,
      default: '',
    },
    operator: {
      type: Array,
      default: () => {},
    },
    remark: {
      type: Array,
      default: () => {},
    },
    newClassValidity: {
      type: String,
      default: '',
    },
    oldClassValidity: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
    };
  },
  computed: {
    detailList() {
      return [
        { itemTitle: '变更时间', itemContent: this.changeTime || '' },
        { itemTitle: '变更后有效期', itemContent: this.newClassValidity || '' },
        { itemTitle: '变更前班级', itemContent: this.oldClass || '' },
        { itemTitle: '变更前有效期', itemContent: this.oldClassValidity || '' },
        { itemTitle: '有效期', itemContent: this.validity || '' },
        { itemTitle: '课时', itemContent: this.courseDetail || '' },
      ];
    },
  },
};
</script>
<style lang="scss" scoped>
.change-bottom {
  width: 95%;
  margin: 10px auto;
  background-color: #fff;
  &__data, &__else {
    margin: 0 16px;
    padding: 8px 0;
  }
  &__else {
    border-top: 1px solid #f2f2f2;
  }
}
</style>
