<template>
  <div
    class="si-panel"
    @click="toggleCheck"
  >
    <div
      v-if="showEdit"
      class="si-part icon-left"
      @click.stop="$emit('click-edit', sourceData)"
    >
      <span class="si-edit-icon" />
    </div>
    <div class="si-part expand">
      <div class="si-part-userInfo">
        <span class="si-part-userInfo-name">
          {{ sourceData.name }}，
        </span>
        <span class="si-part-userInfo-phone">
          {{ sourceData.mobile }}
        </span>
      </div>
      <span
        v-if="!infoComplete"
        class="si-part-extra"
      >
        学员信息不全，请补充
      </span>
    </div>
    <div
      v-if="showCheck "
      :style="{
        backgroundColor: infoComplete ? 'transparent' : '#eee'
      }"
      class="si-part icon-right"
    >
      <span
        :class="checked ? 'student-radio-active' : ''"
        class="student-radio"
      >
        <img
          v-if="checked"
          :src="correctImgUrl"
        >
      </span>
    </div>
  </div>
</template>
<script>
/**
 * 带有一个slot插槽，用于展示后续的'信息不全，请补充'的提示
 * 如果有提示，那么组件可以相应点击这个提示的方法clickExtra
 */
import { Toast } from 'vant';
import fullfillImage from 'zan-utils/fullfillImage';

export function checkStudentInfo(customizeItems, currentScene) {
  return customizeItems.every(info => {
    const { applicableScenes = [] } = info;
    if (Array.isArray(applicableScenes) && applicableScenes.length) {
      const senceConf = applicableScenes.find(scene => scene.applicableScene === currentScene) || {};
      if (senceConf.required) {
        return info.value !== '';
      }
    }
    return true;
  });
};

export default {
  name: 'student-item',

  props: {
    showEdit: {
      type: Boolean,
      default: true,
    },
    showCheck: {
      type: Boolean,
      default: false,
    },
    sourceData: Object,
    checked: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      infoComplete: false,
      correctImgUrl: fullfillImage('https://img01.yzcdn.cn/public_files/2018/11/27/ec2af9e485510cd839d7b2d519b3c44c.png', '!30x30.jpg'),
    };
  },

  mounted() {
    const { customizeItems = [] } = this.sourceData;
    const currentScene = 1;
    if (Array.isArray(customizeItems) && customizeItems.length) {
      this.infoComplete = checkStudentInfo(customizeItems, currentScene);
    }
  },

  methods: {
    toggleCheck() {
      if (this.infoComplete) this.$emit('click-check', true, this.sourceData);
      else Toast.fail('请补充该学员信息');
    },
  },
};
</script>
<style lang="scss">
.expand {
  flex: 1;
}

.icon {
  &-left {
    position: relative;
    height: 60px;
    font-size: 14px;
    color: #999;
    border: none;

    .si-edit-icon {
      display: inline-block;
      width: 20px;
      height: 60px;
      background-image: url('https://b.yzcdn.cn/public_files/2018/12/06/12f20e4bb2e43cbb4cdfe520cbf13875.png');
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 12px 12px;
    }
  }

  &-right {
    width: 20px;
    height: 20px;
    margin: 20px;
    border-radius: 20px;

    .student-radio {
      position: absolute;
      top: 50%;
      right: 20px;
      display: block;
      width: 20px;
      height: 20px;
      border: 1px solid #f0f0f0;
      border-radius: 10px;
      transform: translate(0, -50%);
      box-sizing: border-box;

      &-active {
        background-image: url('https://b.yzcdn.cn/public_files/2018/11/27/ec2af9e485510cd839d7b2d519b3c44c.png');
      }

      img {
        display: block;
        width: 18px;
        height: 20px;
      }
    }
  }
}

.si {
  &-panel {
    position: relative;
    display: flex;
    padding: 0 10px;
    background-color: #fff;
  }

  &-part {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    line-height: 1.5;

    &-extra {
      width: 100%;
      padding-left: 25px;
      font-size: 12px;
      color: #f00 !important;
    }

    &-userInfo {
      width: 100%;
      padding-left: 25px;

      &-name {
        color: #111;
      }

      &-phone {
        color: #111;
      }
    }
  }
}
</style>
