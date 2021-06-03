<template>
  <div>
    <div
      v-if="fetched && !waitFlush"
      class="groupon-invitation"
    >
      <groupon-invitation-header
        :content-detail="contentDetail"
        :join-num="grouponDetail.groupon.condition_num"
        :promotion-price="promotionPrice"
        :status="grouponDetail.group.status"
        :user-group-status="grouponDetail.user_group_status"
        :user-groupon-status="grouponDetail.user_groupon_status"
        :group-type="grouponDetail.groupon.group_type"
        :groupon-status="grouponDetail.groupon.status"
        :user-identity="grouponDetail.user_identity"
        :is-column="isColumn"
      />

      <groupon-invitation-footer
        :groupon-detail="grouponDetail"
        :content-detail="contentDetail"
        :is-column="isColumn"
        @refreshGroup="refreshGroup"
      />
    </div>

    <!-- 支付后暂时未获得团信息时提醒用户手动刷新 -->
    <group-error v-if="waitFlush" />
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant';
import mapKeysToSnakeCase from 'zan-utils/string/mapKeysToSnakeCase';
import GrouponInvitationHeader from './components/GrouponInvitationHeader';
import GrouponInvitationFooter from './components/GrouponInvitationFooter';
import { getPaidContentShareLink } from 'pct/utils/share';
import { setShareData } from '@youzan/wxsdk';
import AccDiv from 'zan-utils/number/accDiv';
import AccSub from 'zan-utils/number/accSub';
import Args from 'zan-utils/url/args';
import api from 'pct/api';
import mixinVisPage from 'common/mixins/mixin-vis-page';
import GroupError from 'components/group-error';
import * as SafeLink from '@youzan/safe-link';
import { getCommonWeappCode } from '@/common-api/utils';
import { checkAndLogin } from '@/common/utils/login';

const global = window._global;
const miniprogram = global.miniprogram || {};
const isWeapp = miniprogram.isWeapp;

