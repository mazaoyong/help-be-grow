<template>
  <vis-popup
    ref="popup"
    v-model="show"
    title="兑换课程"
    closeable
    class="course-popup"
  >
    <transition v-if="isCardVisible" name="van-slide-down">
      <section v-show="showStickyCard" class="sticky-card">
        <section class="amount">
          <span>¥</span>
          <span class="number">{{ amount }}</span>
        </section>
        <section class="desc">
          <!-- 此处读取固定配置，保证 html 安全 -->
          <!--  eslint-disable-next-line vue/no-v-html -->
          <p v-html="miniCardDesc[0]" />
          <!-- 此处读取固定配置，保证 html 安全 -->
          <!--  eslint-disable-next-line vue/no-v-html -->
          <p v-html="miniCardDesc[1]" />
        </section>
        <van-button
          v-if="cardActionButton.isVisible"
          size="small"
          round
          class="button"
          @click="onClickActionButton"
        >
          {{ cardActionButton.text }}
        </van-button>
      </section>
    </transition>

    <section ref="containerRef" class="container">
      <header v-if="isCardVisible" ref="card" class="card">
        <section class="desc">
          <h1>我的学费</h1>
          <!-- 此处读取固定配置，保证 html 安全 -->
          <!--  eslint-disable-next-line vue/no-v-html -->
          <h2 v-html="cardSubtitle" />
        </section>
        <section class="amount">
          <span>¥</span>
          <span class="number">{{ amount }}</span>
        </section>

        <van-button
          v-if="cardActionButton.isVisible"
          round
          size="small"
          class="button"
          @click="onClickActionButton"
        >
          {{ cardActionButton.text }}
        </van-button>
      </header>
      <section class="courses">
        <h2 class="title">
          学费可兑换以下课程
        </h2>

        <vis-common-list
          :params="params"
          :request="fetchCourses"
        >
          <template slot-scope="props">
            <course-goods-card
              v-bind="props.item"
              :show-price="sholudShowPrice(props.item)"
              :price-tag="cutTag.text"
              class="course"
              :button-text="actionButton.text"
              @click="onClickCourseItem(props.item)"
            />
          </template>
        </vis-common-list>
      </section>
    </section>
  </vis-popup>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { Popup as VisPopup, CommonList as VisCommonList } from '@youzan/vis-ui';

import CourseGoodsCard from '../components/CourseGoodsCard.vue';

import { Button as VanButton } from 'vant';

import { findGoodsByPage } from '../api';
import { OWL_TYPE } from '@/constants/course/owl-type';

import { throttle } from 'lodash';

// import store from '../store';

// import { mapState}
// @ts-ignore
let observer = null;

export default Vue.extend({
  name: 'popup-courses',
  components: {
    // CommonList,
    VisPopup,
    VanButton,
    CourseGoodsCard,
    VisCommonList,
  },
  data: function() {
    return {
      popupRef: null,
      cardRef: null,
      showStickyCard: false,
      params: {},
      containerRef: null,
    };
  },
  computed: {
    ...mapGetters({
      isWeapp: 'isWeapp',
      templateId: 'templateId',
      cutTag: 'courseItemIsCutTag',
      amount: 'currentTuitionAmount',
      actionButton: 'courseItemActionButton',
      cardSubtitle: 'popupCoursesCardSubtitle',
      miniCardDesc: 'popupCoursesMiniCardDesc',
      isCardVisible: 'popupCoursesIsCardVisible',
      cardActionButton: 'popupCoursesCardActionButton',
    }),
    show: {
      get() {
        return this.$store.state.isCoursesPopupVisible;
      },
      set(value) {
        this.$store.commit('setCoursesPopupVisible', value);
      },
    },
  },

  updated() {
    // this.$store.state.xxxxx;
    if (!this.isCardVisible) {
      return;
    }

    // @ts-ignore
    this.popupRef = this.$refs.popup;
    this.cardRef = this.$refs.card;
    this.containerRef = this.$refs.containerRef;

    if (observer) {
      return;
    }
    if (typeof window.IntersectionObserver === 'function') {
      this.initCardObserver();
    } else {
      // 心太累了，跟视觉沟通下，无法兼容
      // this.initCardObserverFallback();
    }
  },

  methods: {

    sholudShowPrice(course) {
      const isOfflineCourse = course.owlType === OWL_TYPE.COURSE;
      return isOfflineCourse || !this.isWeapp;
    },
    fetchCourses(params) {
      // 抽取转换函数
      const { page, pageSize } = params;

      return findGoodsByPage(this.templateId, page, pageSize).then(data => {
        const { content = [], totalPages } = data;
        return {
          list: content.filter(item => Boolean(item)),
          hasNext: page < totalPages,
        };
      });
    },
    onClickActionButton() {
      this.$store.commit('setCoursesPopupVisible', false);
      this.$store.dispatch(this.cardActionButton.action);
    },

    onClickCourseItem(course) {
      if (!this.sholudShowPrice(course)) {
        this.$store.dispatch('showWeappTip');
        return;
      }
      this.$store.commit('setTempCourseAlias', course.goodsAlias);
      this.$store.dispatch(this.actionButton.action);
    },

    initCardObserver() {
      if (!(this.popupRef.$el && this.cardRef)) {
        return;
      }
      let options = {
        root: this.popupRef.$el,
        threshold: 0.4,
      };

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          this.showStickyCard = !entry.isIntersecting;
        },
        );
      }, options);

      observer.observe(this.cardRef);
    },
    /** 兼容模式 */
    initCardObserverFallback() {
      const [, scrollContainer] = this.popupRef.$el.children || [];
      if (!scrollContainer) {
        return;
      }
      const scrollCallback = throttle((e) => {
        const { bottom: cardBottom } = this.cardRef.getBoundingClientRect();
        const { top: scrollContainerTop } = scrollContainer.getBoundingClientRect();
        const containerTop = scrollContainerTop + 44;
        if (cardBottom < containerTop) {
          if (!this.showStickyCard) {
            this.showStickyCard = true;
          }
        } else {
          if (this.showStickyCard) {
            this.showStickyCard = false;
          }
        }
      }, 500);
      scrollContainer.addEventListener('scroll', scrollCallback);
      observer = true;
    },

    disconnectCardObserver() {

    },

  },

},
);
</script>

