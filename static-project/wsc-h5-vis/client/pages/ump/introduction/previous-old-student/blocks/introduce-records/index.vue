<!-- 我的邀请记录 -->
<template>
  <vis-standard-popup
    v-model="show"
    title="我的邀请记录"
    closeable
    close-on-click-overlay
    class="old-student__records"
  >
    <section
      class="old-student__records-card"
      :style="style"
    >
      <p class="desc">
        你已邀请好友
      </p>
      <p class="count">
        <strong>{{ total }}</strong>位
      </p>
    </section>
    <section
      ref="list"
      class="old-student__friends-list"
    >
      <h3>
        最近邀请好友
      </h3>
      <div class="content">
        <van-list
          v-if="!noData"
          v-model="isLoading"
          :finished="isFinished"
          @load="fetchIntroduceRecords"
        >
          <friend-card
            v-for="(item, index) in introduceRecords"
            :key="index"
            :name="item.refereeName"
            :status="item.refereeStatus"
            :time="item.introduceAt"
          />
        </van-list>
        <no-course
          v-else
          desc="暂无记录，赶紧去邀请吧"
        >
          <!-- 进行中的活动展示按钮 -->
          <van-button
            v-if="status === 1"
            text="立即邀请"
            color="#fc4952"
            round
            @click="onJumpToInvitePoster"
          />
        </no-course>
      </div>
    </section>
  </vis-standard-popup>
</template>
<script>
import { Button, List, Toast, Dialog } from 'vant';
import { Popup } from '@youzan/vis-ui';
import NoCourse from '@/pages/edu/components/no-course';
import FriendCard from './friend-card';

import * as customSafeLink from '@/common/utils/custom-safe-link';
import { navigateEnv } from '@/common/utils/env';
import { RECORD_BG } from '../../constants';
import { findIntroduceRecord, checkActivityThreshold } from '../../../apis/old-student';

const kdtId = (window._global || {}).kdt_id;

export default {
  name: 'invite-records',

  components: {
    'van-list': List,
    'van-button': Button,
    'vis-standard-popup': Popup,
    NoCourse,
    FriendCard,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    // 活动别名
    alias: {
      type: String,
      default: '',
    },

    // 活动状态
    status: {
      type: Number,
      default: 1,
    },
  },

  data() {
    return {
      introduceRecords: [],
      isLoading: false,
      isFinished: false,
      noData: false,
      isInited: false,
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      show: false,
    };
  },

  computed: {
    style() {
      return {
        'backgroundImage': `url(${RECORD_BG})`,
      };
    },
  },

  watch: {
    value(bool) {
      this.show = bool;
      // 第一次显示的时候需要重置一下弹窗的高度
      this.$nextTick(() => {
        if (bool && !this.isInited) {
          const contentEl = this.$refs.list;
          const parentEl = contentEl && contentEl.parentNode;
          if (contentEl) {
            parentEl.style.height = parentEl.style.maxHeight;
          }
        }
      });

      if (bool) {
        this.introduceRecords = [];
        this.isFinished = false;
        this.noData = false;
        this.pageNumber = 1;
        this.total = 0;
      }
    },

    show(bool) {
      this.$emit('input', bool);
    },
  },

  methods: {
    fetchIntroduceRecords() {
      this.isLoading = true;
      findIntroduceRecord({
        alias: this.alias || '',
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
      })
        .then((data) => {
          const { content = [], total = 0 } = data;
          this.total = total;
          this.introduceRecords = this.introduceRecords.concat(content);
          if (this.introduceRecords.length < 1) {
            this.noData = true;
          }
          if (this.introduceRecords.length >= this.total) {
            this.isFinished = true;
          }
          this.pageNumber++;
          this.isInited = true;
        })
        .catch((msg) => {
          this.isFinished = true;
          Toast(msg || '获取邀请记录失败， 请稍后再试~');
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    onJumpToInvitePoster() {
      checkActivityThreshold({
        alias: this.alias,
      })
        .then(data => {
          if (data) {
            customSafeLink.redirect({
              url: '/wscvis/ump/introduction/previous-invite-poster',
              kdtId,
              query: {
                kdt_id: kdtId,
                alias: this.alias,
                from: 'inivte_records',
              },
            });
          } else {
            this.onDialogTip();
          }
        })
        .catch((msg) => {
          this.onDialogTip(msg);
        });
    },

    onDialogTip(msg = '仅老学员才能参加活动，快去报名上课吧') {
      Dialog.confirm({
        message: msg,
        confirmButtonText: '去店铺逛逛',
      })
        .then(() => {
          navigateEnv();
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.old-student {
  &__records {
    &-card {
      padding: 49px 24px;
      height: 160px;
      background-size: 100% 100%;
      border-radius: 4px;
      box-sizing: border-box;

      .desc {
        color: #fff2f3;
      }

      .count {
        margin-top: 16px;
        font-family: Avenir;
        font-size: 16px;
        color: #fff;

        strong {
          margin-right: 8px;
          font-size: 36px;
          font-weight: 600;
        }
      }
    }

    ::v-deep .vis-standard-popup__content {
      padding: 12px;
      display: flex;
      flex-direction: column;
      background-color: #f5f5f5;
    }
  }

  &__friends {
    &-list {
      flex: 1;
      margin-top: 12px;
      background-color: #fff;
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      h3 {
        padding: 8px 12px;
        font-size: 14px;
        font-weight: 500;
        color: #111;
      }

      .content {
        flex: 1;
        overflow: auto;
      }

      .vis-no-course {
        padding-top: 32px;
      }

      .van-button {
        width: 96px;
        height: 36px;
        line-height: 34px;
      }
    }
  }
}
</style>
