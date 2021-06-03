<template>
  <div>
    <div v-if="success" class="present-list">
      <edu-present-card
        v-if="list.course.length"
        :list="list.course"
        type="course"
        title="以下课程赠品需要填写报名信息以便我们为你预约："
      />
      <edu-present-card
        v-if="list.knowledge.length"
        :list="list.knowledge"
        type="knowledge"
        title="以下课程赠品领取后即可进行学习："
      />
      <goods-present-card
        v-if="list.goods.length"
        :list="list.goods"
      />
    </div>
    <common-error v-else @click="initData" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Button } from 'vant';
// import args from '@youzan/utils/url/args';
import EduPresentCard from '../../components/edu-present-card';
import GoodsPresentCard from '../../components/goods-present-card';
import CommonError from '../../components/common-error';

// const presentSource = args.get('presentSource');

export default {
  name: 'present-list',

  components: {
    [EduPresentCard.name]: EduPresentCard,
    [GoodsPresentCard.name]: GoodsPresentCard,
    [Button.name]: Button,
    [CommonError.name]: CommonError,
  },

  computed: {
    ...mapState(['loading', 'list', 'success']),
  },
};
</script>

<style lang="scss" scoped>
.present-list {
  padding: 12px;
}
</style>
