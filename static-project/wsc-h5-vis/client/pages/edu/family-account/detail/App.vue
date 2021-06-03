<template>
  <vis-page-container>
    <div class="family-detail">
      <div v-theme.main="'background-color!important'" class="family-detail__head-wrapper">
        <div class="family-detail__desc">
          添加家庭帐号，共同关注孩子成长
        </div>
        <div class="family-detail__stu">
          <span class="family-detail__stu-normal">家庭帐号将获得{{ students ? '' : '对学员' }}</span>
          <span v-if="students" class="family-detail__stu-name">{{ students }}</span>
          <span class="family-detail__stu-normal">的以下权限</span>
        </div>
        <entry-list class="family-detail__auth" :is-redirect="false" />
      </div>
      <div v-if="memberList.length > 0" class="family-detail__member">
        <div class="family-detail__member-text family-detail__member-desc">
          家庭成员（最多添加{{ totalLimit }}位）
        </div>
        <member-item
          v-for="item in memberList"
          :key="item.name"
          :item="item"
          @changestatus="changeStatus(item)"
          @endtime="delItem(item)"
        />
        <div
          v-if="memberList.length >= totalLimit"
          class="family-detail__member-text family-detail__member-limit"
        >
          已达到添加上限
        </div>
      </div>
      <no-course
        v-else
        class="family-detail__nomember"
        desc="暂时还没有家庭帐号"
      />

      <van-action-sheet
        v-model="showMember"
        :actions="memberActions"
        cancel-text="取消"
        :description="memberDesc"
        @select="onMemberSelect"
      />

      <vis-popup-confirm
        v-model="showDelete"
        :title="`删除后，该家庭成员将无法为${students}完成以下操作：`"
        confirm-btn-text="删除"
        cancel-btn-text="我再想想"
        @confirm="onDelete"
      >
        <delete-popup />
      </vis-popup-confirm>

      <!-- 底部按钮 -->
      <add-action
        v-if="memberList.length < totalLimit"
        :student-list="studentList"
        @show-role="onRolePopup"
      />

      <!-- 角色弹窗 -->
      <role-popup
        v-model="showRolePopup"
        :role-list="roleList"
        @invite="invite"
      />

      <!-- 分享引导 -->
      <share-mask
        v-if="isWX"
        :show-share-guide="showShareGuide"
        @close-mask="onCloseMask"
      />
      <template v-else>
        <!-- 分享弹窗 -->
        <share-popup
          v-model="showSharePopup"
          :share-link="inviteUrl"
          @show-poster="onShareAction"
          @log-click="logClickHref"
        />
        <!-- 海报 -->
        <invite-poster
          v-model="showInvitePoster"
          :poster-info="posterInfo"
          :invite-url="inviteUrl"
          :logo="logo"
        />
      </template>
    </div>
  </vis-page-container>
</template>

<script>
import { ActionSheet, Dialog, Toast } from 'vant';
import { PopupConfirm } from '@youzan/vis-ui';
import PageContainer from '../../components/page-container';
import EntryList from '../components/entry-list';
import SharePopup from '../components/share-popup';
import InvitePoster from '../components/invite-poster';
import RolePopup from '../components/role-popup';
import ShareMask from '../components/share-mask';
import AddAction from '../components/add-action';

import { setShareData, ZNB, getShareLink } from '@youzan/wxsdk';
import dateFormat from 'date-fns/format';
import MixinStudent from '../mixins/students';
import { getAccount, cancel, remove } from '../api';
import MemberItem from '../components/member-item';
import NoCourse from '../../components/no-course';
import DeletePopup from './components/delete-popup';
import { logClickShare, logClickHref, logClickCard } from '../log';

