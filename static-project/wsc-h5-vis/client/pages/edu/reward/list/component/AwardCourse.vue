<template>
  <div class="award award-course">
    <div class="award__left" @click="linkCourse">
      <img-wrap
        width="100%"
        height="100%"
        :src="thumbUrl"
        :fullfill="`!220x220.jpg`"
        :cover="false"
      />
      <mini-font-tag
        v-if="type === 'experience'"
        text="体验课"
        class="img-tag"
        height="16px"
        background-color="rgba(50, 50, 51, .8)"
      />
    </div>
    <div class="award__right">
      <span class="award__label">{{ label }}</span>
      <div class="award__bottom">
        <span class="award__descs">
          <p class="award__desc">{{ desc }}</p>
          <p v-if="campus" class="award__desc">{{ `· 限${campus}使用` }}</p>
        </span>
        <van-botton
          v-if="status === 1"
          class="award__btn"
          type="primary"
          size="mini"
          @click="getAward('COURSE')"
        >
          立即领取
        </van-botton>
        <span
          v-else-if="status === 32"
          class="award__btn award__btn-text"
        >已使用</span>
        <span
          v-else-if="status === 4"
          class="award__btn award__btn-text"
        >已过期</span>
        <template v-else>
          <span
            v-if="type === 'experience'"
            class="award__btn award__btn-text"
          >已领取</span>
          <van-botton
            v-else
            class="award__btn"
            type="primary"
            size="mini"
            @click="linkAppointment"
          >
            立即预约
          </van-botton>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { imgWrap } from '@youzan/vis-ui';
import { Button } from 'vant';
import MiniFontTag from '@/components/mini-font-tag';
import getAward from '../mixin/getAward.js';
import * as SafeLink from '@youzan/safe-link';

export default {
  components: {
    imgWrap,
    'van-botton': Button,
    MiniFontTag,
  },
  mixins: [getAward],
  props: {
    label: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      default: '',
    },
    status: {
      type: Number,
      default: 0,
    },
    /**
     * 体验课 experience
     * 正式课 formally
     */
    type: {
      type: String,
      default: 'formally',
    },
    thumbUrl: {
      type: String,
      default: '',
    },
    recordId: {
      type: Number,
      default: undefined,
    },
    alias: {
      type: String,
      default: '',
    },
    campus: {
      type: String,
      default: '',
    },
    kdtId: {
      type: Number,
    },
  },
  data() {
    return {};
  },
  methods: {
    linkCourse() {
      SafeLink.redirect({
        url: `/wscvis/edu/prod-detail?alias=${this.alias}&kdt_id=${this.kdtId}`,
        kdtId: this.kdtId,
      });
    },

    linkAppointment() {
      // 暂先跳转到预约列表页，待后端接口优化性能后改为跳转预约课程页面
      SafeLink.redirect({
        url: `/wscvis/edu/appointment/list?kdt_id=${this.kdtId}`,
        kdtId: this.kdtId,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.award-course {
  padding: 20px 15px !important;

  .img-tag {
    position: absolute;
    right: 8px;
    bottom: 8px;
    padding: 0;
  }

  .award__left {
    width: 85px;

    .img-wrap {
      border-radius: 2px;
    }
  }

  .award__right {
    padding-left: 15px;
    justify-content: space-between;
  }
}
</style>
