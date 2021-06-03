<template>
  <div :class="isLoad ? '' : 'page-loading'">
    <template v-if="isLoad">
      <div
        v-if="(isCourseLoaded || isGrouponLoaded) && !waitFlush"
        class="groupon-detail"
      >
        <div class="groupon-detail__bgcover" />
        <!-- <div class="groupon-detail__content"></div> -->
        <invite-info
          :avatar="inviteInfo.avatar"
          :nick-name="inviteInfo.nickName"
          :is-head="inviteInfo.isHead"
          :is-member="inviteInfo.isMember"
          :group-status="inviteInfo.groupStatus"
        />

        <div class="groupon-detail__center">
          <product-detail
            v-if="isCourseLoaded"
            :product-detail="contentDetail.product"
            :group-type="groupType"
          />
          <group-detail
            :group-loaded="isGrouponLoaded"
            :group-data="grouponInfo"
            :product-detail="contentDetail.product"
            :share-url="shareUrl"
            :course-tag="courseTag"
            @refreshData="onInitData"
          />
        </div>

        <div
          v-if="isGrouponLoaded"
          class="groupon-detail__list"
        >
          <member-list :group-id="grouponInfo.group.groupId" />
        </div>
      </div>
      <!-- 支付后暂时未获得团信息时提醒用户手动刷新 -->
      <group-error v-else-if="waitFlush" />
      <div
        v-else
        class="no-course"
      >
        <no-course :desc="noCourseDesc">
          <a
            class="btn btn-goShop"
            @click="onGoShop"
          >
            进店逛逛
          </a>
        </no-course>
      </div>
    </template>
    <van-loading
      v-if="!isLoad"
      type="spinner"
    />
  </div>
</template>

<script>
import { Loading } from 'vant';
import { getGrouponDetailApi, getUserInfoApi } from '../../../common-api/activity';
import Api from '../api';
import Args from 'zan-utils/url/args';
import isEmpty from 'lodash/isEmpty';
import { setShareData, getShareLink } from '@youzan/wxsdk';
// import '../prod-detail/event-bus';
import { GROUP_TYPE, USER_IDENTITY, GROUP_STATUS } from './constants';
import { formatPrice } from '../utils';
import { navigateEnv } from '../../../common/utils/env';
import InviteInfo from './components/InviteInfo';
import ProductDetail from './components/ProductDetail';
import GroupDetail from './components/GroupDetail';
import MemberList from './components/MemberList';
import NoCourse from '../components/no-course';
import mixinPayAndSku from '../mixins/mixinPayAndSku';
import GroupError from 'components/group-error';
import * as SafeLink from '@youzan/safe-link';

const url = window._global.url;
const visBuyer = window._global.visBuyer || {};

