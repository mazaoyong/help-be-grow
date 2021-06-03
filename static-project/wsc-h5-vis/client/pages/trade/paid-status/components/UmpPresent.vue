<template>
  <div class="ump-present">
    <div class="ump-present__header">
      赠课大礼包
    </div>
    <div class="ump-present__body">
      <div class="ump-present__content">
        <!-- 如果只有一个赠品 -->
        <list-item
          v-if="presentList.length === 1"
          class="ump-present__item"
          :thumbnail-url="presentList[0].pictureUrl"
          :title="presentList[0].goodsName"
          :subtitle="getSku(presentList[0].sku)"
        >
          <div slot="footer-left" class="ump-present__item__price">
            <span v-theme.main>￥0</span>
            <del>￥{{ presentList[0].price / 100 }}</del>
          </div>
        </list-item>
        <!-- 否则展示两个 -->
        <template v-else>
          <div
            v-for="(item, index) in presentList.slice(0, 2)"
            :key="index"
            class="ump-present__item--multi"
          >
            <img-wrap
              class="ump-present__item--multi__thumbnail"
              :src="item.pictureUrl"
              width="112px"
              height="63px"
            />
            <div class="ump-present__item--multi__footer">
              <div class="ump-present__item--multi__price">
                <span v-theme.main>￥0</span>
                <del>￥{{ item.price / 100 }}</del>
              </div>
              <div class="ump-present__item--multi__sku">
                {{ getSku(item.sku) }}
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="ump-present__action">
        <p v-if="unReceivedItemCount > 1" class="ump-present__sum">
          共{{ unReceivedItemCount }}个
        </p>
        <div
          v-if="unReceivedItemCount"
          v-theme.main="'background'"
          class="ump-present__btn-receive"
          @click="gotoPresentList"
        >
          立即领取
        </div>
        <div v-else class="ump-present__received">
          已领取
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as SafeLink from '@youzan/safe-link';
import ListItem from 'components/list-item';
import buildUrl from '@youzan/utils/url/buildUrl';
import Args from '@youzan/utils/url/args';
import { ImgWrap } from '@youzan/vis-ui';
import { logUmpPresent } from '../track';

const orderNo = Args.get('orderNo');

export default {
  name: 'ump-present',

  components: {
    ListItem,
    ImgWrap,
  },

  props: {
    presentInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  computed: {
    unReceivedItemCount() {
      return this.presentList.reduce((count, present) => {
        if (present.receiveStatus) {
          return count;
        }
        return ++count;
      }, 0);
    },

    presentList() {
      return this.presentInfo.data || [];
    },
  },

  methods: {
    getSku(sku = '[]') {
      try {
        const parsedSku = JSON.parse(sku);
        if (parsedSku && parsedSku[0]) {
          return parsedSku[0].v || '';
        }
      } catch (err) {
        console.error(err);
      }

      return '';
    },

    gotoPresentList() {
      logUmpPresent();

      const kdtId = _global.kdtId || _global.kdt_id;

      SafeLink.redirect({
        url: buildUrl(`https://h5.youzan.com/wscvis/ump/receive-present?kdtId=${kdtId}&orderNo=${orderNo}`, 'h5', kdtId),
        kdtId: kdtId,
      });
    },
  },
};
</script>

<style lang="scss">
.ump-present {
  margin: 12px;
  padding: 0 12px 16px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;

  &__header {
    line-height: 44px;
    font-size: 16px;
    font-weight: 500;
    color: #323233;
  }

  &__body {
    display: flex;

    &--points {
      box-sizing: border-box;
      padding: 0 12px;
      height: 84px;
      border-radius: 4px;
    }
  }

  &__content {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    overflow: hidden;

    .item {
      padding: 0;
    }

    &--points {

      p {
        margin-top: 8px;
        line-height: 16px;
        font-size: 12px;

        &:first-child {
          margin-top: 0;
          line-height: 18px;
          font-size: 14px;
        }
      }
    }
  }

  &__action {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  &__btn-receive {
    padding: 0 6px;
    line-height: 22px;
    font-size: 12px;
    color: #fff;
    border-radius: 11px;
  }

  &__received {
    height: 18px;
    font-size: 14px;
    color: #969799;
  }

  &__sum {
    margin-bottom: 4px;
    font-size: 10px;
    color: #646566;
  }

  &__item {
    width: 100%;

    &__price {
      line-height: 14px;
      font-size: 12px;
      font-weight: 500;

      del {
        margin-left: 4px;
        font-size: 10px;
        color: #969799;
      }
    }

    &--multi {
      display: inline-block;
      margin-left: 8px;

      &:first-child {
        margin-left: 0;
      }

      &__thumbnail {
        border-radius: 4px;
      }

      &__footer {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
      }

      &__price {
        line-height: 16px;
        font-size: 12px;

        del {
          margin-left: 4px;
          font-size: 10px;
          color: #969799;
        }
      }

      &__sku {
        line-height: 16px;
        font-size: 12px;
        color: #646566;
      }
    }
  }
}
</style>
