<template>
  <div class="container">
    <switch-bar
      v-if="!isEduSingleStore"
      :campus-name="campusName"
      :campus-total="campusTotal"
    />
    <div class="container-flex container-data container-border-radius">
      <div
        v-for="item in dataPreview"
        :key="item.labelType"
        class="container-item container-data__item"
        @click="onGoList(item.filterType)"
      >
        <p class="container-item-num container-data__item-num">
          {{ item.labelNum }}
        </p>
        <p class="container-item-name container-data__item-name">
          {{ item.labelName }}
        </p>
      </div>
    </div>

    <div class="container-todo container-border-radius">
      <div class="container-title-label">
        今日待办
      </div>
      <div class="container-flex">
        <div
          v-for="item in dataTodo"
          :key="item.labelType"
          class="container-item container-todo__item"
          @click="onGoList(item.labelType)"
        >
          <p class="container-item-num container-todo__item-num">
            {{ item.labelNum }}
          </p>
          <p class="container-item-name container-todo__item-name">
            {{ item.labelName }}
            <vis-icon name="arrow" size="12px" color="#c8c9cc" />
          </p>
        </div>
      </div>
    </div>

    <div class="container-action container-border-radius">
      <div class="container-title-label">
        常用功能
      </div>
      <div class="container-flex">
        <div
          v-for="item in actions"
          :key="item.labelType"
          class="container-item container-action__item"
          @click="onGoPage(item.url)"
        >
          <div v-if="item.showTip" class="container-action__item-tip" />
          <p class="container-action__item-icon">
            <vis-icon
              v-if="item.icon"
              :name="item.icon"
              size="24px"
              color="#00b389"
            />
            <img
              v-if="item.iconUrl"
              class="container-action__item-icon-url"
              :src="item.iconUrl"
              alt=""
            >
          </p>
          <p class="container-action__item-name">
            {{ item.labelName }}
          </p>
        </div>
      </div>
    </div>

    <tab active="workTable" />
  </div>
</template>

<script>
import { Icon } from '@youzan/vis-ui';
import ZNB from '@youzan/znb';
import { workTable } from 'pages-api';
import tab from 'components/tab/index.vue';
import switchBar from '../../components/switch-bar';
import { isEduHqStore, isEduSingleStore } from '@youzan/utils-shop';
import { versionWrapper } from '@/vis-shared/configs/version/fns';
import { checkAccess } from 'utils/permission';

const global = window._global;

ZNB.init({ kdtId: global.kdtId });

export default {
  name: 'work-table',
  components: {
    'vis-icon': Icon,
    'tab': tab,
    'switch-bar': switchBar
  },
  data() {
    return {
      isEduSingleStore,
      dataPreview: [
        {
          labelType: 'todayAdd',
          labelName: '今日新增',
          labelNum: 0,
          filterType: 'todayNew'
        },
        {
          labelType: 'todayFollow',
          labelName: '今日已跟进',
          labelNum: 0,
          filterType: 'todayVisit'
        },
        {
          labelType: 'myClue',
          labelName: '我的线索',
          labelNum: 0
        }
      ],
      dataTodo: [
        {
          labelType: 'follow',
          labelName: '待跟进',
          labelNum: 0
        },
        {
          labelType: 'overdue',
          labelName: '已逾期',
          labelNum: 0
        },
        {
          labelType: 'visit',
          labelName: '今日待回访',
          labelNum: 0
        }
      ],
      actions: [],
      isEduHqStore,
      campusName: global.shopInfo && global.shopInfo.shopName,
      campusTotal: global.campusInfo && global.campusInfo.total,
      is7988: global.versionStatus && global.versionStatus.versionCode === 'edu_version'
    };
  },
  computed: {
    dataAction() {
      return versionWrapper('workTableBtns', this.actions);
    },
    hasHomeworkShopAuth() {
      const whitelist = _global.whitelist || {};
      const enableHomework = whitelist.homework || _global.nodeEnv === 'qa';
      return enableHomework && !this.is7988;
    }
  },
  created() {
    this.initData();
    this.init();
  },
  methods: {
    onGoPage(url) {
      window.location.href = url;
    },

    onGoList(type) {
      if (checkAccess('线索-我的线索', '查看')) {
        const query = type ? `?searchType=${type}` : '';
        window.location.href = `/v4/vis/h5/edu/clue#clue-list${query}`;
      }
    },

    initData() {
      if (checkAccess('线索-我的线索', '编辑')) {
        this.actions.push({
          labelType: 'addClue',
          labelName: '添加线索',
          icon: 'clue',
          url: '/v4/vis/h5/edu/clue/update-clue?type=add'
        });
      }

      if (!isEduHqStore && checkAccess('教务-预约管理', '查看')) {
        this.actions.push({
          labelType: 'doTest',
          labelName: '办理试听',
          icon: 'transaction',
          url: '/v4/vis/h5/edu/book-listen'
        });
      }

      if (checkAccess('教务-排课', '查看')) {
        this.actions.push({
          labelType: 'schedule',
          labelName: '查看课表',
          icon: 'classschedule',
          url: '/v4/vis/h5/edu/lesson-list'
        });
      }

      if (checkAccess('教务-排课', '查看')) {
        this.actions.push({
          labelType: 'moments',
          labelName: '家校圈',
          iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAoCAMAAAChHKjRAAAAWlBMVEUAAAAAtIkAtIoAtIoAtooAs4kAtIkAuYsAs4kAs4kAs4wAto0AtosAtowAtowAvJQAv44As4oAs4kAtIkAs4oAs4oAs4n////j9vJJyKrm9/Om5NUcu5Xt+fahLXhyAAAAFnRSTlMA2b+AP/TjIezHVDEmSTkTDN7Oq4deocri+wAAAOJJREFUOMvVkO0OgiAARS+g4ldqX2ha7/+aDaXrFlCttVXnD+7uqGdgk5kI2QY36AQsSuYBH5XmtqeStV6RzLek0zCceMakoe8Hnm9K/u9+5Qr+Tko5jf3MyCGlJLhNizRxEJQkt/PFOpczBwl0i6TMak3jOK2OUUC9SJWJUgGJaxPGh0nKPZQxqQSwc20owk4Bm+TaoPOQk2sA+1vbXOeTAGjYZq3c+4512i3bLLq469F2la6NlMIQMb/bSratVEqKNBVSVbA0W7bFqPds82l119WJ2q1tIY5eW5DmIDO2LVwBBYJfj1JqrwQAAAAASUVORK5CYII=',
          url: '/v4/vis/h5/edu/moments/feeds',
          showTip: false
        });
      }

      if (this.hasHomeworkShopAuth) {
        if (checkAccess('督学互动', '作业', '查看')) {
          this.actions.push({
            labelType: 'homework',
            labelName: '作业本',
            icon: 'zuoyeben',
            url: '/v4/vis/h5/supv/homework/#/book/list',
            showTip: false
          });
        } else {
          workTable
            .checkHasHomework()
            .then(res => {
              if (res) {
                this.actions.push({
                  labelType: 'homework',
                  labelName: '作业本',
                  icon: 'zuoyeben',
                  url: '/v4/vis/h5/supv/homework/#/book/list',
                  showTip: false
                });
              }
            });
        }
      }
    },

    init() {
      workTable
        .GetWorkTableData()
        .then((res = {}) => {
          this.dataPreview[0].labelNum = res.incNewlyNum || 0;
          this.dataPreview[1].labelNum = res.implClueNumToday || 0;
          this.dataPreview[2].labelNum = res.residualClueNum || 0;
          this.dataTodo[0].labelNum = res.followUpNum || 0;
          this.dataTodo[1].labelNum = res.overdueNum || 0;
          this.dataTodo[2].labelNum = res.waitVisitNum || 0;
        });

      workTable
        .findMessageBox()
        .then(res => {
          if (
            res
          ) {
            this.actions.forEach(item => {
              if (item.labelType === 'moments') {
                item.showTip = true;
              }
            });
          }
        });
    }
  }
};
</script>

