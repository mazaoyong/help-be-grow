<template>
  <div class="app-add-student">
    <div class="app-add-student__header">
      <search-bar
        placeholder="请输入学员姓名"
        @doChange="onSearch"
        @doClear="onClear"
        @doCancel="onClear"
      />
    </div>

    <div class="app-add-student__body p-safeArea">
      <selected-students
        v-if="selectedAssets.length"
        :selected="selectedStudents"
        @unselect="onStudentUnselected"
      />

      <moments-reviewed-result
        v-if="pageFrom === 'moments' && isShowReviewedRecentStudentByInput"
        :selected-student-assets="selectedAssets"
        @select="onStudentSelected"
        @unselect="onStudentUnselected"
      />

      <moments-search-result
        v-if="studentList.length"
        :is-loading="isListLoading"
        :is-finished="isListFinished"
        :student-list="studentList"
        :selected-student-assets="selectedAssets"
        @load="onStudentsLoad"
        @select="onStudentSelected"
        @unselect="onStudentUnselected"
      />
    </div>

    <div class="app-add-student__footer f-safeArea">
      <action-bar
        :selected-count="selectedAssets.length"
        :remaining-count="remainingCountStatus"
        :valid-count="studentList.length"
        :show-all="pageFrom !== 'moments'"
        @select-all="onAllSelected"
        @unselect-all="onAllUnselected"
        @confirm="onConfirm"
      />
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant';
import Args from 'zan-utils/url/args';
import SessionStorage from '@youzan/utils/browser/session_storage.js';
import SearchBar from './components/moments/SearchBar';
import SelectedStudents from './components/SelectedStudents';
import momentsSearchResult from './components/moments/MomentsSearchResult';
import ActionBar from './components/ActionBar';
import MomentsReviewedResult from './components/moments/MomentsReviewedResult';
import apis from '../../pages-api/add-student';
import findIndex from 'lodash/findIndex';

const _global = window._global;
const STUDENT_NAME_MAP = {
  '0': '未签到',
  '1': '到课',
  '2': '请假',
  '3': '旷课',
  '4': '课程已到期',
  '5': '课时不足',
  '6': '课时未生效',
};

