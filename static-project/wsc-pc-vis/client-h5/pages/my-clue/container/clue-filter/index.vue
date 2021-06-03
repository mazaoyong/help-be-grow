<template>
  <div class="clue-filter-options-wrap">
    <div v-if="fetchedSource && fetchedTag" class="clue-filter-options-wrap__collapse">
      <div
        v-for="(item, index) in filterOptions"
        :key="item.type"
        :class="['clue-filter-options-wrap__collapse-item', item.type]"
      >
        <div
          :id="item.type"
          :class="['clue-filter-options-wrap__collapse-item-title', item.type]"
          @click="onToggleContent(item, index)"
        >
          <span>{{ item.label }}</span>
          <span
            v-show="activeNames.indexOf(item.type) === -1"
            class="clue-filter-options-wrap__collapse-item-title-selected"
          >
            {{ parseCollection(item.type) }}
          </span>
          <vis-icon
            :name="activeNames.indexOf(item.type)===-1 ? 'arrow-down' : 'arrow-up'"
            size="12px"
            color="#c8c9cc"
          />
        </div>
        <div
          v-if="activeNames.indexOf(item.type) !== -1"
          class="clue-filter-options-wrap__collapse-item-content"
        >
          <template v-if="item.type==='phase'">
            <filter-option-item
              v-for="opt in item.options"
              :id="opt.id"
              :key="opt.id"
              :name="opt.name"
              :is-multi="false"
              :checked-list="checkedPhase"
              @checkedItem="val => onCheckedItem(val, item.type)"
            />
          </template>
          <template v-else-if="item.type==='tag' || item.type==='source'">
            <div
              v-if="item.options.length===0"
              class="empty"
            >
              <span>暂无{{ item.type==='tag' ? '标签' : '来源' }}</span>
            </div>
            <template v-else>
              <filter-option-group
                v-for="opt in item.options"
                :key="opt.groupId"
                :group-name="opt.name"
              >
                <template v-if="item.type === 'source'">
                  <filter-option-item
                    :id="opt.groupId"
                    name="全部"
                    :checked-list="checkedSource"
                    @checkedItem="val => onCheckedItem(val, 'sourceGroup')"
                  />
                </template>
                <filter-option-item
                  v-for="sub in opt.subList"
                  :id="sub.id"
                  :key="sub.id"
                  :name="sub.name"
                  :checked-list="item.type==='tag' ? checkedTag : checkedSource"
                  @checkedItem="val => onCheckedItem(val, item.type)"
                />
              </filter-option-group>
            </template>
          </template>
          <filter-date-select
            v-else
            :checked-btn="dateBtnType[item.type]"
            :start-at="item.options.startTime"
            :end-at="item.options.endTime"
            @checkedDate="(startTime, endTime, btnType) => onCheckedDate(startTime, endTime, btnType, item.type)"
          />
        </div>
      </div>
    </div>

    <div class="clue-filter-options-wrap__button f-safeArea">
      <van-button
        class="clue-filter-options-wrap__button-reset"
        @click="onReset"
      >
        重置
      </van-button>
      <van-button
        class="clue-filter-options-wrap__button-sure"
        @click="onSubmit"
      >
        确定
      </van-button>
    </div>
  </div>
</template>

<script>
import { Button } from 'vant';
import { Icon } from '@youzan/vis-ui';
import accMul from 'zan-utils/number/accMul';
import formatDate from 'zan-utils/date/formatDate';
import flatten from 'lodash/flatten';
import FilterOptionItem from './components/clue-filter-options/FilterOptionItem';
import FilterOptionGroup from './components/clue-filter-options/FilterOptionGroup';
import FilterDateSelect from './components/clue-filter-options/FilterDateSelect';

