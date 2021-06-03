<template>
  <div>
    <vis-exam-detail
      v-if="!isLoading"
      class="exam-detail"
      :exam-detail="examDetail"
      :loading="showLoading"
      @joinexam="onExamCheck"
    />
    <div v-else class="loading-container">
      <van-loading
        type="spinner"
        class="detail-loading"
        color="white"
      />
    </div>
  </div>
</template>

<script>
import { setShareData, getShareLink } from '@youzan/wxsdk';
import { Toast, Loading } from 'vant';
import { ExamDetail } from '@youzan/vis-ui';
import { getExamDetailApi, joinExamApi } from '../../api';
import * as SafeLink from '@youzan/safe-link';

/** 店铺类型
 * isEduSingleStore: 店铺角色是否为教育单店
 * isEduHqStore: 店铺角色是否为教育总部
 * isEduBranchStore: 店铺角色是否为教育分店
 * isEduChainStore: 店铺角色是否为教育连锁店铺
 */
import { isEduHqStore } from '@youzan/utils-shop';

export default {
  name: 'exam-detail',

  components: {
    'vis-exam-detail': ExamDetail,
    'van-loading': Loading,
  },

  data() {
    return {
      showLoading: false,
      isLoading: true,
      examDetail: {
      },
    };
  },

  mounted() {
    this.getExamDetail();
  },

  methods: {
    // 获取测试详情
    getExamDetail() {
      getExamDetailApi({
        id: this.$route.query.examId || 0,
        identity: this.$route.query.identity || '',
      })
        .then(res => {
          if (res.data) {
            this.examDetail = res.data;
            this.isLoading = false;
            // 微信分享
            if (res.data.exam) {
              const coverPicUrl = res.data.exam.coverPic.url || 'https://img01.yzcdn.cn/public_files/2019/01/02/b05d7b0a659c523a686aff45fa0de316.png';
              const examTitle = res.data.exam.title || '';
              const joinUserCount = res.data.exam.joinUserCount;
              // 分享的url，总部预览时分享总部的预览连接，校区及单店分享正式推广连接
              const shareUrl = this.$route.query.identity && isEduHqStore ? `https://h5.youzan.com/wscvis/exam/detail?examId=${this.$route.query.examId || 0}&kdtId=${window._global.kdt_id}&identity=${this.$route.query.identity}` : `https://h5.youzan.com/wscvis/exam/detail?examId=${this.$route.query.examId || 0}&kdtId=${window._global.kdt_id}`;
              setShareData({
                title: `快来一起参加${examTitle}的在线小测试吧`,
                timeline_title: `快来一起参加${examTitle}的在线小测试吧`,
                desc: `${joinUserCount}人已参与`,
                link: getShareLink(shareUrl),
                cover: coverPicUrl,
              });
            }
          }
        })
        .catch(e => {
          this.isLoading = false;
          Toast(e.msg);
          console.log(e.msg);
        });
    },

    // 参与测试
    onExamCheck() {
      this.showLoading = true;
      // 标识是否是预览状态
      const identity = this.$route.query.identity || '';

      joinExamApi({
        examId: this.$route.query.examId || 0,
        identity,
      })
        .then(res => {
          this.showLoading = false;
          res.code === 0 ? SafeLink.redirect({
            url: `https://h5.youzan.com/wscvis/exam/question/0?examId=${this.$route.query.examId || 0}&kdtId=${this.$route.query.kdtId}&identity=${identity}`,
            kdtId: this.$route.query.kdtId,
          }) : void 0;
        })
        .catch(e => {
          this.showLoading = false;
          console.log(e.msg);
          Toast(e.msg);
        });
    },
  },
};
</script>

<style lang="scss">
.exam-detail {
  .live-detail-header {
    padding: 15px 20px;
    margin-bottom: 0;

    &__status,
    &__lecturer {
      margin-top: 10px;
    }
  }
}
</style>
