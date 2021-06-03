<template>
  <div class="column-info">
    <div class="column-info__intro">
      <div class="column-info__intro-left">
        <slot name="pricetag" />
        <h2 class="column-info__title">
          {{ columnData.title }}
          <share-btn v-if="columnData.alias" :url="shareUrl" />
        </h2>
        <div class="column-info__info">
          <div class="column-info__desc">
            <p
              v-if="!isPaid && columnData.subscriptionsCount"
              class="column-info__item"
            >
              <span class="column-info__item-title">
                已学
              </span>
              <span>{{ subscriptionsCount }}人</span>
            </p>
            <p v-if="columnData.author" class="column-info__item">
              <span class="column-info__item-title">
                讲师
              </span>
              <span>{{ columnData.author }}</span>
            </p>
            <p class="column-info__item">
              <span class="column-info__item-title">
                时间
              </span>
              <span>{{ columnDate }}</span>
              <span
                v-if="columnData.isUpdate && columnData.contentsCount"
                class="content-separator"
              />
              <span v-if="columnData.isUpdate && columnData.contentsCount">{{ updateCount }}</span>
            </p>
          </div>
          <div class="column-info__aside">
            <slot name="aside" />
          </div>
        </div>
      </div>
    </div>
    <div class="column-info__groupon">
      <slot name="activityBanner" />
      <slot name="groupon" />
    </div>
  </div>
</template>

<script>

import ShareBtn from '../../../components/ShareBtn';
import formatDate from '@youzan/utils/date/formatDate';
import { formatSalesNum } from 'common/utils/hide-info';

export default {
  name: 'column-info',

  components: {
    ShareBtn,
  },

  props: {
    columnData: Object,
    isPaid: Boolean,
  },

  data() {
    const isPC = window.innerWidth > 600;

    return {
      isPC,
      inviteFriendIcon: 'invite_friend',
    };
  },

  computed: {
    columnDate() {
      const timeStamp = this.columnData.publishAt || '';
      return formatDate(timeStamp, 'YYYY-MM-DD');
    },
    shareUrl() {
      const kdtId = window._global.kdt_id;
      return `/wscvis/ump/invite-card?alias=${this.columnData.alias}&kdt_id=${kdtId}&owlType=1`;
    },
    updateCount() {
      return this.columnData.isUpdate
        ? `已更新${this.columnData.contentsCount}期`
        : `共${this.columnData.contentsCount}期`;
    },
    subscriptionsCount() {
      if (this.columnData.subscriptionsCount) {
        return formatSalesNum(this.columnData.subscriptionsCount);
      }
      return '';
    },
  },

  methods: {
    inviteFriendClick() {
      this.$emit('persentGift');
    },
  },
};
</script>

<style lang="scss">
@import 'var';
@import 'mixins/index.scss';

.column-info {

  .column-info__intro {
    padding: 16px;
    background: $c-white;
    display: flex;
    justify-content: space-between;

    &-left {
      width: 100%;
    }
  }

  .column-info__info {
    position: relative;
    min-height: 24px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .column-info__desc {
    display: flex;
    flex-direction: column;
  }

  .column-info__item {
    padding-bottom: 8px;
    font-size: 12px;
    line-height: 16px;
    &:last-child {
      padding-bottom: 0;
    }
  }

  .column-info__item-title {
    color: #969799;
    padding-right: 16px;
  }

  .column-info__title {
    color: #323233;
    font-size: 18px;
    font-weight: bold;
    line-height: 22px;
    padding: 0 50px 0 16px;
    margin: 0 -16px 16px -16px;
    position: relative;

    /* @include multi-ellipsis(2); */
  }

  .column-info__summary {
    margin-top: 8px;
    color: $c-gray-darker;
    font-size: 14px;
    line-height: 24px;
  }

  .column-info__status {
    margin-top: 10px;
    color: $c-gray-dark;
    font-size: 12px;
    line-height: 17px;
    width: 100%;
  }

  .column-info__sub {
    margin-top: 8px;
    color: $c-gray-dark;
    font-size: 12px;
    line-height: 17px;
    align-self: flex-end;
  }

  .column-info__link {
    display: inline-block;
    margin-top: 10px;
    color: $c-gray-dark;
    font-size: 12px;
    line-height: 16px;

    .svg-icon {
      margin-left: 3px;
      width: 6px;
      height: 8px;
    }
  }

  &__aside {
    position: absolute;
    bottom: 2px;
    right: 0;
  }

  .content-separator {
    border-color: #dcdee0;
    margin: 0 8px;
  }
}
</style>
