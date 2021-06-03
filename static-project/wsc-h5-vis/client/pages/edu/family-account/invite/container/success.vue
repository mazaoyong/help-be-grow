<template>
  <vis-page-container
    v-if="isInited"
    :style="{ 'min-height': `${height}px` }"
    class="family-account-invite-success"
  >
    <div class="family-account-invite-success__info">
      <van-icon
        v-theme.main="'color!important'"
        name="passed"
        size="64px"
        class="icon"
      />
      <p class="text">
        你已成学员的家庭成员
      </p>
    </div>
    <div class="family-account-invite-success__entry">
      <van-button
        v-theme.main="'color'"
        v-theme.main10="'background,border'"
        text="查看学生证"
        block
        :url="stuCardLink"
        class="student-card"
      />
      <div class="ft-link">
        <a
          v-for="(item, index) in entryList"
          :key="index"
          v-theme.main="'color'"
          :href="item.url"
        >
          {{ item.text }}
        </a>
      </div>
    </div>
    <follow-mp
      v-if="hasNotSubscriptMpAccount"
      v-model="hasNotSubscriptMpAccount"
      :qr-url="qrCode"
      :logo="logo"
      :shop-name="shopName"
    />
  </vis-page-container>
</template>
<script>
import { Icon, Button } from 'vant';
import PageContainer from '../../../components/page-container';
import FollowMp from '../components/follow-mp';

import { getMpAccount, getInviteState } from '../api';
import { forcePhoneLogin } from '@/common/utils/login';
import * as SafeLink from '@youzan/safe-link';

export default {
  name: 'family-account-invite-success',

  components: {
    'van-icon': Icon,
    'van-button': Button,
    'vis-page-container': PageContainer,
    FollowMp,
  },

  data() {
    const QUERYSTRING = `kdt_id=${_global.kdt_id || 0}`;
    return {
      entryList: [
        {
          text: '查看课程',
          url: `/wscvis/knowledge/index?p=mypay&${QUERYSTRING}`,
        },
        {
          text: '预约上课',
          url: `/wscvis/edu/appointment/list?${QUERYSTRING}`,
        },
        {
          text: '查看课程表',
          url: `/wscvis/edu/course-schedule?${QUERYSTRING}`,
        },
      ],
      isInited: false, // 初始化登录状态
      hasNotSubscriptMpAccount: false, // 是否没有关注公众号
      qrCode: '', // 公众号二维码
      height: 0,
      stuCardLink: `/wscvis/edu/student/stu-list?${QUERYSTRING}`,
      logo: '',
      shopName: '',
    };
  },

  mounted() {
    // 强制登录
    forcePhoneLogin((sessionId, userId, doLogin) => {
      this.isInited = true;
      this.initGuide();
      const container = document.querySelector('.container');
      if (container) {
        const height = container.clientHeight - document.querySelector('.footer').clientHeight;
        container.style.minHeight = `${height}px`;
        this.height = height;
      }
    });
  },

  methods: {
    // 获取公众号关注状态
    fetchMPAccount() {
      const { inviteCode = '' } = this.$route.query;
      getMpAccount({
        inviteCode,
      })
        .then(res => {
          const { qrCode = '', hasSubscriptMpAccount = false } = res;
          if (qrCode) {
            const { logo = '', title = '' } = this.$parent;
            this.logo = logo;
            this.shopName = title;
            this.hasNotSubscriptMpAccount = !hasSubscriptMpAccount;
            this.qrCode = qrCode;
          }
        });
    },

    // 获取邀请状态
    fetchInviteStatus() {
      const { inviteCode = '', kdtId = 0 } = this.$route.query;
      getInviteState({
        inviteCode,
      })
        .then(res => {
          if (!res.inviteSuccess) {
            SafeLink.redirect({
              url: `/wscvis/edu/family-account/detail?kdt_id=${kdtId}`,
              kdtId,
              redirectType: 'replace',
            });
          }
        });
    },

    initGuide() {
      this.fetchInviteStatus();
      this.fetchMPAccount();
    },
  },
};
</script>
<style lang="scss">
@import "mixins/index.scss";

.family-account-invite-success {

  &__info {
    text-align: center;

    .icon {
      margin: 46px auto 16px auto;
    }

    .text {
      font-size: 16px;
      font-weight: 500;
      color: #323233;
    }
  }

  &__entry {
    position: absolute;
    bottom: 24px;
    left: 50%;
    width: 100%;
    transform: translateX(-50%);
    text-align: center;

    .student-card {
      margin: 0 auto;
      width: 118px;
      height: 36px;
      line-height: 36px;
      border-radius: 18px;
    }

    .ft-link {
      margin-top: 16px;

      a {
        position: relative;
        padding: 0 16px;
        font-size: 14px;
        border-right: 1px solid #DCDEE0;

        &:last-child {
          border-right: 0;
        }
      }
    }
  }
}
</style>
