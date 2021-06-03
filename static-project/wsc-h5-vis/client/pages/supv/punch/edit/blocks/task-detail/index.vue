<template>
  <div>
    <div
      v-if="isShowMoreTask"
      class="m-task-more"
    >
      <div class="u-title u-title--more">
        {{ name }}
      </div>
      <div class="u-content">
        <task-content
          :taskContent="taskContent"
        />
      </div>
    </div>
    <div
      v-if="showName"
      class="m-task-simple"
      @click="onToggleMoreTask"
    >
      <div class="u-title">
        {{ name }}
      </div>
      <div class="u-btn u-btn-more">
        {{ isShowMoreTask ? '收起' : '查看' }}全文
      </div>
    </div>
  </div>
</template>

<script>
import TaskContent from '../../../components/task-content';

export default {
  name: 'task-detail',
  components: {
    'task-content': TaskContent,
  },
  props: {
    isShowMoreTask: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: '',
    },
    showName: {
      type: Boolean,
      default: false,
    },
    taskContent: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  methods: {
    onToggleMoreTask() {
      this.$emit('toggleMoreTask');
    },
  },
};
</script>

<style lang="scss" scoped>
/* 任务详情面板 */
.m-mask {
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0);
}
/* 吸顶栏 */
.m-task-simple {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  box-sizing: border-box;
  display: flex;
  padding: 0 20px;
  align-items: center;
  width: 100vw;
  height: 50px;
  line-height: 50px;
  background-color: #FFFFFF;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, .1);
}
.m-task-simple .u-title {
  display: inline-block;
  flex: 1 1 0;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  font-weight: bold;
  color: #222222;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.m-task-simple .u-btn-more {
  flex: 0 0 auto;
  padding: 2px 10px;
  height: 20px;
  line-height: 20px;
  background-color: #00B389;
  border-radius: 100px;
  font-size: 11px;
  color: #FFFFFF;
}
.m-task-simple .u-btn-more .arrow {
  position: relative;
  display: inline-block;
  border-top: 4px solid #fff;
  border-left: 3px solid rgba(255, 255, 255, 0);
  border-right: 3px solid rgba(255, 255, 255, 0);
}
.m-task-simple .u-btn-more .arrow--up {
  top: -2px;
  transform: rotate(180deg);
}
.m-task-simple .u-btn-more .arrow--down {
  top: -1px;
}
.m-task-more {
  box-sizing: border-box;
  margin-bottom: 10px;
  padding: 26px 18px 10px;
  width: 100%;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 2px 15px rgba(0, 0, 0, .14);
}
.m-task-more .u-title {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #333333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.m-task-more .u-content {
  font-size: 14px;
  color: #333333;
  line-height: 24px;
  overflow: auto;
  text-align:justify;
}
</style>
