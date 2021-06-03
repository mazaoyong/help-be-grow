<template>
  <div class="invitation-header">
    <a class="invitation-header__content" :href="contentUrl">
      <!-- <img class="invitation-header__content-img" :src="contentImage"> -->
      <img-wrap
        :height="'160px'"
        :src="contentDetail.cover"
        :fullfill="'!320x240+2x.jpg'"
        :cover="false"
      />
      <div class="invitation-header__content-mask" />
      <div class="invitation-header__content-detail">
        <h3 class="invitation-header__content-detail-title">
          {{ contentDetail.title }}
        </h3>
        <div class="invitation-header__content-detail-info">
          <span v-if="contentDetail.author" class="invitation-header__content-detail-info-auth">
            {{ contentDetail.author }}
          </span>
          <span v-if="showDevider" class="devide-line" />
          <span v-if="duration" class="invitation-header__content-detail-info-time">
            时长 {{ duration }}
          </span>
          <span v-if="isColumn && contentDetail.contentsCount" class="invitation-header__content-detail-info-period">
            已更新 {{ contentDetail.contentsCount }} 期
          </span>
        </div>
      </div>
      <div class="invitation-header__content-icon">
        <svg-icon :symbol="iconClass" class="invitation-header__content-icon-item" />
      </div>
      <div v-if="groupType === 1" class="invitation-header__content-type">
        {{ newLogo }}
      </div>
    </a>
    <div class="invitation-header__activity">
      <div class="invitation-header__activity-price">
        <span class="invitation-header__activity-price-label">
          {{ joinNum }}人拼团价:
        </span>
        <span class="invitation-header__activity-price-sum">
          {{ promotionPrice / 100 | numberToCurrency }}
        </span>
        <span class="invitation-header__activity-price-tag">
          {{ saveMoney }}
        </span>
      </div>
      <div class="invitation-header__activity-origin-price">
        <span class="invitation-header__activity-origin-price-label">
          单买原价:
        </span>
        <span class="invitation-header__activity-origin-price-sum">
          {{ contentDetail.price / 100 | numberToCurrency }}
        </span>
      </div>

      <div class="invitation-header__activity-stamp" :class="stampClass" />
    </div>
  </div>
</template>

<script>
import SvgIcon from 'components/svg-icon';
import Minus from 'zan-utils/money/minus';
import AddZero from 'zan-utils/string/addZero';
import { ImgWrap } from '@youzan/vis-ui';
import { fullfillImage } from 'zan-utils';
import buildUrl from '@youzan/utils/url/buildUrl';
import {
  MEDIA_TYPE,
  GROUP_STATUS,
  USER_JOIN_GROUPON_STATUS,
  USER_JOIN_PROMOTION_STATUS,
} from 'pct/constants';

const ICON_TYPE_MAP = {
  0: 'column',
  1: 'book1',
  2: 'audio',
  3: 'video',
};

