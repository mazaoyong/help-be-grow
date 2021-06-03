<template>
  <div v-if="isInited" class="my-pay">
    <login-tip v-if="isShowLoginTip" />
    <van-tabs
      v-if="tabIds.length > 0"
      v-model="active"
      :line-width="40"
      class="tab-green"
    >
      <!-- 课程列表 -->
      <van-tab v-if="tabShowStatus.course" title="线下课">
        <course-list :active="active === tabIndexMap['course']" type="my">
          <no-data>你还没有购买过线下课哦</no-data>
        </course-list>
      </van-tab>

      <!-- 专栏列表 -->
      <van-tab v-if="tabShowStatus.column" title="专栏">
        <van-list
          :loading="loading || +active !== tabIndexMap['column']"
          :finished="columnFinished"
          :error.sync="columnListError"
          error-text="请求失败，点击重新加载"
          @load="onLoadMore('column')"
        >
          <template v-if="columnList.length">
            <column-item
              v-for="(item, index) in columnList"
              :key="index"
              :item="item"
            />
          </template>
          <no-data v-else>
            你还没有购买过专栏哦
          </no-data>
        </van-list>
      </van-tab>

      <!-- 内容列表 -->
      <van-tab v-if="tabShowStatus.content" title="内容">
        <van-list
          :loading="loading || active !== tabIndexMap['content']"
          :finished="contentFinished"
          :error.sync="contentListError"
          error-text="请求失败，点击重新加载"
          @load="onLoadMore('content')"
        >
          <template v-if="contentList.length">
            <component
              :is="item.mediaType === 4 ? 'live-item' : 'content-item'"
              v-for="(item, index) in contentList"
              :key="index"
              :item="item"
              :progress="progresses[`c-${item.alias}`] || {}"
            />
          </template>
          <no-data v-else>
            你还没有购买过内容哦
          </no-data>
        </van-list>
      </van-tab>

      <!-- 会员列表 -->
      <van-tab v-if="tabShowStatus.benefit" title="会员">
        <template v-if="benefitList.length">
          <benefit-item
            v-for="(item, index) in benefitList"
            :key="index"
            :item="item"
          />
        </template>
        <no-data v-else>
          你还没有购买过会员哦
        </no-data>
      </van-tab>

      <!-- 打卡列表 -->
      <van-tab v-if="tabShowStatus.gci" title="打卡">
        <van-list
          :loading="loading || active !== tabIndexMap['gci']"
          :finished="punchFinished"
          :error.sync="punchListError"
          error-text="请求失败，点击重新加载"
          @load="onLoadMore('punch')"
        >
          <template v-if="punchList.length">
            <punch-item
              v-for="(item, index) in punchList"
              :key="index"
              :item="item"
            />
          </template>
          <no-data v-else>
            你还没有购买过打卡哦
          </no-data>
        </van-list>
      </van-tab>
    </van-tabs>
    <no-data v-else>
      暂无课程
    </no-data>
  </div>
</template>

<script>
import { Tabs, Tab, List } from 'vant';
import YZLocalStorage from 'zan-utils/local_storage';
import mixinVisPage from 'common/mixins/mixin-vis-page';
import LoginTip from '@/components/login-tip';
import { checkAndLogin, forcePhoneLogin } from '@/common/utils/login';
import apis from 'pct/api';
import NoData from '../../components/NoData';
import CourseList from './components/CourseList.vue';
import ColumnItem from './components/ColumnItem.vue';
import ContentItem from './components/ContentItem.vue';
import LiveItem from './components/LiveItem.vue';
import BenefitItem from './components/BenefitItem.vue';
import PunchItem from './components/PunchItem.vue';
import { getBoughtList } from './apis';

