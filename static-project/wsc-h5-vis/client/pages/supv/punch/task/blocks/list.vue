<template>
  <div class="punch-list-list">
    <template v-if="isCompleted || allowStudentView">
      <template v-if="diaryList.length > 0">
        <div class="punch-list-list__header">
          <span style="font-weight: bold;">{{ dayText }}打卡{{ total || 0 }}人</span>
          <!-- 排序? -->
        </div>
        <van-list
          v-model="loading"
          offset="200"
          :finished="finished"
          finished-text="没有更多了"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
          @load="onLoad"
        >
          <punch-card
            v-for="diary in diaryList"
            :key="diary.id"
            :gci-id="diary.gciId"
            :avatar="diary.userData.avatar"
            :nick-name="diary.userData.nickname"
            :allow-edit="allowStudentEdit && isSelfEdit(diary.userData)"
            :show-share="isSelfEdit(diary.userData)"
            :description="getClockInTimesText(diary.userData.clockInTimes)"
            :is-hand-pick="diary.contentData.isHandPicker"
            :max-content-line="7"
            :content="diary.contentData.plainText"
            :images="diary.contentData.images"
            :audio="diary.contentData.audio"
            :created-at="diary.contentData.createdAt"
            :has-like="diary.commentData.hasLike"
            :like-list="diary.commentData.like"
            :comment-number="diary.commentData.commentNumber"
            :comment-list="diary.commentData.commentList"
            @click-content="handleClickContent(diary)"
            @modify-it="handleEditPunchTask"
            @like-it="handleLike(diary)"
            @comment-it="onShowComment($event, diary)"
            @show-share="onShowShare"
          />
        </van-list>
      </template>
      <div v-else class="punch-list-list__empty">
        <img :src="NO_PUNCH" alt>
        <span>还没有人打卡</span>
      </div>
    </template>
    <div v-else class="punch-list-list__empty">
      <img :src="NO_PUNCH" alt>
      <span>打卡后可查看全部学员打卡内容</span>
    </div>

    <comment-popup v-model="showCommentPopup" :reply-to="replyTo" @submit="onSubmitComment" />
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { get } from 'lodash';
import getFullfillImage from '@youzan/utils/fullfillImage';
import mixinCommentPopup from 'supv/punch/mixins/mixin-comment-popup';
import { isSameDay } from 'date-fns';
import * as SafeLink from '@youzan/safe-link';
import buildUrl from '@youzan/utils/url/buildUrl';
import { List } from 'vant';

import PunchCard from '../../components/punch-card';

const NO_PUNCH = getFullfillImage(
  'https://b.yzcdn.cn/cdn/no-punch.png',
  '!100x100.png',
);

export default {
  name: 'punch-list-list',
  components: {
    'punch-card': PunchCard,
    'van-list': List,
  },

  mixins: [mixinCommentPopup],

  data() {
    return {
      NO_PUNCH,
      loading: false,
      error: false,
    };
  },

  computed: {
    dayText() {
      const now = new Date();
      return isSameDay(now, this.chooseDate) ? '今天' : '当天';
    },
    finished() {
      const diarySize = this.diaryList.length;
      return diarySize >= this.total;
    },
    ...mapState({
      allowStudentEdit: state => state.allowStudentEdit || false,
      allowStudentView: state => state.allowStudentView,
      chooseDate: state => state.calendar.chooseDate,
      isCompleted: state => state.task.config.isCompleted,
      total: state => state.pageInfo.total,
      taskConfig: state => state.task.config,
    }),
    ...mapGetters({
      diaryList: 'getDiaryListWithMyDiary',
      getPunchTaskParams: 'getPunchTaskParams',
      getModifyDiaryParams: 'getModifyDiaryParams',
      myDiaryLogId: 'getMyDiaryLogId',
    }),
  },

  methods: {
    isSelfEdit(userData) {
      const userDataFansId = get(userData, 'fansId');
      const globalFansId = this.myDiaryLogId;
      return userDataFansId === globalFansId;
    },
    getClockInTimesText(clockInTimes) {
      if (Number(clockInTimes) > 0) {
        return `已打卡${clockInTimes}天`;
      }
      return '';
    },
    handleClickContent(diary) {
      const kdtId = _global.kdt_id;
      const { userData, gciId } = diary;
      const { alias, taskId } = this.getPunchTaskParams;
      const { fansId: shareFansId, fansType: shareFansType } = userData || {};
      SafeLink.redirect({
        url: buildUrl(
          `/wscvis/supv/punch/detail?kdtId=${kdtId}&alias=${alias}&taskId=${taskId}&gciId=${gciId}&si=${shareFansId}&st=${shareFansType}`,
          'h5',
          kdtId,
        ),
        kdtId: kdtId,
      });
    },
    handleEditPunchTask() {
      const kdtId = _global.kdt_id;
      const { alias, punchType, taskId } = this.getPunchTaskParams;
      const { currentDate, startDate } = this.getModifyDiaryParams;
      SafeLink.redirect({
        url: buildUrl(
          `/wscvis/supv/punch/edit?kdt_id=${kdtId}&alias=${alias}&taskId=${taskId}&punchType=${punchType}&pt=edit&current_date=${currentDate}&start_date=${startDate}`,
          'h5',
          kdtId,
        ),
        kdtId: kdtId,
      });
    },
    handleLike(diary) {
      const { commentData, id, gciId } = diary;
      const { hasLike } = commentData;
      this.postLike({ gciId, gciLogId: id, status: !hasLike });
    },

    onShowShare(type) {
      this.$store.commit('UPDATE_CURRENT_SHARE_TYPE', type);
      this.$store.commit('UPDATE_SHOW_SHARE_POPUP', true);
    },

    onLoad() {
      const loadedFirstPage = this.diaryList.length > 0;
      if (loadedFirstPage && !this.finished) {
        this.loading = true;
        this.getDiaryList(this.taskConfig)
          .then(() => {
            this.loading = false;
          })
          .catch(() => {
            this.error = true;
          });
      } else {
        this.loading = false;
      }
    },
    ...mapActions(['postLike', 'getDiaryList']),
  },
};
</script>
<style lang="scss" scoped>
.punch-list-list {
  &__header {
    height: 40px;
    padding: 0 20px;
    font-size: 14px;
    line-height: 40px;
    color: #323233;
    border-bottom: 1px solid #f2f2f2;
    box-sizing: border-box;
  }

  &__empty {
    display: flex;
    min-height: 215px;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #999;

    img {
      width: 100px;
      height: 100px;
    }
  }
}
</style>
