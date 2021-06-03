<template>
  <div class="detail-assemblage">
    <van-tabs title-inactive-color="#969799" title-active-color="#00b389" color="#00b389">
      <van-tab title="动态记录">
        <div class="dynamic-container" :style="isHasRecordList ? '' : 'padding: 0'">
          <div
            v-if="isHasRecordList"
            class="action-box"
            :style="isHasTypeRecordList ? '' : 'min-height: 150px;'"
          >
            <a class="change-status" href="javascript: void(0);" @click="onChangeStatus">
              {{ recordTypeArr[selectedRecordIndex].text }}
              <icon
                :name="isShowDynamicActionsheet? 'arrow-up' : 'arrow-down'"
                size="14px"
                color="#a6a8ab"
              />
            </a>
            <a class="add-dynamic" href="javascript: void(0);" @click="onAddDynamic">添加</a>
          </div>

          <!-- 已购课程列表 开始 -->
          <div v-if="isHasRecordList">
            <van-list
              v-if="newRecordList.length > 0"
              :finished="isRecordListLoadingFinished"
              :error.sync="isRecordListError"
              error-text="请求失败，点击重新加载"
              @load="onLoadRecordList"
            >
              <dynamic-item
                v-for="(record, index) in newRecordList"
                :key="index"
                :clue-id="clueId"
                :record-id="record.id"
                :record-type="record.recordType"
                :operator-name="record.operateInfo.operatorName"
                :operate-time="record.operateInfo.operateTime"
                :operator-school-name="record.operateInfo.operatorSchoolName"
                :channel="record.operateInfo.channel"
                :source="record.operateInfo.source"
                :owners="record.operateInfo.owners"
                :reg-info="record.operateInfo.regInfo"
                :attend-time="record.operateInfo.attendTime"
                :attend-address="record.operateInfo.attendAddress"
                :course-name="record.operateInfo.courseName"
                :before-owner="record.operateInfo.beforeOwner"
                :after-owner="record.operateInfo.afterOwner"
                :before-source="record.operateInfo.beforeSource"
                :after-source="record.operateInfo.afterSource"
                :before-role="record.operateInfo.beforeRole"
                :after-role="record.operateInfo.afterRole"
                :scene="record.operateInfo.scene"
                :reason="record.operateInfo.reason"
                :phase-before="record.operateInfo.phaseBefore"
                :phase-after="record.operateInfo.phaseAfter"
                :related-order-no="record.operateInfo.relatedOrderNo"
                :before-tags="record.operateInfo.beforeTags"
                :after-tags="record.operateInfo.afterTags"
                :record-text="record.operateInfo.recordText"
                :image-list="record.operateInfo.imageList"
                :revisit-time="record.operateInfo.revisitTime"
                :stu-before="record.operateInfo.stuBefore"
                :stu-after="record.operateInfo.stuAfter"
                :introduce-name="record.operateInfo.introduceName"
              />
            </van-list>
            <!-- 某种类型的默认空状态 开始 -->
            <div v-else-if="isNotLoadingRecordList && !isHasTypeRecordList" class="no-list">
              <span class="tip tip_record">暂无动态记录</span>
            </div>
            <!-- 某种类型的默认空状态 结束 -->
          </div>
          <!-- 已购课程列表 结束 -->

          <!-- 默认空状态 开始 -->
          <div v-else-if="isNotLoadingRecordList && !isHasRecordList" class="no-list">
            <span class="tip tip_record">暂无动态记录</span>
          </div>
          <!-- 默认空状态 结束 -->
        </div>
      </van-tab>
      <van-tab title="体验课">
        <!-- 体验课列表 开始 -->
        <div v-if="isHasLessonList">
          <van-list
            v-if="lessonList.length > 0"
            :finished="isLessonListLoadingFinished"
            :error.sync="isLessonListError"
            error-text="请求失败，点击重新加载"
            @load="onLoadLessonList"
          >
            <experience-course-item
              v-for="(lesson, index) in lessonList"
              :key="index"
              :name="lesson.courseName || lesson.eduCourseName"
              :status="lesson.studentLessonStatus"
              :start-time="lesson.startTime"
              :address-name="lesson.addressName"
              :lesson-no="lesson.lessonNo"
              :student-no="lesson.studentId"
              :student-lesson-no="lesson.studentLessonNo"
              :student-name="lesson.studentName"
              :source="lesson.origin"
              :can-operate="lesson.canOperate"
              :kdt-id="lesson.kdtId"
              :clue-id="clueId"
              @refresh="onRefeshLessonList"
            />
          </van-list>
        </div>
        <!-- 体验课列表 结束 -->

        <!-- 默认空状态 开始 -->
        <div v-else-if="isNotLoadingLessonList && !isHasLessonList" class="no-list-box">
          <div class="no-list">
            <span class="tip tip_lesson">暂无体验课</span>
          </div>
        </div>
        <!-- 默认空状态 结束 -->
      </van-tab>
      <van-tab title="已购课程">
        <!-- 已购课程列表 开始 -->
        <div v-if="isHasCourseList">
          <van-list
            v-if="courseList.length > 0"
            v-model="isFetchingData"
            :finished="isCourseListLoadingFinished"
            :error.sync="isCourseListError"
            error-text="请求失败，点击重新加载"
            @load="onLoadCourseList"
          >
            <bought-course-item
              v-for="(course, index) in courseList"
              :key="index"
              :name="course.course.title"
              :status="course.eduCourseState"
              :edu-course-valid-description="course.eduCourseValidDescription"
              :start-time="course.startTime"
              :end-time="course.endTime"
              :remaining="course.courseTime && course.courseTime.remaining"
              :total="course.courseTime && course.courseTime.total"
            />
          </van-list>
        </div>
        <!-- 已购课程列表 结束 -->

        <!-- 默认空状态 开始 -->
        <div v-else-if="isNotLoadingCourseList && !isHasCourseList" class="no-list-box">
          <div class="no-list">
            <span class="tip tip_course">暂无已购课程</span>
          </div>
        </div>
        <!-- 默认空状态 结束 -->
      </van-tab>
    </van-tabs>

    <!-- 动态类型actionsheet 开始 -->
    <van-actionsheet v-model="isShowDynamicActionsheet" title="动态类型筛选">
      <p
        v-for="( recordType, index) in recordTypeArr"
        :key="index"
        class="record"
        :class="recordType.type === selectedRecordType ? 'active' : ''"
        @click="onSelectRecordType(recordType.type, index)"
      >
        {{ recordType.text }}
        <icon
          v-if="recordType.type === selectedRecordType"
          class="check"
          name="check"
          size="14px"
          color="#00b389"
        />
      </p>
    </van-actionsheet>
    <!-- 动态类型actionsheet 结束 -->
  </div>
