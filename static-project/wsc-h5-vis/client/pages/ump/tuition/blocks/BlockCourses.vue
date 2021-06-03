<!-- 可兑换课程 Blick -->
<template>
  <section class="course-block">
    <!-- ⬇ 标题 ⬇ -->
    <header>
      学费可兑换以下课程
    </header>
    <!-- ⬆ 标题 ⬆ -->
    <!-- ⬇ 课程列表，数据从 Store 中取，最多展示 3 个 ⬇ -->
    <section>
      <course-goods-card
        v-for="course of courses"
        :key="course.alias"
        v-bind="course"
        :price-tag="cutTag.text"
        :button-text="actionButton.text"
        :show-price="sholudShowPrice(course)"
        @click="onClickCourseItem(course)"
      />
    </section>
    <!-- ⬆ 课程列表 ⬆ -->
    <!-- ⬇ 查看更多按钮，由 Store 中的配置决定是否显示 ⬇ -->
    <footer v-if="isShowMoreButtonVisible" @click="onClickFooter">
      <span>查看全部可兑换课程</span>
      <van-icon size="14" name="arrow" />
    </footer>
    <!-- 查看更多按钮 -->
  </section>
</template>

<script>
import Vue from 'vue';
import { Icon } from 'vant';
import CourseGoodsCard from '../components/CourseGoodsCard.vue';
import { OWL_TYPE } from '@/constants/course/owl-type';

import { mapGetters, mapState } from 'vuex';
export default Vue.extend({
  name: 'block-courses',
  components: {
    'van-icon': Icon,
    CourseGoodsCard,
  },
  computed: {
    ...mapState([
      'courses',
    ]),
    ...mapGetters({
      isWeapp: 'isWeapp',
      cutTag: 'courseItemIsCutTag',
      actionButton: 'courseItemActionButton',
      isShowMoreButtonVisible: 'blockCoursesIsShowMoreButtonVisible',
    }),
  },
  methods: {
    onClickFooter() {
      this.$store.commit('setCoursesPopupVisible', true);
    },
    onClickCourseItem(course) {
      if (!this.sholudShowPrice(course)) {
        this.$store.dispatch('showWeappTip');
        return;
      }
      this.$store.commit('setTempCourseAlias', course.goodsAlias);
      this.$store.dispatch(this.actionButton.action);
    },
    sholudShowPrice(course) {
      const isOfflineCourse = course.owlType === OWL_TYPE.COURSE;
      return isOfflineCourse || !this.isWeapp;
    },
  },
});
</script>

<style lang="scss" scoped>
.course-block {

  border-radius: 8px;
  background-color: #ffffff;
  margin:12px auto 0;
  padding-bottom: 16px;

  header {
    background-image: url(https://b.yzcdn.cn/public_files/ce5cc998ab075bd5162410ddf0805209.png);
    background-size: contain;
    background-repeat: no-repeat;
    font-size: 16px;
    font-weight: 500;
    color: #754802;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 192px;
    height: 38px;
    margin: 0 auto 12px;
  }

  footer{
    font-size: 14px;
    color: #646566;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
  }
}
</style>
