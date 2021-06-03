<template>
  <card
    v-if="Object.keys(dynamicFollowData).length > 0"
    class="record-detail"
  >
    <div class="header">
      <div class="header-container">
        <div class="date">
          {{ date }} {{ week }}
        </div>
        <div class="detail">
          <span>
            {{ dynamicFollowData.operatorName }}
            {{ parsedOperatorSchoolName }}
          </span>
          <span>添加跟进记录</span>
          <span>{{ dynamicFollowData.operateTime | formatTime }}</span>
        </div>
      </div>
    </div>
    <div class="content">
      <pre class="text">{{ dynamicFollowData.recordText }}</pre>
      <div
        v-if="dynamicFollowData.imageList"
        class="image-box"
      >
        <img-wrap
          v-for="(image, index) in dynamicFollowData.imageList"
          :key="index"
          class="image"
          :width="'70px'"
          :height="'70px'"
          :src="image"
          :cover="true"
          @click.native="onPreview(index)"
        />
      </div>
      <span
        v-if="dynamicFollowData.revisitTime"
        class="time"
      >
        回访时间：{{ dynamicFollowData.revisitTime | formatForDay }}
      </span>
    </div>
  </card>
</template>

<script>
import { format, getDay } from 'date-fns';
import { ImgWrap } from '@youzan/vis-ui';
import { isEduSingleStore } from '@youzan/utils-shop';
import Card from 'components/card/index.vue';
import { ImagePreview } from 'vant';

const weekArr = ['日', '一', '二', '三', '四', '五', '六'];

export default {
  name: 'record-detail',
  components: {
    'card': Card,
    'img-wrap': ImgWrap,
  },
  computed: {
    parsedOperatorSchoolName() {
      if (this.dynamicFollowData.operatorSchoolName && !this.isEduSingleStore) {
        return `(${this.dynamicFollowData.operatorSchoolName})`;
      }
      return '';
    },
  },
  data() {
    return {
      dynamicFollowData: {},
      date: '',
      week: '',
      isEduSingleStore,
    };
  },
  created() {
    this.dynamicFollowData = this.$store.getters['clueDetailModule/dynamicFollowData'] || {};
    this.date = format(this.dynamicFollowData.operateTime, 'YYYY-MM-DD');
    this.week = `星期${weekArr[getDay(this.dynamicFollowData.operateTime)]}`;
  },
  methods: {
    onPreview(index) {
      ImagePreview({
        images: this.dynamicFollowData.imageList,
        startPosition: index,
      });
    },
  },
  filters: {
    formatTime(time) {
      return format(time, 'HH:mm');
    },
    formatForDay(time) {
      return format(time, 'YYYY-MM-DD HH:mm:ss');
    },
  },
};
</script>

<style lang="scss" scoped>
.record-detail {
  // padding:  0 15px 0;
  .header {
    padding-top: 15px;
    height: 72px;
    border-bottom: 1px solid #f2f2f2;
    &-container {
      padding: 0 15px;
    }
    .date {
      margin: 0 0 5px;
      line-height: 20px;
      font-size: 14px;
      color: #323233;
    }
    .detail {
      line-height: 20px;
      font-size: 12px;
      color: #646566;
      &>span {
        margin-right: 5px;
      }
    }
  }
  .content {
    padding: 15px 15px 20px;
    .text {
      margin-bottom: 10px;
      line-height: 20px;
      font-size: 13px;
      text-align: justify;
      color: #323233;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .image {
      display: inline-block;
      margin: 0 4px 4px 0;
      border-radius: 4px;
    }
    .time {
      line-height: 25px;
      font-size: 13px;
      color: #969799;
    }
  }
}
</style>