<style lang="scss">
@import '../../styles/mixins/border-retina.css';

.container {
  padding: 10px;
  width: 100%;
  min-height: 100%;
  background-color: #f7f8fa;

  &-border-radius {
    margin-top: 12px;
    border-radius: 4px;
    background-color: #fff;
  }

  &-title-label {
    position: relative;
    height: 38px;
    padding: 10px;
    font-size: 13px;
    color: #646566;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 200%;
      height: 200%;
      transform: scale(.5);
      transform-origin: 0 0;
      pointer-events: none;
      box-sizing: border-box;
      border-bottom: 1px solid #d8d8d8;
    }
  }

  &-flex {
    display: flex;
    justify-content: space-around;
  }

  &-item {
    position: relative;
    width: 100%;
    text-align: center;

    &:nth-child(2) {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 200%;
        height: 200%;
        transform: scale(.5);
        transform-origin: 0 0;
        pointer-events: none;
        box-sizing: border-box;
      }
    }

    &-num {
      margin-bottom: 5px;
      line-height: 28px;
      font-size: 20px;
      font-weight: 500;
    }

    &-name {
      line-height: 20px;
      font-size: 14px;
    }
  }

  &-data {
    margin: 0;
    padding: 20px 0;
    text-align: center;
    color: #fff;
    background-color: #00b389;

    &__item {

      &:nth-child(2) {
        &::after {
          border-left: 1px solid rgba(255, 255, 255, .5);
          border-right: 1px solid rgba(255, 255, 255, .5);
        }
      }
    }
  }

  &-todo {
    .container-flex {
      padding: 10px 0 20px;
    }

    &__item {
      &:nth-child(2) {
        &::after {
          border-left: 1px solid #d8d8d8;
          border-right: 1px solid #d8d8d8;
        }
      }

      &-num {
        color: #323233;
      }

      &-name {
        padding-left: 10px;
        color: #969799;
      }
    }
  }

  &-action {
    .container-flex {
      padding: 17px 0 0;
      flex-wrap: wrap;
      justify-content: left;
    }

    &__item-icon {
      height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__item {
      margin-bottom: 29px;
      width: 33.3%;
      position: relative;

      &-name {
        margin-top: 8px;
        line-height: 20px;
        font-size: 14px;
        color: #969799;
      }
    }

    &__item-icon-url {
      display: block;
      width: 18px;
      height: 20px;
    }

    &__item-tip {
      width: 6px;
      height: 6px;
      border-radius: 3px;
      background-color: #d0021b;
      position: absolute;
      left: 50%;
      top: -6px;
      margin-left: 12px;
    }
  }
}
</style>
