<template>
  <card class="transfer-clue">
    <vis-label
      left-text="课程顾问"
      :right-text="staffText ? staffText : '(必填)请选择转让人'"
      @click="onShowStaff"
    />
    <vis-label
      left-text="转让原因"
      :right-text="reasonText ? reasonText : '(必填)请选择转让原因'"
      @click="onShowReason"
    />

    <!-- 选择转让人actionsheet 开始 -->
    <van-actionsheet
      v-model="isShowStaffActionSheet"
      title="选择课程顾问"
    >
      <van-list
        v-if="staffList.length > 0"
        :finished="isStaffListLoadingFinished"
        :error.sync="isStaffListError"
        error-text="请求失败，点击重新加载"
        @load="onLoadStaffList"
      >
        <p
          v-for="(staff, index) in staffList"
          :key="index"
          class="staff"
          :class="(selectedStaffId === staff.adminId) ? 'active' : ''"
          @click="onSelectStaff(staff)"
        >
          {{ staff.name }}
          <icon
            v-if="selectedStaffId === staff.adminId"
            class="check"
            name="check"
            size="14px"
            color="#00b389"
          />
        </p>
      </van-list>
    </van-actionsheet>
    <!--选择转让人actionsheet 结束 -->

    <!-- 选择转让原因actionsheet 开始 -->
    <van-actionsheet
      v-model="isShowReasonActionSheet"
      title="选择转让原因"
    >
      <van-list
        v-if="reasonList.length > 0"
        :finished="isReasonListLoadingFinished"
        :error.sync="isReasonListError"
        error-text="请求失败，点击重新加载"
        @load="onLoadReasonList"
      >
        <p
          v-for="(reason, index) in reasonList"
          :key="index"
          class="reason"
          :class="(selectedReasonId === reason.reasonId) ? 'active' : ''"
          @click="onSelectReason(reason)"
        >
          {{ reason.reason }}
          <icon
            v-if="selectedReasonId === reason.reasonId"
            class="check"
            name="check"
            size="14px"
            color="#00b389"
          />
        </p>
      </van-list>
    </van-actionsheet>
    <!--选择转让原因actionsheet 结束 -->

    <div
      class="confirm-box f-safeArea f-safeArea_noBackground"
    >
      <a
        class="confirm"
        :class="isCanConfirm ? '' : 'confirm_gray'"
        href="javascript: void(0);"
        @click="onConfirm"
      >
        保存
      </a>
    </div>
  </card>
</template>

<script>
import { ActionSheet, List, Toast } from 'vant';
import { Icon } from '@youzan/vis-ui';
import Args from 'zan-utils/url/args';
import Card from 'components/card/index.vue';
import VisLabel from './components/label.vue';

let APILock = false;