export default {
  name: 'app-add-student-moments',

  components: {
    'search-bar': SearchBar,
    SelectedStudents,
    momentsSearchResult,
    ActionBar,
    MomentsReviewedResult,
  },

  data() {
    return {
      lessonNo: Args.get('lessonNo') || '',

      isListLoading: false,
      isListFinished: false,

      pageSize: 10,
      pageNumber: 1,
      searchContent: '',

      initSelectedAssets: [], // 初始化的选中项
      studentList: [],
      totalStudentCount: 0, // 真实的学员总数
      selectedStudents: [],
      excludedStudents: [],

      isSelectedAll: false, // 是否选中了全选按钮（不是全选状态，偏动作）
      remainingCountStatus: 1, // 全选按钮的状态 0 选中

      kdtId: Args.get('kdtId') || _global.kdtId,
      pageFrom: Args.get('pageFrom'), // moments->面板 momentsEdit->日程

      fetchStudentList: () => {},

      isShowReviewedRecentStudentByInput: true,
    };
  },

  computed: {
    selectedAssets() {
      return this.selectedStudents.map(stu => stu.assetNo);
    },

    selectedAssetsinfos() {
      return this.selectedStudents.map(stu => {
        return {
          name: stu.name,
          id: stu.assetNo,
        };
      });
    },

    excludedAssets() {
      return this.excludedStudents.map(stu => stu.assetNo);
    },
  },

  watch: {
    searchContent(newValue) {
      if (newValue) {
        this.isShowReviewedRecentStudentByInput = false;
      } else {
        this.isShowReviewedRecentStudentByInput = true;
      }
    },
  },

  created() {
    this.setInitSelectedAssets();

    if (this.pageFrom === 'moments') {
      this.fetchStudentList = this.fetchStudentListFn;
    } else if (this.pageFrom === 'momentsEdit') {
      this.fetchStudentList = this.fetchScheduleStudentListFn;
    }

    this.fetchStudentList();
  },

  beforeRouteEnter(to, from, next) {
    try {
      if (from.name) {
        const studentsSessionCache = {
          name: from.name,
          query: from.query,
        };

        SessionStorage.setItem('vis__miniprogram__moments__students_prevhref', JSON.stringify(studentsSessionCache));
      }
    } catch (error) {
    }
    next();
  },

  methods: {
    fetchStudentListFn(isRefresh = false) {
      this.isListLoading = true;
      if (isRefresh) {
        this.pageNumber = 1;
        this.isListFinished = false;
      }

      apis
        .findStudentsForReview({
          // lessonNo: this.lessonNo,
          pageSize: this.pageSize,
          pageNumber: this.pageNumber,
          keyword: this.searchContent || '',
          kdtId: this.kdtId,
        })
        .then(res => {
          const list = res || { content: [], total: 0 };
          // 之所以放在这里清空，是因为想减少数据变化带来的闪动
          if (isRefresh) {
            this.studentList = [];
          }
          this.totalStudentCount = list.total;
          this.studentList = [
            ...this.studentList,
            ...list.content.map(stu => {
              const returnData = {
                assetNo: stu.studentId,
                id: stu.studentId,
                name: stu.studentName,
                avator: stu.avatar || 'https://b.yzcdn.cn/public_files/2019/03/23/1ab34592f489f63f1552424dfcc5fbd9.png',
                phone: stu.mobile,
                time: stu.recentStudyTime,
              };

              if (findIndex(this.selectedStudents, (o) => o.assetNo === returnData.assetNo) === -1) {
                if (this.isSelectedAll) {
                  this.selectedStudents.push(returnData);
                }
              }

              return returnData;
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

    fetchScheduleStudentListFn(isRefresh = false) {
      this.isListLoading = true;
      if (isRefresh) {
        this.pageNumber = 1;
        this.isListFinished = false;
      }

      apis
        .findStudentsOnLesson({
          lessonNo: this.lessonNo,
          pageSize: this.pageSize,
          pageNumber: this.pageNumber,
          keyword: this.searchContent || '',
          kdtId: this.kdtId,
        })
        .then(res => {
          const list = res || { content: [], total: 0 };
          // 之所以放在这里清空，是因为想减少数据变化带来的闪动
          if (isRefresh) {
            this.studentList = [];
          }
          this.totalStudentCount = list.total;
          this.studentList = [
            ...this.studentList,
            ...list.content.map(stu => {
              const returnData = {
                assetNo: stu.studentId,
                id: stu.studentId,
                name: stu.studentName,
                avator: stu.avatar || 'https://b.yzcdn.cn/public_files/2019/03/23/1ab34592f489f63f1552424dfcc5fbd9.png',
                statusText: STUDENT_NAME_MAP[stu.signInStatus],
              };

              if (findIndex(this.selectedStudents, (o) => o.assetNo === returnData.assetNo) === -1) {
                if (this.isSelectedAll) {
                  this.selectedStudents.push(returnData);
                }
              }

              return returnData;
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

    setInitSelectedAssets() {
      const initSelectedStudents = (() => {
        try {
          const data = JSON.parse(SessionStorage.getItem('vis__miniprogram__moments__students')) || {};
          return (data.list || []).map(o => {
            return {
              assetNo: o.id,
              name: o.name,
            };
          });
        } catch (error) {
          return [];
        }
      })();
      this.initSelectedAssets = initSelectedStudents.map(o => o.assetNo);
      this.selectedStudents = initSelectedStudents;
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

      this.remainingCountStatus = 1;

      if (this.isSelectedAll) {
        this.excludedStudents.push(stu);
      }
    },
    onStudentsLoad() {
      this.pageNumber++;
      this.fetchStudentList();
    },

    onAllSelected() {
      this.selectedStudents = [].concat(this.studentList);
      this.isSelectedAll = true;
      this.remainingCountStatus = 0;
      this.excludedStudents = [];
    },
    onAllUnselected() {
      this.selectedStudents = [];
      this.isSelectedAll = false;
      this.remainingCountStatus = 1;
      this.excludedStudents = [];
    },
    onConfirm() {
      console.log('选中的学员', this.selectedAssets);
      console.log('排除的学员', this.excludedAssets);

      try {
        const studentsSessionCache = {
          list: this.selectedAssetsinfos,
          excludeIds: this.excludedAssets,
          isSelectedAll: this.isSelectedAll,
          selectedCount: this.isSelectedAll
            ? this.totalStudentCount - this.excludedAssets.length
            : this.selectedAssetsinfos.length,
        };

        SessionStorage.setItem('vis__miniprogram__moments__students', JSON.stringify(studentsSessionCache));
      } catch (error) {
      }

      try {
        const prevPage = JSON.parse(SessionStorage.getItem('vis__miniprogram__moments__students_prevhref'));

        prevPage.query.useSessionOfStudents = 1;
        this.$router.push(prevPage);
      } catch (error) {
        this.$router.go(-1);
      }
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