export default {
  name: 'my-pay',

  config: {
    title: '我的课程',
  },

  components: {
    'van-tabs': Tabs,
    'van-tab': Tab,
    'van-list': List,
    'login-tip': LoginTip,
    NoData,
    CourseList,
    ColumnItem,
    ContentItem,
    LiveItem,
    BenefitItem,
    PunchItem,
  },

  mixins: [mixinVisPage],

  data() {
    return {
      isInited: false,
      // 当前active tab
      active: 0,
      tabIds: [],
      tabIndexMap: {},
      loading: false,

      // 专栏列表
      columnFinished: false,
      columnList: [],
      columnPageNumber: 1,
      columnPageTotal: 0,
      columnListError: false,

      // 内容列表
      progresses: {},
      contentFinished: false,
      contentList: [],
      contentPageNumber: 1,
      contentPageTotal: 0,
      contentListError: false,

      // 打卡列表
      punchFinished: false,
      punchList: [],
      punchPageNumber: 1,
      punchPageTotal: 0,
      punchListError: false,

      // 会员列表
      benefitList: [],
      benefitPageNumber: 1,

      // tab 显示控制
      tabShowStatus: null,
      isShowLoginTip: !_global.buyer_id, // 如果没有buyerId，则没有用手机号登录
    };
  },

  watch: {
    active(activeIndex) {
      const tabId = this.tabIds[activeIndex];
      if (this[`${tabId}PageNumber`] === 1) {
        this.onLoadMore(tabId);
      }
    },
  },

  created() {
    // 获取内容列表进度数据
    this.getProgresses();
  },

  mounted() {
    const origin = location.search.match(/from=(.*)&?/);
    if (origin && Array.isArray(origin) && origin[1] === 'invoice') {
      forcePhoneLogin((_, userId, doLogin) => {
        this.afterLogin(doLogin);
      });
    } else {
      // 强制用户登录
      checkAndLogin((_, userId, doLogin) => {
        this.afterLogin(doLogin);
      });
    }
  },

  methods: {
    onLoadMore(listType) {
      listType = listType[0].toUpperCase() + listType.slice(1);
      this[`fetchMore${listType}s`]();
    },

    afterLogin(doLogin) {
      if (doLogin) {
        // 如果当前是通过弹框登录的
        return location.reload();
      }
      // 获取不同类别购买状态，来决定是否展示对应tab
      this.calcTabShowStatus();
      this.isInited = true;
    },

    fetchMoreColumns() {
      this.loading = true;
      apis.getAllPaidColumns({
        page: this.columnPageNumber,
        pageSize: 10,
      })
        .then(data => {
          const { content = [], total = 0 } = data;
          this.columnList = this.columnList.concat(content);
          this.columnPageTotal = total;
          if (this.columnList.length >= this.columnPageTotal) {
            this.columnFinished = true;
          }
          this.columnPageNumber = this.columnPageNumber + 1;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.columnFinished = true;
          this.columnListError = true;
        });
    },

    fetchMoreContents() {
      this.loading = true;
      apis.getAllPaidContents({
        pageNumber: this.contentPageNumber,
        pageSize: 10,
      })
        .then(data => {
          const { items = [], paginator = 0 } = data;
          this.contentList = this.contentList.concat(items);
          this.contentPageTotal = paginator.totalCount;
          if (this.contentList.length >= this.contentPageTotal) {
            this.contentFinished = true;
          }
          this.contentPageNumber = this.contentPageNumber + 1;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.contentFinished = true;
          this.contentListError = true;
        });
    },

    fetchMoreBenefits() {
      this.loading = true;
      apis.getAllPaidBenefits({})
        .then(list => {
          this.benefitList = list;
          this.benefitPageNumber = 2;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    fetchMorePunchs() {
      this.loading = true;
      getBoughtList({
        page: this.punchPageNumber,
        size: 10,
      })
        .then(res => {
          this.punchList = this.punchList.concat(res.content);
          this.punchPageTotal = res.total;
          if (this.punchList.length >= this.punchPageTotal) {
            this.punchFinished = true;
          }
          this.punchPageNumber = this.punchPageNumber + 1;
        })
        .catch(() => {
          this.punchFinished = true;
          this.punchListError = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    getProgresses() {
      // 获取 Storage 中存储的进度信息
      const progresses = YZLocalStorage.getItem('paidcontent:progress') || '{}';
      this.progresses = JSON.parse(progresses);
    },

    calcTabShowStatus() {
      apis.checkExist()
        .then(data => data)
        .catch(() => {
          // 出错兜底tab全部展示
          const isYZEdu = window._global.isYZEdu;
          return { course: isYZEdu, content: true, column: true, benefit: true, gci: true };
        })
        .then(tabShowStatus => {
          const tabIds = [
            'course',
            'column',
            'content',
            'benefit',
            'gci',
          ].filter(tabId => tabShowStatus[tabId]);
          const tabIndexMap = tabIds
            .reduce((tabIndexMap, tabId, tabIndex) => {
              tabIndexMap[tabId] = tabIndex;
              return tabIndexMap;
            }, {});
          // fix 会员tab未使用vislist，且当仅存在一个tab时，watch不到active变更，会导致不触发第一次数据获取
          // 这类情况初始就获取一次
          const noVisListIds = ['benefit'];
          noVisListIds.map(id => {
            if (tabIds.indexOf(id) >= 0) {
              this.onLoadMore(id);
            }
          });
          this.tabShowStatus = tabShowStatus;
          this.tabIds = tabIds;
          this.tabIndexMap = tabIndexMap;
        });
    },
  },
};
</script>

<style lang="scss">
@import 'var';

.my-pay {

  .tab-green {

    .van-tabs__line {
      /* background-color: $c-green-wx; */
      height: 3px;
      border-radius: 1.5px;
    }

    .van-tab--active {
      color: #323233;
      font-weight: 500;
    }
  }
}
</style>