export default {
  name: 'app',

  components: {
    'van-loading': Loading,
    'no-course': NoCourse,
    InviteInfo,
    ProductDetail,
    GroupDetail,
    MemberList,
    GroupError,
  },

  mixins: [mixinPayAndSku],

  data() {
    return {
      alias: Args.get('alias') || '', // 获取商品alias
      kdtId: Args.get('kdt_id') || 0, // 获取kdtId
      groupAlias: Args.get('group_alias') || '', // 获取拼团alias
      orderNo: Args.get('order_no') || '', // 获取订单号
      shareUserId: Args.get('share_user_id') || '', // 获取分享人Id
      // 邀请人信息
      inviteInfo: {},
      contentDetail: {
        product: {},
      },
      grouponInfo: {},
      groupType: 0,
      isLoad: false,
      isCourseLoaded: false,
      isGrouponLoaded: false,
      cache: {},
      courseType: -1, // 体验课或正式课， 0:体验课, 1:正式课, 拿不到就不显示
      shareUrl: '',
      courseTag: [],
      activityType: 'groupon',
      noCourseDesc: '页面不见了，去看看其他课程吧',
      waitFlush: false,
    };
  },

  created() {
    this.handleRedirect();
    // this.onInitData();
  },

  methods: {
    handleRedirect() {
      // 根据商品alias查询商品基本信息，如果是知识付费，则重定向到知识付费拼团详情页
      Api.getProductBasicInfo({ aliases: this.alias })
        .then(res => {
          if (res.length > 0) {
            const data = res[0];
            if (data.owlType && data.owlType === 10) {
              this.onInitData();
            } else {
              const redirectUrl = `${window._global.url.h5}/wscvis/knowledge/index?kdt_id=${this.kdtId}&page=grouponinvitation&order_no=${this.orderNo}&alias=${this.groupAlias}`;
              SafeLink.redirect({
                url: redirectUrl,
              });
            }
          } else {
            this.onInitData();
          }
        })
        .catch(() => {
          this.onInitData();
        });
    },

    onInitData() {
      Promise.all([
        Api.getCourseDetail({ alias: this.alias }),
        getGrouponDetailApi({ orderNo: this.orderNo, groupAlias: this.groupAlias }),
      ])
        .then(([product = {}, groupData = {}]) => {
          console.log('product', product.data);
          console.log('groupData', groupData);
          if (product.code === 0) {
            this.parseProductData(product.data);
          }
          if (groupData.code === 0) {
            this.parseGrouponData(groupData.data);
            this.setShareConfig();
          }
        })
        .finally(() => {
          this.isLoad = true;
        });
    },

    setShareConfig() {
      const groupAlias = this.grouponInfo.group.groupAlias;
      const userStatus = this.grouponInfo.userGroupStatus.status;
      // 如果当前用户已参加当前团，分享人设为当前用户
      const shareUserId = userStatus ? this.grouponInfo.userGroupStatus.buyerId : this.shareUserId;
      const discountPrice = this.grouponInfo.groupon.maxSavePrice || 0;

      const picture = this.contentDetail.product.pictures[0].url || '';
      const desc = this.contentDetail.product.subTitle || '';
      this.shareUrl = `${url.h5}/wscvis/edu/groupon-detail?kdt_id=${this.kdtId}&alias=${this.alias}&group_alias=${groupAlias}&share_user_id=${shareUserId}`;
      // alert(this.shareUrl);
      const title = `一起组队学习,立省${formatPrice(discountPrice)}元.【${this.contentDetail.product.title || ''}】`;
      setShareData({
        notShare: false,
        link: getShareLink(this.shareUrl),
        title,
        desc,
        cover: picture,
      });
    },

    parseProductData(data = {}) {
      if (!isEmpty(data)) {
        this.contentDetail = data;
        const sku = data.product.skuFormatModel || {};
        if (sku.list.length === 0 && sku.tree.length === 0) { // 无规格的情况,取collectionId作为skuId
          this.skuId = sku.collectionId || 0;
          this.grouponSkuId = sku.collectionId || 0;
        }
        this.status = data.product.status;
        this.cache.sku = sku;
        this.cache.pictures = data.product.pictures || [];
        this.cache.addressList = data.course.addressList || [];
        this.cache.teacherList = data.course.teacherList || [];
        this.cache.courseStartAt = data.course.courseStartAt || '';
        this.cache.courseEndAt = data.course.courseEndAt || '';
        this.cache.courseSellType = data.course.courseSellType;
        this.cache.courseType = data.course.courseType;
        this.cache.productId = data.course.productId || 0;
        this.courseType = data.course.courseType;
        this.servicePledge = data.course.servicePledge;
        // 处理地址列表, 只需要id的数组
        this.storeIds = this.cache.addressList.map(address => {
          return address.id;
        });
        this.courseTag = data.course.tagList || [];
        this.isCourseLoaded = true;
      }
    },

    parseGrouponData(data = {}) {
      if (!isEmpty(data)) {
        this.waitFlush = data.waitFlush;
        if (!this.waitFlush) {
          const groupType = data.groupon.groupType;
          const userIdentity = data.userIdentity;
          const groupStatus = data.group.status;
          this.grouponInfo = data;
          this.grouponInfo.promotionType = data.groupon.promotionType;
          this.grouponInfo.promotionId = data.groupon.id;
          this.grouponInfo.groupAlias = ((groupType === GROUP_TYPE.NEW && userIdentity === USER_IDENTITY.OLD) || groupStatus !== GROUP_STATUS.ONGOING) ? '' : data.group.groupAlias;
          this.grouponPrice = {
            minPrice: data.groupon.minPrice,
            maxPrice: data.groupon.maxPrice,
            skuPrices: data.groupon.skuPrices,
            price: data.groupon.price,
          };
          this.groupType = groupType;
          this.parseInviteInfo(this.grouponInfo);
          this.isGrouponLoaded = true;
        }
      }
    },

    parseInviteInfo(data) {
      const userStatus = data.userGroupStatus.status;
      const joinGroupRecords = data.joinGroupRecords || [];
      let inviteInfo = {};
      if (userStatus) {
        inviteInfo = {
          avatar: visBuyer.finalAvatar,
          nickName: visBuyer.finalUsername,
          isHead: data.userGroupStatus.isHead,
          isMember: userStatus,
          groupStatus: data.group.status,
        };
        this.inviteInfo = inviteInfo;
        console.log(inviteInfo);
      } else {
        joinGroupRecords.forEach(item => {
          if (!this.shareUserId && item.isHead) {
            this.shareUserId = item.buyerId;
            inviteInfo = {
              isHead: item.isHead,
              isMember: 1,
              avatar: item.avatar,
              nickName: '小伙伴',
              groupStatus: data.group.status,
            };
          } else {
            if (item.buyerId === +this.shareUserId) {
              inviteInfo = {
                isHead: item.isHead,
                isMember: 1,
                avatar: item.avatar,
                nickName: '小伙伴',
                groupStatus: data.group.status,
              };
            }
          }
        });
        getUserInfoApi({ userId: this.shareUserId })
          .then((res = {}) => {
            console.log('res', res);
            const data = res.data || {};
            inviteInfo.nickName = data.nickName || '小伙伴';
            inviteInfo.avatar = inviteInfo.avatar ? inviteInfo.avatar : (data.avatar || 'https://img01.yzcdn.cn/public_files/2017/10/23/1321da81aa84d0539b0d5af73fbbf53b.png');
          })
          .finally(() => {
            this.inviteInfo = inviteInfo;
            console.log(inviteInfo);
          });
      }
    },

    onGoShop() {
      navigateEnv(this.kdtId);
    },
  },
};
</script>

<style lang="scss">
@import "var";

.groupon-detail {
  position: relative;
  min-height: 100vh;
  padding: 0 10px;
  padding-bottom: 10px;
  background-color: #bdbfc4;
  background-image: url(https://b.yzcdn.cn/public_files/2019/04/03/group-bg-new.png);
  background-repeat: no-repeat;
  background-size: cover;

  &__bgcover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .13);
  }

  &__list {
    position: relative;
    margin-top: 10px;
    background-color: $c-white;
    border-radius: 6px;
  }
}

.no-course {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  transform: translate(-50%, -50%);

  .btn {
    padding: 7px 22px;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    border: 1px solid #666;
    border-radius: 22px;
  }

  .btn-goShop {
    display: inline-block;
    color: #f44;
    border: 1px solid #f44;
  }
}

.page-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
