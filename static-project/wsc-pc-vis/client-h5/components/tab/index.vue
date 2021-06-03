<template>
  <ul class="tab f-safeArea">
    <li
      v-for="(icon, index) in iconList"
      :key="index"
      class="tab-item"
      @click="onJump(icon)"
    >
      <vis-icon
        :name="icon.iconName"
        size="24px"
        :color="icon.isActive ? '#00b389' : '#dcdee0'"
      />
      <span
        class="text"
        :class="icon.isActive ? 'text-active': '' "
      >
        {{ icon.text }}
      </span>
    </li>
  </ul>
</template>

<script>
import { Icon } from '@youzan/vis-ui';
import { versionWrapper } from '@/vis-shared/configs/version/fns';
import { checkAccess } from 'utils/permission';

const workTable = {
  name: 'workTable',
  iconName: 'workbench',
  isActive: false,
  text: '工作台'
};
const clueList = {
  name: 'clueList',
  iconName: 'clue',
  isActive: false,
  text: '线索'
};
const lesson = {
  name: 'lesson',
  iconName: 'classschedule',
  isActive: false,
  text: '课表'
};
const userCenter = {
  name: 'userCenter',
  iconName: 'my',
  isActive: false,
  text: '我的'
};

export default {
  name: 'tab',
  components: {
    'vis-icon': Icon
  },
  props: {
    active: {
      type: String,
      default: 'lesson'
    }
  },
  data() {
    return {
      iconList: []
    };
  },
  watch: {
    iconList() {
      const { iconList } = this;
      iconList.map(icon => {
        if (icon.name === this.active) {
          icon.isActive = true;
        }
        return icon;
      });
      return iconList;
    }
  },
  created() {
    this.init(); // 此时需要做的，是根据权限点去展示不同的tab
  },
  methods: {
    init() {
      this.iconList.push(workTable);
      if (checkAccess('线索-我的线索', '查看')) {
        this.iconList.push(clueList);
      }
      if (checkAccess('教务-排课', '查看')) {
        this.iconList.push(lesson);
      }
      this.iconList.push(userCenter);
      this.iconList = versionWrapper('scheduleTab', this.iconList);
    },
    onJump(icon) {
      if (icon.isActive) { // 如果点击了当前状态的，则直接返回
        return;
      }
      icon.isActive = true;
      const JUMP = {
        lesson: '/v4/vis/h5/edu/lesson-list',
        userCenter: '/v4/vis/h5/edu/user-center',
        workTable: '/v4/vis/h5/edu/work-table',
        clueList: '/v4/vis/h5/edu/clue'
      };
      window.location.href = JUMP[icon.name];
    }
  }
};
</script>

<style lang="scss" scoped>
.tab {
  display: flex;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: #fff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, .05);
  &-item {
    position: relative;
    display: block;
    flex: 1;
    text-align: center;
    .vis-icon {
      vertical-align: 0;
    }
    .text {
      position: absolute;
      left: 50%;
      transform: translate(-50%, 0);
      bottom: 5px;
      line-height: 14px;
      font-size: 10px;
      color: #969799;
      &-active {
        color: #00b389;
      }
    }
  }
}
</style>
