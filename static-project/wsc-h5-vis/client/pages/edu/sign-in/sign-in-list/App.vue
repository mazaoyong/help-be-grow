<template>
  <div
    v-if="isInited"
    class="sign-in-list"
  >
    <!-- 切换校区 -->
    <top-bar />

    <template v-if="lessonsList.length">
      <lesson-status
        :lessons="unCheckedCount"
        class="sign-in-list__lesson-status"
      />
      <vis-info-card
        v-for="(item, index) in lessonsList"
        :key="index"
        :title="item.visCardInfo.title"
        :body-list="item.visCardInfo.bodyList"
        :footer-list="item.visCardInfo.footerList"
        :show-action="item.visCardInfo.showAction"
        :show-status="!item.visCardInfo.showAction"
        :status-text="item.visCardInfo.statusName"
        class="sign-in-list__card"
        action-text="签到"
        action-name="sign-in"
        @sign-in="onAppointmentMake(item)"
        @click.native="onInfoCardPageTo(item)"
      />
    </template>
    <empty-view
      v-else
      class="sign-in-list__empty"
      desc="你没有可上课的课程"
    >
      <van-button
        round
        plain
        class="sign-in-list__empty-button sign-in-list__empty-button-buy"
        size="small"
        type="primary"
        @click="onOpenTo('courseList')"
      >
        已购课程
      </van-button>
      <van-button
        round
        plain
        class="sign-in-list__empty-button"
        size="small"
        type="primary"
        @click="onOpenTo('homePage')"
      >
        去购买课程
      </van-button>
    </empty-view>
  </div>
</template>

<script>
import { Toast, Button } from 'vant';
import { format } from 'date-fns';
import { InfoCard } from '@youzan/vis-ui';
import mixinVisPage from 'common/mixins/mixin-vis-page';

import Api from '../api.js';
import { SIGN_STATUS, SIGN_DESC } from '../constant.js';

import LessonStatus from './components/LessonStatus.vue';
import Empty from '../../components/no-course';
import TopBar from '../../../../components/top-bar/TopBar';
import * as SafeLink from '@youzan/safe-link';
import buildUrl from '@youzan/utils/url/buildUrl';

