<template>
  <div class="detail">
    <template v-if="valid">
      <block-summary />

      <!-- 中间详情 -->
      <block-detail :show-more="hasLimit" />

      <!-- 底部动作按钮 -->
      <block-action />
    </template>

    <empty
      v-else
      message="考试已失效"
      button-text="去逛逛店铺"
      @click="goHomePage"
    />

    <module
      v-if="hasLimit || !valid"
      name="recommend"
      :type="valid ? 'exam' : 'course'"
    />
  </div>
</template>

<script>
import { navigateEnv } from '@/common/utils/env';
import Empty from 'components/error-message';
import BlockSummary from './blocks/Summary';
import BlockDetail from './blocks/Detail';
import BlockAction from './blocks/Action';
import { setShareData } from '@youzan/wxsdk';
import get from 'lodash/get';

const isWeapp = get(window, '_global.miniprogram.isWeapp', false);
const shopLogoUrl = get(window, '_global.mp_data.logo', 'https://img01.yzcdn.cn/public_files/2016/05/13/8f9c442de8666f82abaf7dd71574e997.png');

export default {
  name: 'detail',

  components: {
    BlockSummary,
    BlockDetail,
    BlockAction,
    Empty,
  },

  rootMutations: ['updateExamId'],
  state: ['valid', 'hasLimit'],
  actions: ['fetchExamDetail'],

  created() {
    // 更新 examId
    const { examId } = this.$route.query;
    if (examId) {
      this.updateExamId(examId);
    }
    // 获取考试详情
    this.fetchExamDetail()
      .then((res) => {
        const {
          examDTO: {
            picture: {
              coverUrl,
            },
            title,
            detail,
          },
        } = res;
        const node = document.createElement('div');
        node.innerHTML = detail;
        const detailDesc = node.innerText;
        if (isWeapp) {
          setShareData({
            title,
            cover: coverUrl,
          });
        } else {
          setShareData({
            title,
            desc: detailDesc === '' ? '点击查看考试详情' : detailDesc,
            cover: shopLogoUrl,
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  },

  methods: {
    goHomePage() {
      navigateEnv();
    },
  },
};
</script>

<style lang="scss">
@import '~supv/examination/style/index';

.detail {
  .error-message {
    position: relative;
    top: 0;
    height: 283px;
    padding: 43px 0 60px;
    margin-top: 0;
    background: $white;
    transform: none;
    box-sizing: border-box;
  }
}
</style>
