<template>
  <div>
    <!-- 默认空状态 开始 -->
    <div
      v-if="isNotLoadingGroupList && groupList.length === 0"
      class="no-list"
    >
      <span class="tip tip_tag">暂无线索标签</span>
    </div>
    <!-- 默认空状态 结束 -->

    <card
      v-else
      class="edit-tag"
    >
      <van-collapse v-model="activeNames">
        <van-list
          v-if="groupList.length > 0"
          :finished="isFinished"
          :error.sync="isError"
          error-text="请求失败，点击重新加载"
          @load="onGroupList"
        >
          <!-- 系统标签开始 -->
          <van-collapse-item v-if="hasSystemTags" name="systemTag" :class="{ 'init-overflow': isShowDisableTip}">
            <template slot="title">
              <div class="group-name-title">
                系统标签
                <div class="disable-tips">
                  <van-icon color="#A9A9A9" name="question" @click.stop="toggleDisableTip" />
                  <template v-if="isShowDisableTip">
                    <div class="mask" @click.stop="toggleDisableTip" />
                    <div class="tips-box">
                      根据默认规则自动打标
                    </div>
                  </template>
                </div>
              </div>
            </template>
            <a
              v-for="systemTag in systemTags"
              :key="systemTag.tagId"
              class="tag tag_disable"
              href="javascript: void(0);"
            >
              {{ systemTag.name }}
            </a>
          </van-collapse-item>
          <!--系统标签结束-->

          <van-collapse-item
            v-for="(group, index) in groupList"
            :key="index"
            :name="group.groupId"
            :class="{ 'init-overflow': isShowDisableTip}"
            :title="group.multiSelect ? `${group.name}(可多选)` : group.name"
          >
            <a
              v-for="tag in group.tagDTOS"
              :key="tag.tagId"
              class="tag"
              :class="{
                tag_active: tag.isActive,
              }"
              href="javascript: void(0);"
              @click="onChangeTag(group, tag.tagId)"
            >
              {{ tag.name }}
            </a>
          </van-collapse-item>
        </van-list>
      </van-collapse>

      <!-- 底部的确认按钮 开始 -->
      <a
        class="footer f-safeArea"
        @click="onConfirm"
      >
        确定
      </a>
      <!-- 底部的确认按钮 结束 -->
    </card>
  </div>
</template>

<script>
import { List, Collapse, CollapseItem, Toast, Icon } from 'vant';
import Card from 'components/card/index.vue';

let APILock = false;