<style lang="scss" scoped>
// vis-ui-classname
/* ::v-deep .vis-standard-popup__content {
  position: relative;
  overflow: hidden;
  padding: 0 16px;
} */

::v-deep .vis-standard-popup__title{
  position: absolute;
  background: #ffffff;
  left: 0;
  right: 0;
  z-index: 3;
}

::v-deep .van-popup__close-icon--top-right{
  z-index: 4;
}

$headerCardHeight: 117px;

section.sticky-card {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  position: absolute;
  top: 44px;
  left: 0;
  right: 0;
  background: #ffffff;
  z-index: 2;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.08);

  .amount {
    flex: 0;
    color: #ff4a00;
    font-size: 20px;
    font-weight: 500;
    .number {
      font-size: 32px;
      font-weight: 600;
      margin-left: 6px;
    }
  }

  .desc {
    font-size: 12px;
    color: #754802;
    line-height: 16px;
    margin-left: 8px;
    .number {
      color: #ff4a00;
    }
    flex: 1;
  }

  .button {
    flex-shrink: 0;
    font-size: 14px;
    color: #ffffff;
    font-weight: 500;
    border: none;
    background-image: linear-gradient(
      90deg,
      #ff6713 0%,
      #ff6713 0%,
      #ff551f 100%
    );
  }
}

.container {
  padding: 44px 16px 0;

  header.card {
  height: $headerCardHeight;
  background-color: #ffffff;
  background-image: url(https://b.yzcdn.cn/public_files/c4b268ebdd52d4e3a75b0bcf68c3b16f.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 12px 16px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  border-radius: 8px;

  section.desc {
    width: 100%;
    color: #754802;
    /* flex: 1; */
    h1 {
      font-weight: 500;
      font-size: 16px;
      line-height: 22px;
    }
    h2 {
      font-size: 13px;
      line-height: 17px;
      .number {
        color: #ff3200;
        font-weight: 600;
      }
    }
  }
  section.amount {
    color: #ff4a00;
    font-weight: 500;
    font-size: 26px;
    line-height: 32px;
    .number {
      font-size: 44px;
      line-height: 44px;
      font-weight: 600;
    }
  }
  .button {
    font-size: 14px;
    color: #ffffff;
    font-weight: 500;
    border: none;
    background-image: linear-gradient(
      90deg,
      #ff6713 0%,
      #ff6713 0%,
      #ff551f 100%
    );
  }
}

  section.courses {
    margin-top: 15px;
    h2.title {
      padding-left: 10px;
      margin-bottom: 8px;
      font-size: 14px;
      color: #323233;
      line-height: 18px;
      font-weight: 500;
    }
    .course {
      margin-bottom: 8px;
      background: #fff8f2;
      border-radius: 8px;
    }
  }
}
</style>
