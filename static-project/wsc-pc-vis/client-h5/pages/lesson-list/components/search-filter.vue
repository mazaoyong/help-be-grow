<template>
  <div class="vis-search-filter-container">
    <div class="vis-search-filter-wrapper">
      <div class="search-wrapper" :class="overlayShow ? 'focus' : 'blur'">
        <van-dropdown-menu active-color="#00b389" class="dropdown-menu">
          <van-dropdown-item
            v-model="dropdownValue"
            :options="dropdownOptions"
            class="dropdown-item"
            @change="onDropdownValueChange"
          />
        </van-dropdown-menu>
        <div class="search-with-tag">
          <van-field
            ref="keywordSearch"
            v-model="keyword"
            class="search-field"
            :label-width="labelWidthCompute"
            :placeholder="selectedValue.length ? '' : placeholder"
            @focus="onFieldFocus"
            @input="onSearchInput"
            @keydown.13="onEnter"
          >
            <div
              v-if="selectedValue.length"
              slot="label"
              ref="searchTag"
              class="search-field-tag"
              @click="onLabelClick"
            >
              <div class="tag-wrapper">
                <div
                  v-for="(tag, index) in selectedValue"
                  :key="tag.id"
                  ref="tags"
                  class="tag"
                >
                  <p class="tag-text">
                    {{ tag.teacherName || tag.staffName }}
                  </p>
                  <van-icon name="cross" class="icon" @click="e => onDeleteOne(e, index)" />
                </div>
                <p v-if="selectedValue.length >= maxShowTagNum" class="length-word">
                  等{{ selectedValue.length }}{{ tagUnit }}
                </p>
              </div>
            </div>
            <div slot="left-icon">
              <van-icon name="search" class="left-search"/>
            </div>
            <div v-show="overlayShow" slot="right-icon" @click="onClear">
              <van-icon name="clear" class="right-close"/>
            </div>
          </van-field>
        </div>
      </div>
      <a v-show="overlayShow" class="cancel-btn" @click="onCancel">取消</a>
    </div>

    <div v-show="overlayShow" class="overlay-container">
      <transition name="van-slide-down">
        <van-list
          v-model="searching"
          :finished="finished"
          finished-text="没有更多了"
          :error.sync="isError"
          class="teacher-list"
          error-text="请求失败，点击重新加载"
          @load="onLoad"
        >
          <div
            v-for="item in searchList"
            :key="item.id"
            class="teacher-cell"
            @click="onSelect(item)"
          >
            <div class="teacher-cell-info">
              <p>{{ item.teacherName || item.staffName }}&nbsp;{{ item.mobile }}</p>
            </div>
            <van-icon
              v-if="selectedValue.find(teacher => teacher.id === item.id)"
              name="success"
              class="selected-logo"
            />
          </div>
        </van-list>
      </transition>
    </div>
  </div>
