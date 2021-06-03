<template>
  <div class="progress-wrap">
    <div class="progress-bg">
      <div class="progress-bar" :style="{width: `${curProgress}%`}" />
    </div>
    <div class="stage-wrap">
      <div
        v-for="(item, index) in stage"
        :key="item[progressKey]"
        class="stage-item"
        :style="{left: `${(index * 100) / (stage.length - 1)}%`}"
      >
        <template v-if="index + 1 === stage.length">
          <img class="highest-reward" src="https://img01.yzcdn.cn/upload_files/2020/11/09/FkzxokzJMBKlqxnITaLf5s7eeanS.png">
        </template>
        <template v-else>
          <div class="dot" :class="{active: curProgress >= index * 100 / (stage.length - 1)}" />
        </template>
        <div v-if="index > 0" class="dot-under">
          {{ item[progressKey] }}人
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    stage: {
      type: Array,
      default: () => ([]),
    },
    curNum: {
      type: Number,
      default: 0,
    },
    progressKey: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      curProgress: 0,
      speed: 5,
    };
  },
  computed: {
    progress: function() {
      const stageList = this.stage.map(item => item[this.progressKey]);
      const stageListLen = stageList.length;
      const curNum = this.curNum;
      // 进度步长不一样
      for (let i = 0; i < stageListLen; i++) {
        if (curNum === 0) {
          return 0;
        }
        if (curNum >= Math.max(...stageList)) {
          return 100;
        }
        if (curNum < stageList[i]) {
          // 当前阶段
          const stagePrecent = (i - 1) * 100 / (stageListLen - 1);
          // 当前阶段步长
          const stageStep = curNum - stageList[i - 1];
          // 当前阶段每段百分比
          const stageStepPercent = (100 / (stageListLen - 1)) / (stageList[i] - stageList[i - 1]);
          return stagePrecent + stageStepPercent * stageStep;
        }
      }
      return 0;
    },
  },
  mounted() {
    this.stepProgress();
  },
  methods: {
    stepProgress() {
      if (this.curProgress < this.progress) {
        setTimeout(() => {
          this.curProgress += this.speed;
          if (this.speed > 0.2) {
            this.speed -= 0.2;
          }
          this.stepProgress();
        }, 0.5);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.progress-wrap {
  position: relative;
  min-height: 35px;
}

.progress-bg {
  position: relative;
  width: 100%;
  height: 6px;
  background-color: #fdddc3;
  border-radius: 3px;
}

.progress-bar {
  position: relative;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #ff5100;
}

.stage-item {
  position: absolute;
  top: 0;
}
// 定制样式
.stage-item:last-of-type {
  transform: translate(-26px, -16px);

  .dot-under {
    margin-top: 0;
  }
}

.highest-reward {
  width: 30px;
}
// 默认stage样式，支持slot自定义
.dot {
  width: 12px;
  height: 12px;
  background: #fdddc3;
  border-radius: 100%;
  // （自身高度 - bar高度）/2
  transform: translate(-1px, -3px);
}

.dot.active {
  background: #ff5100;
}

.dot-under {
  position: absolute;
  left: 50%;
  width: 60px;
  margin-top: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #ff5100;
  text-align: center;
  transform: translateX(-50%);
}
</style>
