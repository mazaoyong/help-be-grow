<template>
  <div>
    <exam-question
      v-if="!isLoading"
      :question-detail="questionDetail.questionList[currentIndex]"
      :question-count="questionDetail.questionCount"
      :current-index="currentIndex"
      :create-audio="createAudio"
      :loading="submitLoading"
      @submit-answer="submitAnswer"
      @answer-info="answerInfo"
      @video-play-count="onVideoPlayCount"
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
import { setShareData } from '@youzan/wxsdk';
import { Toast, Loading } from 'vant';
import { ExamQuestion } from '@youzan/vis-ui';
import { getQuestionListApi, submitAnswerApi } from '../../api';
import audioHelpers from 'common-api/audio';
import * as SafeLink from '@youzan/safe-link';
import { setValidTimer as countVideoPlayed } from 'common/utils/count-played';

const { getAudioInfo } = audioHelpers;

export default {
  name: 'question',

  components: {
    'exam-question': ExamQuestion,
    [Loading.name]: Loading,
  },

  data() {
    return {
      submitLoading: false,
      isLoading: true,
      questionDetail: {
        questionList: [],
      },
      title: '',
    };
  },

  computed: {
    currentIndex() {
      return parseInt(this.$route.params.id) || 0;
    },
  },

  watch: {
    currentIndex() {
      document.title = this.title;
    },
  },

  mounted() {
    // 待优化window中的变量
    this.setPageData();
    // 获取数据源
    this.getQuestionList();
    // 处理答题页路由刷新问题
    if (this.currentIndex !== 0) {
      const { origin, search } = window.location;
      SafeLink.redirect({
        url: `${origin}/wscvis/exam/question/0${search}`,
      });
    }
  },

  methods: {
    setPageData() {
      if (this.currentIndex === 0) {
        window.examId = this.$route.query.examId || 0;
        window.kdtId = this.$route.query.kdtId;
        window.identity = this.$route.query.identity || '';
      }
    },
    // 获取问题列表
    getQuestionList() {
      getQuestionListApi({
        examId: this.$route.query.examId || 0,
        identity: this.$route.query.identity || '',
      })
        .then(res => {
          if (res.data) {
            this.questionDetail = res.data;
            document.title = this.title = res.data.title || '趣味测试';
          }
          this.isLoading = false;
          // 答题页禁用微信分享
          setShareData({
            notShare: true,
          });
        })
        .catch(e => {
          this.isLoading = false;
          Toast(e.msg);
          console.log(e.msg);
        });
    },
    // 传递给音频组件使用
    createAudio(src) {
      return getAudioInfo(src);
    },

    submitAnswer() {
      // 遍历获取所有问题的id和对应选项的id
      const itemIdList = [];
      const questionIdList = [];
      this.questionDetail.questionList.forEach((item, index) => {
        const questionId = item.id;
        const itemList = item.itemList;
        let count = 0;
        itemList.forEach((item, index) => {
          if (item.selected) {
            count++;
            itemIdList.push(item.id);
          }
        });
        count > 0 ? questionIdList.push(questionId) : void 0;
      });
      // 问题id数量和问题总数相同时表示所有题答完
      console.log('questionIdList:', questionIdList.length);
      console.log('questionCount:', this.questionDetail.questionCount);
      if (questionIdList.length === this.questionDetail.questionCount) {
        this.submitLoading = true;
        submitAnswerApi({
          examId: this.$route.query.examId || 0,
          identity: this.$route.query.identity || '',
          itemIdList,
          questionIdList,
        })
          .then(res => {
            this.submitLoading = false;
            const identity = this.$route.query.identity || '';
            if (res.data && res.data.recordDetail) {
              SafeLink.redirect({
                url: `https://h5.youzan.com/wscvis/exam/result?examId=${this.$route.query.examId || 0}&kdtId=${this.$route.query.kdtId}&identity=${identity}`,
                kdtId: this.$route.query.kdtId,
              });
            }
          })
          .catch(e => {
            this.submitLoading = false;
            console.log(e.msg);
            Toast(e.msg);
          });
      } else {
        Toast('您还有题目未选择答案哦!');
      }
    },

    // 处理eventBus传过来的数据源
    answerInfo(ev) {
      // 文字选项-单选
      if (ev.type === 1) {
        this.questionDetail.questionList[this.currentIndex].itemList =
          this.questionDetail.questionList[this.currentIndex].itemList.map((item) => {
            if (item.id === ev.id) return { ...item, selected: true };
            return { ...item, selected: false };
          });
      }
      // 文字选项-多选
      if (ev.type === 2) {
        const ids = ev.id;
        if (ids.length > 0) {
          this.questionDetail.questionList[this.currentIndex].itemList =
            this.questionDetail.questionList[this.currentIndex].itemList.map(item => {
              if (ids.indexOf(item.id) !== -1) return { ...item, selected: true };
              return { ...item, selected: false };
            });
        } else {
          this.questionDetail.questionList[this.currentIndex].itemList =
            this.questionDetail.questionList[this.currentIndex].itemList.map(item => {
              return { ...item, selected: false };
            });
        }
      }
      // 图片选项-多选
      if (ev.type === 3) {
        this.questionDetail.questionList[this.currentIndex].itemList =
          this.questionDetail.questionList[this.currentIndex].itemList.map((item) => {
            if (item.id === ev.id) {
              if (ev.flag) return { ...item, selected: true };
              return { ...item, selected: false };
            }
            return item;
          });
      }
      // 图片选项-单选
      if (ev.type === 4) {
        this.questionDetail.questionList[this.currentIndex].itemList =
          this.questionDetail.questionList[this.currentIndex].itemList.map((item) => {
            if (item.id === ev.id) return { ...item, selected: true };
            return { ...item, selected: false };
          });
      }

      // 5为下一步 || 6为提交答案
      if (ev.type === 5 || ev.type === 6) {
        console.log('下一步');
        const itemList = this.questionDetail.questionList[this.currentIndex].itemList;
        let count = 0;
        itemList.forEach((item, index) => {
          if (item.selected) count++;
        });
        if (count > 0) {
          if (ev.type === 5) {
            console.log('index-examId:', this.$route.query.examId);
            console.log('index-kdtId:', this.$route.query.kdtId);
            this.$router.push({
              path: `/question/${this.currentIndex + 1}`,
              query: {
                examId: this.$route.query.examId || 0,
                kdtId: this.$route.query.kdtId,
                identity: this.$route.query.identity || '',
              },
            });
          }
          if (ev.type === 6) {
            this.submitAnswer();
          }
        } else {
          Toast('您还未选择答案哦!');
        }
      }
    },

    onVideoPlayCount() {
      const question = this.questionDetail.questionList[this.currentIndex] || {};
      const media = question.media || {};
      if (media.video && media.video.videoId) {
        // 统计播放次数
        countVideoPlayed({
          videoId: media.video.videoId,
          channel: 'owl_ump_online_exam',
          component: 'edu_exam_video_player',
        });
      }
    },
  },
};
</script>

<style lang="scss">
body {
  background-color: #fff;
}

.loading-container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, .5);
}

.detail-loading {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
