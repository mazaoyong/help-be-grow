<template>
  <div class="tab f-safeArea">
    <a
      v-for="(operation, index) in operationList"
      :key="index"
      class="tab-item"
      :href="operation.type === 2 ? `tel:${mobile}` : 'javascript: void(0);'"
      @click="onOperation(operation.type)"
    >
      <span class="text">{{ operation.text }}</span>
    </a>

    <!-- 更多操作的actionsheet 开始 -->
    <van-actionsheet
      v-model="isShowOperationAction"
      :actions="operationActions"
      cancel-text="取消"
      @select="onSelectOperationAction"
      @cancel="onCancelOperationAction"
    />
    <!-- 更多操作的actionsheet 结束 -->

    <!-- 选择校区actionsheet 开始 -->
    <van-actionsheet v-model="isShowShopAction" title="选择校区">
      <p
        v-for="(shop, index) in shopList"
        :key="index"
        class="shop"
        :class="shop.kdtId === selectedKdtId ? 'active' : ''"
        @click="onSelectShop(shop)"
      >
        {{ shop.shopName }}
        <icon
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
import { ActionSheet, Toast } from 'vant';
import { Icon } from '@youzan/vis-ui';
/** 店铺类型
 * isEduSingleStore: 店铺角色是否为教育单店
 * isEduHqStore: 店铺角色是否为教育总部
 * isEduBranchStore: 店铺角色是否为教育分店
 * isEduChainStore: 店铺角色是否为教育连锁店铺
 */
import { isEduHqStore } from '@youzan/utils-shop';
import { action } from '@youzan/zan-jsbridge';
import UA from '@youzan/utils/browser/ua_browser';
import compareVersions from '@youzan/utils/string/compareVersions';
import router from '../router.js';
import { checkAccess } from 'utils/permission';

let lock = false;

const operationList = [
  {
    type: 0,
    text: '更多操作'
  },
  {
    type: 1,
    text: '添加动态'
  },
  {
    type: 2,
    text: '拨打电话'
  }
];

const operationActions = [];

const transfer = {
  type: 0,
  name: '转让线索'
};

const giveup = {
  type: 1,
  name: '放弃线索'
};

const appointment = {
  type: 2,
  name: '办理试听',
  loading: false
};

const distribution = {
  type: 3,
  name: '分配给校区'
};

const registration = {
  type: 4,
  name: '办理报名'
};

