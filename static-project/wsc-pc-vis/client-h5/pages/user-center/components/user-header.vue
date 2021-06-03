<template>
  <div class="user-center">
    <div class="bg" />
    <div class="teacher-info">
      <img-wrap
        class="header"
        :width="'60px'"
        :height="'60px'"
        :src="avatar"
        :fullfill="'!120x0.jpg'"
        :cover="true"
        @click.native="changeImg"
      />
      <p class="name">
        <span>{{ teacherName }}</span>
        <van-tag
          v-if="roleName"
          color="#147961"
        >
          {{ roleName }}
        </van-tag>
      </p>
      <p class="mobile">
        {{ mobile }}
      </p>
    </div>
  </div>
</template>

<script>
import { Tag, Toast } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';
import { userCenter } from 'pages-api';
import ChangeImg from '@/vis-shared/components/change-img';

export default {
  name: 'user-center',
  components: {
    'van-tag': Tag,
    'img-wrap': ImgWrap,
  },

  props: {
    icon: {
      type: String,
      default: '',
    },
    teacherName: {
      type: String,
      default: '',
    },
    roleName: {
      type: String,
      default: '',
    },
    mobile: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      avatar: this.icon,
    };
  },

  watch: {
    icon(newValue) {
      this.avatar = newValue;
    },
  },

  methods: {
    changeImg() {
      ChangeImg({
        title: '更换头像',
        tokenUrl: '/v4/vis/h5/edu/commom/material/getQiniuAggregateUploadToken.json',
      })
        .then((res = []) => {
          const imgUrl = (res[0] || {}).url;

          userCenter.PostUpdateTeacherAvatar({
            avatar: imgUrl,
          })
            .then(() => {
              this.avatar = imgUrl;
            })
            .catch(err => {
              Toast(err);
            });
        })
        .catch(res => {
          Toast('图片上传失败');
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.user-center {
  position: relative;
  padding: 30px 15px 25px;
  width: 100%;
  height: 177px;
  border-radius: 4px;
  background: linear-gradient(to right, #01cb9c, #00b389);

  .bg {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 164px;
    height: 125px;
    background-image: url('https://b.yzcdn.cn/public_files/2019/03/15/ec649212309e7e9b68a9825c565a9de4.png');
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: 164px 125px;
  }
  .teacher-info {
    .header {
      border-radius: 30px;
    }
    .name {
      font-size: 20px;
      font-weight: bold;
      color: #fff;
      line-height: 50px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      .van-tag {
        margin: 0 8px;
        height: 18px;
        line-height: 14px;
        font-size: 12px;
      }
      & > span {
        vertical-align: middle;
      }
    }
    .mobile {
      font-size: 13px;
      color: #fff;
      line-height: 1;
    }
  }
}
</style>
