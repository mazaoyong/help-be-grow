<template>
  <section class="entry-list">
    <van-grid
      :column-num="3"
      :border="false"
    >
      <van-grid-item
        v-for="(item, index) in entryList"
        :key="index"
        :text="item.text"
        class="entry-list__item"
      >
        <vis-icon
          slot="icon"
          v-theme.main="'color!important'"
          :name="item.icon"
          size="32px"
          class="entry-list__item-icon"
        />
      </van-grid-item>
    </van-grid>
  </section>
</template>
<script>
import { Grid, GridItem } from 'vant';
import { Icon } from '@youzan/vis-ui';
const ENTRTLIST = [
  {
    icon: 'mycurriculum',
    text: '查看课程',
  },
  {
    icon: 'lookatthetimetable',
    text: '查看课表',
  },
  {
    icon: 'certificate',
    text: '查看证书',
  },
  {
    icon: 'appointmentforclass',
    text: '预约上课',
  },
  {
    icon: 'attendanceinclass',
    text: '签到消课',
  },
  {
    icon: 'column',
    text: '修改资料',
  },
];
export default {
  name: 'entry-list',

  components: {
    'van-grid': Grid,
    'van-grid-item': GridItem,
    'vis-icon': Icon,
  },

  props: {
    isRedirect: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      entryList: ENTRTLIST,
    };
  },
};
</script>
<style lang="scss">
@import 'mixins/index.scss';

.entry-list {
  margin: 0 12px;
  padding: 16px 25px;
  background-color: $white;
  border-radius: 8px;
  overflow: hidden;

  &__item {
    &-icon {
      margin-bottom: 12px;
      color: #00B389;
    }

    .van-grid-item__text {
      line-height: 16px;
      font-size: 13px;
      color: #323233;
    }
  }
}
</style>
