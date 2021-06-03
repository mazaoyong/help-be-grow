<template>
  <div class="block-reward">
    <div class="block-reward__container">
      <van-cell
        v-if="isNotNull(payRewardInfo.rewardPointDTO) && payRewardInfo.rewardPointDTO.rewardPoint"
        :border="false"
        title-class="block-reward__item-title"
        value-class="block-reward__item-value"
        class="block-reward__item"
        @click="gotoUrl('point')"
      >
        <template slot="title">
          <span class="block-reward__icon-wrap">
            <i v-theme.main10="'background'" class="block-reward__icon-bg" />
            <i v-theme.main class="block-reward__icon">积</i>
          </span>
          <span>
            恭喜获得
            <span class="block-reward__num">{{ payRewardInfo.rewardPointDTO.rewardPoint }}</span>
            {{ pointsName || '积分' }}
          </span>
        </template>
        <template slot="default">
          <van-icon name="arrow" />
        </template>
      </van-cell>
      <van-cell
        v-if="isNotNull(payRewardInfo.rewardMemberCardList)"
        :border="false"
        title-class="block-reward__item-title"
        value-class="block-reward__item-value"
        class="block-reward__item"
        @click="gotoUrl('membercard', memberCardAlias)"
      >
        <template slot="title">
          <span class="block-reward__icon-wrap">
            <i v-theme.main10="'background'" class="block-reward__icon-bg" />
            <i v-theme.main class="block-reward__icon">卡</i>
          </span>
          <span>
            恭喜获得
            <span
              class="block-reward__blod"
            >{{ memberCardName || '权益卡' }}</span>
          </span>
        </template>
        <template slot="default">
          <button
            v-if="memberCardActivatedAlias"
            v-theme.main
            class="block-reward__btn"
            @click="gotoUrl('membercard-activation', memberCardActivatedAlias)"
          >
            立即激活
          </button>
          <van-icon v-else name="arrow" />
        </template>
      </van-cell>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Cell, Icon } from 'vant';
import get from 'lodash/get';
import buildUrl from '@youzan/utils/url/buildUrl';
import * as SafeLink from '@youzan/safe-link';
import {
  logRewardPoints,
  logRewardMembercard,
} from '../track';

const pointsName = _global.visPointsName || '积分';

export default {
  name: 'block-reward',

  components: {
    'van-cell': Cell,
    'van-icon': Icon,
  },

  data() {
    return {
      pointsName,
    };
  },

  computed: {
    ...mapState([
      'payRewardInfo',
    ]),

    hasReward() {
      return (
        this.isNotNull(this.payRewardInfo.rewardMemberCardList) ||
        this.isNotNull(this.payRewardInfo.rewardPointDTO)
      );
    },

    memberCardName() {
      return get(this, 'payRewardInfo.rewardMemberCardList', []).map(card => card.name).join('、');
    },
    memberCardAlias() {
      return get(this, 'payRewardInfo.rewardMemberCardList[0].cardAlias', '');
    },
    memberCardActivatedAlias() {
      let alias = '';
      const cardList = get(this, 'payRewardInfo.rewardMemberCardList', []);
      for (let i = 0; i < cardList.length; i++) {
        if (!cardList[i].activated) {
          alias = cardList[i].cardAlias;
          break;
        }
      }
      return alias;
    },
  },

  methods: {
    isNotNull(obj) {
      return !!obj && JSON.stringify(obj) !== '{}';
    },

    gotoUrl(type, alias) {
      const { kdtId: newKdtId = 0, kdt_id: oldKdtId = 0 } = window._global;
      const kdtId = newKdtId || oldKdtId;

      let url = '';
      switch (type) {
        case 'point':
          logRewardPoints();
          url = buildUrl(`https://h5.youzan.com/wscump/pointstore/pointcenter?kdt_id=${kdtId}`, 'h5', kdtId);
          break;
        case 'membercard':
          logRewardMembercard();
          url = buildUrl(`https://h5.youzan.com/wscuser/scrm/benefitcard?kdt_id=${kdtId}&card_alias=${alias}`, 'h5', kdtId);
          break;
        case 'membercard-activation':
          logRewardMembercard();
          url = buildUrl(`https://h5.youzan.com/wscuser/scrm/benefitcard/active?alias=${alias}&kdt_id=${kdtId}`, 'h5', kdtId);
          break;
        default:
          break;
      }

      SafeLink.redirect({
        url: url,
        kdtId,
      });
    },
  },
};
</script>

<style lang="scss">
@import 'var';
$red-color: #ee0d27;
$red-color-active: #eb7784;
$cell-bg-active: #f2f3f5;

.block-reward {
  overflow: hidden;
  background: #fff;

  &__container {
    margin: 12px 24px;
    overflow: hidden;
    background: #f7f8fa;
    border-radius: 8px;
  }

  &__split {
    padding: 0 15px;
    margin-bottom: 8px;

    &::after {
      display: block;
      width: 100%;
      height: 1px;
      pointer-events: none;
      background-image: linear-gradient(to right, #dcdee0 0%, #dcdee0 50%, transparent 50%);
      background-repeat: repeat-x;
      background-size: 8px 1px;
      content: ' ';
    }
  }

  &__item {
    padding: 8px 8px 8px 12px;
    line-height: 18px;
    background: #f7f8fa;
    justify-content: space-between;
    align-items: center;

    &:active {
      background: $cell-bg-active;
    }

    &-title {
      display: flex;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      align-items: center;
    }

    &-value {
      flex: none;
    }

    &:first-child {
      margin-top: 5px;
    }

    &:last-child {
      margin-bottom: 5px;
    }
  }

  &__icon-wrap {
    position: relative;
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 6px;
    line-height: 16px;
    text-align: center;
  }

  &__icon-bg {
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 2px;
  }

  &__icon {
    position: relative;
    font-size: 11px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px;
    color: $red-color;
    vertical-align: top;
  }

  &__btn {
    padding: 0 6px;
    font-size: 12px;
    color: $red-color;
    background: none;
    border: none;
    outline: none;

    &:active {
      color: $red-color-active;
    }
  }

  &__num {
    padding: 0 0 0 4px;
    font-weight: 600;
  }

  &__bold {
    padding: 0 3px;
    font-weight: 500;
  }

  .van-icon {
    vertical-align: middle;
  }
}
</style>
