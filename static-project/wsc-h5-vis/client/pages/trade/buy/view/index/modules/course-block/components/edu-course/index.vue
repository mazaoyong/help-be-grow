<template>
  <base-course :tag="tagName" :content-list="contentList" />
</template>

<script>
import { COURSE_SELL_TYPE } from '@/constants/course/course-sell-type';
import { COURSE_EFFECTIVE_TYPE } from '@/constants/course/course-effective-type';
import {
  VALID_PERIOD_TYPE,
  VALID_PERIOD_UNIT_DESC,
} from '@/constants/course/validity-period';

import BaseCourse from '../base-course';

export default {
  name: 'edu-course',

  components: {
    BaseCourse,
  },

  getters: ['singleGoods'],

  computed: {
    tagName() {
      return this.singleGoods.orderCourseDTO.courseTypeName;
    },

    contentList() {
      const list = [];
      const sku = this.getSku();
      const vaildTime = this.getCourseValidTime(this.singleGoods.orderCourseDTO);

      if (sku) {
        list.push({ icon: 'course-symbol', text: sku });
      }

      if (vaildTime) {
        list.push({ icon: 'valid-time', text: vaildTime });
      }

      return list;
    },
  },

  methods: {
    getSku() {
      const skus = JSON.parse(this.singleGoods.sku) || [];
      return skus.map(({ v }) => v).join('；');
    },

    // 获取课程有效期描述
    getCourseValidTime(dto = {}) {
      const {
        validityPeriodUnit,
        validityPeriodType,
        validityPeriodRange,
        courseEffectiveDelayDays,
        courseSellType,
        courseEffectiveType,
      } = dto;

      if (validityPeriodType === VALID_PERIOD_TYPE.FOREVER) {
        return '';
      }

      switch (courseSellType) {
        case COURSE_SELL_TYPE.COUNT:
          return [
            this.getCourseEffectiveDesc(
              courseEffectiveType,
              courseEffectiveDelayDays
            ),
            this.getValidPeriodDesc(validityPeriodRange, validityPeriodUnit),
          ].join('，');
        case COURSE_SELL_TYPE.DURATION:
          return this.getCourseEffectiveDesc(
            courseEffectiveType,
            courseEffectiveDelayDays
          );
        default:
          return '';
      }
    },

    // 获取课程有效时间描述
    getCourseEffectiveDesc(type, num) {
      const effectiveDescMap = {
        [COURSE_EFFECTIVE_TYPE.AFTER_SIGN]: '首次上课签到后生效',
        [COURSE_EFFECTIVE_TYPE.AFTER_BUY_PERIOD]: `付款${num}天后生效`,
        [COURSE_EFFECTIVE_TYPE.AFTER_BUY]: '付款完成后立即生效',
      };

      return effectiveDescMap[type];
    },

    // 获取生效事件描述
    getValidPeriodDesc(num, unit) {
      return `生效起${num}${VALID_PERIOD_UNIT_DESC[unit] || ''}内可用`;
    },
  },
};
</script>
