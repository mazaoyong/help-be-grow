<template>
  <div class="select-pop-content">
    <div class="select-pop-content__top">
      <span class="select-pop-content__top-title">
        选择{{ title }}
      </span>
      <van-icon
        name="cross"
        size="14px"
        color="#969799"
        @click="onCancel"
      />
    </div>
    <div class="select-pop-content__options">
      <template v-if="courseList.length>0">
        <van-list
          v-model="loading"
          :finished="finished"
          @load="onLoad"
        >
          <select-item
            v-for="item in courseList"
            :id="item.id"
            :key="item.id"
            :name="item.name"
            :selected-id="selectedCourseId"
            @selected="onSelectedItem"
          />
        </van-list>
      </template>
      <div
        v-else
        class="select-pop-content__options-empty"
      >
        <img
          class="img"
          src="https://b.yzcdn.cn/public_files/2018/11/19/bfc666f3eb05081b88d7353f43e18123.png"
        >
        <p>暂无{{ title }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon, List } from 'vant';
import SelectItem from './SelectItem';

export default {
  name: 'select-pop-content',

  components: {
    'van-icon': Icon,
    'van-list': List,
    SelectItem,
  },

  props: {
    showPop: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      default: '',
    },

    selectedCourseId: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      loading: true,
      isNotLoading: false,
      pageNumber: 1,
      pageSize: 10,
      courseList: [],
      finished: false,
      selectedItem: {},
      total: 0,
    };
  },

  mounted() {
    this.fetchEduCourse();
  },

  methods: {
    onLoad() {
      if (this.isNotLoading) {
        this.isNotLoading = false;
        this.pageNumber++;
        this.fetchEduCourse();
      }
    },

    fetchEduCourse() {
      const pageRequest = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
      };
      this.$store.dispatch('fetchCourseList', { pageRequest })
        .then((res = {}) => {
          const content = res.content;
          this.total = res.total;
          this.courseList = this.courseList.concat(content);
          this.finished = res.content.length === 0;
          this.isNotLoading = true;
          this.loading = false;
        })
        .catch(() => {
          this.isError = true;
          this.isNotLoading = true;
          this.loading = false;
        });
    },

    onSelectedItem(id) {
      this.courseList.forEach(item => {
        if (item.id === id) {
          this.selectedItem = item;
        }
      });
      this.$emit('selected', this.selectedItem);
    },

    onCancel() {
      this.$emit('cancelCourse');
    },
  },
};
</script>

<style lang="postcss">
.select-pop-content {
  width: 100%;
  height: 390px;

  &__top {
    display: flex;
    justify-content: space-between;
    height: 44px;
    line-height: 44px;
    padding: 0 15px;
    font-size: 14px;
    color: #323233;
    border-bottom: 1px solid #ccc;

    .van-icon {
      line-height: 44px;
    }
  }

  &__options {
    max-height: 340px;
    overflow-y: auto;

    &-empty {
      margin-top: 80px;
      text-align: center;
      font-size: 14px;
      color: #999;

      .img {
        width: 80px;
        margin-bottom: 5px;
      }
    }
  }
}
</style>
