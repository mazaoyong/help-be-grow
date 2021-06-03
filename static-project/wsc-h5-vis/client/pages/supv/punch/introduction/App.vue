<template>
  <div>
    <!-- 专栏弹窗 开始 -->
    <column-modal
      v-if="isShowColumnModal"
      :is-show-column-modal="isShowColumnModal"
      :title="column.title"
      :is-can-click-mask="column.isCanClickMask"
      :show-close-button="column.showCloseButton"
      :show-confirm-button="column.showConfirmButton"
      :close-button-text="column.closeButtonText"
      :confirm-button-text="column.confirmButtonText"
      :cover-url="column.coverUrl"
      :name="column.name"
      :contents-count="column.contentsCount"
      :subscriptions-count="column.subscriptionsCount"
      @closeModal="onCloseColumnModal"
    />
    <!-- 专栏弹窗 结束 -->

    <!-- 密码弹窗 开始 -->
    <pass-modal
      v-if="isShowPassModal"
      :pass-modal-bottom="passModalBottom"
      :participate-password-copy="participatePasswordCopy"
      :is-error="isError"
      :password-val="pass.passwordVal"
      :is-password-type="pass.isPasswordType"
      :focus="focus"
      @passwordChange="onPasswordChange"
      @hideModal="onHidePassModal"
      @focus="onBindPasswordFocus"
      @togglePasswordType="onTogglePasswordType"
      @sendPassword="onSendPassword"
    />
    <!-- 密码弹窗 结束 -->

    <div v-if="isInited">
      <!-- 头部 开始 -->
      <vis-desc
        :proceed-status-text="proceedStatusText"
        :name="name"
        :cover-url="coverUrl"
        :start-at-format="startAtFormat"
        :end-at-format="endAtFormat"
      />
      <!-- 头部 结束 -->

      <!-- 内容 开始 -->
      <vis-content
        :join-person-num="joinPersonNum"
        :proceed-status-text="proceedStatusText"
        :avatars="avatars"
        :reward="reward"
        :punch-text="punchText"
        :gci-times="gciTimes"
        :gci-times-text="gciTimesText"
        :condition="condition"
        :description="description"
      />
      <!-- 内容 结束 -->

      <div class="fixed-btn">
        <van-button
          :class="['u-btn u-btn-punch', btnPunch.status === 0 ? 'u-btn-punch-disabled' : '' ]"
          :disabled="btnPunch.status === 0"
          @click="getUserInfo(btnPunch.status)"
        >
          {{ btnPunch.text }}
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Button, Toast } from 'vant';
import { get } from 'lodash';
import { setShareData, getShareLink } from '@youzan/wxsdk';
import Args from 'zan-utils/url/args';
import * as SafeLink from '@youzan/safe-link';
import buildUrl from '@youzan/utils/url/buildUrl';
import { format } from 'date-fns';
import commonLogin from '@/common/utils/login';
import ColumnModal from './blocks/column-modal';
import PassModal from './blocks/pass-modal';
import Desc from './blocks/desc';
import Content from './blocks/content';
import apis from '../apis';
import { logEnterPage } from '../log';

const global = window._global;
const kdtId = global.kdt_id || 0;
const buyer = global.buyer || {};
const user = global.user || {};
const platform = global.platform || '';
const pointsName = global.visPointsName || '积分';

