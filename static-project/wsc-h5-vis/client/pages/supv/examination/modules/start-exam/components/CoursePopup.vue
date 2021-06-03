<template>
  <div class="course-popup">
    <header>
      <div class="course-popup__title">
        课程报名
      </div>
      <div class="course-popup__subtitle">
        需要先报名以下任意课程才能参加考试
      </div>
    </header>

    <main>
      <vis-common-list
        :params="listParams"
        :request="getCourseListWrap"
        immediate-check
        @error="onListError"
      >
        <goods-card
          slot-scope="props"
          :alias="props.item.alias"
          :owl-type="props.item.courseType"
          :media-type="props.item.mediaType"
          :img="props.item.cover"
          :title="props.item.title"
          button-text="去报名"
        >
          <div class="course-popup__course-item__infos">
            <span v-theme.main="'color!important'" class="course-popup__course-item__price">
              ￥{{ props.item.price / 100 }}
            </span>
            <span v-if="props.item.subscriptionCount" class="course-popup__course-item__users">
              {{ props.item.subscriptionCount }}人{{ getSalesSuffix(props.item) }}
            </span>
          </div>
        </goods-card>
      </vis-common-list>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Toast } from 'vant';
import { CommonList as VisCommonList } from '@youzan/vis-ui';
import { OWL_TYPE } from '@/constants/course/owl-type';
import { MEDIA_TYPE_SUFFIX } from '@/constants/course/media-type';
import GoodsCard from 'components/goods-card/index.vue';
import { getRecommendList } from '../apis';

export default Vue.extend({
  name: 'course-popup',

  components: {
    VisCommonList,
    GoodsCard,
  },

  props: {
    value: Boolean,
    examId: {
      type: String,
      default: '',
    },
  },

  computed: {
    listParams() {
      return {
        pageSize: 10,
        examTemplateId: this.examId,
      };
    },
    hasExam() {
      return true;
    },

  },

  methods: {
    getCourseListWrap: (params: any) => {
      params.pageRequest = {
        pageSize: params.pageSize,
        pageNumber: params.page,
      };

      return getRecommendList(params)
        .then(res => ({
          list: res.content,
          hasNext: params.page < res.totalPages,
        }));
    },

    getSalesSuffix(item: any) {
      if (item.courseType === OWL_TYPE.CONTENT) {
        return MEDIA_TYPE_SUFFIX[item.mediaType];
      }

      return {
        [OWL_TYPE.COLUMN]: '已学',
        [OWL_TYPE.CONTENT]: '已学',
        [OWL_TYPE.LIVE]: '观看',
        [OWL_TYPE.COURSE]: '学过',
      }[item.courseType];
    },

    onListError(errMsg: string) {
      Toast(errMsg || '获取考试列表失败');
    },
  },
});
</script>

<style lang="scss" scoped>
@import '~supv/examination/style/index';

.course-popup {
  header {
    position: sticky;
    top: 0;
    z-index: 1;
    height: 65px;
    padding-top: 11px;
    text-align: center;
    background: $white;
    box-sizing: border-box;
  }

  &__title {
    @include text(16px, $black, 22px, 500);
  }

  &__subtitle {
    @include text(12px, $deep-gray, 22px);
  }

  &__course-item {
    &__price {
      @include text(14px, $edu-green, 19px, 500);
    }

    &__users {
      @include text(10px, $deeper-gray, 14px);

      margin-left: 4px;
    }
  }
}
</style>
