<template>
  <info-block
    v-if="directoryList.length"
    v-tab="{ index: 3, title: '课程目录' }"
    title="课程目录"
    class="directory-list-block"
  >
    <div class="directory-list">
      <van-collapse v-model="active" :border="false">
        <van-collapse-item
          v-for="directory in directoryList"
          :key="directory.serialNo"
          :name="directory.serialNo"
          :is-link="!!directory.sectionList.length"
          :border="false"
          class="directory-item"
        >
          <span slot="title" class="directory-title">
            <span class="number">
              {{ getNumStr(directory.serialNo) }}
            </span>
            <span class="text">
              {{ directory.title }}
            </span>
          </span>
          <ul v-if="directory.sectionList.length">
            <li
              v-for="section in directory.sectionList"
              :key="section.serialNo"
              class="section-item"
            >
              {{ section.title }}
            </li>
          </ul>
        </van-collapse-item>
      </van-collapse>
    </div>
  </info-block>
</template>

<script>
import { map } from 'lodash';
import { Collapse, CollapseItem } from 'vant';
import InfoBlock from '@/pages/course/detail/components/info-block';

export default {
  components: {
    'van-collapse': Collapse,
    'van-collapse-item': CollapseItem,
    InfoBlock,
  },

  data() {
    return {
      active: [],
    };
  },

  rootState: ['goodsData'],

  computed: {
    directoryList() {
      return this.goodsData.directoryList;
    },
  },

  created() {
    this.active = map(this.directoryList, directory => directory.serialNo);
  },

  methods: {
    getNumStr(num) {
      return num > 9 ? num + 1 : `0${num + 1}`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.directory-list-block {
  margin-bottom: 8px;
}

.directory-list {
  padding-bottom: 12px;

  .directory-item {
    &::after {
      border: 0 none;
    }
  }

  ::v-deep .van-collapse-item__content {
    padding: 0 16px;
  }
}

.directory-title {
  font-size: 14px;
  line-height: 14px;
  color: $main-text-color;

  .number {
    display: inline-block;
    padding-right: 4px;
    margin-right: 4px;
    border-right: 1px solid #dcdee0;
  }

  .text {
    display: inline-block;
  }
}

.section-item {
  position: relative;
  padding: 12px 10px;
  font-size: 13px;
  line-height: 17px;
  color: $vice-text-color;
  background-color: #f4f8fa;

  &:first-child {
    border-radius: 4px 4px 0 0;
  }

  &:last-child {
    border-radius: 0 0 4px 4px;
  }

  &::after {
    @include border-retina(bottom, $light-border-color);
  }

  &:last-child::after {
    @include border-retina(bottom, transparent);
  }
}
</style>
