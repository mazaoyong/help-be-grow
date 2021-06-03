<template>
  <div v-if="benefitInfo.name" class="vip-benefit-desc">
    <column-entry
      v-if="benefitInfo.alias"
      :entry-type="'benefit'"
      :title="benefitInfo.name"
      :alias="benefitInfo.alias"
      :thumbnail="benefitInfo.cover"
      :update-desc="updateDesc"
      class="entry-bar"
    />

    <div class="benefit-desc">
      <div class="benefit-desc__title">
        会员详情
      </div>
      <div
        v-if="benefitInfo.description"
        class="benefit-desc__desc custom-richtext"
        v-html="benefitInfo.description"
      />
      <div v-else class="benefit-desc__desc custom-richtext">
        还没有设置会员权益详情哦
      </div>
    </div>
  </div>
</template>

<script>
import { setShareData } from '@youzan/wxsdk';
import ColumnEntry from 'pct/components/ColumnEntry';
import apis from 'pct/api';
import { getPaidContentShareLink } from 'pct/utils/share';
import mixinVisPage from 'common/mixins/mixin-vis-page';

export default {
  name: 'vip-benefit-desc',

  config: {
    title: 'this.title',
  },

  components: {
    ColumnEntry,
  },

  mixins: [mixinVisPage],

  data() {
    return {
      title: '知识付费会员',
      benefitInfo: {},
    };
  },

  computed: {
    updateDesc() {
      // if (this.benefitInfo.content_count > 0 || this.benefitInfo.column_count > 0) return '';
      // const contentDesc = this.benefitInfo.content_count >= 0 ? `${this.benefitInfo.content_count}篇内容` : '';
      // const columnDesc = this.benefitInfo.column_count > 0 ? `，${this.benefitInfo.column_count}篇专栏` : '';
      // return `已更新${contentDesc}${columnDesc}`;
      if (this.benefitInfo.content_count || this.benefitInfo.column_count) {
        const contentDesc = this.benefitInfo.content_count ? `${this.benefitInfo.content_count}篇内容` : '';
        const flagDesc = this.benefitInfo.content_count && this.benefitInfo.column_count ? '、' : '';
        const columnDesc = this.benefitInfo.column_count ? `${this.benefitInfo.column_count}篇专栏` : '';
        return `已更新${contentDesc}${flagDesc}${columnDesc}`;
      }
      return '';
    },
  },

  created() {
    this.getBenefitInfo();
  },

  methods: {
    // 获取权益简介
    getBenefitInfo() {
      apis.getVipBenefit({
        alias: this.$route.query.alias || '',
      }).then(data => {
        this.benefitInfo = data;
        // 修改分享内容
        setShareData({
          notShare: false,
          desc: this.benefitInfo.summary,
          link: getPaidContentShareLink(window.location.href, this.$route),
          title: this.benefitInfo.name,
          cover: this.benefitInfo.cover,
        });
        this.title = this.benefitInfo.name;
      }).catch((errMsg) => {
        console.warn(errMsg);
      });
    },
  },

};
</script>

<style lang="scss">
@import "components/custom_richtext.scss";

.vip-benefit-desc {
  background: #fff;

  .benefit-desc {
    padding: 0 10px;

    &__title {
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      color: #333;
    }

    &__desc {
      font-size: 14px;
      color: #666;
      max-width: 100%;
    }
  }
}

</style>
