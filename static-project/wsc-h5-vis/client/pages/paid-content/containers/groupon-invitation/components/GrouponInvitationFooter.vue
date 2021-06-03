<template>
  <div class="invitation-footer">
    <invitation-description
      :promotion-status="grouponDetail.groupon.status"
      :tuan-status="grouponDetail.group.status"
      :tuan-alias="grouponDetail.group.group_alias"
      :user-group-status="grouponDetail.user_group_status"
      :user-groupon-status="grouponDetail.user_groupon_status"
      :remain-join-num="grouponDetail.group.remain_join_num"
      :start-at="grouponDetail.group.start_at"
      :end-at="grouponDetail.group.remain_time"
      :content-is-paid="contentDetail.isPaid"
    />

    <div v-if="!hideUserList" class="invitation-footer__user">
      <div
        v-for="(item, index) in joinedUsers"
        :key="index"
        class="invitation-footer__user-item"
      >
        <img :src="item.value">
        <span v-if="index === 0" class="tl-tag">
          团长
        </span>
      </div>
    </div>

    <div class="invitation-footer__intro" @click="onActionClick">
      玩法详情
      <van-icon name="arrow" />
    </div>

    <action-button
      :promotion-status="grouponDetail.groupon.status"
      :group-type="grouponDetail.groupon.group_type"
      :tuan-status="grouponDetail.group.status"
      :tuan-alias="grouponDetail.group.group_alias"
      :user-group-status="grouponDetail.user_group_status"
      :user-groupon-status="grouponDetail.user_groupon_status"
      :user-identity="grouponDetail.user_identity"
      :is-column="isColumn"
      :content-alias="contentDetail.alias"
      :media-type="contentDetail.mediaType"
      :content-is-paid="contentDetail.isPaid"
      @refreshGroup="refreshGroup"
      @startOrder="startOrder"
      @makeCard="makeCard"
    />

    <!-- 分享图片生成弹层 -->
    <van-popup v-model="showCard" :lock-scroll="true">
      <div class="groupon-share-card">
        <em class="groupon-close" @click="closeCard" />
        <div class="img-content">
          <img :src="cardImage">
        </div>
        <p class="note">
          长按图片保存至相册
        </p>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Icon, Popup, Toast } from 'vant';
import fullfillImage from 'zan-utils/fullfillImage';
import AddZero from 'zan-utils/string/addZero';
import AccDiv from 'zan-utils/number/accDiv';
import AccSub from 'zan-utils/number/accSub';
import accountUnion from 'common/utils/account-union';
import checkFansBuy from '@/common/utils/checkFansBuy';
import { USER_JOIN_GROUPON_STATUS, USER_JOIN_PROMOTION_STATUS, ICON } from 'pct/constants';
import InvitationDescription from './InvitationDescription';
import Buttons from './Buttons';
import * as SafeLink from '@youzan/safe-link';
import * as BuyApi from '@/common-api/buy';
import * as CustomSafeLink from '@/common/utils/custom-safe-link';

