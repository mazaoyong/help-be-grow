<template>
  <card class="transfer-clue">
    <vis-label
      left-text="放弃原因"
      :right-text="reasonText ? reasonText : '(必填)请选择放弃原因'"
      @click="onShowReason"
    />

    <!-- 选择放弃原因actionsheet 开始 -->
    <van-actionsheet
      v-model="isShowReasonActionSheet"
      title="选择放弃原因"
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
    <!--选择放弃原因actionsheet 结束 -->

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
      reasonText: '',
      selectedReasonId: -1,

      reasonList: [], // 放弃原因列表
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
      return this.selectedReasonId !== -1;
    },
  },
  watch: {
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
    onShowReason() {
      this.getReasonList();
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
              return item.applyGiveUpClue;
            });
            this.reasonList = this.reasonList.concat(parsedContent);
            const { offset } = res.pageable;
            pageable = (offset + res.content.length) < res.total;
            this.isShowReasonActionSheet = true;
          }
          if (this.reasonList.length === 0) {
            Toast('暂无可选择的放弃原因列表');
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
        this.$store.dispatch('abandonClueModule/giveUpClues', {
          clueIds: this.clueIds,
          reason: this.reasonText,
        })
          .then(() => {
            Toast.success({ message: '线索已放弃', duration: 1500 });
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
    .reason {
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
