<template>
  <goods-card :title="title">
    <div class="goods-list">
      <div v-for="item in list" :key="item.alias" class="goods-present">
        <img-wrap
          width="120px"
          height="68px"
          class="goods-img"
          :cover="false"
          fullfill="!100x100.jpg"
          :src="item.imageUrl"
        />
        <div class="goods-info">
          <div class="goods-title">
            {{ item.title }}
          </div>
          <div class="goods-extra">
            {{ item.presentSkuDesc }}
          </div>
        </div>
      </div>
    </div>
    <!-- vant升级2.0之后可用Divider组件 -->
    <div class="divider" />
    <div class="btn-area">
      <van-button
        class="reveive-btn main-btn"
        type="primary"
        size="mini"
        tag="a"
        :href="url"
        round
        @click="handleClick"
      >
        {{ text }}
      </van-button>
    </div>
  </goods-card>
</template>

<script>
import each from 'lodash/each';
import { Button, Toast } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';
import * as SafeLink from '@youzan/safe-link';
import GoodsCard from '../goods-card';

const { kdt_id: kdtId } = _global;

export default {
  name: 'edu-present-card',

  components: {
    [Button.name]: Button,
    [ImgWrap.name]: ImgWrap,
    [GoodsCard.name]: GoodsCard,
  },

  props: {
    type: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  computed: {
    received() {
      let received = false;
      each(this.list, item => {
        // 0：未领取 1：已领取
        if (item.receiveStatus) {
          received = true;
          return false;
        }
      });
      return received;
    },

    url() {
      if (this.received) {
        return `/wscvis/knowledge/index?p=mypay&kdt_id=${kdtId}#/mypay?p=mypay&kdt_id=${kdtId}`;
      }
      return 'javascript:;';
    },

    text() {
      if (this.received) {
        return '查看课程';
      }
      return '立即领取';
    },
  },

  methods: {
    // 跳转到赠品列表
    redirectToPresent() {
      setTimeout(() => {
        SafeLink.redirect({
          url: `/wscump/presents?kdt_id=${_global.kdt_id}`,
          kdtId: _global.kdt_id,
        });
      }, 3000);
    },
    // vant升级2.0之后，可以使用button的to属性
    handleClick() {
      if (!this.received) {
        if (this.type === 'course') { // 线下课跳转到线下课专门的领取页面领取
          this.$router.push({
            name: 'student',
            query: this.$route.query,
          });
        } else if (this.type === 'knowledge') { // 知识付费直接当前页面点击按钮领取
          this.$store.dispatch('receivePresent', {
            data: {},
            success: res => {
              if (res && res.data && res.data.successNum) {
                Toast.success('领取成功');
              } else {
                Toast.success(res.msg || '你来晚了，赠品已经领完了');
              }
              this.redirectToPresent();
            },
            fail: err => {
              Toast.fail(err.msg || '你来晚了，赠品已经领完了');
              if (Number(err.code) === 320500011) {
                this.redirectToPresent();
              }
            },
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "mixins/index.scss";

.goods-list {
  display: flex;
  margin: 0 -12px 12px 0;
  overflow: auto;
}

.goods-present {
  margin-right: 12px;
  width: 120px;

  &:last-child {
    margin-right: 0;
  }
}

.goods-img {
  border-radius: 3px;
  backdrop-filter: blur(0);
}

.goods-info {
  margin-top: 8px;
  font-size: 12px;
  line-height: 16px;
}

.goods-title {
  color: #323233;
  word-break: break-all;
  @include multi-ellipsis(2);
}

.goods-extra {
  color: #969799;
}

.btn-area {
  text-align: right;
}

.btn-area .reveive-btn {
  padding: 0 10px;
  width: auto;

  &::after {
    border: 0 none;
  }
}

.divider {
  display: flex;
  align-items: center;
  margin: 12px 0;
  color: #969799;
  font-size: 14px;
  line-height: 24px;
  border-color: #ebedf0;
  border-style: solid;
  border-width: 0;

  &::before {
    content: '';
    display: block;
    flex: 1;
    box-sizing: border-box;
    height: 1px;
    border-color: inherit;
    border-style: inherit;
    border-width: 1px 0 0;
    transform: scaleY(0.5);
  }
}
</style>
