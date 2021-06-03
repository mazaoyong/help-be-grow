<template>
  <div class="paid-content__column-intro">
    <div
      v-if="content.length > 0"
      id="rich-content"
      class="paid-content__intro-content custom-richtext"
      v-html="content"
    />
    <div v-else>
      你还没有设置专栏详情哦
    </div>
    <!-- 屏蔽显示全部 针对专栏介绍 -->
    <!-- <div
      v-if="hidePartContent"
      class="column-richcontent__showmore"
      @click="onButtonToggle">
      <p class="column-richcontent__showmore-btn">
        显示全部
      </p>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'column-intro',

  props: {
    content: {
      type: String,
      default: '',
    },
    isOwned: {
      type: Boolean,
      default: false,
    },
    // 是否展示试看列表
    showFreeList: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      showMoreBtn: false,
    };
  },

  computed: {
    // 显示全部控制
    hidePartContent() {
      return !this.isOwned && this.showMoreBtn && this.showFreeList;
    },
  },

  mounted() {
    this.contentHeightCheck();
  },

  methods: {
    // 高度检查
    contentHeightCheck() {
      let maxCheck = 10;
      const heightChecker = () => {
        maxCheck--;
        if (!document.getElementById('rich-content') && maxCheck > 0) {
          setTimeout(() => {
            heightChecker();
          }, 1000);
        } else if (document.getElementById('rich-content') &&
          document.getElementById('rich-content').clientHeight > 150
        ) {
          this.showMoreBtn = true;
        }
      };
      heightChecker();
    },

    onButtonToggle() {
      this.showMoreBtn = !this.showMoreBtn;
    },
  },
};
</script>

<style lang="css" scoped>
@import '~assets/styles/components/custom_richtext.scss';

.paid-content__column-intro {
  overflow: hidden;
  padding: 18px 15px 24px;
  position: relative;
}
.paid-content__column-content {
  overflow: hidden;
}

.limit-height {
  height: 250px;
  overflow: hidden;
}

.column-richcontent__showmore {
  height: 70px;

  /* background: linear-gradient(180deg, rgba(255, 255, 255, .8), rgba(255, 255, 255, 1)); */
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0 15px;
}

.column-richcontent__showmore-btn {
  font-size: 14px;
  border-radius: 2px;
  color: #00b389;
  background-color: #f7f8fa;
  width: 100%;
  text-align: center;
  height: 44px;
  line-height: 44px;
  font-weight: 500;
  box-shadow: 0 -30px 30px #fff;
}
</style>