export default {
  name: 'clue-filter-options',

  components: {
    'vis-icon': Icon,
    'van-button': Button,
    FilterOptionItem,
    FilterOptionGroup,
    FilterDateSelect
  },

  data() {
    return {
      filterOptions: [
        {
          titleClass: 'phase-1',
          type: 'phase',
          label: '阶段',
          isMultiCheck: false,
          options: [
            {
              name: '待跟进',
              id: 2
            },
            {
              name: '待邀约',
              id: 3
            },
            {
              name: '待试听',
              id: 4
            },
            {
              name: '已试听',
              id: 5
            },
            {
              name: '已成交',
              id: 6
            }
          ]
        },
        {
          titleClass: 'tag-1',
          type: 'tag',
          label: '标签(可多选)',
          isMultiCheck: true,
          options: []
        },
        {
          titleClass: 'source-1',
          type: 'source',
          label: '来源',
          isMultiCheck: false,
          options: []
        },
        {
          titleClass: 'record-1',
          type: 'recordUpdatedAt',
          label: '动态更新时间',
          isMultiCheck: false,
          options: {}
        },
        {
          titleClass: 'create-1',
          type: 'createdAt',
          label: '创建时间',
          isMultiCheck: false,
          options: {}
        },
        {
          titleClass: 'revisit-1',
          type: 'revisitTime',
          label: '回访时间',
          isMultiCheck: false,
          options: {}
        }
      ],
      activeNames: ['phase', 'tag', 'source'],
      formated: false,
      checkedList: '',
      checkedPhase: 0,
      checkedTag: [],
      checkedSource: 0,
      filterData: {
      },
      tagList: [],
      sourceList: [],
      tagPageNumber: 1,
      sourcePageNumber: 1,
      pageSize: 10,
      fetchedTag: false,
      fetchedSource: false,
      dateBtnType: {},
      outerContainer: '',
      innerContainer: '',
      headers: [],
      headersEle: [],
      scrollHeight: 0,
      lastShowHeader: '',
      useTranslateZ: true
    };
  },

  created() {
    Promise.all([
      this.fetchTagList(),
      this.fetchSourceList()
    ])
      .then(([fetchedTag, fetchedSource]) => {
        if (fetchedTag && fetchedSource) {
          this.initScroll();
        }
      });

    this.initData();
  },

  mounted() {
    this.$nextTick(() => {
      window.addEventListener('scroll', () => {
        this.computePostion();
      });
    });
  },

  methods: {
    initScroll() {
      this.headers = this.filterListHeader();
      this.init();
    },

    init() {
      this.headers.forEach(id => {
        let header = this.getDom(id);
        if (header) {
          this.headersEle.push(this.setHeader(header));
        }
      });
    },

    getDom(dom) {
      let element = '';
      if (typeof dom === 'string') {
        element = document.getElementById(dom);
      } else if (dom instanceof HTMLElement) {
        element = dom;
      }

      return element;
    },

    /**
     * clone header and set headers style
     *
     * @param {HTMLElement} node
     */
    setHeader(node) {
      const cloneNode = node.cloneNode();
      cloneNode.style.width = node.offsetWidth + 'px';
      cloneNode.style.height = node.offsetHeight + 'px';
      cloneNode.style.display = 'none';
      cloneNode.style.position = 'static';
      node.style.top = node.offsetTop + 'px';
      node.style.left = node.offsetLeft + 'px';
      node.style.width = node.offsetWidth + 'px';
      node.style.height = node.offsetHeight + 'px';

      this.insertAfter(cloneNode, node);
      return {
        protoNode: node,
        cloneNode: cloneNode,
        top: node.offsetTop,
        left: node.offsetLeft,
        width: node.offsetWidth,
        height: node.offsetHeight,
        position: window.getComputedStyle(node).position
      };
    },

    insertAfter(newElement, targetElement) {
      var parent = targetElement.parentNode;
      if (parent.lastChild === targetElement) {
        parent.appendChild(newElement);
      } else {
        parent.insertBefore(newElement, targetElement.nextSibling);
      }
    },

    computePostion(e) {
      this.headersEle.forEach(header => {
        let { protoNode, ...property } = header;
        if (property.top < window.pageYOffset + property.height) {
          if (this.lastShowHeader) {
            let lastShowHeaderProperty = this.headersEle.find(ele => this.lastShowHeader === ele.protoNode);
            this.lastShowHeader.style.top = property.top - window.pageYOffset - lastShowHeaderProperty.height + 'px';
          }
        }

        if (property.top < window.pageYOffset) {
          if (this.useTranslateZ) {
            protoNode.style.position = 'fixed';
          } else {
            protoNode.style.position = 'absolute';
          }
          protoNode.style.top = '0';
          this.lastShowHeader = protoNode;
          property.cloneNode.style.display = 'block';
        } else {
          protoNode.style.position = property.position;
          property.cloneNode.style.display = 'none';
        }
      });
    },

    initData() {
      this.filterData = this.$store.getters['clueListModule/clueInfoQuery'];
      this.dateBtnType = this.$store.getters['clueListModule/clueInfoDateType'];
      const {
        phase,
        tags = [],
        sourceId,
        recordDateRange,
        createAtDateRange,
        revisitDateRange
      } = this.filterData;
      this.checkedPhase = phase;
      this.checkedTag = tags;
      this.checkedSource = sourceId;
      this.filterOptions[3].options = { ...recordDateRange };
      this.filterOptions[4].options = { ...createAtDateRange };
      this.filterOptions[5].options = { ...revisitDateRange };
    },

    filterListHeader() {
      const listHeader = [];
      this.filterOptions.forEach(item => {
        listHeader.push(item.type);
      });
      return listHeader;
    },

    fetchTagList() {
      const tagParam = {
        pageNumber: this.tagPageNumber,
        pageSize: this.pageSize
      };
      return new Promise((resolve) => {
        this.$store.dispatch('clueListModule/fetchTagList', tagParam)
          .then(res => {
            const content = res.content;
            const total = res.total;
            this.tagList = this.tagList.concat(content);
            if (accMul(this.tagPageNumber, this.pageSize) < total) {
              this.tagPageNumber++;
              return this.fetchTagList();
            }
          })
          .then(() => {
            this.fetchedTag = true;
            this.filterOptions[1].options = [].concat(this.formatData(this.tagList, 'tag'));
            resolve(this.fetchedTag);
          })
          .catch(() => {
            this.fetchedTag = true;
            resolve(this.fetchedTag);
          });
      });
    },

    fetchSourceList() {
      const tagParam = {
        pageNumber: this.sourcePageNumber,
        pageSize: this.pageSize,
        needSystemDefault: true
      };
      return new Promise((resolve) => {
        this.$store.dispatch('clueListModule/fetchSourceList', tagParam)
          .then(res => {
            const content = res.content;
            const total = res.total;
            this.sourceList = this.sourceList.concat(content);
            if (accMul(this.sourcePageNumber, this.pageSize) < total) {
              this.sourcePageNumber++;
              return this.fetchSourceList();
            }
          })
          .then(() => {
            this.fetchedSource = true;
            this.filterOptions[2].options = [].concat(this.formatData(this.sourceList, 'source'));
            resolve(this.fetchedSource);
          })
          .catch(() => {
            this.fetchedSource = true;
            resolve(this.fetchedSource);
          });
      });
    },

    formatData(data, type) {
      data.forEach(item => {
        if (type === 'source') {
          (item.sourceDTOS || []).forEach(ele => {
            ele.id = ele.sourceId;
          });
          item.subList = item.sourceDTOS;
        } else {
          (item.tagDTOS || []).forEach(ele => {
            ele.id = ele.tagId;
          });
          item.subList = item.tagDTOS;
        }
      });
      return data;
    },

    onCheckedItem(val, type) {
      if (type === 'phase') {
        this.checkedPhase = this.checkedPhase === val ? 0 : val;
        this.checkedPhase ? (this.filterData.phase = this.checkedPhase) : delete this.filterData['phase'];
      } else if (type === 'tag') {
        if (this.checkedTag.indexOf(val) === -1) {
          this.checkedTag.push(val);
        } else {
          this.checkedTag.splice(this.checkedTag.indexOf(val), 1);
        }
        this.checkedTag.length ? (this.filterData.tags = this.checkedTag) : delete this.filterData.tags;
      } else if (type === 'source') {
        // 每个来源分组下需要增加一个全部选项，当选择全部的时候需要传给后端 groupId
        // 选中某个来源的时候则需要传 sourceId，所以需要删除一下
        delete this.filterData.groupId;
        this.checkedSource = this.checkedSource === val ? 0 : val;
        this.checkedSource ? (this.filterData.sourceId = this.checkedSource) : delete this.filterData.sourceId;
      } else if (type === 'sourceGroup') {
        this.checkedSource = this.checkedSource === val ? 0 : val;
        if (this.checkedSource) {
          delete this.filterData.sourceId;
          this.filterData.groupId = this.checkedSource;
        }
      }

      // this.$store.dispatch('clueListModule/updateClueInfoDateType', this.dateBtnType);
    },

    onCheckedDate(startTime, endTime, btnType, type) {
      const recordDateRange = {};
      const createAtDateRange = {};
      const revisitDateRange = {};
      if (type === 'recordUpdatedAt') {
        startTime ? (recordDateRange.startTime = startTime) : delete recordDateRange.startTime;
        endTime ? (recordDateRange.endTime = endTime) : delete recordDateRange.endTime;
        this.filterData.recordDateRange = recordDateRange;
      } else if (type === 'createdAt') {
        startTime ? (createAtDateRange.startTime = startTime) : delete createAtDateRange.startTime;
        endTime ? (createAtDateRange.endTime = endTime) : delete createAtDateRange.endTime;
        this.filterData.createAtDateRange = createAtDateRange;
      } else {
        startTime ? (revisitDateRange.startTime = startTime) : delete revisitDateRange.startTime;
        endTime ? (revisitDateRange.endTime = endTime) : delete revisitDateRange.endTime;
        this.filterData.revisitDateRange = revisitDateRange;
      }
      // this.$store.dispatch('clueListModule/updateClueInfoQuery', this.filterData);
      this.dateBtnType[type] = btnType;
      // this.$store.dispatch('clueListModule/updateClueInfoDateType', this.dateBtnType);
    },

    onSubmit() {
      this.$store.dispatch('clueListModule/updateClueInfoQuery', this.filterData);
      this.$store.dispatch('clueListModule/updateClueInfoDateType', this.dateBtnType);
      // this.$router.push({ path: '/clue-list' });
      this.$router.go(-1);
    },

    onReset() {
      this.filterData = {};
      this.dateBtnType = {};
      this.$store.dispatch('clueListModule/updateClueInfoQuery', this.filterData);
      this.$store.dispatch('clueListModule/updateClueInfoDateType', this.dateBtnType);
      this.initData();
      // this.$router.push({ path: '/clue-list' });
    },

    onToggleContent(item, index) {
      if (this.activeNames.indexOf(item.type) === -1) {
        this.activeNames.push(item.type);
      } else {
        this.activeNames.splice(this.activeNames.indexOf(item.type), 1);
      }
    },

    parseCollection(type) {
      let options = (this.filterOptions.find(filter => type === filter.type) || {}).options;
      if (!options) {
        return;
      }
      let collection = null;
      switch (type) {
        case 'phase':
          options.length && (collection = (options.find(item => item.id === this.checkedPhase) || {}).name);
          break;
        case 'tag':
        case 'source':
          let transfType = type.replace(/(\s|^)[a-z]/g, (str) => str.toUpperCase());
          let subList = [];
          let checkedCollection = this[`checked${transfType}`];
          options.length && options.forEach(option => {
            if (option.subList && option.subList.length) {
              subList.push(option.subList);
            }
          });
          subList = flatten(subList);
          if (Array.isArray(checkedCollection)) {
            collection = [];
            checkedCollection.length && subList.forEach(sub => {
              checkedCollection.indexOf(sub.id) > -1 && collection.push(sub.name);
            });
            collection = collection.join(',');
          } else {
            checkedCollection && (collection = (subList.find(sub => checkedCollection === sub.id) || {}).name);
          }
          break;
        case 'recordUpdatedAt':
        case 'createdAt':
        case 'revisitTime':
          const dateList = ['今天', ' 昨天', '近7天', '近30天'];
          if (this.dateBtnType[type] === 0) {
            collection = `${formatDate(options.startTime, 'YYYY-MM-DD HH:mm')}-${formatDate(options.endTime, 'YYYY-MM-DD HH:mm')}`;
          } else {
            collection = dateList[this.dateBtnType[type] - 1];
          }
          break;
        default:
          break;
      };
      return collection;
    }

  }
};
</script>