export default {
  name: 'groupon-invitation-footer',

  components: {
    'van-icon': Icon,
    'van-popup': Popup,
    InvitationDescription,
    'action-button': Buttons,
  },

  props: {
    // 拼团活动的信息
    grouponDetail: Object,
    // 商品信息
    contentDetail: Object,
    isColumn: Boolean,
  },

  data() {
    return {
      showCard: false,
      cardImage: '',
      placeholder: 'https://img01.yzcdn.cn/public_files/2017/09/20/4135b27618a9fb6f520c70dd6a217ec8.png',
      ellipsisImage: 'https://img01.yzcdn.cn/public_files/2017/09/29/7ad1015d2279c58b2d11dfd125a10b98.png',
      defaultImage: 'https://img01.yzcdn.cn/public_files/2018/04/08/avatar.png',
    };
  },

  computed: {
    joinedUsers() {
      // ump的库表优化10人以上团，如已参团人数大于10 ，只返回10条记录
      let avatars = [];
      // 成团条件
      const conditionNum = this.grouponDetail.groupon.condition_num;
      // 已参团人数
      // const joinedNum = this.grouponDetail.join_group_records.length;
      // 待成团人数
      const remainJoinNum = this.grouponDetail.group.remain_join_num;
      // 优先展示待成团空位
      if (conditionNum < 10) {
        this.grouponDetail.join_group_records.forEach(item => {
          const avatar = {};
          avatar.value = fullfillImage(item.avatar, '!45x45+2x.jpg');
          avatar.label = item.is_head === true ? '团长' : avatar.label;
          avatars.push(avatar);
        });

        avatars = avatars.concat(
          this.pushPlaceholder(
            remainJoinNum,
            this.grouponDetail.group.status,
            this.grouponDetail.groupon.is_mock_groupon
          )
        );
      } else {
        if (remainJoinNum > 8) {
          this.grouponDetail.join_group_records.forEach(item => {
            const avatar = {};
            if (item.is_head) {
              avatar.value = fullfillImage(item.avatar, '!45x45+2x.jpg');
              avatar.label = '团长';
              avatars.push(avatar);
            }
          });
          avatars = avatars.concat(
            this.pushPlaceholder(
              9,
              this.grouponDetail.group.status,
              this.grouponDetail.groupon.is_mock_groupon
            )
          );
        } else {
          let avatarNum = conditionNum - remainJoinNum;
          this.grouponDetail.join_group_records.forEach(item => {
            if (avatarNum > 0) {
              const avatar = {};
              avatar.value = fullfillImage(item.avatar, '!45x45+2x.jpg');
              avatar.label = item.is_head === true ? '团长' : avatar.label;
              avatars.push(avatar);
              avatarNum--;
            }
          });
          avatars = avatars.concat(
            this.pushPlaceholder(
              remainJoinNum,
              this.grouponDetail.group.status,
              this.grouponDetail.groupon.is_mock_groupon
            )
          );
        }
      }

      // 添加省略号图片
      if (this.grouponDetail.groupon.condition_num > 10) {
        avatars[1].value = fullfillImage(this.ellipsisImage, '!45x45+2x.jpg');
      }
      console.log(avatars);
      return avatars;
    },

    hideUserList() {
      if (this.contentDetail.isPaid) {
        // 已购买内容，但是非拼团成功
        if (this.grouponDetail.user_groupon_status.status !== USER_JOIN_PROMOTION_STATUS.SUCCESS) {
          return true;
        }
      } else {
        // 活动已结束
        if (this.grouponDetail.groupon.status === 2) {
          return true;
        } else if (this.grouponDetail.groupon.status === 1) {
          // 活动进行中，用户参加了活动但未参加该团
          if (
            this.grouponDetail.user_group_status.status === USER_JOIN_GROUPON_STATUS.NOT_JOIN &&
            this.grouponDetail.user_groupon_status.status !== USER_JOIN_PROMOTION_STATUS.NOT_JOIN
          ) {
            return true;
          }
        }
      }
      return false;
    },
  },

  methods: {
    onImageError(e) {
      console.error(e);
    },

    onActionClick() {
      SafeLink.redirect({
        url: 'https://h5.youzan.com/v2/ump/groupon/guide',
      });
    },

    refreshGroup(alias) {
      this.$emit('refreshGroup', alias);
    },

    pushPlaceholder(placeholderNum, groupStatus, isMockGroupon) {
      const avatarsTmp = [];
      for (let i = 0; i < placeholderNum; i++) {
        const avatar = {};
        // 虚拟成团
        if (groupStatus === 1 && isMockGroupon) {
          avatar.value = fullfillImage(this.defaultImage, '!45x45+2x.jpg');
        } else {
          avatar.value = fullfillImage(this.placeholder, '!45x45+2x.jpg');
        }
        avatar.label = '';
        avatarsTmp.push(avatar);
      }

      return avatarsTmp;
    },

    /*
    * @param type 表示参团类型
    * new-> 开新团，group_alias 为空
    * join-> 参团，group_alias 不为空
    */
    startOrder(type) {
      const alias = this.contentDetail.alias;
      const groupAlias = type === 'new' ? '' : this.grouponDetail.group.group_alias;
      const promotionType = this.grouponDetail.groupon.promotion_type;
      const promotionId = this.grouponDetail.groupon.id;
      const productId = this.grouponDetail.groupon.goods_id;

      // 知识付费购买时先判断 acl 的场景值 是否需要手机号登录/微信授权
      accountUnion
        .checkUnion('paidcontent', {})
        // 查询店铺是否设置了购物门槛
        .then(({ didLogin }) => checkFansBuy({ didLogin, productId }))
        .then(() => {
          const product = {
            alias: alias,
            num: 1,
            id: this.contentDetail.goodsId,
          };

          const params = {
            productInfoList: [product],
            umpInfo: {
              promotionType,
              promotionId,
              groupAlias,
            },
          };

          // @TODO gaotian
          return BuyApi.postBookKey(params).then(({ bookKey }) => {
            CustomSafeLink.redirect({
              url: 'https://cashier.youzan.com/pay/wscvis_buy',
              query: {
                book_key: bookKey,
              },
            });
          });
        });
    },

    /* 生成分享卡片 */
    makeCard() {
      const _this = this;
      if (this.cardImage) {
        this.showCard = true;
      } else {
        this.getCanvasData().then(function(data) {
          _this.cardImage = data;
          _this.showCard = true;
        });
      }
    },

    closeCard() {
      this.showCard = false;
    },
    // 格式化时长
    formateDuration(duration) {
      const seconds = duration;
      const minute = parseInt(seconds / 60, 10);
      const second = parseInt(seconds % 60);
      return `${AddZero(minute)}:${AddZero(second)}`;
    },

    chooseIcon(mediaType) {
      if (this.isColumn) {
        return ICON.COLUMN;
      } else {
        if (mediaType === 1) {
          return ICON.IMAGE;
        } else if (mediaType === 2) {
          return ICON.AUDIO;
        } else if (mediaType === 3) {
          return ICON.VIDEO;
        }
      }
    },

    getCanvasData() {
      return new Promise((resolve, reject) => {
        const qrImg = new Image();
        const logoImg = new Image();
        const bannerImg = new Image();
        const content = this.contentDetail;
        const promotion = this.grouponDetail;
        let title = content.title;
        const author = content.author;
        const contentsCount = content.contents_count;
        const duration = content.video_duration ? this.formateDuration(content.video_duration) : 0;
        const summary = content.summary;
        const logo = this.chooseIcon(content.media_type);
        const promotionPrice = (
          promotion.groupon.price / 100
        ).toFixed(2);
        const singlePrice = (content.price / 100).toFixed(2);
        const joinNum = promotion.groupon.condition_num;
        const gapNum = promotion.group.remain_join_num;
        const savePercent = (AccDiv(AccSub(content.price, promotion.groupon.price), content.price) * 100).toFixed(0);
        qrImg.src = this.grouponDetail.qrcode;
        logoImg.src = logo;
        bannerImg.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 670;
          canvas.height = 850;
          canvas.style.width = '335px';
          canvas.style.height = '430px';

          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, 670, 860);

          // 商品大图

          ctx.drawImage(bannerImg, 20, 40, 630, 340);

          // 商品类型logo
          ctx.drawImage(logoImg, 590, 60, 40, 40);

          // 图片蒙层
          // ctx.globalAlpha = 0.7;
          const gradient = ctx.createLinearGradient(20, 40, 20, 360);
          gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, .3)');
          ctx.fillStyle = gradient;
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'black';
          ctx.fillRect(20, 40, 630, 340);

          ctx.shadowBlur = 0;
          ctx.shadowColor = '';
          ctx.globalAlpha = 1;
          // 商品信息容器
          // 商品名称 20 length
          ctx.fillStyle = '#fff';
          ctx.font = '500 36px Arial';
          if (title.length <= 20) {
            ctx.fillText(title, 45, 312);
          } else {
            if (title.length > 30) {
              title = title.substr(0, 30) + '...';
            }
            ctx.fillText(title.substr(0, 20), 45, 312);
            // ctx.fillText(title.substr(20), 45, 302);
          }

          // 作者
          ctx.font = '24px Arial';
          let authorText = '';
          if (this.isColumn) {
            authorText = author + (author && contentsCount ? ' | ' : '') + (contentsCount ? '已更新' + contentsCount + '期' : '');
          } else {
            authorText = author + (author && duration ? ' | ' : '') + (duration ? '时长' + duration : '');
          }
          ctx.fillText(authorText, 45, 356);

          // 简介
          ctx.fillStyle = '#666';
          ctx.font = '24px Arial';
          ctx.textAlign = 'center';
          // 文案换行
          let lineWidth = 0;
          const maxWidth = 580; // 文案最大显示宽度
          let initHeight = 432; // 距离canvas顶部距离
          let lastSubStrIndex = 0; // 每次开始截取的字符串的索引
          for (let i = 0; i < summary.length; i++) {
            lineWidth += ctx.measureText(summary[i]).width;
            if (lineWidth > maxWidth) {
              ctx.fillText(
                summary.substring(lastSubStrIndex, i),
                335,
                initHeight
              ); // 绘制截取部分
              initHeight += 44; // 40为字体的高度
              lineWidth = 0;
              lastSubStrIndex = i;
            }
            if (i === summary.length - 1) {
              // 绘制剩余部分
              ctx.fillText(
                summary.substring(lastSubStrIndex, i + 1),
                335,
                initHeight
              );
            }
          }

          // 几人成团
          ctx.fillStyle = '#ff4444';
          ctx.font = '500 32px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(joinNum + '人拼团价: ￥' + promotionPrice, 335, 560);

          // 单买价格
          ctx.fillStyle = '#999';
          ctx.font = '24px Arial';
          ctx.fillText('单买原价: ￥' + singlePrice, 335, 612);

          // 底部
          // 二维码容器
          ctx.fillStyle = '#f8f8f8';
          ctx.fillRect(0, 664, 670, 180);
          ctx.textAlign = 'left';

          // 待成团人数及节省幅度文案
          ctx.fillStyle = '#333';
          ctx.font = '28px Arial';
          ctx.fillText(
            '仅差' + gapNum + '人，快来凑团，立省' + savePercent + '%',
            45,
            746
          );

          ctx.fillStyle = '#666';
          ctx.font = '24px Arial';
          ctx.fillText('扫描或长按识别二维码参与', 45, 800);

          // 二维码
          ctx.drawImage(qrImg, 510, 704, 120, 120);
          resolve(canvas.toDataURL('image/png'));
        };
        bannerImg.crossOrigin = 'Anonymous';
        bannerImg.src = fullfillImage(this.contentDetail.cover, '!360x360.jpg');

        bannerImg.onerror = e => {
          Toast('图片加载错误，请稍候再试');
        };
      });
    },
  },
};
</script>