export default {
  name: 'edit-tag',
  components: {
    'card': Card,
    'van-list': List,
    'van-collapse': Collapse,
    'van-collapse-item': CollapseItem,
    'van-icon': Icon,
  },
  data() {
    return {
      clueId: 0,
      activeNames: [],
      groupList: [],
      pageSize: 100,
      pageNumber: 1,
      isFinished: false,
      isError: false,
      isNotLoadingGroupList: false,
      isShowDisableTip: false,
      systemTags: [],
    };
  },
  computed: {
    hasSystemTags() {
      return this.systemTags.length > 0;
    },
  },
  mounted() {
    this.initTagGroupList();
    this.clueId = this.$route.query.clueId;
    document.title = '编辑标签';
  },
  methods: {
    initTagGroupList() {
      const { pageSize, pageNumber } = this;
      this.$store.dispatch('editTagModule/findTagGroupPage', {
        pageSize,
        pageNumber,
      })
        .then(res => {
          let pageable = true;
          if (res.content && res.content.length > 0) {
            this.groupList = this.groupList.concat(res.content);
            const { offset } = res.pageable;
            pageable = (offset + res.content.length) < res.total;
          }
          this.parseActiveNames();
          this.initActiveTags();
          this.isFinished = !pageable;
          this.isNotLoadingGroupList = true;
        })
        .catch(err => {
          this.isError = true;
          this.isNotLoadingGroupList = true;
          Toast(err);
        });
    },
    onGroupList() {
      if (this.isNotLoadingGroupList) {
        this.isNotLoadingGroupList = false;
        this.pageNumber++;
        if (this.pageNumber > 1) {
          this.initTagGroupList();
        }
      }
    },
    initActiveTags() {
      const clueDetailTagList = this.$store.getters['clueDetailModule/clueDetail'].tags || [];
      if (clueDetailTagList.length > 0) {
        const parsedClueDetailTagList = clueDetailTagList.map(tag => {
          return tag.tagId;
        });
        this.groupList.map(group => {
          let newGroup = group.tagDTOS.map(tag => {
            if (parsedClueDetailTagList.indexOf(tag.tagId) > -1) {
              tag.isActive = true;
            } else {
              tag.isActive = false;
            }
            return tag;
          });
          return newGroup;
        });
        // 设置系统标签
        const systemTags = clueDetailTagList.filter(tag => tag.systemTag);
        if (systemTags.length > 0) {
          this.systemTags = systemTags;
          this.activeNames.push('systemTag');
        }
      }
    },
    onChangeTag(group, tagId) {
      const { multiSelect, groupId } = group;
      if (multiSelect) {
        this.groupList.map(group => {
          let newGroup = group.tagDTOS.map(tag => {
            if (tagId === tag.tagId) {
              tag.isActive = !tag.isActive;
            }
            return tag;
          });
          return newGroup;
        });
      } else {
        this.groupList.map(group => {
          if (groupId === group.groupId) {
            let newGroup = group.tagDTOS.map(tag => {
              if (tagId === tag.tagId) {
                tag.isActive = !tag.isActive;
              } else {
                tag.isActive = false;
              }
              return tag;
            });
            return newGroup;
          }
        });
      }

      this.$forceUpdate();
    },
    onConfirm() {
      if (APILock) {
        return;
      }
      APILock = true;
      const tagIds = this.getActiveTags();
      // if (tagIds.length === 0) {
      //   history.go(-1);
      //   return;
      // }
      this.$store.dispatch('editTagModule/updateClueTags', {
        clueId: this.clueId,
        tagIds,
      })
        .then(res => {
          Toast.success({ message: '保存成功', duration: 1500 });
          setTimeout(() => {
            history.go(-1);
            APILock = false;
          }, 1500);
        })
        .catch(err => {
          Toast(err);
          APILock = false;
        });
    },
    getActiveTags() {
      const activeTags = [];
      this.groupList.map(group => {
        group.tagDTOS.map(tag => {
          if (tag.isActive) {
            activeTags.push(tag.tagId);
          }
        });
      });

      return activeTags;
    },
    parseActiveNames() { // 所有面板默认展开
      this.activeNames = this.groupList.map(group => {
        return group.groupId;
      });
    },
    toggleDisableTip(e) {
      this.isShowDisableTip = !this.isShowDisableTip;
    },
  },
};
</script>

<style lang="scss">
// 覆盖 overflow 显示提示弹窗
.edit-tag {
  .init-overflow {
    .van-cell {
      overflow: initial;
    }
  }
}
.van-collapse-item__content {
  padding: 10px 4px 15px 15px;
}
.van-cell__title {
  font-weight: 500;
}
.van-cell:not(:last-child)::after {
  border: none;
}
.van-hairline--top::after {
  border: none;
}
</style>

<style lang="scss" scoped>
.edit-tag {
  margin-bottom: 100px;
}

.group-name-title {
  display: flex;
  .disable-tips {
    position: relative;
    margin-left: 8px;
    display: flex;
    align-items: center;
    .mask {
      position: fixed;
      background: transparent;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 996;
    }
    .tips-box {
      position: absolute;
      background-color: #111111;
      padding: 12px 8px;
      color: white;
      background: rgba(17, 17, 17, 0.7);
      border-radius: 2px;
      z-index: 965;
      white-space: nowrap;
      left: -12px;
      top: 120%;
      &:before {
        content: '';
        position: absolute;
        border-radius: 1px;
        width: 0px;
        height: 0px;
        border: 10px solid transparent;

        border-bottom: 10px solid rgba(17, 17, 17, 0.7);
        top: -20px;
      }
    }
  }
}

.tag {
  display: inline-block;
  margin: 0 10px 10px 0;
  min-width: 92px;
  padding: 0 5px;
  height: 32px;
  line-height: 32px;
  font-size: 13px;
  text-align: center;
  color: #323233;
  border-radius: 2px;
  background-color: #f7f8fa;
  &_active {
    color: #fff;
    background-color: #00b389;
  }
  &_disable {
    color: #969799;
  }
}
.no-list {
  position: absolute;
  top: 150px;
  left: 50%;
  transform: translate(-50%, 0);
  width: 140px;
  height: 124px;
  text-align: center;
  background-image: url('https://b.yzcdn.cn/public_files/2019/03/12/9d9c065ca679da115f7b547c99dbf3d1.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 90px 90px;
  .tip {
    display: inline-block;
    position: absolute;
    bottom: 0;
    font-size: 14px;
    color: #999;
    line-height: 1;
    &_tag {
      left: 20px;
    }
  }
}
.footer {
  display: block;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  text-align: center;
  color: #fff;
  background-color: #00b389;
}
</style>
