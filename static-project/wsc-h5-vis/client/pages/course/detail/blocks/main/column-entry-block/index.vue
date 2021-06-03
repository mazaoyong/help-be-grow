<template>
  <div class="colum-entry-block">
    <a
      v-if="show"
      v-log="['click_to_column', '查看专栏']"
      :href="url"
      class="column-entry-link"
    >
      <img-wrap
        class="cover"
        :src="column.cover"
        :cover="false"
        fullfill="!160x0q75.png"
        width="80px"
        height="46px"
      />
      <main>
        <p class="title">
          <span>
            {{ column.title }}
          </span>
          <van-icon
            class="arrow"
            name="arrow"
            size="14px"
          />
        </p>
        <div class="desc">
          <span v-if="column.contentsCount" class="desc-item">
            已更新{{ column.contentsCount }}期
          </span>
          <span v-if="column.sales" class="desc-item">
            {{ column.sales }}人{{ env.isIOSWeapp ? '订阅提示' : '已购' }}
          </span>
        </div>
      </main>
    </a>
    <column-catalogue v-if="showColumn && columnPaid" />
  </div>
</template>

<script>
import { Icon } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';
import ColumnCatalogue from './column-catalogue';
import { getIsPaid } from './api';

export default {
  components: {
    'van-icon': Icon,
    ImgWrap,
    ColumnCatalogue,
  },
  data() {
    return {
      columnPaid: false,
    };
  },
  rootState: ['goodsData', 'kdtId', 'env'],
  rootGetters: ['isContent'],
  computed: {
    column() {
      return this.goodsData.column || {};
    },

    showColumn() {
      // TODO 知识付费没有全量上线，这里暂时屏蔽直播，等内容专栏上线之后可以放开
      return this.isContent;
    },

    url() {
      return `/wscvis/course/detail/${this.column.alias}?kdt_id=${this.kdtId}`;
    },

    show() {
      return Boolean(this.column.alias);
    },
  },
  created() {
    if (this.goodsData.column && this.goodsData.column.alias) {
      getIsPaid(this.goodsData.column.alias).then(res => {
        this.columnPaid = res;
      });
    }
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.colum-entry-block {
  display: flex;
  margin-bottom: 8px;
  background-color: $white;
  align-items: center;
}

.column-entry-link {
  display: flex;
  padding: 12px;
  overflow: hidden;
  box-sizing: border-box;
  align-items: center;
  flex: 1 1 auto;

  .cover {
    margin-right: 10px;
    border-radius: 4px;
  }

  main {
    overflow: hidden;
    flex: 1 1 0;
  }

  .title {
    display: flex;
    font-size: 14px;
    font-weight: bold;
    line-height: 20px;
    color: $main-text-color;
    align-items: center;

    span {
      @include ellipsis;
    }
  }

  .desc {
    margin-top: 8px;
    font-size: 12px;
    line-height: 16px;
    color: $disabled-color;

    .desc-item {
      padding-left: 4px;
      margin-left: 4px;
      border-left: 1px solid $disabled-color;

      &:first-child {
        padding-left: 0;
        margin-left: 0;
        border-left: 0 none;
      }
    }
  }
}

.column-catalogue {
  flex: 0 0 auto;
  padding: 0 16px;
  border-left: 2px solid #f2f3f5;
}
</style>

<style>
.column-catalogue .catalogue-label {
  white-space: nowrap;
}
</style>