export default {
  name: 'goupon-invitation',

  config: {
    title: '邀请好友参团',
  },

  components: {
    GrouponInvitationHeader,
    GrouponInvitationFooter,
    GroupError,
  },

  mixins: [mixinVisPage],

  data() {
    return {
      grouponDetail: {},
      joinedUserList: [],
      // 商品详情
      contentDetail: {},
      shareData: {},
      // 生成分享卡片时需要的内容信息
      contentOnCard: {},
      isColumn: false,
      promotionPrice: 0,
      fetched: false,
      waitFlush: false,
    };
  },

  computed: {
    alias() {
      return this.$route.query.alias || '';
    },

    order_no() {
      return Args.get('order_no') || '';
    },
  },

  created() {
    checkAndLogin(() => {
      this.getGrouponInfo();
    });
  },

  methods: {
    // 获取二维码
    getQrcode() {
      const codeParam = {
        url: getPaidContentShareLink(window.location.href, this.$route),
        isShortenUrl: true,
      };

      if (isWeapp) {
        // 生成小程序码
        const data = {
          page: `/packages/edu/webview/index`,
          targetUrl: encodeURIComponent(getPaidContentShareLink(window.location.href, this.$route)),
        };
        return getCommonWeappCode(data);
      } else {
        return api.getQrCode(codeParam)
          .then(data => {
            return data;
          })
          .catch(err => {
            console.log('Error:', err);
            Toast('获取二维码出错');
          });
      }
    },

    // 获取拼团信息
    getGrouponInfo(alias) {
      const param = {
        groupAlias: alias || this.alias,
        orderNo: alias ? '' : this.order_no,
      };

      api.getGrouponInfo(param).then((data) => {
        this.waitFlush = data.waitFlush || false;
        this.getQrcode().then((qrData) => {
          this.grouponDetail = mapKeysToSnakeCase(data);
          this.grouponDetail.qrcode = qrData;
          this.joinedUserList = this.grouponDetail.join_group_records;
          this.promotionPrice = this.grouponDetail.groupon.price;
          this.getContentInfo(this.grouponDetail.content_type, this.grouponDetail.target_alias);
          this.isBeyondGroup(this.grouponDetail);
        })
          .finally(() => {
            this.fetched = true;
          });
      })
        .catch(errMsg => {
          this.toGroupList(errMsg);
        });
    },

    /*
      * 获取内容信息，单篇/专栏
      * @param contentType 1->专栏 2->内容
      * @param alias 商品别名
      */
    getContentInfo(contentType, alias) {
      if (contentType === 2) {
        api.getContent({ alias: alias }).then((data) => {
          this.isColumn = false;
          this.contentDetail = data;
          this.contentOnCard = this.contentDetail;
          this.shareData = {
            desc: this.contentDetail.summary,
            cover: this.contentDetail.cover,
            contentName: this.contentDetail.title,
            author: this.contentDetail.author,
            price: this.contentDetail.price,
            promotionPrice: this.grouponDetail.groupon.price,
          };
          this.setShareInfo(this.shareData);
        });
      } else {
        api.getColumn({ alias: alias }).then((data) => {
          this.isColumn = true;
          this.contentDetail = data;
          this.contentOnCard = this.contentDetail;
          this.shareData = {
            desc: this.contentDetail.summary,
            cover: this.contentDetail.cover,
            contentName: this.contentDetail.title,
            author: this.contentDetail.author,
            price: this.contentDetail.price,
            promotionPrice: this.grouponDetail.groupon.price,
          };
          this.setShareInfo(this.shareData);
        });
      }
    },

    /*
      * 修改分享内容
      */
    setShareInfo(data) {
      const savePercent = (AccDiv(AccSub(data.price, data.promotionPrice), data.price) * 100).toFixed(0);
      const promotionPrice = (data.promotionPrice / 100).toFixed(2);
      const title = `立省${savePercent}%，快来${promotionPrice}元团购 【${data.author ? data.author + ':' : ''}${data.contentName}】`;
      const url = `${window._global.url.wap}/ump/paidcontent/index?kdt_id=${window._global.kdt_id}&alias=${this.grouponDetail.group.group_alias}#/grouponinvitation`;
      setShareData({
        notShare: false,
        desc: data.desc,
        link: getPaidContentShareLink(url, this.$route),
        title: title,
        cover: data.cover,
      });
    },

    // 有团长价时判断是否超团
    isBeyondGroup(data) {
      if (
        data.group.status === 1 &&
        data.groupon.header_price > 0 &&
        data.user_group_status.status === 0 &&
        data.user_group_status.from_group_id > 0
      ) {
        Dialog.alert({
          message: `<div class="paid-content__dialog--no-title">抱歉，此团已满，订单关闭并且自动退款~再去新开个团吧~</div>`,
          confirmButtonText: '确定',
        });
      }
    },

    // 活动失效，弹框提示去拼团活动列表页面
    toGroupList(msg) {
      Dialog.alert({
        message: `<div class="paid-content__dialog--no-title">${msg}</div>`,
        confirmButtonText: '查看更多活动',
      }).then(() => {
        SafeLink.redirect({
          url: `${window._global.url.wap}/ump/groupon/list?kdt_id=${window._global.kdt_id}`,
          kdtId: window._global.kdt_id,
        });
      });
    },

    // 查看我的团
    refreshGroup(alias) {
      SafeLink.redirect({
        url: `${window._global.url.wap}/ump/paidcontent/index?kdt_id=${window._global.kdt_id}&alias=${alias}&page=grouponinvitation`,
        kdtId: window._global.kdt_id,
      });
      // this.getGrouponInfo(alias);
    },

    afterLogin() {
      window.location.reload();
    },
  },
};
</script>

<style>
  .groupon-invitation {
    background-color: #fff;
    overflow-x: hidden;
  }
</style>
