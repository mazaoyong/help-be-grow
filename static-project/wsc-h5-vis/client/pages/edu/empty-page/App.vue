<template>
  <div class="vis-no-course">
    <top-bar />
    <div class="top-box">
      <div class="img-box">
        <img
          class="img"
          src="https://b.yzcdn.cn/public_files/2018/11/19/bfc666f3eb05081b88d7353f43e18123.png"
        >
      </div>
      <p class="desc">
        课程已经失效了，看看其他课程吧
      </p>
      <van-button
        v-theme:border-color.main
        v-theme:color.main
        size="small"
        plain
        round
        class="no-course--switch"
        @click="toHomePage"
      >
        查看其他课程
      </van-button>
    </div>
    <recommand-box
      :recommend-goods="list"
    />
  </div>
</template>

<script>
import { Button, Toast } from 'vant';
import { navigateEnv } from 'common/utils/env';
import RecommandBox from '../../trade/paid-status/components/RecommendBox';
import { getRecommendGoods } from '../../trade/paid-status/api';
import TopBar from '../../../components/top-bar/TopBar';

export default {
  name: 'no-course',

  components: {
    'van-button': Button,
    RecommandBox,
    TopBar,
  },

  data() {
    return {
      list: [],
    };
  },

  created() {
    getRecommendGoods()
      .then(res => {
        this.list = res.goodsList;
      })
      .catch(err => Toast.fail(err));
  },

  methods: {
    toHomePage() {
      navigateEnv();
    },
  },
};
</script>

<style lang="scss" scoped>
.vis-no-course {
  width: 100%;
  text-align: center;

  .top-box {
    margin: 40px 0;
  }

  .img-box {
    position: relative;
    width: 100px;
    height: 100px;
    margin: 0 auto;
  }

  .img {
    position: absolute;
    top: 0;
    left: 50%;
    display: block;
    width: 100px;
    height: 100px;
    margin-left: -50%;
  }

  .desc {
    margin: 5px 0 20px;
    font-size: 14px;
    line-height: 20px;
    color: #999;
    text-align: center;
  }

  .no-course--switch {
    border-style: solid;
    border-width: 1px;
  }
}
</style>
