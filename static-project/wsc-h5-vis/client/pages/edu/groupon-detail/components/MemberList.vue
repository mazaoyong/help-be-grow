<template>
  <div class="group-member-list">
    <div class="group-member-list__title">
      参团好友
    </div>
    <div class="group-member-list__list">
      <van-list
        v-model="loading"
        :finished="finished"
        @load="getMemberList"
      >
        <div
          v-for="(item, index) in list"
          :key="index"
          class="group-member-list__list-item"
        >
          <div class="group-member-list__list-item-avatar">
            <img
              :src="item.fansPicture"
              class="avatar-img"
            >
            <van-tag
              v-if="item.isHead"
              class="head-tag activity-label"
              round
            >
              团长
            </van-tag>
          </div>
          <div class="group-member-list__list-item-name">
            <p class="nick">
              {{ item.fansNickName }}
            </p>
            <p class="invite-text">
              开团时间：{{ item.payTime }}
            </p>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import { List, Tag } from 'vant';
import { getGroupMemberListApi } from '../../../../common-api/activity';

export default {
  name: 'member-list',

  components: {
    [List.name]: List,
    [Tag.name]: Tag,
  },

  props: {
    groupId: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      page: 1,
      pageSize: 10,
      list: [],
      finished: false,
      loading: false,
    };
  },

  mounted() {
    this.getMemberList();
  },

  methods: {
    getMemberList() {
      this.loading = true;
      const params = {
        page: this.page,
        pageSize: this.pageSize,
        groupId: this.groupId,
      };
      getGroupMemberListApi(params)
        .then((res = {}) => {
          const list = (res.data || {}).items;
          const total = (res.data || {}).paginator.totalCount || 0;
          this.list = this.list.concat(list);

          if (this.list.length < total && list.length === this.pageSize) {
            this.finished = false;
            this.page++;
          } else {
            this.finished = true;
          }
        })
        .catch(() => {
          this.finished = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss">
@import "var";
@import 'mixins/index.scss';

.group-member-list {
  padding: 15px;

  &__title {
    line-height: 20px;
    font-size: 14px;
    font-weight: 500;
    color: $c-black;
  }

  &__list {
    &-item {
      position: relative;
      display: flex;
      padding: 13px 0;

      &-avatar {
        position: relative;

        .avatar-img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .head-tag {
          position: absolute;
          top: -3px;
          right: -12px;
          line-height: 1;
        }
      }

      &-name {
        display: inline-flex;
        flex-direction: column;
        justify-content: space-around;
        margin-left: 15px;
        font-size: 12px;
        color: $c-gray-dark;

        .nick {
          font-size: 13px;
          color: $c-black;
        }
      }

      &:after {
        @include border-retina(bottom);

        border-color: #f2f2f2;
      }
    }
  }
}
</style>
