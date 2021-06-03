<template>
  <div class="lecturer-edit">
    <div class="lecturer-edit__hd">
      <van-uploader :after-read="uploadAvatar" :disabled="loading.avatar">
        <div class="lecturer-edit__avatar-wrap">
          <van-loading
            v-show="loading.avatar"
            class="lecturer-edit__avatar-loading"
            type="spinner"
          />
          <img
            class="lecturer-edit__avatar"
            :src="form.avatar || '//img01.yzcdn.cn/public_files/2018/04/24/defaultAvatar.png'"
            alt=""
          >
        </div>
        <p class="lecturer-edit__text">
          点击修改头像
        </p>
      </van-uploader>
    </div>
    <div class="lecturer-edit__bd">
      <van-cell-group>
        <van-field
          v-model="form.nickname"
          placeholder="请输入讲师昵称"
          clearable
          label="昵称"
        />
        <van-field
          v-if="isAdmin"
          v-model="form.userDesc"
          placeholder="请输入讲师身份"
          clearable
          label="身份"
        />
      </van-cell-group>
    </div>
    <div class="lecturer-edit__ft">
      <van-button
        class="lecturer-edit__btn"
        type="danger"
        size="large"
        :disabled="!canSubmit"
        :loading="loading.submitBtn"
        @click="onSubmit()"
      >
        保存
      </van-button>
      <van-button
        v-if="isAdmin"
        class="lecturer-edit__btn"
        type="danger"
        size="large"
        :loading="loading.removeBtn"
        @click="onOpenRemoveDialog()"
      >
        移除讲师
      </van-button>
    </div>
  </div>
</template>

<script>
import {
  Button,
  Field,
  CellGroup,
  Dialog,
  Uploader,
  Toast,
  Loading,
} from 'vant';
import mixinVisPage from 'common/mixins/mixin-vis-page';
import uploadImg from '@/common-api/img-upload';
import { getGlobalConfig } from '../live-chat/utils/index';
import { ZNB } from '@youzan/wxsdk';
import api from '../../api';

const {
  wxUid,
  liveId,
  alias,
} = getGlobalConfig();

