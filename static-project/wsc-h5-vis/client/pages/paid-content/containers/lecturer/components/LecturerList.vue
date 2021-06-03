<template>
  <div class="lecturer-list">
    <div class="lecturer-list__header clearfix">
      <p class="header__title">
        直播讲师
      </p>
      <div class="header__icon-reload-wrap" @click="reload">
        <icon
          :class="['header__icon-reload', {
            'header__icon-reload--reload': loading
          }]"
          symbol="reload"
        />
      </div>
    </div>

    <div class="lecturer-list__content">
      <div
        v-for="(item, index) in list"
        :key="'lecturer' + index"
        :class="['lecturer-list__item', 'clearfix', {
          'lecturer-list__item--no-border': index === list.length - 1
        }]">
        <img class="item__avator" :src="item.wxAvatar">

        <div class="item__user-control clearfix">
          <van-button
            class="item__control-item"
            size="small"
            @click="toEditPage(item)">
            修改
          </van-button>
        </div>

        <div class="item__user-info clearfix">
          <div class="item__user-name">
            <van-tag
              v-if="+item.lectorType === 2"
              class="item__user-name__tag"
              type="danger">
              管理员
            </van-tag>
            <p class="item__user-name__text">
              {{ item.wxNickname }}
            </p>
          </div>
          <p class="item__user-role">
            {{ item.userDesc }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Tag, Button, Field } from 'vant';
import svgIcon from 'components/svg-icon';

export default {

  name: 'lecturer-list',

  components: {
    icon: svgIcon,
    [Tag.name]: Tag,
    [Button.name]: Button,
    [Field.name]: Field,
  },

  props: {
    list: Array,
    title: String,
    loading: Boolean,
    isAdmin: Boolean,
  },

  data() {
    return {
      adminUid: '',
      modifyNameStatus: false,
      modifyIndex: 0,
      modifiedName: '',
      newRole: '',
      modifyDialogVisible: false,
      modifyingLecturer: null,
      // modifyInputErrorVisible: false
    };
  },

  methods: {
    /**
     * 跳转到信息修改页面
     */
    toEditPage(item) {
      const { wxUid = '', buyerUid = '' } = item;
      this.$router.push({
        name: 'LecturerEdit',
        query: {
          reUid: wxUid,
          from: location.href,
          buyerUid,
        },
      });
    },
    reload() {
      this.$emit('reload');
    },
  },
};
</script>

<style lang="scss">
@import 'var';

.lecturer-list {

  &__header {
    box-sizing: border-box;
    height: 40px;
    margin-top: 10px;
    padding-top: 15px;

    .header {
      &__title {
        font-weight: bold;
        font-size: 16px;
        line-height: 22px;
        float: left;
      }

      &__icon-reload-wrap {
        float: right;
        margin-top: 4px;
      }

      &__icon-reload {
        width: 14px;
        height: 14px;
      }

      &__icon-reload--rotate {
        animation: rotate 2s infinite linear;
      }
    }
  }

  &__content {
    overflow: hidden;

    .lecturer-list {

      &__item {
        margin-top: 15px;
        border-bottom: 1px solid #e5e5e5;
        height: 60px;

        &--no-border {
          border-bottom: 1px solid transparent;
        }

        .item {
          &__user-info {
            overflow: hidden;
          }

          &__avator {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            float: left;
            margin-right: 10px;
          }

          &__info {
            float: left;
          }

          &__user-name {
            display: inline-block;
            margin: 2px 0 5px;
            max-width: 100%;
            font-size: 14px;
            line-height: 20px;
            color: #333;

            &__text {
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }

            &__tag {
              float: right;
              margin-left: 2px;
            }
          }

          &__user-role {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            font-size: 12px;
            line-height: 16px;
            color: #999;
          }

          &__user-control {
            float: right;
            margin-top: 8px;
          }

          &__control-item {
            float: left;
            margin-left: 10px;
            min-width: auto;
          }
        }
      }
    }
  }
}

.modify-input {
  line-height: 44px;

  input {
    box-sizing: border-box;
    text-align: center;
    border: 1px solid #bbb;
  }

  &-error {
    text-align: center;
    color: $c-red;
    font-size: 12px;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
