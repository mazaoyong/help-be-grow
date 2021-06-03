<template>
  <div class="stu-list--wrap">
    <van-swipe
      :style="{right: isEnd ? '23px' : '0', 'padding-left': isEnd ? '0' : '23px'}"
      v-if="data.length > 0"
      :loop="false"
      :show-indicators="false"
      :width="cardWidth"
      :height="cardHeight"
      @change="onChange"
    >
      <van-swipe-item
        v-for="(item, index) in data"
        :key="index"
      >
        <stu-card :item="item" />
      </van-swipe-item>
    </van-swipe>
    <div
      v-else
      :style="`height: ${cardHeight}px`"
    >
      <no-course
        :desc="'你还没有添加过学员'"
        class="no-stu"
      />
    </div>
    <van-button
      data-href="https://h5.youzan.com/wscvis/edu/student-edit.html?from=studentCert"
      :style="{width: `${cardWidth - 14}px`}"
      @click="onGoStuEdit"
      class="stu-add"
    >
      新增学员
    </van-button>
  </div>
</template>
<script>
import { Swipe, SwipeItem, Button, Toast } from 'vant';
import StuCard from './components/stu-card';
import NoCourse from '../../components/no-course';
import { findByCustomerId } from '../api.js';
import * as SafeLink from '@youzan/safe-link';

const kdtId = _global.kdt_id || 0;

export default {
  name: 'stu-list',

  components: {
    'van-swipe': Swipe,
    'van-swipe-item': SwipeItem,
    'van-button': Button,
    StuCard,
    NoCourse,
  },

  props: {
  },

  data() {
    return {
      cardHeight: window.innerHeight - 104,
      cardWidth: window.innerWidth - 46,
      data: [],
      isEnd: false,
    };
  },

  computed: {
  },

  created() {
    document.title = '学员列表';
    this.fetchData();
  },

  methods: {
    fetchData() {
      findByCustomerId()
        .then(data => {
          this.data = data;
        })
        .catch(msg => {
          Toast(msg);
        });
    },

    onChange(index) {
      this.isEnd = false;
      if (index === this.data.length - 1) {
        this.isEnd = true;
      }
    },

    onGoStuEdit() {
      SafeLink.redirect({
        url: `https://h5.youzan.com/wscvis/edu/student-edit.html?from=studentCert&kdt_id=${kdtId}`,
        kdtId,
      });
    },
  },
};
</script>
<style lang="scss">
.stu-list--wrap {
  padding-top: 20px;

  .van-swipe {
    padding-left: 23px;
  }

  .stu-add {
    margin: 0 auto;
    display: block;
    border-radius: 22px;
    background-color: #00b389;
    color: #fff;
    font-size: 16px;
    margin-top: 20px;
  }

  .no-stu {
    padding-top: 130px;
  }
}
</style>