<style lang="postcss">
  .clue-filter-options-wrap {
    height: 100%;
    min-height: 100vh;
    padding: 10px;
    padding-bottom: 50px;
    overflow: hidden;
    background-color: #f2f3f5;
    overflow: auto;

    /* .tag,
    .source {
      margin-top: -15px;
    } */

    &__button {
      position: fixed;
      display: flex;
      width: 100%;
      left: 0;
      bottom: 0;

      .van-button {
        width: 100%;
        height: 50px;
        border: 0;
        font-size: 14px;
        color: #323233;
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, .1);
        border-radius: 0;
      }

      &-sure {
        color: #fff !important;
        background-color: #00b389;
      }
    }

    &__collapse{
      height: 100%;
      padding: 10px;
      background-color: #fff;
      border-radius: 4px;

      &-item {
        &-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 30px;
          line-height: 30px;
          /* padding: 15px 0; */
          margin-bottom: 10px;
          font-weight: 500;
          font-size: 13px;
          color: #323233;
          background-color: #fff;

          &-selected {
            flex: 1;
            margin: 0 8px 0 71px;
            color: #00b389;
            text-align: right;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        &-content {
          .empty {
            padding: 20px 0 30px;
            text-align: center;
            font-size: 13px;
            color: #999;
          }
        }
      }
    }
  }
</style>
