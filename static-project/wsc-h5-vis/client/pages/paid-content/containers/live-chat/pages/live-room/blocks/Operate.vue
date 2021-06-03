<template>
  <van-popup
    v-model="displayValue"
    position="bottom"
    class="operate-container"
    :style="{
      height: isLecturer ? 390 : 340 + 'px'
    }"
  >
    <div class="operate-container__header">
      <p>操作</p>
      <van-icon
        class="operate-container__header-close-icon"
        name="close"
        @click="closePopup"
      />
    </div>

    <div class="operate-container__content">
      <van-cell-group
        v-if="isAdmin"
        :border="false"
        class="operate-container__content-block"
      >
        <van-cell
          class="operate-container__lecturer-info"
          title="个人信息"
          :border="false"
          is-link
          @click="toEditPage()"
        >
          <template slot="title">
            <span class="custom-text">个人信息</span>
            <span><img :src="avatar" alt=""></span>
          </template>
        </van-cell>
      </van-cell-group>
      <van-cell-group
        :border="false"
        class="operate-container__content-block"
      >
        <van-cell
          title="邀请好友看直播"
          :border="false"
          is-link
          @click="inviteFriend"
        />
        <van-cell
          v-if="isLecturer"
          title="学员禁言模式"
          :border="false"
        >
          <van-switch
            v-model="checked"
            size="20px"
            @change="handleMute"
          />
        </van-cell>
        <van-cell
          title="收藏"
          :border="false"
          is-link
          @click="collectRoom"
        />
      </van-cell-group>
      <van-cell-group
        :border="false"
        class="operate-container__content-block"
      >
        <van-cell
          title="店铺首页"
          is-link
          :border="false"
          @click="onNavigateToHome"
        />
        <van-cell
          title="直播简介"
          is-link
          :border="false"
          :url="detailUrl"
        />
      </van-cell-group>
      <div
        v-if="isLecturer"
        class="operate-container__content-block operate-container__content-block-close"
        @click="endRoom"
      >
        结束直播
      </div>
      <div
        v-else
        :class="['operate-container__content-block',
                 'operate-container__content-block-close',
                 'operate-container__content-block-close--student']"
        @click="refreshRoom"
      >
        刷新
      </div>
    </div>
  </van-popup>
</template>

<script>
import { Popup, Icon, Cell, CellGroup, Switch, Dialog } from 'vant';
import { navigateEnv } from 'common/utils/env';

import popupMixins from '../../../mixins/popup';
import { getGlobalConfig, reload } from '../../../utils/index';

const {
  isLiveRoomForbid,
  kdtId,
  alias,
  wxUid,
  avatar,
  lecturerType,
} = getGlobalConfig();

export default {
  name: 'operate',

  components: {
    [Popup.name]: Popup,
    [Icon.name]: Icon,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Switch.name]: Switch,
  },

  mixins: [popupMixins],

  props: {
    type: {
      type: [Number, String],
      default: 1,
      validator(value) {
        return [1, 2].indexOf(+value) > -1;
      },
    },
    isMute: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      checked: isLiveRoomForbid,
      homePageUrl: `${window._global.wap_url.wap}/showcase/homepage?kdt_id=${kdtId}`,
      detailUrl: `${window._global.url.h5}/wscvis/knowledge/index?page=livedetail&alias=${alias}&kdt_id=${kdtId}&sg=live#/livedetail?alias=${alias}`,
    };
  },
  computed: {
    isAdmin() {
      return +lecturerType === 2;
    },
    isLecturer() {
      return this.type === 1;
    },
    avatar() {
      return avatar || '//img01.yzcdn.cn/public_files/2018/04/24/defaultAvatar.png';
    },
  },

  watch: {
    isMute(newValue) {
      this.checked = newValue;
    },
  },

  methods: {
    inviteFriend() {
      this.closePopup();
      this.$emit('invite-friend');
    },
    collectRoom() {
      this.closePopup();
      this.$emit('collect-room');
    },
    handleMute(e) {
      if (e) {
        Dialog.confirm({
          title: '开启禁言模式？',
          message: '禁言后学员将不能发送消息或提问',
          confirmButtonText: '开启禁言',
        })
          .then(() => {
            this.$emit('trigger-mute', e);
          })
          .catch(() => {
            // 取消禁言
            this.checked = false;
          });
      } else {
        this.$emit('trigger-mute', e);
      }
    },
    endRoom() {
      this.closePopup();
      this.$emit('end-room');
    },
    refreshRoom() {
      reload();
    },
    toEditPage() {
      this.$router.push({
        name: 'LecturerEdit',
        query: {
          reUid: wxUid,
          from: location.href,
          buyerUid: `${alias}${_global.visBuyer.buyerId}`,
        },
      });
    },
    onNavigateToHome() {
      navigateEnv();
    },
  },
};
</script>

<style lang="scss">
  .operate-container {
    background-color: #f2f2f2;

    &__header {
      position: relative;
      height: 50px;
      margin-bottom: 10px;
      font-size: 15px;
      line-height: 50px;
      text-align: center;
      background-color: #fff;
    }

    &__header-close-icon {
      position: absolute;
      top: 17px;
      right: 20px;
      font-size: 17px;
      color: #999;
    }

    &__content-block {
      margin-bottom: 10px;

      .van-cell {
        padding: 13px 15px;
      }
    }

    &__content-block-close {
      font-size: 14px;
      line-height: 50px;
      color: #ff2538;
      text-align: center;
      background-color: #fff;

      &--student {
        color: #4b0;
      }
    }

    &__lecturer-info {
      display: flex;
      align-items: center;
      padding: 10px 15px !important;

      .van-cell__title {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      img {
        display: block;
        width: 30px;
        height: 30px;
        background-color: #eee;
        border-radius: 50%;
        object-fit: cover;
      }
    }
  }

</style>