</template>

<script>
import { Tab, Tabs, List, Toast, ActionSheet } from 'vant';
import { Icon } from '@youzan/vis-ui';
import { isSameDay } from 'date-fns';
import { cloneDeep } from 'lodash';
import dynamicItem from './dynamic-item.vue';
import experienceCourseItem from './experience-course-item.vue';
import boughtCourseItem from './bought-course-item.vue';
import router from '../router.js';

let recordOperateTime; // 动态记录上次的操作时间

export default {
  name: 'detail-assemblage',
  components: {
    'van-tabs': Tabs,
    'van-tab': Tab,
    'van-list': List,
    'van-actionsheet': ActionSheet,
    icon: Icon,
    'dynamic-item': dynamicItem,
    'experience-course-item': experienceCourseItem,
    'bought-course-item': boughtCourseItem,
  },
  props: {
    mobile: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    studentId: {
      // 学员id
      type: Number,
      default: 0,
    },
    clueId: {
      // 线索id
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isShowDynamicActionsheet: false,
      selectedRecordType: 0,
      selectedRecordIndex: 0,
      recordTypeArr: [
        { text: '全部动态', type: 0 },
        { text: '添加线索', type: 1 },
        { text: '更新基本资料', type: 2 },
        { text: '更新阶段', type: 3 },
        { text: '更新标签', type: 4 },
        { text: '变更课程顾问', type: 5 },
        { text: '变更跟进记录', type: 6 },
        { text: '更新来源', type: 100 },
        { text: '变更角色', type: 101 },
      ],
      recordList: [], // 动态记录列表
      newRecordList: [], // parse过的动态记录列表
      recordQuery: {
        clueId: this.clueId,
        recordType: 0, // (0,全部),(1,添加线索),(2,更新基本资料),(3,更新阶段),(4,更新标签),(5,变更课程顾问),(6,变更跟进记录)
        pageNumber: 1,
        pageSize: 10,
      },
      isHasRecordList: false,
      isHasTypeRecordList: true, // 是否有特定类型的动态记录
      isNotLoadingRecordList: false,
      isRecordListLoadingFinished: false,
      isRecordListError: false,

      lessonList: [], // 体验课列表
      lessonQuery: {
        pageNumber: 1,
        pageSize: 10,
        courseType: 0,
      },
      isHasLessonList: false,
      isNotLoadingLessonList: false,
      isLessonListLoadingFinished: false,
      isLessonListError: false,

      courseList: [], // 已购课程列表
      courseQuery: {
        pageNumber: 1,
        pageSize: 10,
      },
      isHasCourseList: false,
      isNotLoadingCourseList: false,
      isCourseListLoadingFinished: false,
      isCourseListError: false,

      isFetchingData: true,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.initRecordList(); // 获取动态记录列表
      this.initLessonList(); // 获取体验课列表
      this.initCourseList(); // 获取已购课程列表
      this.initEvent();
    },
    onRefeshLessonList() {
      this.lessonQuery.pageNumber = 1;
      this.initLessonList('refresh');
    },
    initRecordList(type = '') {
      // 获取动态记录列表
      const { pageSize, pageNumber, clueId, recordType } = this.recordQuery;
      this.$store
        .dispatch('clueDetailModule/findPageClueRecords', {
          pageSize,
          pageNumber,
          clueId,
          recordType,
        })
        .then(res => {
          let pageable = true;
          if (res.content && res.content.length > 0) {
            this.recordList =
              type === 'refresh' ? res.content : this.recordList.concat(res.content);
            this.newRecordList = this.parseRecordList();
            this.isHasRecordList = true;
            this.isHasTypeRecordList = true;
            const { offset } = res.pageable;
            pageable = offset + res.content.length < res.total;
          } else {
            this.recordList = [];
            this.newRecordList = [];
            this.isHasTypeRecordList = false;
            pageable = false;
          }
          this.isRecordListLoadingFinished = !pageable;
          this.isNotLoadingRecordList = true;
        })
        .catch(err => {
          this.isRecordListError = true;
          this.isNotLoadingRecordList = true;
          Toast(err);
        });
    },
    initLessonList(type = '') {
      // 获取体验课列表
      const { pageSize, pageNumber } = this.lessonQuery;
      this.$store
        .dispatch('clueDetailModule/findStudentLessonsByIdentity', {
          pageSize,
          pageNumber,
          mobile: this.mobile,
          studentId: this.studentId,
          name: this.name,
        })
        .then(res => {
          let pageable = true;
          if (
            res.studentLessons &&
            res.studentLessons.content &&
            res.studentLessons.content.length > 0
          ) {
            this.lessonList =
              type === 'refresh'
                ? res.studentLessons.content
                : this.lessonList.concat(res.studentLessons.content);
            this.isHasLessonList = true;
            const { offset } = res.studentLessons.pageable;
            pageable = offset + res.studentLessons.content.length < res.studentLessons.total;
          }
          this.isLessonListLoadingFinished = !pageable;
          this.isNotLoadingLessonList = true;
        })
        .catch(err => {
          this.isLessonListError = true;
          this.isNotLoadingLessonList = true;
          Toast(err);
        });
    },
    initCourseList() {
      // 获取已购课程列表
      const { pageSize, pageNumber } = this.courseQuery;
      this.$store
        .dispatch('clueDetailModule/findPageByMobileWithCourse', {
          pageSize,
          pageNumber,
          mobile: this.mobile,
        })
        .then(res => {
          this.isFetchingData = false;
          let pageable = true;
          if (res.content && res.content.length > 0) {
            this.courseList = this.courseList.concat(res.content);
            this.isHasCourseList = true;
            const { offset } = res.pageable;
            pageable = offset + res.content.length < res.total;
          }
          if (!pageable) {
            this.isCourseListLoadingFinished = true;
          }
          this.isNotLoadingCourseList = true;
        })
        .catch(err => {
          this.isFetchingData = false;
          this.isCourseListError = true;
          this.isNotLoadingCourseList = true;
          Toast(err);
        });
    },
    initEvent() {
      this.$bus.$on('refreshRecordList', () => {
        this.initRecordList('refresh');
      });
    },
    onLoadRecordList() {
      if (this.isNotLoadingRecordList) {
        this.isNotLoadingRecordList = false;
        this.recordQuery.pageNumber++;
        if (this.recordQuery.pageNumber > 1) {
          this.initRecordList();
        }
      }
    },
    onLoadLessonList() {
      if (this.isNotLoadingLessonList) {
        this.isNotLoadingLessonList = false;
        this.lessonQuery.pageNumber++;
        if (this.lessonQuery.pageNumber > 1) {
          this.initLessonList();
        }
      }
    },
    onLoadCourseList() {
      if (this.isNotLoadingCourseList) {
        this.isNotLoadingCourseList = false;
        this.courseQuery.pageNumber++;
        if (this.courseQuery.pageNumber > 1) {
          this.initCourseList();
        }
      }
    },
    parseRecordList() {
      // 给动态记录添加时间轴
      const newArr = cloneDeep(this.recordList);
      let i = 0;
      this.recordList.map((record, index) => {
        if (record.operateInfo.operateTime) {
          if (!recordOperateTime || !isSameDay(recordOperateTime, record.operateInfo.operateTime)) {
            recordOperateTime = record.operateInfo.operateTime;
            newArr.splice(index + i, 0, {
              recordType: -1,
              operateInfo: {
                operateTime: recordOperateTime,
              },
            });
            i++;
          }
        }
      });

      return newArr;
    },
    onChangeStatus() {
      this.isShowDynamicActionsheet = !this.isShowDynamicActionsheet;
    },
    onSelectRecordType(type, index) {
      this.selectedRecordType = type;
      this.selectedRecordIndex = index;
      this.recordQuery.pageNumber = 1;
      this.recordQuery.recordType = this.selectedRecordType;
      this.initRecordList('refresh');
      this.isShowDynamicActionsheet = false;
    },
    onAddDynamic() {
      router.push({ name: 'update-dynamic', query: { type: 'add', clueId: this.clueId } });
    },
  },
};
</script>