const { finalAvatar: avatar, finalUsername: name, buyerId: userId = 0 } = _global.visBuyer || {};
const TOTAL_LIMIT = 8;
export default {
  name: 'app',

  components: {
    'van-action-sheet': ActionSheet,
    'vis-page-container': PageContainer,
    'vis-popup-confirm': PopupConfirm,
    EntryList,
    SharePopup,
    InvitePoster,
    RolePopup,
    ShareMask,
    AddAction,
    MemberItem,
    NoCourse,
    DeletePopup,
  },

  mixins: [MixinStudent],

  data() {
    return {
      showMember: false,
      showDelete: false,
      currentItem: {},
      memberActions: [],
      memberDesc: '',
      showSharePopup: false,
      showInvitePoster: false,
      showRolePopup: false,
      showShareGuide: false,
      inviteUrl: '', // 邀请链接
      posterInfo: { // 海报信息
        avatar,
        name,
        students: '',
        overtime: '',
        qrUrl: '',
      },
      roleList: [], // 角色列表
      memberList: [], // 成员列表
      isWX: false,
      isWeapp: false,
      logo: '',
      totalLimit: TOTAL_LIMIT,
    };
  },

  created() {
    this.fetchFamilyAccountInfo();
    this.fetchStudentList(userId);
    ZNB.init()
      .then(({ platform }) => {
        if (platform === 'weapp' || platform === 'wechat') {
          this.isWX = true;
        }
        if (platform === 'weapp') {
          this.isWeapp = true;
        }
      });
  },

  methods: {
    // 家庭信息
    fetchFamilyAccountInfo() {
      getAccount()
        .then(res => {
          const { name, avatar } = res.owner || {};
          const { name: defaultName, avatar: defaultAvatar } = this.posterInfo;
          this.roleList = res.roles || [];
          this.memberList = res.members || [];
          this.logo = res.logo || _global.mp_data.logo;
          this.posterInfo = {
            ...this.posterInfo,
            name: name || defaultName,
            avatar: avatar || defaultAvatar,
          };
        });
    },

    invite(role, res) {
      this.setShareInfo(res);
      this.lockRole(role);
      // 触发更新家庭帐号列表
      this.fetchFamilyAccountInfo();
    },

    // 配置分享信息
    setShareInfo(res) {
      // 微信环境右上角分享
      if (this.isWX) {
        const imageUrl = this.isWeapp ? 'https://b.yzcdn.cn/public_files/2020/02/21/minProgramBg.png' : this.logo;
        setShareData({
          title: `我邀请你成为${this.students}的家庭成员，共同见证他们的学习成长`,
          desc: '接受邀请>',
          cover: imageUrl,
          link: getShareLink(res.url),
        });
        this.showShareGuide = true;
        logClickShare();
      } else {
        // 海报信息
        const { inviteQrCode, url } = res;
        this.posterInfo = Object.assign(this.posterInfo, {
          qrUrl: inviteQrCode,
          students: this.students,
          overtime: dateFormat(res.inviteEndTime, 'YYYY-MM-DD HH:mm:ss'),
        });
        this.inviteUrl = url;
        this.showSharePopup = true;
        logClickCard();
      }
    },

    // 角色锁定
    lockRole(role) {
      this.roleList.forEach((item, index) => {
        if (item.role === role.role) {
          role.existNum++;
          if (role.limitNum - role.existNum <= 0) {
            role.canInvite = false;
          }
          this.$set(this.roleList, index, item);
        }
      });
    },

    changeStatus(item) {
      this.currentItem = item;
      if (item.state === 1) {
        this.memberActions = [{ name: '再次邀请' }, { name: '取消邀请' }];
        this.memberDesc = '';
      } else {
        this.memberActions = [{ name: '删除', color: '#fa1919' }];
        this.memberDesc = '是否删除家庭成员';
      }
      this.showMember = true;
    },

    onShareAction() {
      this.showInvitePoster = true;
    },

    onRolePopup() {
      if (this.roleList.length) {
        this.showRolePopup = true;
      }
    },

    onMemberSelect(item) {
      if (item.name === '删除') {
        this.showDelete = true;
      } else if (item.name === '再次邀请') {
        const { inviteQrCode, inviteUrl, inviteEndTime } = this.currentItem;
        this.setShareInfo({
          url: inviteUrl,
          inviteQrCode,
          inviteEndTime,
        });
      } else {
        cancel({ inviteCode: this.currentItem.inviteCode || '' })
          .then(res => {
            if (res) {
              if (res.code === 348911114) {
                Dialog.alert({ message: res.msg || '取消邀请失败，请刷新后再试～' });
              } else {
                Toast('取消邀请成功');
                this.memberList = this.memberList.filter(item => item.inviteCode !== this.currentItem.inviteCode);
                // 更新家庭帐户角色
                this.roleList.forEach((item, index) => {
                  if (item.role === this.currentItem.role) {
                    item.canInvite = true;
                    item.existNum--;
                    this.$set(this.roleList, index, item);
                  }
                });
              }
            }
          });
      }
      this.showMember = false;
    },

    onDelete() {
      this.showMember = false;
      this.showDelete = false;
      remove({
        removeUserId: this.currentItem.userId || 0,
        role: this.currentItem.role || 0,
      })
        .then(res => {
          Toast('删除成功');
          // 更新家庭帐户成员
          this.memberList = this.memberList.filter(item => item.userId !== this.currentItem.userId ||
            (item.userId === this.currentItem.userId && item.role !== this.currentItem.role));
          // 更新家庭帐户角色
          this.roleList.forEach((item, index) => {
            if (item.role === this.currentItem.role) {
              item.canInvite = true;
              item.existNum--;
              this.$set(this.roleList, index, item);
            }
          });
        });
    },

    // 待确认倒计时完成时删掉
    delItem(curItem) {
      // 更新家庭帐户成员
      this.memberList = this.memberList.filter(item => item.state !== 1 ||
        (item.state === 1 && item.inviteEndTime !== curItem.inviteEndTime));
      // 更新家庭帐户角色
      this.roleList.forEach((item, index) => {
        if (item.role === curItem.role) {
          item.canInvite = true;
          item.existNum--;
          this.$set(this.roleList, index, item);
        }
      });
    },

    onCloseMask() {
      this.showShareGuide = false;
    },

    // 点击事件埋点
    logClickHref() {
      logClickHref();
    },
  },

};
</script>

