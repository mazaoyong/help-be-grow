<template>
  <van-checkbox-group
    v-model="resultLocal"
    :checked-color="checkedColor"
    @change="checkChange"
  >
    <vis-common-list
      v-bind="$attrs"
      v-on="$listeners"
      @load="onLoad"
    >
      <van-checkbox
        slot-scope="{item, index}"
        :name="item.keyName"
        :class="[listItemClass]"
      >
        <slot
          :item="item"
          :index="index"
        />
      </van-checkbox>
    </vis-common-list>
  </van-checkbox-group>
</template>

<script>
import { Checkbox, CheckboxGroup } from 'vant';
import { CommonList } from '@youzan/vis-ui';

export default {
  components: {
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    'vis-common-list': CommonList,
  },

  inheritAttrs: false,

  props: {
    result: {
      type: Array,
      default() {
        return [];
      },
    },
    listItemClass: {
      type: String,
      default: '',
    },
    checkedColor: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      resultLocal: [],
      localData: [],
    };
  },

  watch: {
    result(newValue) {
      this.resultLocal = newValue;
    },
  },

  methods: {
    onLoad(res, resData) {
      console.log('翻页数据返回', resData);
      this.localData = this.localData.concat(resData.list);
    },
    checkChange(res) {
      console.log('勾选的 change', res);
      const changedList = this.localData.filter(o => {
        if (res.includes(o.keyName)) {
          return true;
        }
        return false;
      });
      this.$emit('selectedChange', changedList);
    },
  },
};
</script>

<style lang="scss">

</style>
