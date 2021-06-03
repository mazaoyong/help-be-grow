<template>
  <div v-if="inited" class="list">
    <van-tabs v-if="hasExam" v-model="currentTabIndex" :color="$theme.colors.main">
      <van-tab
        v-for="list in listConfig"
        :key="list.name"
        :title="list.title"
      >
        <vis-common-list
          :params="listParams"
          :request="getExamListWrap"
          immediate-check
          @error="onListError"
        >
          <goods-card
            slot-scope="props"
            :img="props.item.cover"
            :title="props.item.title"
            :title-tag="getTitleTag(props.item.answeredPaperState)"
            :title-tag-class="getTitleTagClass(props.item.answeredPaperState)"
            :button-text="getButtonText(props.item, list.name)"
            @click="toDetail(props.item.examId)"
          >
            <div
              v-if="props.item.relateCourses && props.item.relateCourses.length"
              class="list-item__infos"
            >
              <span class="list-item__info">
                关联课程：{{ props.item.relateCourses.join('，') }}
              </span>
            </div>
          </goods-card>

          <empty
            slot="empty"
            class="empty-block"
            :show-button="false"
            :message="`没有${list.title}的考试`"
          >
            <div slot="button" />
          </empty>
        </vis-common-list>
      </van-tab>
    </van-tabs>

    <template v-else>
      <empty
        message="没有可以参加的考试"
        button-text="去逛逛店铺"
        @click="goHomePage"
      />

      <module name="recommend" type="course" />
    </template>
  </div>
</template>

<script>
import { Toast, Tabs as VanTabs, Tab as VanTab } from 'vant';
import { CommonList as VisCommonList } from '@youzan/vis-ui';
import { navigateEnv } from '@/common/utils/env';
import GoodsCard from 'components/goods-card';
import Empty from 'components/error-message';
import { getUserExamList, getUserExam } from 'supv/examination/apis';
import { AnsweredPaperState } from 'supv/examination/types';

export default {
  name: 'list',

  components: {
    VanTabs,
    VanTab,
    VisCommonList,
    GoodsCard,
    Empty,
  },

  data() {
    return {
      inited: false,
      hasExam: true,
      currentTabIndex: 0,
      listConfig: [
        { name: 'notjoin', title: '未参加', state: 0 },
        { name: 'notcommitted', title: '未提交', state: 1 },
        { name: 'committed', title: '已提交', state: 2 },
      ],
    };
  },

  computed: {
    currentTabName() {
      return this.listConfig[this.currentTabIndex].name;
    },
    listParams() {
      return {
        queryState: this.listConfig[this.currentTabIndex].state,
      };
    },
  },

  created() {
    getUserExam()
      .then(res => {
        if (res) {
          this.hasExam = res.hasCanJoinExam;
        } else {
          this.hasExam = false;
        }
      })
      .catch(() => {
        this.hasExam = false;
      })
      .finally(() => {
        this.inited = true;
      });
  },

  methods: {
    getExamListWrap: (params) => {
      params.pageRequest = {
        pageNumber: params.page,
        pageSize: params.pageSize,
      };

      return getUserExamList(params)
        .then(res => ({
          list: res.content,
          hasNext: params.page < res.totalPages,
        }));
    },

    onListError(errMsg) {
      Toast(errMsg || '获取考试列表失败');
    },

    goHomePage() {
      navigateEnv();
    },

    toDetail(examId) {
      this.$router.push({
        name: 'detail',
        query: {
          examId,
          kdt_id: _global.kdt_id,
        },
      });
    },

    getTitleTag(answeredPaperState) {
      switch (answeredPaperState) {
        case AnsweredPaperState.WAIT_REVIEW:
          return '待批阅';
        case AnsweredPaperState.REVIEWED:
          return '已批阅';
        default:
          return '';
      }
    },

    getTitleTagClass(answeredPaperState) {
      switch (answeredPaperState) {
        case AnsweredPaperState.WAIT_REVIEW:
          return 'title-tag--wait-review';
        case AnsweredPaperState.REVIEWED:
          return 'title-tag--reviewed';
        default:
          return '';
      }
    },

    getButtonText(item, listName) {
      return !!item.canRejoinCount && listName === 'committed' ? '重考' : '';
    },
  },
};
</script>

<style lang="scss">
@import '~supv/examination/style/index';

.list {
  background: $white;

  &-item {
    &__infos {
      overflow: hidden;
      line-height: 20px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__info {
      @include text(10px, $deeper-gray, 14px);
    }
  }

  .title-tag--reviewed {
    color: $deep-gray;
    background: $light-gray !important;
  }

  .error-message {
    position: relative;
    top: 0;
    height: 290px;
    padding: 43px 0 67px;
    margin-top: 0;
    background: $white;
    transform: none;
    box-sizing: border-box;
  }

  .error-message.empty-block {
    position: relative;
    top: 0;
    height: 283px;
    padding: 43px 0 60px;
    margin-top: 0;
    background: $white;
    transform: none;
    box-sizing: border-box;
  }

  .empty-block {
    height: 223px;
  }
}
</style>
