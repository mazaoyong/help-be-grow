<template>
  <div @click="toLiveroom">
    <div class="entry-detail clearfix">
      <icon symbol="live" class="entry-detail__icon-live" />
      <van-icon class="entry-detail__icon-arrow" name="arrow" />
      <p class="entry-detail__title">
        直播间：{{ title }}
      </p>
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant';
import svgIcon from 'components/svg-icon';
import get from 'lodash/get';
import * as SafeLink from '@youzan/safe-link';

export default {
  name: 'entry-detail',

  components: {
    [Icon.name]: Icon,
    icon: svgIcon,
  },

  props: {
    liveId: [String, Number],
    title: String,
    alias: String,
  },

  methods: {
    toLiveroom() {
      const url = get(window, '_global.url.wap');
      const kdtId = get(window, '_global.kdt_id');
      // eslint-disable-next-line max-len
      SafeLink.redirect({
        url: `${url}/ump/paidcontent/index?page=liveroom&kdt_id=${kdtId}&alias=${this.alias}&sg=live#/liveroom?title=${this.title}`,
        kdtId,
      });
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';

.entry-detail {
  margin-top: 20px;
  width: 100%;
  height: 44px;
  line-height: 44px;
  border-radius: 2px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, .12);

  &__icon-live {
    float: left;
    margin: 12px 0 0 10px;
    width: 28px;
    height: 22px;
  }

  &__icon-arrow {
    float: right;
    font-size: 10px;
    margin: 17px 10px 17px 0;
  }

  &__title {
    padding-left: 10px;
    overflow: hidden;
    font-size: 14px;
    color: #4a4a4a;

    @include multi-ellipsis(1);
  }
}
</style>