<style lang="scss">
body {
  background-color: #f7f8fa;
}

.family-detail {
  &__head-wrapper {
    position: relative;
    background: #0CA884 url('https://b.yzcdn.cn/public_files/0d1bc0343d6dc6eed43ef9ad3eedade5.png') no-repeat top center;
    background-size: 100% 100%;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 57px;
      background-color: #f7f8fa;
    }
  }

  &__desc {
    padding: 24px 0 7px;
    font-size: 20px;
    line-height: 24px;
    color: #fff;
    text-align: center;
  }

  &__stu {
    padding: 0 64px 24px;
    font-size: 13px;
    line-height: 17px;
    text-align: center;
    color: #fff;

    &-normal {
      opacity: .7;
    }

    &-name {
      padding: 0 4px;
    }
  }

  &__auth {
    position: relative;
    z-index: 2;
    box-shadow: 0 2px 2px #f2f3f5;
  }

  &__member {
    padding: 0 12px 90px;

    &-text {
      color: #969799;
      font-size: 13px;
    }

    &-desc {
      padding: 20px 4px 12px;
    }

    &-limit {
      line-height: 17px;
      text-align: center;
    }
  }

  &__nomember {
    margin-top: 72px;
  }

  button.van-action-sheet__item, button.van-action-sheet__cancel {
    padding: 0;
  }

  .van-hairline--top::after {
    border-top-width: 0;
  }

  .vis-popup-confirm {
    .vis-standard-popup__content {
      min-height: auto !important;
      margin-bottom: 40px;
      overflow: hidden;
    }

    .delete-popup__del {
      font-weight: 500;
    }

    button.vis-standard-popup__button:last-child {
      height: 65px;
      line-height: 65px;
    }
  }
}
</style>
