<template>
  <div class="block-list">
    <!-- 课程列表容器 开始 -->
    <div
      class="block-list__lesson"
    >
      <!-- 课程列表 开始 -->
      <van-list
        v-if="lessonList.length > 0"
        v-model="listLoading"
        class="lesson-list"
        :finished="listFinished"
        @load="onLoad"
      >
        <div>
          <van-checkbox-group v-model="checked" :max="1">
            <schedule-item
              v-for="(lesson, index) in lessonList"
              :key="index"
              :lesson="lesson"
              @click.native="onItemClick(index)"
            />
          </van-checkbox-group>

          <van-divider :style="{ borderColor: '#d8d8d8', }">
            若无合适的日程，可考虑直接新建试听日程
          </van-divider>
          <van-button
            round
            plain
            color="#00b389"
            @click="openAddSchedule"
          >
            新建试听日程
          </van-button>
        </div>
      </van-list>
      <!-- 课程列表 结束 -->

      <!-- 课程列表空状态 开始 -->
      <div
        v-else-if="!listLoading && lessonList.length === 0"
        class="no-lesson-list"
      >
        <img src="https://b.yzcdn.cn/public_files/2019/03/12/9d9c065ca679da115f7b547c99dbf3d1.png">
        <div class="tip">
          若无合适的日程，可考虑直接新建试听日程
        </div>
        <van-button
          round
          plain
          color="#00b389"
          @click="openAddSchedule"
        >
          新建试听日程
        </van-button>
      </div>
      <!-- 课程列表空状态 结束 -->
    </div>
    <!-- 课程列表容器 结束 -->

    <div v-if="lessonList.length" class="block-list__button f-safeArea">
      <van-button round @click="onConfirm">
        确定
      </van-button>
    </div>
  </div>
</template>

<script>
import { List, Button, CheckboxGroup, Divider, Dialog } from 'vant';
import {
  createNamespacedHelpers,
} from 'vuex';
import ScheduleItem from '../../components/schedule-item';
import {
  SET_SHOW_ADD,
  SET_LIST_LOADING,
  SET_LIST_PAGE_NUMBER,
} from '../../../../store/modules/schedule-list/mutation-types';

const {
  mapState,
  mapMutations,
  mapActions,
} = createNamespacedHelpers('scheduleList');

export default {
  name: 'block-list',

  components: {
    'van-list': List,
    'van-button': Button,
    'van-divider': Divider,
    'van-checkbox-group': CheckboxGroup,
    ScheduleItem,
  },

  data() {
    return {
      selectedItem: {},
      checked: [this.$route.query.selectedLessonNo || ''],
    };
  },

  computed: {
    ...mapState({
      listLoading: state => state.list.listLoading,
      pageNumber: state => state.list.pageNumber,
      lessonList: state => state.list.lessonList,
      listFinished: state => state.list.listFinished,
      hasError: state => state.list.hasError,
    }),
  },

  created() {
    this.selectedItem = this.$store.state.selectedSchedule;
  },

  methods: {
    ...mapMutations({
      setListLoading: SET_LIST_LOADING,
      setPageNumber: SET_LIST_PAGE_NUMBER,
      setShowAdd: SET_SHOW_ADD,
    }),

    ...mapActions([
      'fetchScheduleList',
    ]),

    onLoad() {
      if (!this.listLoading) {
        this.setListLoading(true);
        this.setPageNumber(this.pageNumber + 1);
        this.fetchScheduleList();
      }
    },

    onConfirm() {
      const goPrevPage = () => {
        this.$store.dispatch('updateSelectedSchedule', { ...this.selectedItem });
        this.$router.go(-1);
      };

      const {
        appointNumLeft,
        maxAppointNum,
        appointRule,
      } = this.selectedItem;
      // 无剩余名额 & 需要预约
      if (appointNumLeft === 0 && appointRule === 1) {
        Dialog.confirm({
          title: '名额不足',
          message: `该上课日程已满员（上限${maxAppointNum}人），是否仍然添加？`,
          confirmButtonText: '确定预约',
          confirmButtonColor: '#00b389',
        }).then(goPrevPage);
      } else {
        goPrevPage();
      }
    },

    onItemClick(index) {
      const currentItem = this.lessonList[index];
      if (this.selectedItem.lessonNo === currentItem.lessonNo) {
        this.selectedItem = {};
      } else {
        this.selectedItem = currentItem;
      }
      this.checked.splice(0, 1, this.selectedItem.lessonNo);
    },

    openAddSchedule() {
      this.setShowAdd(true);
    },
  },
};
</script>

<style lang="postcss">
.block-list {
  padding-bottom: 66px;
  overflow: auto;

  &__lesson {
    overflow-y: auto;

    .lesson-list {
      padding: 0 10px;
      margin-top: 25px;
      text-align: center;

      .van-divider {
        margin: 6px 30px 0;
        font-size: 12px;

        &::before {
          margin-right: 8px;
        }

        &::after {
          margin-left: 8px;
        }
      }

      .van-button {
        height: 36px;
        padding: 0 20px;
        margin-top: 12px;
        line-height: 34px;
      }
    }

    .no-lesson-list {
      margin-top: 94px;
      text-align: center;

      img {
        position: relative;
        left: 6px;
        display: block;
        width: 100px;
        height: 100px;
        margin: 0 auto;
      }

      .tip {
        margin-top: 7px;
        font-size: 14px;
        line-height: 20px;
        color: #999;
      }

      .van-button {
        height: 36px;
        margin-top: 8px;
        line-height: 34px;
        padding: 0 20px;
      }
    }

    &::after {
      display: block;
      content: '';
      width: 100%;
      height: 0;
      height: constant(safe-area-inset-bottom) !important;
      height: env(safe-area-inset-bottom) !important;
      background: none;
    }
  }

  &__button {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    width: 100%;
    padding: 8px 24px;
    background: #fff;

    .van-button {
      flex: 1;
      height: 40px;
      font-size: 16px;
      line-height: 40px;
      color: #fff;
      background-color: #00b389;
    }
  }
}
</style>
