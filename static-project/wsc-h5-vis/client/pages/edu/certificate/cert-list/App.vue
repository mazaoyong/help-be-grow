<template>
  <div class="cert-list--wrap">
    <template v-if="!isLoading">
      <template v-if="drawInfos.length > 0">
        <van-swipe
          ref="swipeBox"
          class="cert-list--swipe-box"
          :loop="false"
          :show-indicators="false"
          :width="getSwipeWidth"
          :initial-swipe="currentIndex"
          @change="onChange"
        >
          <van-swipe-item
            v-for="(item, index) in subItems"
            :key="index"
            :class="getSwipeItemClass(index, subItems)"
          >
            <cert-item :draw-infos="subItems[index]" :style="certItemStyle" />
          </van-swipe-item>
        </van-swipe>
        <div
          :style="{width: `${cardWidth - 14}px`}"
          class="cert-list__share"
        >
          长按保存图片分享至朋友圈
        </div>
      </template>
      <div
        v-else
        :style="`height: ${cardHeight}px`"
      >
        <no-course
          :desc="'很抱歉，你还没有获得证书哦'"
          class="no-cert"
        />
      </div>
    </template>
    <template v-else>
      <div class="loading-wrap">
        <van-loading class="cert-loading" color="white" />
      </div>
    </template>
  </div>
</template>
<script>
import { Swipe, SwipeItem, Toast, Loading } from 'vant';
import NoCourse from '../../components/no-course';
import CertItem from '../../components/cert-item';
import apis from '../../api';

export default {
  name: 'cert-list',

  components: {
    'van-swipe': Swipe,
    'van-swipe-item': SwipeItem,
    'van-loading': Loading,
    NoCourse,
    CertItem,
  },

  props: {
  },

  data() {
    const clientWidth = document.body.clientWidth;
    const clientHeight = document.body.clientHeight;
    return {
      cardHeight: clientHeight - 104,
      cardWidth: clientWidth - 22,
      // 证书信息列表
      drawInfos: [],
      total: 0,
      pageNumber: 1,
      subItems: [],
      currentIndex: 0,
      data: [],
      // 记录当前证书
      currentCert: '',
      isLoading: true,
    };
  },

  computed: {
    certItemStyle() {
      const paddingWidth = 37;
      const ratio = 971 / 611;
      const currentHeight = Math.floor((this.cardWidth - paddingWidth) * ratio);
      return { height: `${currentHeight}px` };
    },
    getSwipeWidth() {
      return document.body.clientWidth - 59;
    },
  },

  created() {
    document.title = '我的证书';

    // 分页默认为50
    apis.findCertificate({
      findType: 1,
      pageSize: 10,
      pageNumber: this.pageNumber,
    })
      .then(data => {
        this.isLoading = false;
        this.drawInfos = data.content;
        this.total = data.total;
        this.subItems = this.drawInfos.slice(0, 2);

        this.updateStatus(this.drawInfos);
      })
      .catch(msg => {
        this.isLoading = false;
        console.log(msg);
        Toast(msg);
      });
  },

  methods: {
    onChange(index) {
      // 倒数第二张卡片请求下一页
      const isLastSecond = index === this.drawInfos.length - 2;
      const fetchNextPage = this.drawInfos.length < this.total;
      if (isLastSecond && fetchNextPage) {
        this.pageNumber = this.pageNumber + 1;
        apis.findCertificate({
          findType: 1,
          pageSize: 10,
          pageNumber: this.pageNumber,
        })
          .then(data => {
            this.isLoading = false;
            this.drawInfos = this.drawInfos.concat(data.content);
            this.total = data.total;
            // 请求分页接口防止this.subItems[index + 1]为空
            this.$set(this.subItems, index + 1, this.drawInfos[index + 1]);
            this.currentIndex = index;

            this.updateStatus(this.drawInfos);
          })
          .catch(msg => {
            this.isLoading = false;
            console.log(msg);
            Toast(msg);
          });
      } else {
        // 非倒数第二张卡片直接加载下一张
        if ((index > this.currentIndex) && (index <= this.total - 2)) {
          this.$set(this.subItems, index + 1, this.drawInfos[index + 1]);
          this.currentIndex = index;
        }
      }
      // 如果是最后一张，需要手动设置最后一张的偏移量
      if (index === this.drawInfos.length - 1) {
        this.$nextTick().then(this.manualSetOffset);
      }
    },
    manualSetOffset() {
      const swipeBox = this.$refs.swipeBox;
      if (swipeBox) {
        const maxOffset = this.getSwipeWidth * (this.drawInfos.length - 1);
        const track = swipeBox.$el.querySelector('.van-swipe__track');
        if (track) {
          track.style.transform = `translateX(-${maxOffset}px)`;
        }
      }
    },
    // 批量更新证书查看状态
    updateStatus(list) {
      let ids = [];
      list.forEach((item, index) => {
        if (item.status === 1) {
          ids.push(item.id);
        }
      });
      console.log('ids:--------', ids);
      if (ids.length > 0) {
        apis.batchUpdateStatus({
          id: ids,
          status: 2,
        })
          .then(data => {
            console.log('修改查看状态：', data);
          })
          .catch(msg => {
            console.log(msg);
          });

        apis.batchUpdatePopStatus({
          certificateIds: ids,
          popStatus: 1,
        })
          .then(data => {
            console.log('修改弹窗状态：', data);
          })
          .catch(msg => {
            console.warn(msg);
          });
      }
    },
    getSwipeItemClass(index, subItems) {
      let className = '';
      if (index === 0) {
        className = 'van-swipe-item-first';
      } else if (index === subItems.length - 1) {
        className = 'van-swipe-item-last';
      }
      return className;
    },
  },
};
</script>
<style lang="scss">
@import 'mixins/index.scss';

.cert-list {
  &--swipe-box {
    padding: 0 30px;
  }

  &--wrap {
  padding-top: 20px;

  .cert-share {
    margin: 0 auto;
    display: block;
    border-radius: 22px;
    background-color: #00b389;
    color: #fff;
    font-size: 16px;
    margin-top: 20px;
  }

  .cert-list__share {
    margin: 0 auto;
    margin-top: 20px;
    font-size: 16px;
    color: #969799;
    height: 44px;
    line-height: 44px;
    text-align: center;
    position: relative;
  }

  .no-cert {
    padding-top: 130px;
  }

  .cert-list__item {
    margin-left: 7px;

    &__img {
      width: 100%;
      height: 100%;
      border-radius: 4px;
    }
  }
}
}

.loading-wrap {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, .5);

  .cert-loading {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