</template>
<script>
import { Field, DropdownMenu, DropdownItem, Icon, List, Toast } from 'vant';
import _debounce from 'lodash/debounce';
let debounceIns;
export default {
  components: {
    'van-dropdown-menu': DropdownMenu,
    'van-dropdown-item': DropdownItem,
    'van-field': Field,
    'van-icon': Icon,
    'van-list': List
  },
  props: {
    dropdownOptions: {
      // 下拉选项对象数组，key为text、value、requestDataFunc（接口）、paramsExtra（除了pageSize，pageNumber、keyword外别的参数）
      type: Array,
      default: () => []
    },
    defaultDropDownValue: {
      // 下拉项默认值
      type: [String, Number],
      default: () => ''
    },
    placeholder: {
      // 输入框placeholder
      type: String,
      default: () => ''
    },
    pageSize: {
      // 每页数量
      type: Number,
      default: () => 10
    },
    tagUnit: {
      // 超过maxShowTagNum后显示的等几人，等几位，等几头的单位
      type: String,
      default: () => '位'
    },
    maxShowTagNum: {
      // 选择的tag数量大于此字段定义的数量时在末尾显示"等几${tagUnit}"
      type: Number,
      default: () => 4
    },
    debounceDelayTime: {
      // 输入关键字时的防抖时间
      type: Number,
      default: () => 500
    }
  },
  data() {
    return {
      keyword: '',
      dropdownValue: this.defaultDropDownValue, // 左侧下拉框的值
      pageNumber: 1,
      overlayShow: false,
      searchList: [], // 通过关键词搜索出的列表
      selectedValue: [], // 已选择值列表
      searching: false, // 是否在关键词搜索中
      finished: false,
      labelWidth: 0,
      focusMaxLabelWidth: 120,
      blurMaxLabelWidth: 250,
      isError: false, // 滚动加载失败
      isNotLoading: false,
      tempSelectedValue: [] // 暂存的已选项，点击取消后会将selectedValue变成该值
    };
  },
  computed: {
    labelWidthCompute: function() {
      if (this.overlayShow) {
        return this.labelWidth > this.focusMaxLabelWidth
          ? this.focusMaxLabelWidth
          : this.labelWidth;
      }
      return this.labelWidth;
    }
  },
  watch: {
    selectedValue(newVal, oldVal) {
      this.$nextTick(() => {
        if (newVal.length >= this.maxShowTagNum) {
          this.labelWidth = this.blurMaxLabelWidth;
          return;
        }
        const tags = this.$refs.tags;
        let width = 15;
        const paddingRight = 4;
        if (tags) {
          tags.forEach(tag => {
            width += tag.clientWidth + paddingRight;
          });
        }

        this.labelWidth = width > this.blurMaxLabelWidth ? this.blurMaxLabelWidth : width;
      });
    }
  },
  created() {
    debounceIns = _debounce(() => {
      this.onSearch();
    }, this.debounceDelayTime);
  },

  methods: {
    onEnter() {
      this.keyword = '';
      this.searchList = [];
      this.overlayShow = false;
      this.$refs.keywordSearch.blur();
      this.triggerChange();
    },
    onDropdownValueChange() {
      this.searchList = [];
      this.selectedValue = [];
      this.keyword = '';
      this.finished = false;
      // 切换老师、助教时，蒙层如果是开启状态才触发查询
      if (this.overlayShow) {
        this.onSearch('jump');
      } else {
        this.triggerChange();
      }
    },
    searchData(type = '') {
      if (type === 'jump') {
        this.pageNumber = 1;
      }
      this.isError = false;
      this.searching = true;
      let params = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        keyword: this.keyword
      };
      let request;
      const findOption = this.dropdownOptions.find(item => item.value === this.dropdownValue);
      params = { ...params, ...(findOption.paramsExtra || {}) };
      request = findOption.requestDataFunc;
      request(params)
        .then(res => {
          if (res && res.content) {
            if (type === 'jump') {
              this.searchList = res.content || [];
            } else {
              this.searchList = this.searchList.concat(res.content);
            }
            this.finished = this.pageNumber >= res.totalPages;
          }
          this.isNotLoading = true;
          this.searching = false;
        })
        .catch(err => {
          this.isError = true;
          this.searching = false;
          this.isNotLoading = true;
          Toast(err);
        });
    },
    onSearch() {
      this.pageNumber = 1;
      this.finished = false;
      this.searchList = [];
      this.searchData('jump');
    },
    onLoad() {
      if (this.isNotLoading) {
        this.isNotLoading = false;
        this.pageNumber++;
        this.searchData();
      }
    },
    onClear() {
      if (this.keyword) {
        this.keyword = '';
      } else {
        this.selectedValue = [];
      }
      this.searchList = [];
      this.$nextTick(() => {
        this.$refs.keywordSearch.focus();
        this.triggerChange();
      });
    },
    onCancel() {
      this.keyword = '';
      this.selectedValue = this.tempSelectedValue;
      this.onFieldBlur();
    },
    onFieldFocus() {
      this.tempSelectedValue = JSON.parse(JSON.stringify(this.selectedValue));
      this.overlayShow = true;
      this.$nextTick(() => {
        this.searchData('jump');
        if (this.$refs.searchTag) {
          this.$refs.searchTag.scrollLeft = this.$refs.searchTag.scrollWidth + 90;
        }
      });
    },
    onFieldBlur() {
      this.overlayShow = false;
      this.$nextTick(() => {
        if (this.$refs.searchTag) {
          this.$refs.searchTag.scrollLeft = this.$refs.searchTag.scrollWidth;
        }
      });
    },
    onSearchInput() {
      debounceIns();
    },
    triggerChange() {
      this.$emit('searchResultChange', {
        type: this.dropdownValue,
        selectedValue: this.selectedValue
      });
    },
    onSelect(teacher) {
      const ifExist = this.selectedValue.find(item => item.id === teacher.id);
      if (ifExist) return;
      this.selectedValue.push(teacher);
      this.keyword = '';
      this.searchList = [];
      this.overlayShow = false;
      this.triggerChange();
    },
    onDeleteOne(e, index) {
      e.stopPropagation();
      this.selectedValue.splice(index, 1);
      if (!this.overlayShow) {
        this.triggerChange();
      }
    },
    onLabelClick() {
      this.$refs.keywordSearch.focus();
    }
  }
};
</script>

