import args from '@youzan/utils/url/args.js';
import SessionStorage from '@youzan/utils/browser/session_storage.js';
import * as SafeLink from '@youzan/safe-link';
import apis from '../../apis';
import { Toast } from 'vant';

let canPublish = true;

const moduleText = {
  namespaced: true,

  state: {
    postId: args.get('postId'),
    isNew: !args.get('postId'),
    kdtId: args.get('kdtId') || _global.kdtId,
    pageFrom: +args.get('pageFrom') || 2, // 来自日程还是面板 1：日程 2：面板
    canUseSessionStudent: +args.get('useSessionOfStudents') === 1,
    lessonNo: args.get('lessonNo'), // 日程编号
    onlyOneStudent: +args.get('onlyOneStudent'), // 日程进来是否只有一个学生

    // view actions
    locationType: -1, // 0: 不展示位置, 1: 展示校区名, 2: 展示校区名-课程名
    locationOptions: [], // 地址的数组信息
    visibility: 1, // 0: 全校可见, 1: 仅被点评学员可见, 2: 仅本节课学员
    mentionedUsers: [], // 点评学员
    excludeStudentIds: [], // 反选的点评学员（全选时）
    selectAllMark: 0, // 是否全选 默认 0 非全选
    selectedCount: 0, // 选择的学员个数

    // view media 数据
    imgList: [], // { url }
    videoList: [], // { videoId, url, cover, videoStatus, duration }

    // text
    textContent: '',
  },
  mutations: {
    SET_FORM_DATA(state, payload) {
      if (['locationType', 'visibility', 'imgList', 'videoList', 'textContent', 'mentionedUsers', 'excludeStudentIds'].indexOf(payload.type) > -1) {
        state[payload.type] = payload.value;
      } else {
        console.info('不允许改变此 state');
      }
    },

    SET_MEMTIONED_USER_BY_SESSION(state, payload) {
      const studentInfo = (() => {
        try {
          return JSON.parse(SessionStorage.getItem('vis__miniprogram__moments__students')) || {};
        } catch (error) {
          return {};
        }
      })();
      const { list, excludeIds = [], isSelectedAll, selectedCount } = studentInfo;
      state.mentionedUsers = list || [];
      state.selectAllMark = isSelectedAll ? 1 : 0;
      if (excludeIds.length) {
        state.excludeStudentIds = excludeIds;
      }
      state.selectedCount = selectedCount;
    },

    SET_MENTIONED_USER_BY_NET(state, payload) {
      state.mentionedUsers = payload.map(o => ({
        name: o.userName,
        id: o.userId,
      }));
      state.selectedCount = payload.length;
    },

    SET_LOCATION(state, locationType) {
      state.locationType = locationType;
    },

    SET_VISIBILITY(state, payload) {
      state.visibility = payload;
    },

    SET_CONTENT(state, payload) {
      state.textContent = payload;
    },

    SET_MEDIA(state, payload) {
      if (Array.isArray(payload) && payload.length > 0) {
        const mediaType = payload[0].contentType;
        if (mediaType === 0) {
          state.imgList = payload.map(o => ({ url: o.url, imgId: o.id }));
        } else if (mediaType === 2) {
          state.videoList = payload.map(o => ({
            url: o.url,
            videoId: o.videoDTO.videoId,
            cover: o.videoDTO.coverUrl,
            videoStatus: o.videoDTO.videoStatus,
            duration: o.videoDTO.duration,
            deleted: o.videoDTO.deleted,
            size: {
              width: o.videoDTO.coverWidth,
              height: o.videoDTO.coverHeight,
            },
          }));
        }
      }
    },

    SET_LESSON(state, payload) {
      // 有 lessonNo 说明是日程来的，给当前状态添加 pageFrom 类型
      if (payload) {
        state.pageFrom = 1;
        state.lessonNo = payload;
      } else {
        state.pageFrom = 2;
      }
    },

    SET_MEDIA_BY_USER(state, payload) {
      if (payload.type === 0) {
        state.imgList = payload.list;
      }
      if (payload.type === 2) {
        state.videoList = payload.list;
      }
    },

    CHANGE_ARGS(state, payload) {
      console.log('路由守卫 CHANGE_ARGS', payload);

      for (const key in payload) {
        if (payload.hasOwnProperty(key)) {
          const element = payload[key];
          if (key === 'onlyOneStudent') {
            state[key] = +element;
          } else if (key === 'lessonNo') {
            state[key] = element;
          } else if (key === 'useSessionOfStudents') {
            state.canUseSessionStudent = +element === 1;
          } else if (key === 'pageFrom') {
            state[key] = +element;
          } else {
            state[key] = element;
          }
        }
      }

      if (payload.postId) {
        state.isNew = false;
      }
    },

    SET_LOCATION_OPTIONS(state, payload) {
      state.locationOptions = payload;
    },
  },

  actions: {
    getFromData({ state, commit }) {
      apis.getPostById({
        postId: state.postId,
      })
        .then(res => {
          if (!state.canUseSessionStudent) {
            commit('SET_MENTIONED_USER_BY_NET', res.mentionedUsers);
          }

          if (res.location) {
            const location = res.location;
            const list = [
              {
                value: 1,
                text: location.schoolName,
              },
            ];
            if (location.eduCourseName) {
              list.push({
                value: 2,
                text: `${location.schoolName}·${location.eduCourseName}`,
              });
            }
            list.push({
              value: 0,
              text: '不展示位置',
            });
            commit('SET_LOCATION_OPTIONS', list);

            if (location.eduCourseId) {
              commit('SET_LOCATION', 2);
            } else {
              commit('SET_LOCATION', 1);
            }
          }

          commit('SET_VISIBILITY', res.visibility);

          commit('SET_CONTENT', res.textContent);

          commit('SET_MEDIA', res.extraContents);

          commit('SET_LESSON', res.lessonNo);
        })
        .catch(err => Toast(err));
    },
    publish({ state }) {
      if (!canPublish) {
        return;
      }
      canPublish = false;

      const media = (() => {
        if (state.imgList.length) {
          return state.imgList.map(item => {
            return {
              contentType: 0,
              url: item.url,
              id: item.imgId || 0,
            };
          });
        }
        if (state.videoList.length) {
          return state.videoList.map(item => {
            return {
              contentType: 2,
              id: item.videoId,
            };
          });
        }
        return [];
      })();

      const mentionedUsers = state.mentionedUsers.map(o => {
        return {
          userId: o.id,
          userRole: 1,
        };
      });
      const fromData = {
        postId: state.postId || 0,
        comeFrom: 0,
        extraContents: media,
        excludeStudentIds: state.excludeStudentIds,
        kdtId: state.kdtId,
        locationType: state.locationType === -1 ? 0 : state.locationType,
        lessonNo: state.lessonNo,
        mentionedUsers,
        selectAllMark: state.selectAllMark,
        textContent: state.textContent,
        visibility: state.visibility,
      };

      console.log('发布', fromData);
      const publishFn = state.isNew ? apis.createReview(fromData) : apis.updateReview(fromData);

      publishFn.then(() => {
        const publishRedirectUrl = args.get('redirectUrl');
        Toast('发布成功');
        setTimeout(() => {
          if (publishRedirectUrl) {
            SafeLink.redirect({
              url: decodeURIComponent(publishRedirectUrl),
              kdtId: window._global.kdt_id,
            });
          } else {
            history.go(-1);
          }
        }, 1000);
      })
        .catch(err => {
          Toast(err);
        })
        .finally(() => {
          canPublish = true;
        });
    },
  },
};

export default moduleText;