export default {
  name: 'groupon-invitation-header',

  components: {
    SvgIcon,
    'img-wrap': ImgWrap,
  },

  props: {
    // 商品详情
    contentDetail: Object,
    // 几人团
    joinNum: Number,
    // 活动价
    promotionPrice: [Number, String],
    // 拼团类型
    groupType: Number,
    // 活动状态： 0->未开始 1->进行中 2->已结束
    grouponStatus: Number,
    // 团状态： 0->待成团 1->成团 2->团失效
    status: Number,
    isColumn: Boolean,
    // 用户对于当前团的状态信息
    userGroupStatus: Object,
    // 用户对于活动的状态信息
    userGrouponStatus: Object,
    // 用户身份 0->老用户， 1->新用户
    userIdentity: Number,
  },

  computed: {
    saveMoney() {
      const save = Minus(this.contentDetail.price, this.promotionPrice);
      return `省 ${save}元`;
    },

    newLogo() {
      if (this.userGroupStatus.is_head) {
        return '老带新';
      } else {
        if (this.userIdentity === 1) {
          return '新人专享';
        } else {
          return '老带新';
        }
      }
    },

    showDevider() {
      return (
        this.contentDetail.author &&
        (this.duration || this.contentDetail.contentsCount)
      );
    },

    duration() {
      // 单位到秒;目前仅视频展示时长
      if (this.isColumn || this.contentDetail.mediaType !== MEDIA_TYPE.VIDEO) {
        return 0;
      } else {
        const duration = this.contentDetail.videoDuration;
        const minute = parseInt(duration / 60, 10);
        const second = parseInt(duration % 60);
        return `${AddZero(minute)}:${AddZero(second)}`;
      }
    },

    contentImage() {
      return fullfillImage(this.contentDetail.cover, '!320x160.jpg');
    },

    iconClass() {
      return this.isColumn
        ? ICON_TYPE_MAP[0]
        : ICON_TYPE_MAP[this.contentDetail.mediaType];
    },

    stampClass() {
      if (this.contentDetail.isPaid) {
        if (
          this.userGrouponStatus.status === USER_JOIN_PROMOTION_STATUS.SUCCESS &&
          this.userGroupStatus.status === USER_JOIN_GROUPON_STATUS.JOINED
        ) {
          return 'tuan-success';
        } else {
          return '';
        }
      } else {
        if (this.grouponStatus === 2) {
          return 'promotion-end';
        } else {
          // 当前团成功
          if (this.status === GROUP_STATUS.GROUPONED) {
            // 用户未参加当前团及活动
            if (!this.contentDetail.isPaid && this.userGroupStatus.status === USER_JOIN_GROUPON_STATUS.NOT_JOIN &&
              this.userGrouponStatus.status === USER_JOIN_PROMOTION_STATUS.NOT_JOIN) {
              return 'tuan-over';
            } else if (this.userGroupStatus.status === USER_JOIN_GROUPON_STATUS.JOINED) {
              return 'tuan-success';
            }
          } else if (
            !this.contentDetail.isPaid &&
            this.status === GROUP_STATUS.GROUPON_FAILURE &&
            this.userGrouponStatus.status === USER_JOIN_PROMOTION_STATUS.NOT_JOIN
          ) {
            return 'tuan-failure';
          }
        }
      }
      return '';
    },

    contentUrl() {
      if (this.contentDetail.alias) {
        return buildUrl(`/wscvis/knowledge/index?kdt_id=${window._global.kdt_id}&p=${this.isColumn ? 'columnshow' : 'contentshow'}&alias=${this.contentDetail.alias}`, '', window._global.kdt_id);
      } else {
        return '';
      }
    },
  },
};
</script>

<style lang="scss">
@import "var";
@import 'mixins/index.scss';
.invitation-header {
  height: 230px;
  padding: 15px 20px 0;

  &__content {
    position: relative;
    display: block;
    height: 160px;
    border-radius: 4px;

    &-mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 160px;
      background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .7) 100%);
    }

    &-detail {
      position: absolute;
      left: 0;
      bottom: 0;
      // width: 100%;
      line-height: 20px;
      padding: 0 15px;
      color: $c-white;
      text-align: left;

      &-title {
        font-size: 18px;
        margin-bottom: 5px;
        font-weight: 500;
      }

      &-info {
        font-size: 12px;
        padding-bottom: 10px;

        &-order {
          float: right;
          padding-right: 30px;
        }

        .devide-line {
          position: relative;
          margin: 0 5px;

          &:after {
            @include border-retina(left);

            border-left-color: #fff;
          }
        }
      }
    }

    &-icon {
      position: absolute;
      top: 10px;
      right: 15px;

      &-item {
        width: 20px;
        height: 20px;
      }
    }

    &-type {
      position: absolute;
      left: 15px;
      top: 13px;
      height: 14px;
      line-height: 14px;
      padding: 2px 5px;
      border-radius: 2px;
      background-color: #ff4343;
      font-size: 12px;
      color: $c-white;
    }
  }

  &__activity {
    position: relative;
    line-height: 16px;
    padding: 14px 15px;
    box-shadow: 0 1px 10px 0 rgba(0, 0, 0, .09);
    background-color: $c-white;

    &-price {
      margin-bottom: 5px;
      font-size: 16px;
      color: $c-red-light;
      font-weight: 500;

      &-label {
        margin-right: 10px;
      }

      &-tag {
        padding: 2px 4px;
        margin-left: 10px;
        border-radius: 2px;
        font-size: 10px;
        background-color: #ffecec;
        vertical-align: text-bottom;
        font-weight: normal;
      }
    }

    &-origin-price {
      font-size: 12px;
      color: $c-gray-dark;

      &-label {
        margin-right: 10px;
      }
    }

    &-stamp {
      position: absolute;
      right: -11px;
      bottom: -11px;
      height: 80px;
      width: 80px;
      background-size: contain;

      &.promotion-end {
        background-image: url(/public_files/2018/04/08/end.png);
      }

      &.tuan-over {
        background-image: url(/public_files/2018/04/08/over.png);
      }

      &.tuan-failure {
        background-image: url(/public_files/2018/04/08/failure.png);
      }

      &.tuan-success {
        background-image: url(/public_files/2018/04/08/success.png);
      }
    }
  }
}
</style>
