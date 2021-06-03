<template>
  <div class="block-action">
    <div
      v-theme.main="'color,border-color'"
      class="block-action__main-btn"
      @click="onBtnClick(mainBtn)"
    >
      {{ mainBtn.text }}
    </div>
    <div class="block-action__vice-btn-list">
      <div
        v-for="btn in viceBtnList"
        :key="btn.text"
        v-theme.main
        class="block-action__vice-btn"
        @click="onBtnClick(btn)"
      >
        <template v-if="btn.component">
          <component :is="btn.component" v-bind="btn.props" />
        </template>
        <span v-else>{{ btn.text }}</span>
      </div>
    </div>

    <!-- 套餐分享卡片 -->
    <activity-card
      v-if="orderType === 'package'"
      v-model="showShareCard"
      :alias="activityAlias"
      :type="7"
      :page-url="packagePageUrl"
      @error="onActivityCardError"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Args from '@youzan/utils/url/args';
import * as SafeLink from '@youzan/safe-link';
import { themeTypeMap, themeColor as themeColorMap } from 'common/constants';
import ActivityCard from 'components/activity-card';
import UmpRecommendGift from './UmpRecommendGift';
import {
  logActionShare,
  logActionCourse,
  logActionAppointment,
} from '../track';

const themeType = themeTypeMap[_global.themeType];
const defaultThemeColor = themeColorMap[themeType] || '#00b389';

export default {
  name: 'block-action',

  components: {
    ActivityCard,
    UmpRecommendGift,
  },

  data() {
    const orderType = Args.get('orderType') || 'course';
    const activityAlias = Args.get('activityAlias');
    let packagePageUrl = '';
    if (orderType === 'package' && activityAlias) {
      packagePageUrl = `${_global.url.h5}/wscvis/ump/package-buy?activityAlias=${Args.get('activityAlias')}&kdt_id=${_global.kdt_id}`;
    }

    return {
      themeColor: defaultThemeColor,

      orderType,
      // 展示分享卡
      showShareCard: false,
      // 套餐分享链接
      packagePageUrl,
      // 套餐活动别名
      activityAlias,
      // 活动卡生成失败
      isActivityCardError: false,
    };
  },

  computed: {
    ...mapGetters([
      'mainBtn',
      'viceBtnList',
    ]),
  },

  methods: {
    performCustomAction(action) {
      switch (action.action) {
        case 'packageInvite':
          this.showShareCard = true;
          break;
        default:
          break;
      }
    },

    onBtnClick(btn) {
      switch (btn.text) {
        case '推荐给好友':
          logActionShare();
          break;
        case '查看课程':
          logActionCourse();
          break;
        case '我要约课':
          logActionAppointment();
          break;
        default:
          break;
      }

      if (btn.type === 'navigation') {
        SafeLink.redirect({
          url: btn.url,
          kdtId: _global.kdtId || _global.kdt_id,
        });
      } else if (btn.type === 'custom') {
        this.performCustomAction(btn);
      }
    },

    onActivityCardError(errMsg) {
      this.isActivityCardError = true;
      this.showShareCard = false;
    },
  },
};
</script>

<style lang="scss">
.block-action {
  padding: 24px 0 24px;
  // overflow: hidden;
  overflow-y: visible;
  font-size: 14px;
  text-align: center;
  background: #fff;

  &__main-btn {
    display: inline-block;
    height: 36px;
    padding: 0 31px;
    line-height: 34px;
    cursor: pointer;
    border: 1px solid;
    border-radius: 18px;
    box-sizing: border-box;
  }

  &__vice-btn-list {
    padding: 3px 0;
    margin-top: 24px;
    line-height: 14px;
  }

  &__vice-btn {
    display: inline-block;
    padding: 0 16px;
    cursor: pointer;
    border-left: 1px solid #dcdee0;

    &:first-child {
      border-left: none;
    }
  }
}
</style>
