<template>
  <dynamic-item-container class="dynamic-follow">
    <div class="intro">
      <span class="name">
        {{ operatorName }}
        {{ parsedOperatorSchoolName }}
      </span>
      <span class="action">添加跟进记录</span>
      <span class="time">{{ operateTime | formatTime }}</span>
      <a
        class="edit"
        href="javascript: void(0);"
        @click="onEdit"
      >
        编辑
      </a>
      <a
        class="more"
        href="javascript: void(0);"
        @click="onWatchMore"
      >
        更多
      </a>
    </div>
    <div class="content">
      <pre class="text">{{ recordText }}</pre>
      <div class="image-box">
        <img-wrap
          v-for="(image, index) in imageList"
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
        v-if="revisitTime"
        class="time"
      >
        回访时间：{{ revisitTime | formatForDay }}
      </span>
    </div>
  </dynamic-item-container>
</template>

<script>
import { format } from 'date-fns';
import { ImgWrap } from '@youzan/vis-ui';
import { isEduSingleStore } from '@youzan/utils-shop';
import dynamicItemContainer from './dynamic-item-container.vue';
import { ImagePreview } from 'vant';
import router from '../router.js';

export default {
  name: 'dynamic-follow',
  components: {
    'img-wrap': ImgWrap,
    'dynamic-item-container': dynamicItemContainer,
  },
  props: {
    clueId: {
      type: Number,
      default: 0,
    },
    recordId: {
      type: Number,
      default: 0,
    },
    operatorName: {
      type: String,
      default: '',
    },
    operateTime: {
      type: Number,
      default: 0,
    },
    operatorSchoolName: {
      type: String,
      default: '',
    },
    recordText: {
      type: String,
      default: '',
    },
    imageList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    revisitTime: {
      type: [Number, Boolean],
      default: null,
    },
  },
  computed: {
    parsedOperatorSchoolName() {
      if (this.operatorSchoolName && !this.isEduSingleStore) {
        return `(${this.operatorSchoolName})`;
      }
      return '';
    },
  },
  data() {
    return {
      isEduSingleStore,
    };
  },
  methods: {
    onEdit() {
      this.$store.dispatch('clueDetailModule/updateDynamicFollowData', {
        operatorName: this.operatorName,
        operateTime: this.operateTime,
        operatorSchoolName: this.operatorSchoolName,
        recordText: this.recordText,
        imageList: this.imageList,
        revisitTime: this.revisitTime,
      });
      router.push({ name: 'update-dynamic', query: { type: 'edit', clueId: this.clueId, recordId: this.recordId } });
    },
    onWatchMore() {
      this.$store.dispatch('clueDetailModule/updateDynamicFollowData', {
        operatorName: this.operatorName,
        operateTime: this.operateTime,
        operatorSchoolName: this.operatorSchoolName,
        recordText: this.recordText,
        imageList: this.imageList,
        revisitTime: this.revisitTime,
      });
      router.push({ name: 'record-detail', query: { clueId: this.clueId } });
    },
    onPreview(index) {
      ImagePreview({
        images: this.imageList,
        startPosition: index,
      });
    },
  },
  filters: {
    formatTime(time) {
      return format(time, 'HH:mm:ss');
    },
    formatForDay(time) {
      return format(time, 'YYYY-MM-DD HH:mm:ss');
    },
  },
};
</script>

<style lang="scss" scoped>
.dynamic-follow {
  .intro {
    position: relative;
    // height: 18px;
    line-height: 25px;
    font-size: 13px;
    color: #646566;
    .name, .action {
      margin-right: 10px;
    }
    .name {
      display: block;
    }
    .edit {
      position: absolute;
      top: 0;
      right: 46px;
    }
    .more {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  .content {
    padding: 15px 0 20px;
    .text {
      margin-bottom: 10px;
      line-height: 20px;
      font-size: 13px;
      text-align: justify;
      color: #323233;
      white-space: pre-wrap;
      word-wrap: break-word;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
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
