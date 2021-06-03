<template>
  <card v-if="pledge.title">
    <div class="service__content">
      <div class="service__title">
        <vis-icon
          v-theme.main="'fill'"
          class="service__icon"
          :name="pledge.icon"
        />
        <span v-theme.main class="service__title">{{ pledge.title }}</span>
      </div>
      <div class="service__desc">
        <span>{{ pledge.desc }}</span>
      </div>
    </div>
  </card>
</template>

<script>
import { get } from 'lodash';
import { SERVICE_PLEDGE } from '@/constants/course/service-pledge';

import { Icon } from '@youzan/vis-ui';
import { Card } from '@/pages/trade/buy/components/card';

const PLEDGE_MAP = {
  [SERVICE_PLEDGE.FREE_APPOINTMENT]: {
    icon: 'no-confirm',
    title: '此课程免预约',
    desc: '该课程购买成功后，无需预约到店即可体验。',
  },
  [SERVICE_PLEDGE.CHECK_AGAIN]: {
    icon: 'need-confirm',
    title: '此课程需要二次确认',
    desc: '该课程购买成功后，需等待商家确认预约。',
  },
};

export default {
  name: 'service-block',

  components: {
    Card,
    'vis-icon': Icon,
  },

  getters: ['singleGoods'],

  computed: {
    pledge() {
      const servicePledge = get(
        this.singleGoods,
        'orderCourseDTO.servicePledge',
        0
      );
      return PLEDGE_MAP[servicePledge] || {};
    },
  },
};
</script>

<style lang="scss" scoped>
.service {
  &__content {
    padding: 12px;
    font-size: 13px;
    line-height: 18px;
  }

  &__title {
    padding-bottom: 8px;
    font-weight: 500;
  }

  &__icon {
    width: 16px;
    height: 16px;
    margin-right: 4px;
    vertical-align: text-bottom;
  }
}
</style>
