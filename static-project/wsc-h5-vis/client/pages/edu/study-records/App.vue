<template>
  <vis-page-container>
    <div
      v-if="studentList.length"
      class="study-records"
    >
      <div class="study-records__bg bg-primary" />

      <swiper
        :disable-change="isListLoading"
        @change="onCurrentStudentChange"
      >
        <swiper-item
          v-for="(student, index) in studentList"
          :key="index"
          :index="index"
        >
          <student-card
            :avatar-url="student.avatar"
            :nickname="student.name"
            :student-id="student.studentNo"
            :owned-count="student.alreadyBuyRecord"
            :used-count="student.alreadyLessonRecord"
            :total-time="student.alreadyLessonTime"
            @click.native="onCardClick(student.id)"
          />
        </swiper-item>
      </swiper>

      <van-list
        v-if="recordList.length"
        v-model="isListLoading"
        :finished="isListFinished"
        @load="onListLoad"
        class="appointment-list"
        finished-text=""
      >
        <div class="study-records__list">
          <list-item
            v-for="(record, index) in recordList"
            :key="index"
            :url="((record.course && record.course.alias)
              || (record.userAsset && record.userAsset.assetOriginType === 3)) // 正式课 or 导入的课程可以点击
              ? `//h5.youzan.com/wscvis/edu/course/coursedetail?assetNo=${
                record.userAsset && record.userAsset.assetNo
              }&kdtId=${
                (record.course && record.course.kdtId) || (record.eduCourse && record.eduCourse.kdtId)
              }`
              : ''"
            :thumbnail-url="(record.pictureWrap && record.pictureWrap.url)
              || '//b.yzcdn.cn/edu/default/default.png'"
            :thumbnail-width="120"
            :thumbnail-height="68"
            :title="(record.course && record.course.title) ||
              (record.eduCourse && record.eduCourse.name)"
            :subtitle="getRecordLessonName(record)"
            :status-list="[formatWithWeek(record.startTime, record.week)]"
            :thumbnail-tag="record.courseType ? '' : '体验课'"
            thumbnail-tag-class="main-btn"
          />
        </div>
      </van-list>
      <no-course
        v-else
        class="no-records"
        desc="暂无学习记录"
      />
    </div>
    <no-course
      v-else
      class="no-students"
      desc="你尚未添加过学员<div>暂无学习记录</div>"
    />
  </vis-page-container>
</template>

<script>
import { format } from 'date-fns';
import {
  List,
  Toast,
} from 'vant';
import StudentCard from './components/StudentCard.vue';
import ListItem from 'components/list-item/index.vue';
import VisPageContainer from '../components/page-container';
import NoCourse from '../components/no-course';
import Swiper from './components/Swiper';
import SwiperItem from './components/SwiperItem';
import Api from './api';

export default {
  name: 'study-records',

  components: {
    'van-list': List,
    StudentCard,
    ListItem,
    VisPageContainer,
    NoCourse,
    Swiper,
    SwiperItem,
  },

  data() {
    return {
      currentStudentId: null,
      studentList: [],

      total: 0,
      pageSize: 10,
      pageNumber: 1,
      isListLoading: false,
      isListFinished: false,
      recordList: [],
    };
  },

  created() {
    // 获取学员列表
    this.fetchStudentList()
    // 获取第一个学员的上课记录列表
      .then((id) => {
        if (id) {
          this.currentStudentId = id;
          this.fetchRecordList();
        }
      });
  },

  methods: {
    formatWithWeek(timestamp, week) {
      const cnWeek = ['', '一', '二', '三', '四', '五', '六', '日'];
      return `${format(timestamp, 'YYYY[年]MM[月]DD[日]')} 周${cnWeek[week]} ${format(timestamp, 'HH:mm')}`;
    },

    fetchStudentList() {
      return Api
        .getStudentList()
        .then(res => {
          this.studentList = res.map(item => {
            return {
              ...item,
              ...item.studentDTO,
            };
          });

          return this.studentList[0] && this.studentList[0].id;
        })
        .catch(err => {
          console.error(err);
          Toast(err);
        })
        .finally(() => {

        });
    },

    fetchRecordList(isRefresh = false) {
      if (isRefresh) {
        this.pageNumber = 1;
        this.recordList = [];
        this.isListFinished = false;
      }
      this.isListLoading = true;

      const studentId = this.currentStudentId;
      const {
        pageNumber,
        pageSize = 10,
      } = this;
      return Api
        .getStudyRecords({
          pageNumber,
          pageSize,
          studentId,
        })
        .then(res => {
          if (this.currentStudentId === studentId) {
            this.recordList = [
              ...this.recordList,
              ...res.content,
            ];
            this.total = res.total;
            if (this.recordList.length >= this.total) {
              this.isListFinished = true;
            } else {
              this.isListFinished = false;
            }
            return this.recordList;
          }
        })
        .catch(err => {
          console.error(err);
          Toast(err);
          this.isListFinished = true;
        })
        .finally(() => {
          this.isListLoading = false;
        });
    },

    getRecordLessonName(record) {
      if (!record.courseType) {
        return '';
      }

      return record.lessonName ? record.lessonName : (record.eduCourse && record.eduCourse.name) || '';
    },

    onCardClick(studentId = 0) {
      if (!studentId || studentId === this.currentStudentId || this.isListLoading) return;

      this.currentStudentId = studentId;
      this.fetchRecordList(true);
    },

    onCurrentStudentChange(index) {
      this.currentStudentId = this.studentList[index].id;
      this.fetchRecordList(true);
    },

    onListLoad() {
      this.pageNumber++;
      this.fetchRecordList();
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';

.study-records {
  position: relative;
  padding: 16px 10px 0;
  overflow: hidden;

  &__bg {
    position: absolute;
    top: -1880px;
    left: 50%;
    transform: translateX(-1000px);
    width: 2000px;
    height: 2000px;
    background: #01cb9c;
    border-radius: 1000px;
  }

  &__list {
    margin-top: 10px;
    padding: 0 15px;
    background: #fff;
    border-radius: 4px;

    .item {
      padding: 15px 0;

      &:last-child {

        &:after {
          border-bottom: none;
        }
      }

      &:after {
        @include border-retina(bottom);
      }
    }
  }

  .item__thumbnail-tag {
    top: unset;
    left: 8px;
    bottom: 8px;
    transform: unset;
    padding: 0 6px;
    height: 18px;
    line-height: 18px;
    font-size: 12px;
    background: #00b389;
    border-radius: 9px;
  }
}

.no-records {
  margin-top: 60px;
}

.no-students {
  margin-top: 130px;
}
</style>
