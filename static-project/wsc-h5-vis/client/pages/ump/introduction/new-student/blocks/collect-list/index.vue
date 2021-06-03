<template>
  <section-container
    v-if="reward.type === 3 && rewardDetail.joinNum > 0 && isShowCollectList"
    :title="`${rewardDetail.joinNum}位好友已为你助力`"
  >
    <div class="collect-list">
      <div class="avatar-list">
        <template v-for="(item, index) in list">
          <img-wrap
            :key="index"
            class="avatar"
            :src="item.avatar"
            width="56px"
            height="56px"
            v-if="item"
          />
          <div
            class="share-btn"
            :key="index"
            @click="onButtonClick('share')"
            v-else
          >
            +
          </div>
        </template>
        <div v-if="hasMore" class="more" @click="onShowAll">
          <span>
            查看全部
            <vis-icon name="arrow-down" size="14px" color="#969799" />
          </span>
        </div>
      </div>
    </div>
  </section-container>
</template>

<script>
import { ImgWrap, Icon } from '@youzan/vis-ui';
import { mapState, mapActions } from 'vuex';

import SectionContainer from '../../../components/section-container';

export default {
  name: 'collect-list',

  components: {
    ImgWrap,
    'vis-icon': Icon,
    SectionContainer,
  },

  computed: {
    ...mapState(['reward', 'rewardDetail', 'isShowCollectList', 'helperList']),
    list() {
      const { isShowAll, helperList } = this;
      let list = [];
      if (isShowAll) {
        list = helperList;
      } else {
        list = helperList.slice(0, 3);
      }
      list.splice(3, 0, '');
      return list;
    },
    hasMore() {
      const { rewardDetail, list } = this;
      return rewardDetail.joinNum > 3 && list.length <= 4;
    },
  },

  data() {
    return {
      isShowAll: false,
    };
  },

  mounted() {
    this.fetchHelperList();
  },

  methods: {
    ...mapActions(['onButtonClick', 'fetchHelperList']),

    onShowAll() {
      this.isShowAll = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.collect-list {
  padding: 16px 26px;

  .avatar-list {
    @include flex-row(flex-start, center);
    flex-wrap: wrap;

    .avatar {
      position: relative;
      margin: 0 8px 16px 8px;
      border-radius: 50%;
      overflow: hidden;

      &:after {
        @include border-retina();
        border-color: #ebedf0;
      }
    }

    .share-btn {
      width: 56px;
      height: 56px;
      margin: 0 8px 16px 8px;
      background: #ffedd8;
      border-radius: 50%;
      color: #ff5100;
      font-size: 34px;
      line-height: 50px;
      text-align: center;
    }

    .more {
      width: 100%;
      margin-top: 8px;
      text-align: center;
      font-size: 14px;
      color: #969799;
    }
  }
}
</style>