export default {
  name: 'app',
  components: {
    'van-button': Button,
    'pass-modal': PassModal,
    'column-modal': ColumnModal,
    'vis-desc': Desc,
    'vis-content': Content,
  },
  data() {
    return {
      alias: Args.get('alias'),
      isInited: false,
      passModalBottom: 0,
      punchText: '打卡',
      column: {
        title: '购买专栏后可参加打卡课程',
        isCanClickMask: false,
        showCloseButton: true,
        showConfirmButton: true,
        closeButtonText: '再看看',
        confirmButtonText: '去购买',
      },
      pass: {
        isPasswordType: true,
        passwordVal: '',
      },
      pointsName,
      proceedStatusText: '',
      proceedStatus: 1,
      name: '',
      startAtFormat: '',
      startAt: '',
      endAtFormat: '',
      endAt: '',
      coverUrl: '',
      joinPersonNum: 0,
      gciTimes: '',
      gciTimesText: '',
      avatars: [],
      reward: '',
      condition: '',
      description: {},
      btnPunch: {
        status: 0,
        text: '参加打卡',
      },
      participateColumnAlias: '',
      participatePasswordCopy: '',
      participatePassword: '',
      gciId: 0,
      startDaysCount: 0,
      focus: false,
      avatar: buyer.avatar || '',
      nickName: get(_global, 'visBuyer.finalUsername', buyer.nick_name || ''),
      isShowColumnModal: false,
      isShowPassModal: false,
      isError: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      apis.getIntroDesc({
        alias: this.alias,
      })
        .then(res => {
          if (res) {
            res && this.handleData(res);
          }
          this.isInited = true;
          this.setShareConfig();
          logEnterPage('pci', res.gciId);
        })
        .catch(err => {
          Toast(err);
        });
    },
    handleData(res) {
      // 处理proceedStatus: 1 未开始 2 进行中 3 已经结束
      let proceedStatusText = this.handleProceedStatus(res.proceedStatus);
      let startAtFormat = format(res.startAt, 'YYYY.MM.DD');
      let endAtFormat = format(res.endAt, 'YYYY.MM.DD');
      // 处理人数显示
      let joinPersonNum = this.handlePeopleNum(res.joinPersonNum);
      let gciTimes = this.handlePeopleNum(res.gciTimes);
      let gciTimesText = proceedStatusText === '未开始' ? '暂未开始' : '人打卡';
      // 处理用户头像列表，小屏手机最多显示5个头像，正常屏幕最多显示6个头像
      let avatars = this.handleAvatars(res.avatars);
      let reward = this.handleReward(res.gciRewards);
      let condition = this.handleCondition(res.gciRewards);
      // 处理底部按钮的逻辑： 下架/课程已结束/购买专栏/付费购买/密码进入/免费购买
      let btnPunch = this.handleBtnPunch(res);

      this.proceedStatusText = proceedStatusText;
      this.proceedStatus = res.proceedStatus;
      this.name = res.name;
      this.startAtFormat = startAtFormat;
      this.startAt = res.startAt;
      this.endAtFormat = endAtFormat;
      this.endAt = res.endAt;
      this.coverUrl = res.coverUrl || '';
      this.joinPersonNum = joinPersonNum;
      this.gciTimes = gciTimes;
      this.gciTimesText = gciTimesText;
      this.avatars = avatars;
      this.reward = reward;
      this.condition = condition;
      this.description = JSON.parse(res.description || '{}');
      this.btnPunch = btnPunch;
      this.participateColumnAlias = res.participateColumnAlias || '';
      this.participatePasswordCopy = res.participatePasswordCopy || '';
      this.participatePassword = res.participatePassword || '';
      this.gciId = res.gciId || 0;
      this.startDaysCount = res.startDaysCount || 0;
    },
    handleProceedStatus(proceedStatus = 1) {
      const proceedStatusArr = ['', '未开始', '进行中', '已结束'];
      return proceedStatusArr[proceedStatus];
    },
    handlePeopleNum(num) {
      return (num > 9999) ? `${parseInt(num / 1000, 10)}K+` : num;
    },
    handleAvatars(avatars = []) {
      avatars = avatars.filter(avatar => avatar);
      let newAvatars = [];
      let num = window.screen.width < 375 ? 4 : 6;
      let moreImgUrl = 'https://img01.yzcdn.cn/punch/icon/Bitmap.png';
      if (avatars.length > num) {
        newAvatars = avatars.slice(0, num);
        newAvatars.push(moreImgUrl);
      } else {
        newAvatars = avatars;
      }
      return newAvatars;
    },
    handleReward(gciRewards = []) {
      let reward = '';
      if (gciRewards.length === 0) {
        return reward;
      }

      let rewardCoupon = '';
      let couponCount = 0;
      let rewardPoints = '';
      gciRewards.forEach((item) => {
        if (item.rewardType === 1) { // 优惠券
          let str = '';
          // 1. 代金券 2. 折扣券
          if (item.preferentialType === 1) {
            if (item.valueRandomTo > 0) { // 随机代金券
              str = `${parseFloat(item.denominations / 100, 10)}~${parseFloat(item.valueRandomTo / 100, 10)}元`;
            } else {
              str = `${parseFloat(item.denominations / 100, 10)}元`;
            }
          } else if (item.preferentialType === 2) {
            str = `${(item.discount / 10).toFixed(1)}折`;
          }
          couponCount += item.rewardCount;
          rewardCoupon += `${str}优惠券`;
        } else if (item.rewardType === 2) { // 积分
          rewardPoints += `${item.rewardCount}${this.pointsName}券`;
        }
      });
      if (couponCount) {
        reward += couponCount > 1 ? `${couponCount}张优惠券` : rewardCoupon;
      }
      if (reward.length > 0) {
        reward += rewardPoints ? ` · ${rewardPoints}` : rewardPoints;
      } else {
        reward += rewardPoints;
      }
      return reward;
    },
    handleCondition(gciRewards = []) {
      if (gciRewards.length === 0) {
        return '';
      }
      return gciRewards[0].totalDaysCondition;
    },
    handleBtnPunch(res) {
      this.proceedStatus = res.proceedStatus || 1;
      let btnPunch = {}; // 维护一个自定义的按钮状态对象
      // 已删除的优先级最高
      if (res.gciStatus === 0) {
        btnPunch.status = 0;
        btnPunch.text = '打卡已删除';
        return btnPunch;
      }
      // 下架的优先级最高
      if (res.gciStatus === 2) { // gciStatus 0: 已删除, 1: 上架, 2: 下架
        btnPunch.status = 0;
        btnPunch.text = '打卡已下架';
        return btnPunch;
      }
      if (platform !== 'weixin') { // 不是微信内环境，屏蔽跳转
        btnPunch.status = 8;
        btnPunch.text = '请在微信中访问';
        return btnPunch;
      }
      // 其次为课程是否结束的优先级
      if (res.proceedStatus === 3) { // proceedStatus 1: 未开始, 2: 进行中, 3: 已结束
        btnPunch.status = res.bought ? 1 : 0; // 课程已结束, 如果之前参加过, 还是可以进入，之前没参加过，不可进入
        btnPunch.text = '打卡课程已结束';
        return btnPunch;
      }
      // 若为可购买/进入状态
      if (res.bought) {
        btnPunch.status = 2;
        btnPunch.text = '进入打卡';
        return btnPunch;
      }
      // 如果是免费参加
      if (res.participateWay === 1) { // participateWay 1: 免费参加, 2: 付费参加, 3: 购买专栏参加, 4: 输入密码参加
        btnPunch.status = 3;
        btnPunch.text = '参加打卡';
        return btnPunch;
      }
      // 如果是付费购买
      if (res.participateWay === 2) {
        btnPunch.status = 4;
        const price = res.participatePrice ? res.participatePrice / 100 : 0;
        btnPunch.text = `参加打卡 ¥${price}`;
        return btnPunch;
      }
      // 如果是购买专栏参加
      if (res.participateWay === 3) {
        if (res.needBuyColumn) { // 需要购买专栏
          btnPunch.status = 5;
        } else { // 不需要购买专栏
          btnPunch.status = 7;
        }
        btnPunch.text = `参加打卡`;
        return btnPunch;
      }
      // 如果是输入密码参加
      if (res.participateWay === 4) {
        btnPunch.status = 6;
        btnPunch.text = `参加打卡`;
        return btnPunch;
      }
    },
    // 点击打卡
    toPunch(status) {
      switch (status) {
        case 3: // 免费参加
        case 7: // 来源专栏，但不需要购买
          this.generateUser(status)
            .then(res => {
              if (res) {
                this.toPunchTask();
              } else {
                Toast('生成用户失败，请重试');
              }
            });
          break;
        case 1: // 已经购买过打卡，直接进入
        case 2:
          this.toPunchTask();
          break;
        case 4: // 付费打卡
          this.toPayPunch();
          break;
        case 5: // 购买专栏参加
          this.showColumnModal();
          break;
        case 6: // 密码参加
          this.showPassModal();
          break;
        default:
          break;
      }
    },
    // 打卡详情页面
    toPunchTask() {
      const params = {
        'kdt_id': kdtId,
        'alias': this.alias,
        'start_date': this.startAt,
        'end_date': this.endAt,
      };
      const url = buildUrl(
        Args.add('/wscvis/supv/punch/task', params),
        'h5',
        kdtId,
      );
      SafeLink.redirect({ url, kdtId });
    },
    // 打卡支付页面
    toPayPunch() {
      const params = {
        'kdt_id': kdtId,
        'alias': this.alias,
        'type': 'punch',
        'aid': 0,
        'channel_type': 0,
      };
      const url = buildUrl(
        Args.add('https://cashier.youzan.com/pay/wscvis_ptc_pay', params),
        'h5',
        kdtId,
      );
      SafeLink.redirect({ url, kdtId });
    },
    // 专栏支付页面
    toPayColumn() {
      const params = {
        'kdt_id': kdtId,
        'alias': this.column.columnAlias,
        'p': 'columnshow',
      };
      const url = buildUrl(
        Args.add('/wscvis/knowledge/index', params),
        'h5',
        kdtId,
      );
      SafeLink.redirect({ url, kdtId });
    },
    // 弹出专栏弹窗
    showColumnModal() {
      apis.getColumn({
        kdtId,
        columnAlias: this.participateColumnAlias || '',
      })
        .then(res => {
          if (res) {
            this.isShowColumnModal = true;
            this.column = Object.assign(this.column, {
              coverUrl: res.coverUrl || '',
              name: res.name || '',
              contentsCount: res.contentsCount || '',
              columnAlias: res.columnAlias || '',
              subscriptionsCount: res.subscriptionsCount || 0,
            });
          }
        })
        .catch(err => {
          Toast(err);
        });
    },
    // 关闭专栏弹窗
    onCloseColumnModal(type) {
      this.isShowColumnModal = false;
      if (type === 'confirm') {
        this.toPayColumn();
      }
    },
    // 弹出密码弹窗
    showPassModal() {
      this.isShowPassModal = true;
      this.focus = true;
    },
    onHidePassModal() {
      this.isShowPassModal = false;
    },
    // 切换密码输入框的type
    onTogglePasswordType() {
      this.focus = true;
      this.pass = Object.assign(this.pass, {
        isPasswordType: !this.pass.isPasswordType,
      });
    },
    onBindPasswordFocus() {
      // this.passModalBottom = 10;
      this.isError = false;
    },
    // 密码弹窗点击确定按钮
    onSendPassword() {
      let bool = this.checkPassword();
      if (!bool) {
        return;
      }
      apis.postValidatePassword({
        kdtId,
        alias: this.alias || '',
        password: this.pass.passwordVal,
      })
        .then(res => {
          if (res) {
            this.isShowPassModal = false;
            this.generateUser(status)
              .then(res => {
                if (res) {
                  this.toPunchTask();
                } else {
                  Toast('生成用户失败，请重试');
                }
              });
          }
        })
        .catch(err => {
          Toast(err);
        });
    },
    onPasswordChange(val) {
      this.pass.passwordVal = val;
    },
    checkPassword() {
      if (!this.pass.passwordVal) {
        Toast('密码不能为空');
        this.isError = true;
        return false;
      }
      if (this.pass.passwordVal !== this.participatePassword) {
        Toast('密码有误');
        this.isError = true;
        return false;
      }
      return true;
    },
    // 获取授权
    getUserInfo(status) {
      if (user.has_login) {
        this.toPunch(status);
        return;
      }
      commonLogin()
        .then((userInfo) => {
          location.reload();
        });
    },
    setShareConfig() {
      setShareData({
        notShare: false,
        link: getShareLink(location.href),
        title: `${this.nickName || ''}邀请你参与${this.name}`,
        desc: '',
        cover: 'https://img01.yzcdn.cn/punch/image/share@2x.png',
      });
    },
    generateUser(status = '') {
      let sendData = {
        alias: this.alias || '',
        gciId: this.gciId || 0,
        avatar: this.avatar,
        nickname: this.nickname,
      };
      if (Number(status) === 7) {
        Object.assign(sendData, {
          columnAlias: this.participateColumnAlias || '',
        });
      }

      return new Promise((resolve, reject) => {
        apis.generateUser(sendData)
          .then(res => {
            res ? resolve(res) : reject(false);
          })
          .catch(err => {
            Toast(err);
            reject(false);
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.fixed-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 998;
  width: 100%;
}

.u-btn {
  width: 100%;
  height: 44px;
  line-height: 44px;
  text-align: center;
  border: none;
  border-radius: 0;
  opacity: 1;
}

.u-btn::after {
  border: none;
  border-radius: 0;
}

.u-btn-punch {
  font-size: 16px;
  color: #fff;
  text-align: center;
  background-color: #00b389;
}

.u-btn-punch-disabled {
  color: #979797;
  background-color: #e5e5e5;
}
</style>

<style>
.u-content .van-cell {
  padding: 5px 0;
}

.u-input-box .van-field__control {
  display: inline-block;
  height: 42px;
  font-size: 20px;
  line-height: 42px;
  outline: none;
  outline: 0;
}
</style>
