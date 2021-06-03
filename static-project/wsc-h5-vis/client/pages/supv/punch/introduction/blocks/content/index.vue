<template>
  <div class="m-intro-content">
    <div class="m-statistics">
      <span class="u-people">
        <span>{{ joinPersonNum }}</span>人参加
      </span>
      <span class="u-point">·</span>
      <span class="u-num">
        <span v-if="proceedStatusText !== '未开始'">{{ gciTimes }}</span>{{ gciTimesText }}
      </span>
      <!-- wx.getSystemInfoSync().screenWidth < 375 展示4个, -->
      <div class="u-img-list">
        <img-wrap
          v-for="(item, index) in avatars"
          :key="index"
          class="u-img-item"
          :src="item"
        />
      </div>
    </div>
    <div v-if="reward" class="m-reward">
      <div class="u-desc">
        {{ reward }}
      </div>
      <div class="u-condition">
        {{ punchText }}满{{ condition }}天即可获得
      </div>
    </div>
    <div class="m-text">
      <div class="u-title">
        {{ punchText }}介绍
      </div>
      <div class="u-content">
        <task-content
          :task-content="description"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TaskContent from '../../../components/task-content';
import { ImgWrap } from '@youzan/vis-ui';

export default {
  name: 'vis-content',
  components: {
    'task-content': TaskContent,
    'img-wrap': ImgWrap,
  },
  props: {
    joinPersonNum: {
      type: Number,
      default: 0,
    },
    proceedStatusText: {
      type: String,
      default: '',
    },
    avatars: {
      type: Array,
      default: () => {
        return [];
      },
    },
    reward: {
      type: String,
      default: '',
    },
    punchText: {
      type: String,
      default: '',
    },
    gciTimes: {
      type: [String, Number],
      default: '',
    },
    gciTimesText: {
      type: String,
      default: '',
    },
    condition: {
      type: [String, Number],
      default: '',
    },
    description: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.m-intro-content {
  position: relative;
  z-index: 3;
  padding: 18px 20px;
  margin-top: -10px;
  background-color: #fff;
  border-radius: 12px 12px 0 0;
  box-sizing: border-box;
}

.m-statistics {
  width: 100%;
  margin: 0 0 26px 0;
}

.m-statistics .u-point {
  display: inline-block;
  margin: 0 5px;
  font-size: 14px;
  line-height: 20px;
  color: #333;
}

.m-statistics .u-people,
.m-statistics .u-num {
  display: inline-block;
  font-size: 14px;
  line-height: 20px;
  color: #333;
}

.m-statistics .u-people span,
.m-statistics .u-num span {
  font-weight: 700;
}

.m-statistics .u-img-list {
  float: right;
}

.m-reward {
  position: relative;
  // width: 340px;
  height: 113px;
  margin-bottom: 40px;
  background: #fff;
  background-image: url('https://img01.yzcdn.cn/punch/image/reward@2x.png');
  background-repeat: no-repeat;
  background-size: contain;
  border-radius: 6px;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, .1);
}

.m-reward .u-desc {
  position: absolute;
  top: 53px;
  left: 21px;
  font-size: 14px;
  font-weight: bold;
  line-height: 17px;
  color: #222;
}

.m-reward .u-condition {
  position: absolute;
  top: 77px;
  left: 21px;
  display: inline-block;
  height: 16px;
  padding: 0 9px;
  font-size: 10px;
  line-height: 16px;
  color: #fff;
  background-color: #00b389;
  border-radius: 100px;
}

.m-text .u-title {
  margin-bottom: 8px;
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.m-text .u-content {
  font-size: 14px;
  line-height: 24px;
  color: #333;
  text-align: justify;
  -webkit-text-align-last: justify;/* chrome 20+ */
}
</style>

<style>
.u-img-list .u-img-item {
  display: inline-block;
}

.u-img-list .imgWrap__img {
  width: 20px;
  height: 20px;
  margin: 1px;
  border-radius: 10px;
}
</style>
