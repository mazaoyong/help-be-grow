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
  </div>
</template>

<script>
/**
 * 商品分享跳 商品详情页
 * 转介绍、推荐有奖都跳活动落地页
 * 套餐分享跳套餐落地页
 */
import Args from '@youzan/utils/url/args';
import ActivityCard from 'components/activity-card';
import UmpRecommendGift from './components/UmpRecommendGift';
import { mapData } from '@youzan/ranta-helper-vue';
import { getThemeHook } from '@/common/global/common-run/theme';

const themeHook = getThemeHook();
const kdtId = _global.kdtId || _global.kdt_id;

export default {
  name: 'block-action',
  components: {
    ActivityCard,
    UmpRecommendGift,
  },

  directives: {
    'theme': {
      inserted: themeHook,
      update: themeHook,
    },
  },

  data() {
    return {
      // 按钮数据
      btnList: [],
      // 按钮活动
      btnUmpMap: {},
      // 返回链接
      resultUrl: '',
    };
  },

  computed: {
    mainBtn() {
      return this.btnList[0];
    },
    viceBtnList() {
      const { btnList, btnUmpMap } = this;
      // 优先级，按优先级注入活动按钮
      const btnUmpIndex = ['recommend-gift', 'introduction'];
      const viceBtns = btnList.slice(1);

      if (btnUmpMap) {
        viceBtns.forEach((btn, btnIndex) => {
          if (btn.businessType === 'ump-replace') {
            for (let i = 0; i < btnUmpIndex.length; i++) {
              const key = btnUmpIndex[i];
              if (btnUmpMap[key]) {
                viceBtns[btnIndex] = { ...btn, ...btnUmpMap[key] };
                break;
              }
            }
          }
        });
      }
      console.log('viceBtns', viceBtns);
      return viceBtns;
    },
    packagePageUrl() {
      const orderType = Args.get('orderType', this.resultUrl) || 'course';
      const activityAlias = Args.get('activityAlias', this.resultUrl);

      let packagePageUrl = '';

      if (orderType === 'package' && activityAlias) {
        packagePageUrl = `${_global.url.h5}/wscvis/ump/package-buy?activityAlias=${activityAlias}&kdt_id=${kdtId}`;
      }

      return packagePageUrl;
    },
  },

  created() {
    mapData(this, ['btnList', 'btnUmpMap', 'resultUrl']);
  },
  methods: {
    performCustomAction(action) {
      switch (action.action) {
        case 'packageInvite':
          // 跳转至套餐落地页
          this.ctx.process.invoke('navigateGo', {
            url: this.packagePageUrl,
          });
          break;
        default:
          break;
      }
    },

    onBtnClick(btn) {
      switch (btn.text) {
        case '推荐给好友':
          this.ctx.process.invoke('logAction', {
            et: 'click',
            ei: 'action_share',
            en: '推荐给好友',
            pt: 'paidReceipt',
          });
          break;
        case '查看课程':
          this.ctx.process.invoke('logAction', {
            et: 'click',
            ei: 'action_course',
            en: '查看课程',
            pt: 'paidReceipt',
          });
          break;
        case '我要约课':
          this.ctx.process.invoke('logAction', {
            et: 'click',
            ei: 'action_appointment',
            en: '我要约课',
            pt: 'paidReceipt',
          });
          break;
        default:
          break;
      }

      if (btn.type === 'navigation') {
        this.ctx.process.invoke('navigateGo', {
          url: btn.url,
        });
      } else if (btn.type === 'custom') {
        this.performCustomAction(btn);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
