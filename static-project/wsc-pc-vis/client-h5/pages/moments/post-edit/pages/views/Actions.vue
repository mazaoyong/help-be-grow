<template>
  <div class="moments-pe-actions-v">
    <post-edit-action
      title="点评学员"
      :value="students"
      :disabled="disableStudent || !isNew"
      :icon="students ? 'xueyuan-o' : 'xueyuan'"
      @click="onClickSelectStudent"
    >
      <div
        slot="right"
        class="moments-pe-actions-v__students-right"
      >
        <p
          class="moments-pe-actions-v__students-right-name"
        >
          {{ students }}
        </p>
        <p
          class="moments-pe-actions-v__students-right-num"
        >
          {{ studentsExtra }}
        </p>
      </div>
    </post-edit-action>

    <popup-select
      title="所在位置"
      :options="locationOptions"
      :value="$store.state.edit.locationType"
      @change="handleLocation"
    >
      <post-edit-action
        slot-scope="{ selected = {} }"
        :active="selected.value === 1 || selected.value === 2"
        :icon="selected.value === 1 || selected.value === 2 ? 'weizhi-o' : 'weizhi'"
        :title="(selected.value !== 1 && selected.value !== 2) ? '所在位置' : selected.text"
      />
    </popup-select>

    <popup-select
      title="谁可以看"
      :options="visibilityOptions"
      :value="$store.state.edit.visibility"
      has-line
      @change="handlevisibility"
    >
      <post-edit-action
        slot-scope="{ selected = {} }"
        title="谁可以看"
        :value="selected.text && selected.text.title"
        :icon="selected.text && selected.text.title ? 'kejian-o': 'kejian'"
      />
      <!-- 自定义的选项 -->
      <template slot="option" slot-scope="{ option: { text = {} } = {} }">
        <div class="moments-pe-actions-v__custom-radio-title">
          {{ text.title }}
        </div>
        <div class="moments-pe-actions-v__custom-radio-desc">
          {{ text.desc }}
        </div>
      </template>
    </popup-select>
  </div>
</template>

<script>
import { PopupSelect } from '@youzan/vis-ui';
import SessionStorage from '@youzan/utils/browser/session_storage.js';
import Action from '../components/Action';
import apis from '../../apis';

export default {
  name: 'post-actions',

  components: {
    'post-edit-action': Action,
    'popup-select': PopupSelect,
  },

  props: {
  },

  data() {
    return {
    };
  },

  computed: {
    students() {
      const { mentionedUsers } = this.$store.state.edit;
      const studentNames = mentionedUsers.map(item => item.name);
      const studentNamesStr = studentNames.length > 2 ? `${studentNames.slice(0, 2).join('、')}` : studentNames.join('、');
      return studentNamesStr;
    },
    studentsExtra() {
      const { mentionedUsers, selectedCount } = this.$store.state.edit;
      const studentNames = mentionedUsers.map(item => item.name);
      const studentNamesStr = studentNames.length > 2 ? `等${selectedCount}人` : '';
      return studentNamesStr;
    },
    disableStudent() {
      // 日程下只有一个不允许换学员
      const { pageFrom, onlyOneStudent } = this.$store.state.edit;
      return pageFrom === 1 && onlyOneStudent === 1;
    },
    visibilityOptions() {
      const { lessonNo, selectedCount, pageFrom } = this.$store.state.edit;
      let visibilityList = [
        {
          value: 0,
          text: {
            title: '全校',
            desc: '所有学员的动态列表中可见，可分享给其他人',
          },
        },
        {
          value: 2,
          text: {
            title: '本节课学员',
            desc: '本节课学员的动态列表中可见，可分享给其他人',
          },
        },
        {
          value: 1,
          text: {
            title: '被点评学员',
            desc: '被点评学员的动态列表中可见，可分享给其他人',
          },
        },
      ];

      if (!lessonNo) {
        visibilityList = visibilityList.filter(o => {
          return o.value !== 2;
        });
      }

      if (!selectedCount && pageFrom === 2) {
        visibilityList = visibilityList.filter(o => {
          return o.value !== 1;
        });
      }

      return visibilityList;
    },
    locationOptions() {
      // 0: 不展示位置, 1: 展示校区名, 2: 展示校区名-课程名
      return this.$store.state.edit.locationOptions;
    },
    isNew() {
      return this.$store.state.edit.isNew;
    },
  },

  watch: {
  },

  created() {
    // 根据不同发布来源初始化可见范围
    const { pageFrom } = this.$store.state.edit;
    let visibility = 1;
    if (pageFrom === 2) {
      visibility = 0;
    } else {
      visibility = 1;
    }
    this.$store.commit('edit/SET_VISIBILITY', visibility);
  },

  mounted() {
    const { isNew } = this.$store.state.edit;
    if (isNew) {
      this.fetchLocations();
    }
  },

  methods: {
    onClickSelectStudent() {
      console.log('选择点评学员');
      const {
        pageFrom,
        lessonNo,
      } = this.$store.state.edit;
      let url = { name: 'Student' };
      if (pageFrom === 1) {
        url.query = { pageFrom: 'momentsEdit', lessonNo: lessonNo };
      } else if (pageFrom === 2) {
        url.query = { pageFrom: 'moments' };
      }

      try {
        const { mentionedUsers } = this.$store.state.edit;
        const studentsSessionCache = {
          list: mentionedUsers,
          excludeIds: [],
          isSelectedAll: false,
          selectedCount: mentionedUsers.length,
        };

        SessionStorage.setItem('vis__miniprogram__moments__students', JSON.stringify(studentsSessionCache));
      } catch (error) {
      }
      url && this.$router.push(url);
    },
    handleLocation(state) {
      this.$store.commit('edit/SET_LOCATION', state.value);
    },
    handlevisibility(state) {
      this.$store.commit('edit/SET_VISIBILITY', state.value);
    },

    fetchLocations() {
      const { pageFrom, lessonNo, kdtId } = this.$store.state.edit;
      const query = {
        kdtId,
      };
      if (pageFrom === 1) {
        query.lessonNo = lessonNo;
      }
      apis.findLocationInfo(query)
        .then(res => {
          const list = [
            {
              value: 1,
              text: res.schoolName,
            },
          ];
          if (res.eduCourseName) {
            list.push({
              value: 2,
              text: `${res.schoolName}·${res.eduCourseName}`,
            });
          }
          list.push({
            value: 0,
            text: '不展示位置',
          });

          this.$store.commit('edit/SET_LOCATION_OPTIONS', list);

          if (pageFrom === 1) {
            this.$store.commit('edit/SET_LOCATION', 2);
          } else if (pageFrom === 2) {
            this.$store.commit('edit/SET_LOCATION', 1);
          }
        });
    },
  },
};
</script>

<style lang="scss">
  .moments-pe-actions-v {
    margin-top: 16px;

    &__students-right {
      display: flex;
      align-items: center;

      &-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 135px;
      }

      &-num {
        white-space: nowrap;
        flex: 1;
      }
    }

    &__custom-radio-title {
      color: #111111;
      font-size: 14px;
      line-height: 20px;
    }

    &__custom-radio-desc {
      color: #969799;
      font-size: 13px;
      line-height: 18px;
      margin-top: 6px;
    }
  }
</style>
