<template>
  <div class="app-add-student">
    <div class="app-add-student__header">
      <search-bar
        @search="onSearch"
        @clear="onClear"
      />
    </div>

    <div class="app-add-student__body p-safeArea">
      <selected-students
        v-if="selectedAssets.length"
        :selected="selectedStudents"
        @unselect="onStudentUnselected"
      />
      <search-result
        v-if="studentList.length"
        :is-loading="isListLoading"
        :is-finished="isListFinished"
        :student-list="studentList"
        :selected-student-ids="selectedStudentIds"
        :selected-student-assets="selectedAssets"
        @load="onStudentsLoad"
        @select="onStudentSelected"
        @unselect="onStudentUnselected"
        @goToCancel="onGoToCancel"
      />
    </div>

    <div class="app-add-student__footer f-safeArea">
      <action-bar
        :selected-count="selectedAssets.length"
        :remaining-count="remainingCount"
        :appointment-limit="appointmentLimit"
        :appointment-remaining="appointmentRemaining"
        :valid-count="studentList.length"
        @select-all="onAllSelected"
        @unselect-all="onAllUnselected"
        @confirm="onConfirm"
      />
    </div>
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant';
import Args from 'zan-utils/url/args';
import format from 'date-fns/format';
import SearchBar from './components/SearchBar';
import SelectedStudents from './components/SelectedStudents';
import SearchResult from './components/SearchResult';
import ActionBar from './components/ActionBar';
import apis from '../../pages-api/add-student';
import studentApis from '../../pages-api/edu-admin/student';
import openStudentStatus from '../../components/student-stauts';
import OpenFreezeDetail from '@/vis-shared/views/edu-admin/freeze-detail';

const _global = window._global;

