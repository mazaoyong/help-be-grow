<template>
  <div class="block-recommend-list">
    <recommend-list
      v-if="(hasData && examId) || goodsList.length"
      :title="title"
    >
      <template v-if="showRelatedCourses">
        <vis-common-list
          class="common-list"
          :params="params"
          :request="getRecommendList"
          immediate-check
          @error="onListError"
        >
          <recommend-item
            slot-scope="props"
            :image-url="props.item.cover"
            :title="props.item.title"
            :price="props.item.price"
            :sales="props.item.subscriptionCount"
            :url="props.item.url"
            :course-type-name="getCourseTypeName(props.item)"
            :owl-type="props.item.courseType"
            :media-type="props.item.mediaType"
          />
        </vis-common-list>
      </template>

      <template v-else>
        <recommend-item
          v-for="item in goodsList"
          :key="item.id"
          :image-url="item.imageUrl"
          :title="item.title"
          :price="item.price"
          :sales="item.subscriptionCount"
          :url="item.url"
          :course-type-name="getCourseTypeName(item)"
          :owl-type="item.courseType"
          :media-type="item.mediaType"
        />
      </template>
    </recommend-list>
  </div>
</template>

<script>
import { CommonList as VisCommonList } from '@youzan/vis-ui';
import { OWL_TYPE_DESC } from '@/constants/course/owl-type';
import RecommendList from 'components/recommend-list';
import RecommendItem from 'components/recommend-list/RecommendItem';
import { getRecommendList } from '../apis';

export default {
  name: 'block-recommend-list',

  components: {
    VisCommonList,
    RecommendList,
    RecommendItem,
  },

  rootState: ['examId'],
  state: ['goodsList'],
  actions: ['fetchRecommendGoods'],

  props: {
    type: {
      type: String,
      default: 'exam',
    },
  },

  data() {
    return {
      hasData: true,
    };
  },

  computed: {
    title() {
      return this.type === 'exam' ? '关联课程' : '更多精选课程';
    },

    showRelatedCourses() {
      return this.type === 'exam';
    },

    params() {
      return {
        examTemplateId: this.examId,
        pageSize: 10,
      };
    },
  },

  watch: {
    showRelatedCourses: {
      immediate: true,
      handler(value) {
        if (!value) {
          this.fetchRecommendGoods();
        }
      },
    },
  },

  methods: {
    getRecommendList(params) {
      params.pageRequest = {
        pageNumber: params.page,
        pageSize: params.pageSize,
      };
      return getRecommendList(params)
        .then(res => {
          if (!res.total) {
            this.hasData = false;
          }

          return {
            list: res.content,
            hasNext: params.page < res.totalPages,
          };
        });
    },

    onListError(errMsg) {
    },

    getCourseTypeName(item) {
      return OWL_TYPE_DESC[item.courseType];
    },
  },
};
</script>

<style lang="scss">
.block-recommend-list {
  margin-top: 24px;

  .van-list {
    display: flex;
    flex-wrap: wrap;
  }

  .common-list {
    width: 100%;
    text-align: center;
  }
}
</style>