export default {
  name: 'transfer-clue',
  components: {
    'card': Card,
    'vis-label': VisLabel,
    'van-actionsheet': ActionSheet,
    'van-list': List,
    'icon': Icon,
  },
  data() {
    return {
      clueIds: this.parseClueIds(),
      staffText: '',
      reasonText: '',
      selectedStaffId: '',
      selectedReasonId: -1,

      staffList: [], // 转让人列表
      staffQuery: {
        pageNumber: 1,
        pageSize: 10,
      },
      // isHasStaffList: false,
      isNotLoadingStaffList: false,
      isStaffListLoadingFinished: false,
      isStaffListError: false,
      isShowStaffActionSheet: false,

      reasonList: [], // 转让原因列表
      reasonQuery: {
        pageNumber: 1,
        pageSize: 10,
      },
      // isHasReasonList: false,
      isNotLoadingReasonList: false,
      isReasonListLoadingFinished: false,
      isReasonListError: false,
      isShowReasonActionSheet: false,
    };
  },
  computed: {
    isCanConfirm() {
      return this.selectedStaffId && this.selectedReasonId !== -1;
    },
  },
  watch: {
    isShowStaffActionSheet(val) {
      if (!val) {
        this.staffQuery.pageNumber = 1;
        this.staffList = []; // 需要重置下staffList
      }
    },
    isShowReasonActionSheet(val) {
      if (!val) {
        this.reasonQuery.pageNumber = 1;
        this.reasonList = []; // 需要重置下reasonList
      }
    },
  },
  methods: {
    parseClueIds() {
      const clueIds = decodeURIComponent(Args.get('clueIds')) || '';
      if (clueIds) {
        return clueIds.split(',');
      }
    },
    onShowStaff() {
      if (this.staffList.length === 0) {
        this.getStaffList();
      }
    },
    onShowReason() {
      this.getReasonList();
    },
    getStaffList() {
      this.$store.dispatch('transferClueModule/findStaffPage')
        .then(res => {
          // let pageable = true;
          if (res && res.length > 0) {
            this.staffList = this.staffList.concat(res);
            // const { offset } = res.pageable;
            // pageable = (offset + res.content.length) < res.total;
            this.isShowStaffActionSheet = true;
          }

          if (this.staffList.length === 0) {
            Toast('暂无可选择的转让人列表');
          }
          this.isStaffListLoadingFinished = true;
          this.isNotLoadingStaffList = true;
        })
        .catch(err => {
          this.isStaffListError = true;
          this.isNotLoadingStaffList = true;
          Toast(err);
        });
    },
    onLoadStaffList() {
      if (this.isNotLoadingStaffList) {
        this.isNotLoadingStaffList = false;
        this.staffQuery.pageNumber++;
        if (this.staffQuery.pageNumber > 1) {
          this.getStaffList();
        }
      }
    },
    onSelectStaff(staff) {
      this.selectedStaffId = staff.adminId;
      this.staffText = staff.name;
      this.isShowStaffActionSheet = false;
    },
    getReasonList() { // 获取转让原因列表
      const { pageSize, pageNumber } = this.reasonQuery;
      this.$store.dispatch('transferClueModule/findTransferReasonPage', {
        pageSize,
        pageNumber,
      })
        .then(res => {
          let pageable = true;
          if (res && res.content && res.content.length > 0) {
            const parsedContent = res.content.filter(item => {
              return item.applyTransferClue;
            });
            this.reasonList = this.reasonList.concat(parsedContent);
            const { offset } = res.pageable;
            pageable = (offset + res.content.length) < res.total;
            this.isShowReasonActionSheet = true;
          }
          if (this.reasonList.length === 0) {
            Toast('暂无可选择的转让原因列表');
          }
          this.isReasonListLoadingFinished = !pageable;
          this.isNotLoadingReasonList = true;
        })
        .catch(err => {
          this.isReasonListError = true;
          this.isNotLoadingReasonList = true;
          Toast(err);
        });
    },
    onLoadReasonList() {
      if (this.isNotLoadingReasonList) {
        this.isNotLoadingReasonList = false;
        this.reasonQuery.pageNumber++;
        if (this.reasonQuery.pageNumber > 1) {
          this.getReasonList();
        }
      }
    },
    onSelectReason(reason) {
      this.selectedReasonId = reason.reasonId;
      this.reasonText = reason.reason;
      this.isShowReasonActionSheet = false;
    },
    onConfirm() {
      if (this.isCanConfirm) {
        if (APILock) {
          return;
        }
        APILock = true;
        this.$store.dispatch('transferClueModule/transferClues', {
          clueIds: this.clueIds,
          targetUserId: Number(this.selectedStaffId),
          reason: this.reasonText,
        })
          .then(() => {
            Toast.success({ message: '线索已转让', duration: 1500 });
            setTimeout(() => {
              window.location.href = '/v4/vis/h5/edu/clue';
            }, 1500);
          })
          .catch(err => {
            Toast(err);
            APILock = false;
          });
      }
    },
  },
};
</script>

<style lang="scss">
body {
  background-color: #f7f8fa;
}
</style>

<style lang="scss" scoped>
.transfer-clue {
  padding: 0 15px;
  .van-action-sheet__content {
    .staff, .reason {
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
  .confirm-box {
    position: fixed;
    left: 50%;
    padding: 0 10px 20px;
    margin:  0 auto;
    width: 100%;
    transform: translate(-50%, 0);
    background-color: #f7f8fa;
  }
  .confirm {
    display: block;
    height: 44px;
    line-height: 44px;
    font-size: 16px;
    text-align: center;
    border-radius: 22px;
    color: #fff;
    background-color: #00b389;
    &_gray {
      color: #969799;
      background-color: #dcdee0;
    }
  }
}
</style>
