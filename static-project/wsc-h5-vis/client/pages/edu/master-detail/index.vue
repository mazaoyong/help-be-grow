<template>
  <page-container>
    <div class="master-info">
      <div class="avatar-container pos-center">
        <img
          v-if="avatar"
          :src="avatar | formatImage"
          width="70"
          height="70"
        />
      </div>
      <div class="master-info-baseInfo pos-center">
        <div class="master-info-name">{{ masterName }}</div>
        <div v-if="title" class="master-info-title">{{ title }}</div>
      </div>
      <div
        ref="desContainer"
        :class="[
          'master-info-des',
          isOverWrite && isClipDes ? 'master-info-des-clip' : '',
          isShowMaxHeight ? '' : 'master-info-des-maxHeight'
        ]">
          <pre ref="des" class="des">{{ description }}</pre>
        <template v-if="isOverWrite">
          <div
            v-if="isClipDes"
            class="master-info-des-more"
            @click="onToggleMoreOrHide"
          >...更多</div>
          <div
            v-else
            class="master-info-des-hide"
            @click="onToggleMoreOrHide"
          >收起</div>
        </template>
      </div>
    </div>
    <course-list
      v-if="courseList.length > 0"
      :sourceData="courseList"
    />
    <div
      v-if="isPageable"
      class="master-info-load-more"
      @click="onLoadMore"
    >点击加载更多</div>
  </page-container>
</template>
<script>
import { Toast } from 'vant/lib';
import masterDetailStoreModule from '@/store/modules/master-detail';
import { get, fullfillImage } from '@/common/utils';
import CourseList from './components/CourseList.vue';
import PageContainer from '../components/page-container';
import { getEnv } from './utils';