const kdtId = window._global.kdt_id;
export default {
  name: 'sign-in-list',

  config: {
    title: '签到',
    log: {
      auto: true,
      type: 'x',
      id: 0,
    },
  },

  components: {
    'lesson-status': LessonStatus,
    'vis-info-card': InfoCard,
    'empty-view': Empty,
    'van-button': Button,
    TopBar,
  },

  mixins: [mixinVisPage],

  data() {
    return {
      isInited: false,
      unCheckedCount: 0,
      lessonsList: [],
    };
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {
    Api.getLessons()
      .then(res => {
        const unCheckedCount = res.unSignInCount;
        const lessonsList = res.lessons;

        this.isInited = true;
        this.lessonsList = this.genCardList(lessonsList || []);
        this.unCheckedCount = unCheckedCount;
      })
      .catch(err => {
        Toast(err);
      });
  },

  methods: {
    /**
     * @description 生成渲染卡片所需的数据
     * @param {Object} card - 后端 item 数据
     * @returns {Object}
     * @returns {Array} - bodyList
     * @returns {Array} - footerList
     * @returns {boolean} - showAction 是否展示签到按钮
     * @returns {string} - statusName 状态
     * @returns {string} - title 卡片名成
     */
    genCard(card) {
      const bodyList = [
        {
          icon: 'course',
          value: card.categoryName,
          hidden: !card.categoryName,
        },
        {
          icon: 'time',
          value: `${format(+card.startTime || 0, 'HH:mm')}-${format(+card.endTime || 0, 'HH:mm')}`,
        },
      ];
      const footerList = [
        {
          name: '学员',
          value: card.studentName,
        },
        {
          name: '老师',
          value: card.teacherName,
          hidden: !card.teacherName,
        },
        {
          name: '助教',
          value: card.assistantNames && card.assistantNames.join('、'),
          hidden: !card.assistantNames,
        },
        {
          name: '消耗课时',
          value: card.consumeAssetCount / 100,
        },
      ];
      const showAction = card.signStatus === SIGN_STATUS.VALID;
      const statusName = SIGN_DESC[card.signStatus] || '';

      return {
        bodyList,
        footerList,
        showAction,
        statusName,
        title: card.eduCourseName || '',
      };
    },

    genCardList(arr) {
      arr.forEach(item => {
        const card = this.genCard(item);
        item.visCardInfo = card;
      });
      return arr;
    },

    onAppointmentMake(item, ev) {
      const { studentId, lessonType, lessonNo, studentLessonNo, studentName } = item || {};
      let lessonNoData = lessonNo;

      if (lessonType === 0) { // 机构课表
        lessonNoData = lessonNo;
      } else if (lessonType === 1) { // 自己的课表
        lessonNoData = studentLessonNo;
      }

      const q = new Promise((resolve, reject) => {
        // 机构
        if (lessonType === 0) {
          Api.findUserAssetsForSignIn({
            studentId,
            lessonNo: lessonNo,
          })
            .then((res = {}) => {
              if (res.assetNum > 1) {
                SafeLink.redirect({
                  url: `/wscvis/edu/sign-in-assets?kdt_id=${kdtId}&studentId=${studentId}&lessonNo=${lessonNo}&studentName=${studentName}`,
                  kdtId,
                });
              } else if (res.assetNum === 1) {
                if (res.assetList && res.assetList.length > 0) {
                  return Api.postSignInWithAssets({
                    lessonNo: lessonNoData,
                    studentId,
                    lessonType,
                    assetNos: [res.assetList[0].assetNo],
                    kdtId,
                  })
                    .then(res => {
                      // 跳转路径
                      (res && typeof res === 'string') && (SafeLink.redirect({
                        url: buildUrl(`/wscvis/edu/sign-in-result?kdt_id=${kdtId}&studentLessonNo=${res}`, 'h5', kdtId),
                        kdtId,
                      }));
                    });
                }
              } else {
                resolve();
              }
            })
            .catch(err => {
              reject(err);
            });
        } else if (lessonType === 1) {
          resolve();
        }
      });

      q.then(() => {
        return Api.postSignIn({
          lessonNo: lessonNoData,
          studentIds: [studentId],
          lessonType,
          signInType: 0,
          kdtId,
        })
          .then(res => {
            // 跳转路径
            (res && typeof res === 'string') && (SafeLink.redirect({
              url: `//h5.youzan.com/wscvis/edu/sign-in-result?kdt_id=${kdtId}&studentLessonNo=${res}`,
              kdtId,
            }));
          });
      }).catch(err => {
        Toast(err);
      });
    },

    onOpenTo(urlKey) {
      const urlMap = {
        courseList: `//h5.youzan.com/wscvis/knowledge/index?page=mypay&kdt_id=${kdtId}`,
        homePage: `//h5.youzan.com/v2/home?kdt_id=${kdtId}`,
      };
      const url = urlMap[urlKey];
      url && (SafeLink.redirect({
        url,
        kdtId,
      }));
    },

    onInfoCardPageTo(item, ev) {
      if (item.signStatus === SIGN_STATUS.DONE) {
        SafeLink.redirect({
          url: `//h5.youzan.com/wscvis/edu/sign-in-result?kdt_id=${kdtId}&studentLessonNo=${item.studentLessonNo}`,
          kdtId,
        });
      }
    },
  },
};
</script>

<style lang="scss">
  @import 'mixins/index.scss';

  .sign-in-list {

    &__lesson-status {
      margin: 10px auto;
    }

    &__empty {
      margin-top: 130px;
      margin-bottom: 130px;
    }

    &__card {
      width: 355px;
      margin: 10px auto 0;
      box-sizing: border-box;
    }

    &__empty-button-buy {
      margin-right: 10px;
    }

    &__empty-button {
      background-color: transparent;
      width: 100px;
    }

    .table-list-item__value {
      @include multi-ellipsis(1);
    }
  }
</style>