export default {
  name: 'app-add-student',

  components: {
    SearchBar,
    SelectedStudents,
    SearchResult,
    ActionBar,
  },

  data() {
    return {
      eduCourseId: 0,
      lessonNo: '',

      isListLoading: false,
      isListFinished: false,

      pageSize: 10,
      pageNumber: 1,
      searchContent: '',

      studentList: [],
      selectedStudents: [],

      appointmentLimit: 0, // 预约人数限制，0的时候为不限制
      appointmentRemaining: 0, // 剩余可预约数

      kdtId: Args.get('kdtId') || _global.kdtId,

      startTime: Args.get('startTime'),
      endTime: Args.get('endTime'),
    };
  },

  computed: {
    remainingCount() {
      return this.studentList.filter((student) => {
        return student.isValid &&
          // 没有选中
          !this.selectedAssets.includes(student.assetNo) &&
          // 没有选中这个学员的其他资产
          !this.selectedStudentIds.includes(student.id);
      }).length;
    },

    selectedStudentIds() {
      return this.selectedStudents.map(stu => stu.id);
    },

    selectedAssets() {
      return this.selectedStudents.map(stu => stu.assetNo);
    },
  },

  created() {
    this.eduCourseId = Args.get('eduCourseId');
    this.lessonNo = Args.get('lessonNo');

    this.fetchStudentList();
  },

  methods: {
    onGoToCancel(stu) {
      console.log('取消冻结课程', stu);
      function getContentTop(stu) {
        const checkConfig = stu.check || {};
        const assetCheckInfo = checkConfig.assetCheckInfo || {};
        const lessonCheckInfo = checkConfig.lessonCheckInfo || {};

        let text = '';
        if (assetCheckInfo.locked) {
          text = `${lessonCheckInfo.consumeNum ? `本节课需扣减 ${lessonCheckInfo.consumeNum / 100} 课时，` : ''}剩余 ${assetCheckInfo.available / 100} 课时可用。\n有 ${assetCheckInfo.locked / 100} 课时已被冻结，可先将学员从日程中移除再操作。`;
        } else {
          text = '';
        }
        return text;
      }
      OpenFreezeDetail({
        props: {
          tip: getContentTop(stu),
          params: {
            kdtId: this.kdtId,
            assetNos: [stu.assetNo],
          },
          fetchPromise: (params) => studentApis.findLockedPage(params).then((res = {}) => {
            const list = res.content || [];
            list.forEach(o => {
              o.keyName = o.lessonNo;
            });
            return { list, hasNext: list.length === params.pageSize };
          }),
          removePromise: (selectedList) => {
            const req = {
              kdtId: this.kdtId,
              studentLessonNos: selectedList.map(o => o.studentLessonNo),
            };
            return studentApis.batchCancel(req);
          },
        },
      })
        .then(res => {
          this.fetchStudentList(true);
        });
    },
    fetchStudentList(isRefresh = false) {
      this.isListLoading = true;
      if (isRefresh) {
        this.pageNumber = 1;
        this.isListFinished = false;
      }

      studentApis
        .findStudentsPageForAddToSignInV2({
        // apis
        //   .getStudentList({
          lessonNo: this.lessonNo,
          eduCourseId: this.eduCourseId,
          pageSize: this.pageSize,
          pageNumber: this.pageNumber,
          studentNameOrPhone: this.searchContent || '',
          kdtId: this.kdtId,
        })
        .then(res => {
          this.appointmentLimit = res.appointmentLimit || 0; // 预约人数限制，0的时候为不限制
          this.appointmentRemaining = res.appointmentRemaining || 0; // 剩余可预约数
          const list = res.students || { content: [], total: 0 };
          // 之所以放在这里清空，是因为想减少数据变化带来的闪动
          if (isRefresh) {
            this.studentList = [];
          }
          this.studentList = [
            ...this.studentList,
            ...list.content.map(stu => {
              const {
                assetNo = '',
                student = {},
                course = {},
                courseTime = {},
                eduCourseValidDescription = '',
                joinState = {},
              } = stu;

              const checkConfig = joinState.check || {};
              const checkcode = checkConfig.checkCode;
              const assetCheckInfo = checkConfig.assetCheckInfo || {};
              const lessonCheckInfo = checkConfig.lessonCheckInfo || {};

              const statusMap = {
                0: {
                  text: '',
                  extraText: '',
                },
                1: {
                  text: '已经本日程',
                  extraText: '学员已在本日程。',
                },
                21: {
                  text: '课程已到期',
                  extraText: `学员课程在上课日期（${format(lessonCheckInfo.startTime, 'M月D日')}）前已到期，到期日：${format(assetCheckInfo.endTime, 'YYYY-MM-DD')}。`,
                },
                10: {
                  text: '课程未生效',
                  extraText: `学员课程未生效，可到PC端学员详情中立即生效课程。`,
                },
                20: {
                  text: '课程未生效',
                  extraText: `学员课程在上课日期(${format(lessonCheckInfo.startTime, 'M月D日')}）前未生效，生效日：${format(assetCheckInfo.startTime, 'YYYY-MM-DD')}。`,
                },
                30: {
                  text: '课时不足',
                  extraText: `可用课时为${assetCheckInfo.available / 100}${lessonCheckInfo.consumeNum ? `，本节课需扣除${lessonCheckInfo.consumeNum / 100}课时。` : '。'}`,
                },
                31: {
                  text: '课时不足',
                  extraText: `可用课时为${assetCheckInfo.available / 100}，${lessonCheckInfo.consumeNum ? `本节课需扣除${lessonCheckInfo.consumeNum / 100}课时，` : ''}有${assetCheckInfo.locked / 100}课时已被其他日程冻结，可`,
                },
              };

              const statusMapText = statusMap[checkcode] || {};

              return {
                assetNo,
                id: student.id,
                name: student.name,
                isValid: joinState.choose,
                checkCode: checkcode,
                statusText: statusMapText.text,
                statusExtraText: statusMapText.extraText,
                courseType: course.courseSellType,
                used: courseTime && courseTime.used,
                remaining: courseTime && courseTime.remaining,
                validDate: eduCourseValidDescription,
                check: checkConfig,
              };
            }),
          ];
          if (this.studentList.length >= list.total) {
            this.isListFinished = true;
          }
        })
        .catch(errMsg => {
          Toast(errMsg);
          this.isListFinished = true;
        })
        .finally(() => {
          this.isListLoading = false;
        });
    },

    fetchAddStudents() {
      if (this.selectedStudents.length) {
        const studentAndAssets = this.selectedStudents.map(stu => {
          return {
            assetNo: stu.assetNo,
            studentId: stu.id,
          };
        });

        Toast(`正在添加${studentAndAssets.length}名学员...`);

        studentApis
          .addStudentsV2({
            lessonNo: this.lessonNo,
            studentAndAssets,
            kdtId: this.kdtId,
          })
          .then(res => {
            if (res) {
              const { failedNum, successNum, failedStudents = [] } = res || {};
              if (failedNum) {
                const summaryTitle = `${successNum} 名学员已添加完成，${failedNum} 名学员失败。`;
                const detailTitle = `以下 ${failedNum} 名学员添加失败。`;
                const detailList = failedStudents.map(o => {
                  return {
                    name: o.studentName,
                    reason: o.msg,
                    extraReason: o.extMsg,
                  };
                });
                openStudentStatus({
                  props: {
                    summaryTitle,
                    detailTitle,
                    detailList,
                  },
                })
                  .then(res => {
                    setTimeout(() => {
                      this.goSignIn();
                    }, 1500);
                  });
              } else {
                Toast(`${successNum}名学员已添加完成`);
                setTimeout(() => {
                  this.goSignIn();
                }, 1500);
              }
            } else {
              this.goSignIn();
            }
          })
          .catch(errMsg => {
            Toast(errMsg);
          })
          .finally(() => {
          });
      } else {
        this.goSignIn();
      }
    },

    goSignIn() {
      window.history.back();
    },

    onSearch(searchContent = '') {
      this.searchContent = searchContent;
      this.fetchStudentList(true);
    },
    onClear() {
      this.searchContent = '';
      this.fetchStudentList(true);
    },

    onStudentSelected(stu) {
      this.selectedStudents.push(stu);
    },
    onStudentUnselected(stu) {
      const index = this.selectedAssets.indexOf(stu.assetNo);
      this.selectedStudents.splice(index, 1);
    },
    onStudentsLoad() {
      this.pageNumber++;
      this.fetchStudentList();
    },

    onAllSelected() {
      this.studentList
        .filter(stu => !this.selectedAssets.includes(stu.assetNo))
        .forEach(stu => {
          if (stu.isValid && !this.selectedStudentIds.includes(stu.id)) {
            this.selectedStudents.push(stu);
          }
        });
    },
    onAllUnselected() {
      this.selectedStudents = this.selectedStudents.filter(stu => {
        return !this.studentList.some(s => s.assetNo === stu.assetNo);
      });
    },

    detectConflict() {
      // 学员日程冲突校验
      const conflictQuery = {
        kdtId: this.kdtId,
        studentIds: this.selectedStudentIds,
        startTime: this.startTime,
        endTime: this.endTime, // '2019-09-10 16:11:25',
      };
      return apis.detectConflict(conflictQuery).then(({ hasConflict, conflictMsg }) => {
        if (hasConflict) {
          return Dialog.confirm({
            // title: '日常名额满员提示',
            message: `${conflictMsg}，继续添加？`,
            confirmButtonText: '继续添加',
            cancelButtonText: '我再想想',
          });
        }
      });
    },

    onConfirm() {
      this.detectConflict().then(() => {
        if (this.appointmentLimit > 0 && (this.selectedStudents.length > this.appointmentRemaining)) { // 有学员限制且选择的学员大于剩余学员数
          Dialog.confirm({
            confirmButtonText: '我再想想',
            cancelButtonText: '确认添加',
            confirmButtonColor: '#00B389',
            message: `该上课日程已满员(上限${this.appointmentLimit}人)，是否仍然添加?`,
          }).then(() => {
          }).catch(() => {
            this.fetchAddStudents();
          });
        } else {
          this.fetchAddStudents();
        }
      });
    },
  },
};
</script>

<style lang="postcss">
.app-add-student {
  height: 100%;
  background: #f2f2f2;

  &__header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
  }

  &__body {
    position: fixed;
    top: 54px;
    bottom: 50px;
    left: 0;
    right: 0;
    padding: 0 10px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  &__footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
  }
}
</style>
