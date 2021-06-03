<template>
  <div class="clue-phase-order-search">
    <form action="/" onsubmit="return false">
      <van-search
        v-model="value"
        class="clue-phase-order-search__van-search"
        :class="{ shadow: showFilter }"
        :placeholder="placeholder"
        show-action
        shape="round"
        @search="simpleSearch"
      >
        <div
          class="right-filter"
          :class="{ active: filterActive }"
          slot="action"
          @click="toggleShowFilter"
        >
          <span>筛选</span>
          <van-icon name="filter-o" size="14px" :color="filterActive ? '#00b389' : '#323233'" />
        </div>
      </van-search>
    </form>
    <!-- 筛选弹出层 -->
    <van-popup
      v-model="showFilter"
      class="clue-phase-order-search__van-popup"
      position="top"
      get-container="body"
      :close-on-click-overlay="!showDateTimePicker"
    >
      <filter-group title="查看范围">
        <filter-item v-model="viewSelectable" text="仅查看可选订单" />
      </filter-group>
      <filter-group title="下单时间">
        <filter-date-select
          v2
          @checkedDate="checkedDate"
          @dateTimePickerVisibleChange="onDateTimePickerVisibleChange"
          ref="dateSelect"
        />
      </filter-group>
      <bottom-bar>
        <van-button type="default" @click="reset">
          重置
        </van-button>
        <van-button type="primary" @click="search">
          确定
        </van-button>
      </bottom-bar>
    </van-popup>
  </div>
</template>

<script>
import { Search, Icon, Popup, Button } from 'vant';
import FilterGroup from './filter-group';
import FilterItem from './filter-item';
import FilterDateSelect from '../../../../my-clue/container/clue-filter/components/clue-filter-options/FilterDateSelect';
import BottomBar from './bottom-bar';
export default {
  name: 'order-search',
  components: {
    'van-search': Search,
    'van-icon': Icon,
    'van-popup': Popup,
    'van-button': Button,
    FilterItem,
    FilterGroup,
    FilterDateSelect,
    BottomBar,
  },
  data() {
    return {
      placeholder: '搜索订单编号/课程/学员',
      value: '',
      showFilter: false,
      viewSelectable: false,
      startTime: '',
      endTime: '',
      isSimpleSearch: true,
      showDateTimePicker: false,
      filterParams: {
        startTime: '',
        endTime: '',
        viewSelectable: false,
      },
    };
  },
  computed: {
    filterActive() {
      return this.showFilter || !this.isSimpleSearch;
    },
  },
  watch: {
    showFilter(showFilter) {
      if (showFilter && this.$refs.dateSelect) {
        this.viewSelectable = this.filterParams.viewSelectable;
        this.startTime = this.filterParams.startTime;
        this.endTime = this.filterParams.endTime;
        this.$refs.dateSelect.setTime(this.startTime, this.endTime);
      }
    },
  },
  methods: {
    simpleSearch() {
      this.isSimpleSearch = true;
      this.$emit('search', {
        text: this.value.trim(),
      });
      this.filterParams = {
        startTime: '',
        endTime: '',
        viewSelectable: false,
      };
      this.showFilter = false;
      this.$refs.dateSelect.hideDatePop();
    },
    search() {
      this.showFilter = false;
      if (this.startTime || this.endTime || this.viewSelectable) {
        this.isSimpleSearch = false;
      } else {
        this.isSimpleSearch = true;
      }
      this.$emit('search', {
        text: this.value.trim(),
        startTime: this.startTime,
        endTime: this.endTime,
        onlySelectable: this.viewSelectable,
      });
      this.filterParams = {
        startTime: this.startTime,
        endTime: this.endTime,
        viewSelectable: this.viewSelectable,
      };
    },
    checkedDate(startTime, endTime) {
      this.startTime = startTime;
      this.endTime = endTime;
    },
    reset() {
      this.viewSelectable = false;
      this.startTime = this.endTime = '';
      this.$refs.dateSelect.reset();
    },
    onDateTimePickerVisibleChange(show) {
      this.showDateTimePicker = show;
    },
    toggleShowFilter() {
      this.showFilter = !this.showFilter;
      if (this.showDateTimePicker) {
        this.$refs.dateSelect.hideDatePop();
      }
    },
  },
};
</script>

<style lang="postcss">
.clue-phase-order-search {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  height: 55px;
  z-index: 79999;

  &__van-search {
    position: relative;
    z-index: 80000;
    transition: box-shadow 0.3s;

    &.shadow {
      box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1);
    }

    input {
      -webkit-appearance: none;
    }
  }

  &__van-popup {
    top: 55px;
  }

  .right-filter {
    span {
      margin-right: 5px;
      vertical-align: 2px;
    }

    &.active {
      color: #00b389;
    }
  }

  .van-button {
    border-radius: 0;
  }
}
</style>
