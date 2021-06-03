<template>
  <div
    :class="['course__item', isBottomLine ? 'course__item--bottomLine' : '']"
    @click="onGoDetail"
  >
    <div class="course__left">
      <vis-tag
        v-if="tagText"
        extend-class="vis-tag-theme vis-tab-position-absolute"
      >
        {{ tagText }}
      </vis-tag>
      <img-wrap
        :width="'100%'"
        :height="'100%'"
        :src="(courseProductDTO.pictureWrapDTO
          && courseProductDTO.pictureWrapDTO.url)
          || '//b.yzcdn.cn/edu/default/default.png'"
        :fullfill="'!220x220.jpg'"
        :alt="courseProductDTO.title"
        :cover="true"
        class="img-wrap--radius"
      />
    </div>
    <div class="course__main">
      <div class="label">
        {{ courseProductDTO.title || eduCourseLittleDTO.name }}
        <div v-if="courseProductDTO.sellType === 1" class="type">
          {{ userAssetDTO.total / 100 }}课时
        </div>
        <div v-else class="type">
          {{ courseProductDTO.skuVal }}  {{ dateRange }}
        </div>
      </div>
      <div v-if="userAssetDTO.studentName" class="time">
        学员：{{ userAssetDTO.studentName || '-' }}
      </div>
    </div>
  </div>
</template>
<script>
import Tag from 'components/tag';
import { imgWrap } from '@youzan/vis-ui';
import * as SafeLink from '@youzan/safe-link';

// const kdtId = window._global.kdt_id;

export default {
  name: 'course-item',

  components: {
    'vis-tag': Tag,
    imgWrap,
  },

  props: {
    item: Object,
    isBottomLine: Boolean,
  },

  data() {
    return {
      courseDetailUrl: this.item.courseDetailUrl || '',
      courseProductDTO: this.item.courseProductDTO || {},
      eduCourseLittleDTO: this.item.eduCourseLittleDTO || {},
      userAssetDTO: this.item.userAssetDTO || {},
    };
  },

  computed: {
    // 有效期单位
    validityPeriodUnit() {
      switch (this.courseProductDTO.validityPeriodUnit) {
        case 1:
          return '天';
        case 2:
          return '月';
        case 3:
          return '季度';
        case 4:
          return '年';
        default:
          return '';
      }
    },

    tagText() {
      const { courseTypeName, courseType } = this.courseProductDTO;
      if (courseTypeName) {
        // 旧逻辑只显示体验课
        if (courseType === 0) {
          return courseTypeName;
        }
      }
      return '';
    },

    dateRange() {
      // 线下课类型
      const sellType = this.courseProductDTO.sellType;
      // 有效期类型
      const periodType = this.courseProductDTO.validityPeriodType;
      // 有效期
      const validityPeriodRange = this.courseProductDTO.validityPeriodRange;

      if (sellType === 0 || sellType === 1) {
        if (periodType === 2 && validityPeriodRange) {
          return `${validityPeriodRange}${this.validityPeriodUnit}`;
        }
      }

      return '';
    },
  },

  methods: {
    onGoDetail() {
      SafeLink.redirect({
        url: this.courseDetailUrl,
        kdtId: window._global.kdt_id,
      });
    },
  },
};
</script>

<style lang="scss">
.course__item {
  display: flex;
  flex-direction: row;
  height: 98px;
  padding: 15px;
  box-sizing: border-box;
  background-color: #fff;
  position: relative;
  overflow: hidden;
}

/* .course__item--bottomLine {
  border-bottom: .5px solid #dcdee0;
} */

.course__item--bottomLine:before {
  content: '';
  position: absolute;
  top: 0;
  left: 15px;
  width: 200%;
  height: 200%;
  transform: scale(.5);
  transform-origin: 0 0;
  pointer-events: none;
  box-sizing: border-box;
  border-bottom: 1px solid #dcdee0;
}

.course__left {
  position: relative;
  width: 120px;
  height: 68px;
  overflow: hidden;
  margin-right: 10px;
  border-radius: 4px;

  img {
    display: block;
    margin: 0 auto;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .vis-tab-position-absolute {
    position: absolute;
    left: 8px;
    bottom: 8px;
    z-index: 1;
    padding: 0 6px;
    line-height: 18px;
    border-radius: 9px;
  }
}

.course__main {
  flex: 1 1 auto;
  display: flex;
  width: 0;
  flex-direction: column;
  justify-content: space-between;

  > div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .label {
    font-size: 14px;
    line-height: 20px;
    font-weight: bold;
    color: #323233;

    .type {
      color: #7d7e80;
      line-height: 17px;
      font-size: 12px;
      font-weight: normal;
      margin-top: 2px;
    }
  }

  .time {
    font-size: 12px;
    line-height: 17px;
    color: #969799;
  }
}
</style>