export default {
  name: 'master-detail',

  components: {
    'course-list': CourseList,
    'page-container': PageContainer,
  },

  asyncData({ store, url }) {
    // 注意写法
    return this.methods.dispatch(store, url);
  },

  // 重要信息：当多次访问路由时，
  // 避免在客户端重复注册模块。
  destroyed() {
    this.$store.unregisterModule('masterDetail');
  },

  data() {
    return {
      avatar: null,
      masterName: null,
      title: null,
      description: null,
      isOverWrite: false,
      isClipDes: false,
      courseList: [],
      pageNumber: 1,
      isPageable: false,
      teacherId: null,
      teacherInfo: {},
      courseInfo: {},
      kdtId: 0,
      isShowMaxHeight: false,
      share: {},
    };
  },

  created() {
    this.getState();
  },

  mounted() {
    // 降级处理
    if (!window.__INITIAL_STATE__) {
      this.dispatch(this.$store, location.href).then(() => {
        this.getState();
        this.handleClipDes();
      });
    } else {
      // 客户端的store需要重新注册下module
      this.$store.registerModule('masterDetail', masterDetailStoreModule);
    }
    this.teacherId = get('teacherId', location.href);
    this.kdtId = get('kdt_id', location.href);
    this.handleClipDes();
  },

  methods: {
    dispatch(store, url) {
      const teacherId = get('teacherId', url);
      const kdtId = get('kdt_id', url);
      store.registerModule('masterDetail', masterDetailStoreModule);
      return Promise.all([
        store.dispatch('masterDetail/getTeacherInfo', { teacherId, kdtId }),
        store.dispatch('masterDetail/getCourseList', { teacherId, kdtId, pageNumber: 1 }),
      ]);
    },
    getState() {
      if (this.$store.state.masterDetail) {
        this.teacherInfo = this.$store.state.masterDetail.teacherInfo;
        this.courseInfo = this.$store.state.masterDetail.courseInfo;
        this.parseTeacherInfo();
        this.parseCourseInfo();
      }
    },
    // 处理老师信息
    parseTeacherInfo() {
      const { duty, description, icon, teacherName, staffName } = this.teacherInfo;
      this.avatar = icon;
      this.masterName = teacherName || staffName;
      this.title = duty;
      this.description = description;
      const { setShareData, getShareLink } = this.share;
      this.setShareConfig(setShareData, getShareLink);
    },
    // 处理课程信息
    parseCourseInfo() {
      const { list, pageable } = this.courseInfo;
      this.courseList = this.courseList.concat(list);
      this.isPageable = pageable;
    },
    handleClipDes() {
      if (this.description) {
        this.$nextTick(() => {
          const desContainerHeight = this.$refs.desContainer.offsetHeight;
          const desHeight = this.$refs.des.offsetHeight;
          const isOverWrite = Boolean(desHeight - desContainerHeight);
          this.isOverWrite = isOverWrite;
          this.isClipDes = isOverWrite;
        });
      }
    },
    // 显示更多
    onToggleMoreOrHide() {
      this.isClipDes = !this.isClipDes;
      this.isShowMaxHeight = !this.isShowMaxHeight;
    },
    // 点击加载更多
    onLoadMore() {
      this.pageNumber += 1;
      Toast.loading({
        mask: true,
        message: '加载中',
        duration: 0,
      });
      this.$store.dispatch(
        'masterDetail/getCourseList',
        {
          teacherId: this.teacherId,
          kdtId: this.kdtId,
          pageNumber: this.pageNumber,
        }
      ).then(() => {
        this.courseInfo = Object.assign({}, this.courseInfo, this.$store.state.masterDetail.courseInfo);
        this.parseCourseInfo();
        Toast.clear();
      }).catch(err => {
        Toast.clear();
        Toast(err);
      });
    },
    // 设置分享
    setShareConfig() {
      if (getEnv() === 'client') {
        // wxsdk中有window对象，因此需要在mounted的时候动态引入
        const { initWXSdk, setShareData, getShareLink } = require('@youzan/wxsdk');
        // 初始化微信sdk
        initWXSdk();
        setShareData({
          title: `你的好友将${this.masterName}老师分享给你`,
          desc: this.description || '',
          link: getShareLink(window.location.href),
          cover: this.avatar,
          weappPath: `/packages/edu/webview/index?targetUrl=${encodeURIComponent(window.location.href)}`,
        }).catch(() => {});
      }
    },
  },

  filters: {
    formatImage: function(src, ext) {
      return fullfillImage(src, ext || '!140x140.jpg');
    },
  },
};
</script>
<style lang="scss" scoped>
.master-info {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 10px;
  box-sizing: border-box;
}

.pos-center {
  align-self: center;
}

.avatar-container {
  height: 70px;
  width: 70px;
  border-radius: 50%;
  overflow: hidden;
  margin: 20px 0;
  background-color: #f8f8f9;
}

.master-info-baseInfo {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #969696;
}

.master-info-name {
  font-size: 20px;
  line-height: 24px;
  color: #111;
  margin-bottom: 5px;
  font-weight: 600;
}

.master-info-title {
  font-size: 14px;
  line-height: 18px;
  margin-bottom: 15px;
}

.master-info-des,
.master-info-des-more,
.master-info-des-hide {
  font-size: 13px;
  line-height: 1.5;
}

.master-info-des {
  text-align: center;
  position: relative;
  margin: 0 20px;
  color: #969696;
  width: inherit;
  white-space: normal;
  word-wrap: break-word;
  word-break: break-all;
  .des {
    text-align: left;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.master-info-des-maxHeight {
  max-height: 58px;
  overflow: hidden;
}

.master-info-des-clip {
  height: 58px;
  overflow: hidden;
}

.master-info-des-more {
  position: absolute;
  bottom: 2px;
  right: 0;
  color: #1989fa;
  background-color: #fff;
}

.master-info-des-hide {
  position: relative;
  width: 100%;
  text-align: center;
  color: #1989fa;
}

.master-info-load-more {
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #898989;
  font-size: 14px;
}
</style>