<style lang="scss">
@import "var";

.invitation-footer {
  padding: 30px 10%;

  &__user {
    margin-top: 15px;
    text-align: center;

    &-item {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 40px;
      margin: 0 8px 20px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }

      .tl-tag {
        position: absolute;
        bottom: -3px;
        left: 6px;
        padding: 2px 4px;
        font-size: 10px;
        color: $c-white;
        background-color: #ff4f4f;
        border-radius: 3px;
      }
    }
  }

  &__intro {
    /* margin-top: 20px; */
    font-size: 12px;
    color: $c-gray-dark;
    text-align: center;

    .van-icon-arrow {
      font-size: 10px;
      line-height: 13px;
      vertical-align: middle;
    }
  }

  .van-popup {
    text-align: center;
    background-color: transparent;

    .groupon-share-card {
      position: relative;
      width: 100vw;

      .img-content {
        padding: 0 20px;

        img {
          max-width: 100%;
          border-radius: 5px;
        }
      }

      .note {
        margin-top: 30px;
        font-size: 14px;
        color: $c-white;
      }

      .groupon-close {
        position: absolute;
        top: 0;
        right: 16px;
        display: inline-block;
        width: 35px;
        height: 35px;
        background-image: url(https://img01.yzcdn.cn/punch/image/close-rounded@2x.png);
        background-repeat: no-repeat;
        background-size: contain;
      }
    }
  }
}
</style>