<style lang="scss">
.vis-search-filter-container {
  padding-bottom: 54px;
  height: 100%;
  .overlay-container {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
  }
  .vis-search-filter-wrapper {
    width: 100%;
    height: 54px;
    padding: 10px 16px;
    background-color: #fff;
    position: fixed;
    top: 0;
    z-index: 1001;
    display: flex;
    align-items: center;
    .cancel-btn {
      display: block;
      margin-left: 16px;
    }
    .search-wrapper {
      background-color: #f7f8fa;
      height: 34px;
      display: flex;
      border-radius: 17px;
      &.focus {
        flex: 1;
      }
      &.blur {
        width: 100%;
      }
      .dropdown-menu {
        width: 60px;
        height: 34px;
        background-color: transparent;
        .van-dropdown-menu__title {
          font-size: 12px;
        }
      }
      .search-with-tag {
        display: flex;
        align-items: center;
        padding: 0 10px;
        flex: 1;
        ::-webkit-scrollbar {
          display: none;
          background-color: transparent;
        }
        .search-field {
          background-color: transparent;
          height: 34px;
          padding: 0;
          display: flex;
          align-items: center;
          overflow-x: scroll;
          ::-webkit-input-placeholder{
            color: #c8c9cc;
          }
          .left-search{
            color:#c8c9cc;
          }
          .right-close{
            color: #c8c9cc;
          }
          .search-field-tag {
            overflow-x: scroll;
            height: 34px;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            font-size: 12px;
            margin-right: 10px;
            ::-webkit-scrollbar {
              display: none;
              background-color: transparent;
            }
            .tag-wrapper {
              display: flex;
              align-items: center;

              .length-word {
                white-space: nowrap;
              }
              @mixin tag {
                height: 24px;
                padding: 0 8px;
                margin-right: 4px;
                display: flex;
                align-items: center;
                border: 1px solid #dcdee0;
                border-radius: 16px;

                font-size: 12px;
                color: #323233;
                letter-spacing: 0;

                .tag-text {
                  height: 24px;
                  white-space: nowrap;
                }
                .icon {
                  margin-left: 4px;
                }
              }
              .tag {
                @include tag;
              }

              .ellipsis-tag {
                display: flex;
                align-items: center;
                .transparent-tag {
                  height: 24px;
                  padding: 0 8px;
                  margin-right: 4px;
                  display: flex;
                  align-items: center;
                  border-radius: 16px;
                  border: 1px solid #dcdee0;
                  font-size: 12px;
                }
              }
            }
          }
        }
        .search-component {
          background-color: transparent;
        }
      }
    }
  }
  .teacher-list {
    padding-top: 54px;
    background-color: #fff;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    overflow-x: auto;
    border-radius: 2px;
    height: 100%;
    .teacher-cell {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      width: 100%;
      background-color: #fff;
      padding: 0 16px;
      .teacher-cell-info {
        display: flex;
        align-items: center;
        max-width: 80%;
      }
      .selected-logo {
        color: #00b389;
      }
    }
  }
}
</style>
