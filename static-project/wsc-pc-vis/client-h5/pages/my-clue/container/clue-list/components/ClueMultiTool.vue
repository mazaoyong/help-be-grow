<template>
  <div class="clue-multi-tool f-safeArea">
    <div class="clue-multi-tool__left">
      <span :class="['clue-multi-tool__left-check', isSelectAll ? '' : 'uncheck']" @click="onSelectAll">
        <vis-icon
          v-if="isSelectAll"
          name="check"
          size="22px"
          color="#00b389"
        />
      </span>
      <span class="clue-multi-tool__left-all">全选</span>
      <span class="clue-multi-tool__left-num">已选 ({{ selectedNum }})</span>
    </div>
    <div class="clue-multi-tool__right">
      <span
        v-if="isEduHqStore"
        class="clue-multi-tool__right-more"
        @click="onShowMoreOperation"
      >
        更多操作
      </span>

      <van-button
        v-if="!isEduHqStore && checkAccess('线索-我的线索', '放弃')"
        class="clue-multi-tool__right-btn"
        plain
        round
        hairline
        @click="onGiveUp"
      >
        放弃
      </van-button>
      <van-button
        v-if="checkAccess('线索-我的线索', '转让')"
        class="clue-multi-tool__right-btn transfer"
        round
        hairline
        @click="onTransfer"
      >
        转让
      </van-button>
    </div>

    <!-- more operation dialog -->
    <van-actionsheet
      v-model="isShowMoreOperation"
      :actions="actions"
      cancel-text="取消"
      @select="onSelectOperation"
      @cancel="onCancel"
    />

    <!-- 选择校区actionsheet 开始 -->
    <van-actionsheet
      v-model="isShowShopAction"
      title="选择校区"
      class="clue-multi-tool__right-more-distribute"
    >
      <p
        v-for="(shop, index) in shopList"
        :key="index"
        class="shop"
        :class="shop.kdtId === selectedKdtId ? 'active' : ''"
        @click="onSelectShop(shop)"
      >
        {{ shop.shopName }}
        <vis-icon
          v-if="shop.kdtId === selectedKdtId"
          class="check"
          name="check"
          size="14px"
          color="#00b389"
        />
      </p>
    </van-actionsheet>
    <!-- 选择校区actionsheet 结束 -->
  </div>
</template>

<script>
import { Button, ActionSheet, Toast } from 'vant';
import { Icon } from '@youzan/vis-ui';

/** 店铺类型
 * isEduSingleStore: 店铺角色是否为教育单店
 * isEduHqStore: 店铺角色是否为教育总部
 * isEduBranchStore: 店铺角色是否为教育分店
 * isEduChainStore: 店铺角色是否为教育连锁店铺
 */
import { isEduHqStore } from '@youzan/utils-shop';

import { checkAccess } from 'utils/permission';

const actions = [];
if (checkAccess('线索-我的线索', '放弃')) {
  actions.push({ name: '放弃线索', type: 'giveup' });
}
isEduHqStore && actions.push({ name: '分配给校区', type: 'distributeToSchool' });

export default {
  name: 'clue-multi-tool',

  components: {
    'vis-icon': Icon,
    'van-button': Button,
    'van-actionsheet': ActionSheet
  },

  props: {
    isSelectAll: {
      type: Boolean,
      default: false
    },

    selectedList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },

  data() {
    return {
      actions,
      isShowMoreOperation: false,
      isShowShopAction: false,
      selectedKdtId: -1,
      shopList: [],
      isEduHqStore
    };
  },

  computed: {
    selectedNum() {
      return this.selectedList.length || 0;
    }
  },

  methods: {
    checkAccess,
    onSelectAll() {
      this.$emit('selectAll');
    },

    onShowMoreOperation() {
      this.isShowMoreOperation = true;
    },

    onSelectOperation(item) {
      if (this.selectedNum > 0) {
        if (item.type === 'giveup') {
          this.onGiveUp();
        } else if (item.type === 'distributeToSchool') {
          // this.$emit('toolClick', 'distributeToSchool');
          this.getShopList();
        }
      } else {
        Toast('请先选择线索');
        this.isShowMoreOperation = false;
      }
    },

    getShopList() { // 分配给校区
      this.shopList = [];
      this.$store.dispatch('clueDetailModule/findListAllCampus', {})
        .then(res => {
          if (res && res.length > 0) {
            this.shopList = this.shopList.concat(res);
            this.isShowMoreOperation = false;
            this.isShowShopAction = true;
          }
          if (this.shopList.length === 0) {
            Toast('暂无可选择的校区');
          }
        })
        .catch(err => {
          Toast(err);
        });
    },

    onSelectShop(shop) {
      this.selectedKdtId = shop.kdtId;
      this.$store.dispatch('clueDetailModule/distributeClues', {
        clueIds: this.selectedList,
        targetKdtId: this.selectedKdtId
      })
        .then(res => {
          if (res.failedCount) {
            Toast(`有${res.failedCount}条线索分配失败，请重新再试`);
          } else {
            Toast.success({ message: '分配成功', duration: 1500 });
            setTimeout(() => {
              this.isShowShopAction = false;
              window.location.reload();
            }, 1500);
          }
        })
        .catch(err => {
          Toast(err);
        });
    },

    onCancel() {
      this.isShowMoreOperation = false;
    },

    onGiveUp() {
      this.$emit('toolClick', 'giveup');
    },

    onTransfer() {
      this.$emit('toolClick', 'transfer');
    }
  }
};
</script>

<style lang="postcss">
.clue-multi-tool {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  line-height: 50px;
  padding: 0 15px;
  background-color: #fff;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, .1);

  &__left {
    &-check {
      margin-right: 7px;
      vertical-align: -webkit-baseline-middle;

      &.uncheck {
        display: inline-block;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 1px solid #ecebed;
        line-height: 22px;
        vertical-align: middle;
      }
    }
    &-all {
      margin-right: 8px;
      font-size: 14px;
      color: #323233;
    }

    &-num {
      font-size: 13px;
      color: #969799;
    }
  }

  &__right {
    &-more {
      font-size: 14px;
      color: #323233;

      &-distribute {
        .shop {
          position: relative;
          padding-left: 15px;
          line-height: 38px;
          font-size: 13px;
          color: #323233;
          .check {
            position: absolute;
            top: 12px;
            right: 15px;
          }
        }
        .active {
          color: #00b389;
        }
      }
    }

    &-btn {
      display: inline-block;
      height: 26px;
      line-height: 24px;
      font-size: 14px;
      color: #323233;

      &.transfer {
        margin-left: 10px;
        color: #fff;
        background-color: #00b389;
      }
    }
  }
}
</style>
