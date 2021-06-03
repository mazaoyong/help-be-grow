<template>
  <vis-page-container class="family-account-invite">
    <div v-theme.main="'background-color!important'" class="family-account-invite__info">
      <img-wrap
        class="avatar"
        width="48px"
        height="48px"
        :src="avatar"
      />
      <p class="name">
        {{ customer.name || '---' }}
      </p>
      <p class="text">
        邀请你成为学员家庭成员
      </p>
      <p class="title">
        接受邀请后你将获得对学员<strong v-if="students">{{ students }}</strong>的以下权限
      </p>
      <entry-list class="entry" />
    </div>
    <van-button
      v-theme.main="'background!important,border-color!important'"
      size="large"
      color="#00b389"
      text="接受邀请"
      round
      class="family-account-invite__receive"
      @click="receiveInvite"
    />
    <p v-if="ShowCountDown" class="family-account-invite__overtime">
      <count-down
        :start="startTime"
        :end="endTime"
        :time-separator="['', '小时', '分钟', '']"
        :hide-zero-day="true"
        time-style="custom"
        @timechange="timeChange"
      />内未接受邀请则链接失效
    </p>
  </vis-page-container>
</template>
<script>
import { Button, Dialog } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';
import { Countdown } from '@youzan/captain';
import PageContainer from '../../../components/page-container';
import EntryList from '../../components/entry-list';

import * as SafeLink from '@youzan/safe-link';
import MixinStudent from '../../mixins/students';
import { confirm, getInvitationInfo, getInvitationByCode } from '../api';
import { forcePhoneLogin } from '@/common/utils/login';

const kdtId = _global.kdt_id;
export default {
  name: 'family-account-invite',

  components: {
    'van-button': Button,
    'count-down': Countdown,
    'vis-page-container': PageContainer,
    EntryList,
    ImgWrap,
  },

  mixins: [MixinStudent],

  data() {
    return {
      startTime: 0,
      endTime: 0,
      currentTime: {},
      customer: {},
      ShowCountDown: false,
    };
  },

  computed: {
    avatar() {
      return this.customer.avatar || 'https://b.yzcdn.cn/public_files/8c652f93e24858f0b4bd80d351279b51.png';
    },
  },

  created() {
    this.fetchUserInfo();
    this.fetchCountDown();
  },

  methods: {
    // 获取邀请者信息和学员列表
    fetchUserInfo() {
      const { inviteCode = '', userId = 0 } = this.$route.query;
      getInvitationInfo({
        inviteCode,
        userId,
      })
        .then(res => {
          this.studentList = res.students || [];
          this.customer = Object.assign({}, res.customer || {});
        });
    },

    // 获取链接倒计时
    fetchCountDown() {
      const { inviteCode = '' } = this.$route.query;
      getInvitationByCode({
        code: inviteCode,
      })
        .then(res => {
          if (res.remainSeconds > 0) {
            this.ShowCountDown = true;
            this.endTime = res.inviteEndTime;
            this.startTime = res.endTime - res.remainSeconds * 1000;
          }
        });
    },

    receiveInvite() {
      // 强制用户登录
      forcePhoneLogin((sessionId, userId, doLogin) => {
        this.confirmInvite();
      });
    },

    confirmInvite() {
      this.timeChange();
      const { inviteCode = '', userId = 0 } = this.$route.query;

      confirm({
        inviteCode,
        userId, // 邀请者的id
      })
        .then(res => {
          // 1.邀请码不存在 2. 邀请码已使用 3. 邀请码已过期 4.邀请码已取消
          const codes = [348911110, 348911111, 348911112, 348911113];
          const redirectParams = {
            url: '',
            kdtId,
            redirectType: 'replace',
          };
          if (res.code === 0) {
            redirectParams.url = `/wscvis/edu/family-account/invite/success?kdtId=${kdtId}&inviteCode=${inviteCode}&userId=${userId}`;
            SafeLink.redirect(redirectParams);
          } else if (codes.indexOf(res.code) > -1) {
            redirectParams.url = `/wscvis/edu/family-account/invite/fail?kdtId=${kdtId}`;
            SafeLink.redirect(redirectParams);
          } else {
            Dialog.alert({ message: res.msg || '接受邀请失败，请稍后再试～' });
          }
        })
        .catch((err) => {
          Dialog.alert({ message: err.msg || '接受邀请失败，请稍后再试～' });
        });
    },

    timeChange(time) {
      time && (this.currentTime = time);
      const { hour, minute } = this.currentTime;
      // 链接失效
      if (minute === 0 && hour === 0) {
        SafeLink.redirect({
          url: '/wscvis/edu/family-account/invite/fail',
          kdtId,
          redirectType: 'replace',
        });
      }
    },
  },
};
</script>
<style lang="scss">
@import 'mixins/index.scss';

.family-account-invite {
  &__info {
    position: relative;
    overflow: hidden;
    color: $white;
    text-align: center;
    background-image: url('https://img01.yzcdn.cn/public_files/2020/02/13/familyAccountBgMask.png'), url('https://b.yzcdn.cn/public_files/0d1bc0343d6dc6eed43ef9ad3eedade5.png');
    background-position: 0 250px, 0 0;
    background-repeat: no-repeat, no-repeat;
    background-size: 100% 100%, 100% 250px;

    .avatar {
      margin: 32px auto 0 auto;
      border-radius: 50%;
    }

    .name {
      margin-top: 12px;
      font-size: 20px;
      font-weight: 500;
      line-height: 24px;
    }

    .text {
      margin-top: 8px;
      font-size: 16px;
      line-height: 20px;
    }

    .title {
      margin: 48px 12px 16px 12px;
      font-size: 13px;
      line-height: 17px;
      color: rgba(255, 255, 255, .7);
      text-align: center;

      strong {
        margin: 0 5px;
        color: $white;
      }
    }

    .entry {
      position: relative;
      z-index: 2;
    }

    &::after {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 57px;
      background-color: $background-color;
      border-bottom: 1px solid $background-color;
      content: '';
    }
  }

  &__receive {
    width: calc(100% - 32px);
    height: 44px;
    margin: 32px 16px 16px 16px;
    line-height: 44px;
  }

  &__overtime {
    font-size: 14px;
    color: #969799;
    text-align: center;

    .cap-countdown__hour,
    .cap-countdown__minute {
      padding: 0;
      margin: 0;
    }

    .cap-countdown__hour,
    .cap-countdown__minute,
    .cap-countdown__time-text {
      font-size: 14px;
    }

    .cap-countdown__second {
      display: none;
    }
  }
}
</style>