export default {
  name: 'lecturer-edit',

  config: {
    title: '邀请直播讲师',
  },

  components: {
    [Button.name]: Button,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Dialog.name]: Dialog,
    [Uploader.name]: Uploader,
    [Toast.name]: Toast,
    [Loading.name]: Loading,
  },

  mixins: [mixinVisPage],

  data() {
    return {
      form: {
        avatar: '',
        nickname: '',
        userDesc: '',
      },
      loading: {
        avatar: true,
        page: true,
        submitBtn: false,
        removeBtn: false,
      },
    };
  },

  computed: {
    isAdmin() {
      // const { verify_weixin_openid: openId = '' } = window._global;
      // return openId === wxUid; // todo: 这有问题吧？
      return true; // hotfix: 原先 wxuid 取的就是 verify_weixin_openid，所以直接返回 true 先
    },
    reUid() {
      return this.$route.query.reUid;
    },
    from() {
      return this.$route.query.from;
    },
    fansId() {
      return window._global.fans_id || (_global.visBuyer && _global.visBuyer.fansId);
    },
    buyerUid() {
      return this.$route.query.buyerUid;
    },
    canSubmit() {
      const { avatar = '', nickname = '' } = this.form;
      return !(
        avatar.trim() === '' ||
        nickname.trim() === ''
      );
    },
  },

  watch: {
    'form.nickname'(val = '') {
      const MAX = 20;
      if (val.length > MAX) {
        this.form.nickname = val.slice(0, MAX);
      }
    },
    'form.userDesc'(val = '') {
      const MAX = 10;
      if (val.length > MAX) {
        this.form.userDesc = val.slice(0, MAX);
      }
    },
  },

  mounted() {
    this.init();
  },

  methods: {
    /**
     * 页面初始化
     */
    init() {
      this.fetchLecturer();
    },

    /**
     * 获取讲师信息
     */
    fetchLecturer() {
      this.loading.avatar = true;
      api.fetchLecturerInfo({
        wxUid: this.reUid,
        liveId,
        alias,
        buyerUid: this.buyerUid,
      }).then(res => {
        const { data = {} } = res;
        const { wxAvatar, wxNickname, userDesc } = data;
        this.form.avatar = wxAvatar;
        this.form.nickname = wxNickname;
        this.form.userDesc = userDesc;
        this.loading.avatar = false;
      }).catch(() => {
        this.loading.avatar = false;
      });
    },

    /**
     * 保存讲师
     */
    onSubmit() {
      this.loading.submitBtn = true;
      api.updateUserInfo({
        ...this.form,
        liveId,
        wxUid,
        reUid: this.reUid,
        fansId: this.fansId,
        alias,
        buyerUid: this.buyerUid,
      }).then(res => {
        const { code, msg } = res;
        this.loading.submitBtn = false;
        if (code === 0) {
          Toast('更新讲师信息成功');
          this.$router.back();
        } else {
          Toast(msg);
        }
      }).catch(() => {
        this.loading.submitBtn = false;
        Toast('更新讲师信息失败');
      });
    },

    /**
     * 打开移除讲师的确认弹窗
     */
    onOpenRemoveDialog() {
      Dialog.confirm({
        className: 'lecturer-edit__dialog',
        title: '移除后，你将不再是直播间讲师',
        confirmButtonText: '移除',
      }).then(() => {
        this.removeLecturer();
      }).catch(() => { });
    },
    /**
     * 移除讲师
     */
    removeLecturer() {
      api.deleteLecturer({
        live_id: liveId,
        re_wx_uid: this.reUid,
        enable: 2,
        alias,
        buyerUid: this.buyerUid,
      })
        .then(res => {
          if (res.code === 0) {
            if (this.isAdmin && this.reUid === window._global.verify_weixin_openid) {
              sessionStorage.setItem('pct:live:deleteLector', 1);
              ZNB.getWx().then(wx => {
                wx.closeWindow();
              });
            } else {
              this.$router.back();
            }
          } else {
            Toast(`删除讲师失败！${res.msg}`);
          }
        })
        .catch(err => {
          Toast(`删除讲师失败！${err}`);
        });
    },

    /**
     * 上传头像
     */
    uploadAvatar(file) {
      this.loading.avatar = true;
      uploadImg(file.file).then(res => {
        const { attachment_url: thumbUrl } = res.data || {};
        this.form.avatar = thumbUrl;
        this.loading.avatar = false;
      }).catch(() => {
        this.loading.avatar = false;
      });
    },
  },
};
</script>

<style lang="scss"> // eslint-disable-line vue-scoped-css/require-scoped
.lecturer-edit {
  &__hd {
    position: relative;
    display: flex;
    height: 137px;
    background-color: #fff;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }

  &__bd {
    margin-top: 13px;

    .van-cell {
      input {
        color: #666;
      }
    }
  }

  &__ft {
    padding: 20px 25px 0;
  }

  &__btn {
    margin-bottom: 10px;
    border-radius: 2px;

    &:nth-child(2) {
      color: #f44;
      background-color: #fff;
      border: 0;
    }
  }

  &__avatar-wrap {
    position: relative;
  }

  &__avatar {
    width: 60px;
    height: 60px;
    background-color: #eee;
    border-radius: 50%;
    object-fit: cover;
  }

  &__avatar-loading {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 5;
    padding: 15px;
    background-color: rgba(0, 0, 0, .5);
    border-radius: 50%;
  }

  &__text {
    margin-top: 10px;
    font-size: 12px;
  }

  .van-cell {
    padding: 13px 15px;
  }

  .van-uploader {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__dialog {
    .van-dialog__header {
      font-weight: normal;
    }
  }
}
</style>
