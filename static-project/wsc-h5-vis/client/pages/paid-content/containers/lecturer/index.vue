<template>
  <div v-if="true" class="lecturer">
    <entry-detail
      :live-id="liveId"
      :title="liveTitle"
      :alias="liveAlias"
    />
    <lecturer-list
      :list="list"
      :loading="loading"
      :is-admin="isAdmin"
      @reload="getLecturers(true)"
    />

    <!-- 邀请函 -->
    <van-popup
      v-model="inviteCardVisible"
      class="invite-card-popup"
      @click.native="inviteCardVisible = false"
    >
      <invite-card
        ref="card"
        :live-title="liveTitle"
        :admin-name="curAdmin.wxNickname"
        :admin-avatar="curAdmin.wxAvatar"
        :qrcode="qrcode"
      />
    </van-popup>

    <van-button
      class="lecturer__bottom-action"
      :style="{ maxWidth: `${bottomActionMaxWidth}px` }"
      type="primary"
      @click="showInviteCard"
    >
      邀请讲师
    </van-button>
  </div>
</template>

<script>
/**
  路由参数：query: live_id, alias, title, (timestamp)
 */
import apis from 'pct/api';
import { Button, Toast, Popup } from 'vant';
import EntryDetail from './components/EntryDetail.vue';
import LecturerList from './components/LecturerList.vue';
import InviteCard from './components/InviteCard';
import { setShareData } from '@youzan/wxsdk';
import { getPaidContentShareLink } from 'pct/utils/share';
import mixinVisPage from 'common/mixins/mixin-vis-page';
import { redirectToLock } from '../../utils/lock';

export default {
  name: 'lecturer',

  config: {
    title: '邀请直播讲师',
  },

  components: {
    InviteCard,
    EntryDetail,
    LecturerList,
    'van-popup': Popup,
    'van-button': Button,
  },

  mixins: [mixinVisPage],

  data() {
    const isPC = window.innerWidth > 600;

    return {
      fetched: false,
      loading: false,

      liveId: '',
      liveTitle: '',
      liveAlias: '',
      timestamp: '', // 校验时间戳

      isAdmin: false,
      admins: [], // 管理员们
      curAdmin: {},

      qrcode: '', // 关注公众号二维码
      avatar: '', // 当前用户的头像
      fans_id: '', // 当前用户微信 id
      nickname: '', // 当前用户昵称
      uid: '', // 当前用户 userId

      list: [], // 讲师列表

      bottomActionMaxWidth: isPC ? 375 : '',
      inviteCardVisible: false,
    };
  },

  created() {
    // wx.closeWindow 退出前会触发 created
    let isReload = false;
    const deleteFlag = sessionStorage.getItem('pct:live:deleteLector');
    if (deleteFlag) {
      isReload = true;
    }

    this.liveId = this.$route.query.live_id;
    this.liveAlias = this.$route.query.alias;
    this.timestamp = this.$route.query.timestamp;

    this.fans_id = window._global.fans_id;
    this.avatar = window._global.fans_picture;
    this.nickname = window._global.fans_nickname;
    this.uid = window._global.user_id;

    this.getLiveDetail()
      .then(() => this.getLecturers(isReload));

    // this.getLecturerQrcode();
    // Promise.all([
    //   this.getLecturers(),
    //   this.getLecturerQrcode()
    // ]).then(res => {
    //   if (res[0].code !== 0) Toast('讲师列表请求失败');
    //   if (res[1].code !== 0) Toast('邀请二维码请求失败');

    //   if (!res[0].code && !res[1].code) this.$refs.card.drawCard();
    // }).catch(err => {
    //   Toast(`请求数据失败！${err}`);
    // });
  },

  mounted() {
    if (this.$route.query.open_share) this.showInviteCard();
    document.querySelector('.container').style.paddingBottom = '146px';
  },

  destroyed() {
    document.querySelector('.container').style.paddingBottom = '0';
  },

  methods: {
    getLiveDetail() {
      return apis.getLiveDetail({
        alias: this.$route.query.alias,
      }).then(data => {
        this.liveAlias = data.alias;
        _global.verify_weixin_openid = _global.verify_weixin_openid &&
          _global.verify_weixin_openid.replace(this.$route.query.alias, data.alias);
        if (data.isLock) {
          redirectToLock(document.title);
        }
        return this.liveAlias;
      });
    },
    getLecturers(reload = false) {
      this.loading = true;
      const data = {
        alias: this.liveAlias,
      };
      if (!reload) data.timestamp = this.timestamp;
      apis.getLecturerList(data)
        .then(data => {
          const admins = [];
          let isAdmin = false;
          let curAdmin;
          data.lecturers.forEach(item => {
            if (+item.lectorType === 2) {
              admins.push(item);

              const selfBuyerUid = data.targetAlias + _global.buyer_id;
              if (selfBuyerUid === item.buyerUid) {
                isAdmin = true;
                curAdmin = item;
              }
            }
          });
          if (!curAdmin) curAdmin = admins[0] || {};

          this.curAdmin = curAdmin;
          this.admins = admins;
          this.isAdmin = isAdmin;
          this.list = data.lecturers;
          this.liveTitle = data.title;
          this.liveId = data.liveId;

          setShareData({
            notShare: false,
            desc: data.summary,
            link: getPaidContentShareLink(window.location.href, {
              name: 'LiveDetail',
              query: {
                alias: this.liveAlias,
              },
            }),
            title: data.title,
            cover: data.cover,
          });
        })
        .catch(errMsg => {
          Toast(errMsg || `获取讲师列表失败！`);
        })
        .finally(() => {
          this.fetched = true;
          this.loading = false;
        });
    },

    getLecturerQrcode() {
      this.loading = true;
      apis.getLecturerQrcode({
        alias: this.liveAlias,
        live_id: this.liveId,
      })
        .then(data => {
          this.qrcode = data;
          this.inviteCardVisible = true;

          this.$nextTick(() => {
            this.$refs.card.drawCard();
          });
        })
        .catch(errMsg => {
          Toast(errMsg || `获取公众号二维码失败！`);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    showInviteCard() {
      if (!this.isAdmin) {
        Toast(`只有管理员才能够邀请讲师`);
        return;
      }

      this.getLecturerQrcode();
      // this.inviteCardVisible = true;
    },
  },
};
</script>

<style lang="scss">
.lecturer {
  padding: 0 15px;
  overflow: hidden;
  background-color: #fff;

  &__bottom-action {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1001;
    width: calc(100% - 50px);
    border-radius: 2px;
  }

  .invite-card-popup {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    transform: none;
    background: transparent;
  }
}
</style>
