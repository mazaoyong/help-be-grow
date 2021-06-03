<template>
  <div
    v-if="isInited"
    class="sign-in-list"
  >
    <p class="sign-in-list__info">
      您多次购买过此课程，请选择其中一个进行签到消课
    </p>
    <template v-if="lessonsList.length">
      <vis-info-card
        v-for="(item, index) in lessonsList"
        :key="index"
        :title="item.visCardInfo.title"
        :body-list="item.visCardInfo.bodyList"
        :show-action="item.visCardInfo.showAction"
        :show-status="!item.visCardInfo.showAction"
        :status-text="item.visCardInfo.statusName"
        class="sign-in-list__card"
        action-text="签到"
        action-name="sign-in"
        @sign-in="onAppointmentMake(item)"
      />
    </template>
  </div>
</template>

<script>
import { Toast } from 'vant';
import args from '@youzan/utils/url/args';
// import { format } from 'date-fns';
import { InfoCard } from '@youzan/vis-ui';
import _format from 'date-fns/format';
import mixinVisPage from 'common/mixins/mixin-vis-page';
import { getValidTime, getCourseTimes } from 'common/utils/check-course';
import * as SafeLink from '@youzan/safe-link';

import Api from '../api.js';

const kdtId = window._global.kdt_id;
const studentId = args.get('studentId');
const lessonNo = args.get('lessonNo');
const studentName = args.get('studentName');
export default {
  name: 'sign-in-list-assets',

  config: {
    title: '签到',
    log: {
      auto: true,
      type: 'x',
      id: 0,
    },
  },

  components: {
    'vis-info-card': InfoCard,
  },

  mixins: [mixinVisPage],

  data() {
    return {
      isInited: false,
      lessonsList: [],
    };
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {
    Api.findUserAssetsForSignIn({
      studentId,
      lessonNo,
    })
      .then(res => {
        const lessonsList = res.assetList;

        this.isInited = true;
        this.lessonsList = this.genCardList(lessonsList || []);
      })
      .catch(err => {
        Toast(err);
      });
  },

  methods: {
    genCard(card) {
      const courseDetail = card.courseDetailDTO || {};
      const validTime = getValidTime({
        ...courseDetail,
        rangeTime: card.dateRangStartTime ? `${_format(card.dateRangStartTime, 'YYYY.MM.DD')} - ${_format(card.dateRangEndTime, 'YYYY.MM.DD')}` : '',
      }).value;

      const courseTimes = getCourseTimes({
        courseSellType: courseDetail.courseSellType,
        countRemaining: card.remaining,
        countTotal: card.total,
      });

      const bodyList = [
        {
          name: '学员',
          value: studentName,
        },
        {
          name: courseTimes.name,
          value: courseTimes.value,
        },
        {
          name: '有效期',
          value: validTime,
        },
      ];
      const showAction = card.assetStatus !== 4;
      const statusName = '课时不足';

      return {
        bodyList,
        showAction,
        statusName,
        title: courseDetail.productTitle || '',
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
      const { assetNo } = item || {};
      let lessonNoData = lessonNo;

      Api.postSignInWithAssets({
        lessonNo: lessonNoData,
        studentId: studentId,
        lessonType: 0,
        assetNos: [assetNo],
        kdtId,
      })
        .then(res => {
          // 跳转路径
          (res && typeof res === 'string') && (SafeLink.redirect({
            url: `/wscvis/edu/sign-in-result?kdt_id=${kdtId}&studentLessonNo=${res}`,
            kdtId,
            redirectType: 'replace',
          }));
        })
        .catch(err => {
          Toast(err);
        });
    },
  },
};
</script>

<style lang="scss">
  .sign-in-list {

    &__info {
      color: #969799;
      font-size: 12px;
      margin-top: 15px;
      margin-left: 16px;
    }

    &__lesson-status {
      margin: 10px auto;
    }

    &__empty {
      margin-top: 130px;
      margin-bottom: 130px;
    }

    &__card {
      margin: 10px 10px 0;
      box-sizing: border-box;
    }

    &__empty-button-buy {
      margin-right: 10px;
    }

    &__empty-button {
      background-color: transparent;
      width: 100px;
    }
  }
</style>