export default {
  name: 'operation',
  components: {
    'van-actionsheet': ActionSheet,
    icon: Icon
  },
  props: {
    clueId: {
      type: Number,
      default: 0
    },
    attributes: {
      type: Array,
      default: () => {
        return [];
      }
    },
    name: {
      type: String,
      default: ''
    },
    mobile: {
      type: String,
      default: ''
    },
    userId: {
      type: Number,
      default: 0
    },
    studentId: {
      type: Number,
      default: 0
    },
    studentName: {
      type: String,
      default: ''
    },
    studentMobile: {
      type: String,
      default: ''
    },
    owners: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      isShowOperationAction: false,
      operationList,
      operationActions,

      shopList: [],
      isShowShopAction: false,
      selectedKdtId: -1
    };
  },
  watch: {
    isShowShopAction(val) {
      if (!val) {
        this.shopList = []; // 需要重置下shopList
      }
    }
  },
  created() {
    this.init(); // 此时需要做的，是根据权限点去展示不同的操作
  },
  methods: {
    init() {
      if (lock) {
        return;
      }
      lock = true;
      if (checkAccess('线索-我的线索', '转让')) {
        this.operationActions.push(transfer);
      }
      if (checkAccess('线索-我的线索', '放弃')) {
        this.operationActions.push(giveup);
      }
      // todo: 待新增线索-办理试听权限点
      if (isEduHqStore || checkAccess('教务-预约管理', '查看')) {
        this.operationActions.push(appointment);
      }
      if (!isEduHqStore) {
        try {
          const version = UA.getPlatformVersion();
          // 只有当当前版本高于此版本才放开入口
          if (compareVersions(version, '4.21.0') >= 0) {
            this.operationActions.push(registration);
          }
        } catch (e) {}
      }
      if (isEduHqStore) {
        this.operationActions.push(distribution);
      }
    },
    onOperation(type) {
      if (type === 0) {
        // 更多操作
        if (this.operationActions.length > 0) {
          this.isShowOperationAction = true;
        } else {
          Toast('无操作权限');
        }
      } else if (type === 1) {
        // 添加动态
        router.push({ name: 'update-dynamic', query: { type: 'add', clueId: this.clueId } });
      }
    },
    onSelectOperationAction(item) {
      switch (item.type) {
        case 0: // 转让线索
          window.location.href = `/v4/vis/h5/edu/clue/transfer-clue?clueIds=${encodeURIComponent([
            this.clueId
          ])}`;
          break;
        case 1: // 放弃线索
          window.location.href = `/v4/vis/h5/edu/clue/abandon-clue?clueIds=${encodeURIComponent([
            this.clueId
          ])}`;
          break;
        case 2: // 办理试听
          this.createPreAppointment();
          break;
        case 3: // 分配给校区，展示校区列表
          this.getShopList();
          break;
        case 4: // 办理报名
          this.goToNativeRegistration();
          break;
        default:
          break;
      }
    },
    // 跳转到Native办理报名
    goToNativeRegistration() {
      let params = {
        clueId: this.clueId,
        studentId: this.studentId,
        studentName: this.studentName,
        studentMobile: this.studentMobile
      };
      if (params.studentId === 0) {
        delete params.studentId;
      }
      if (this.owners.length > 0) {
        const seller = this.owners[0];
        params = { ...params, sellerId: seller.userId, sellerName: seller.name };
      }
      action.call('jumpToNativeSignUpPage', params);/*  */
    },
    createPreAppointment() {
      // 办理试听
      appointment.loading = true;
      const createPreAppointment = this.$store.dispatch('clueDetailModule/createPreAppointment', {
        clueId: this.clueId,
        dataItemInfo: this.parseDataItemInfo(),
        userId: this.userId || null,
        name: this.name,
        telephone: this.mobile
      });
      Promise.all([createPreAppointment])
        .then(([res]) => {
          if (res && res.studentNo) {
            window.location.href = `/v4/vis/h5/edu/book-listen?studentId=${res.studentNo}&type=create-try`;
          } else {
            Toast('未获取到学员编号');
          }
        })
        .catch(err => {
          Toast(err);
        }).finally(() => {
          appointment.loading = false;
          this.isShowOperationAction = false;
        });
    },
    getShopList() {
      // 分配给校区
      this.$store
        .dispatch('clueDetailModule/findListAllCampus', {})
        .then(res => {
          if (res && res.length > 0) {
            this.shopList = this.shopList.concat(res);
            this.isShowOperationAction = false;
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
      this.$store
        .dispatch('clueDetailModule/distributeClues', {
          clueIds: [this.clueId],
          targetKdtId: this.selectedKdtId
        })
        .then(res => {
          if (res.failedCount && res.failInfos) {
            Toast(res.failInfos[0].message || '未知错误');
          } else {
            Toast.success({ message: '分配成功', duration: 1500 });
            setTimeout(() => {
              window.location.href = '/v4/vis/h5/edu/clue';
            }, 1500);
          }
        })
        .catch(err => {
          Toast(err);
        });
    },
    parseDataItemInfo() {
      const dataItemInfo = [];
      this.attributes.map(attribute => {
        if (attribute.attributeId) {
          let obj = {};
          obj.itemId = attribute.attributeId;
          obj.itemValue = attribute.attributeValue;
          dataItemInfo.push(obj);
        }
      });

      return dataItemInfo;
    },
    onCancelOperationAction() {
      this.isShowOperationAction = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.tab {
  display: flex;
  position: fixed;
  z-index: 1;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: #fff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
  &-item {
    position: relative;
    display: block;
    flex: 1;
    text-align: center;
    .text {
      line-height: 50px;
      font-size: 14px;
      color: #00b389;
    }
  }
}
.van-action-sheet__content {
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
</style>