<style lang="scss">
.van-tabs__wrap {
  z-index: 0;
}
</style>
<style lang="scss" scoped>
.detail-assemblage {
  background-color: #fff;
  margin-bottom: 50px;
  .dynamic-container {
    padding: 20px 15px 20px 19px;
    .action-box {
      margin-bottom: 25px;
      height: 22px;
      line-height: 22px;
      clear: both;
      .change-status {
        display: inline-block;
        margin-left: -4px;
        font-size: 16px;
        font-weight: bold;
        color: #323233;
      }
      .add-dynamic {
        float: right;
        display: inline-block;
        font-size: 13px;
        color: #00b389;
      }
    }
  }
  .van-tab__pane {
    position: relative;
    .no-list-box {
      position: relative;
      width: 100%;
      height: 270px;
      background-color: #f7f8fa;
    }
    .no-list {
      position: absolute;
      top: 70px;
      left: 50%;
      transform: translate(-50%, 0);
      width: 140px;
      height: 124px;
      text-align: center;
      background-image: url('https://b.yzcdn.cn/public_files/2019/03/12/9d9c065ca679da115f7b547c99dbf3d1.png');
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 90px 90px;
      .tip {
        display: inline-block;
        position: absolute;
        bottom: 0;
        font-size: 14px;
        color: #999;
        line-height: 1;
        &_lesson {
          left: 28px;
        }
        &_course {
          left: 20px;
        }
        &_record {
          left: 20px;
        }
      }
    }
  }
  .van-action-sheet__content {
    .record {
      position: relative;
      padding-left: 15px;
      line-height: 38px;
      font-size: 13px;
      color: #323233;
      .check {
        position: absolute;
        top: 12px;
        right: 15px;
      }
    }
    .active {
      color: #00b389;
    }
  }
}
</style>
