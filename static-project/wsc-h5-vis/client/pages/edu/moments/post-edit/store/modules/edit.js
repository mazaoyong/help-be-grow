import args from '@youzan/utils/url/args.js';
import * as SafeLink from '@youzan/safe-link';
import cdnDowngrade from '@/common/utils/cdn-downgrade';
import apis from '../../apis';
import { Toast } from 'vant';

let canPublish = true;

const moduleText = {
  namespaced: true,

  state: {
    postId: args.get('postId'),
    isNew: !args.get('postId'),
    kdtId: args.get('kdtId') || _global.kdtId,

    // view actions
    locationType: -1, // 0: 不展示位置, 1: 展示校区名, 2: 展示校区名-课程名

    // view media 数据
    imgList: [], // { url }
    videoList: [], // { videoId, url, cover, videoStatus, duration }
    // text
    textContent: '',

    // 家校圈配置数据
    ceresConfig: null,
  },
  mutations: {
    SET_FORM_DATA(state, payload) {
      if (['locationType', 'imgList', 'videoList', 'textContent'].includes(payload.type)) {
        state[payload.type] = payload.value;
      } else {
        console.info('不允许改变此 state');
      }
    },

    SET_LOCATION(state, locationType) {
      state.locationType = locationType;
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
            cover: cdnDowngrade(o.videoDTO.coverUrl),
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
          state[key] = element;
        }
      }

      if (payload.postId) {
        state.isNew = false;
      }
    },
    SET_CERES_CONFIG(state, payload) {
      state.ceresConfig = payload;
    },
  },

  actions: {
    getCeresConfig({ commit }) {
      apis.getCeresConfig().then(res => {
        commit('SET_CERES_CONFIG', res);
      });
    },
    getFromData({ state, commit }) {
      apis.getPostById({
        postId: state.postId,
      })
        .then(res => {
          if (res.location) {
            const location = res.location;

            if (location.eduCourseId) {
              commit('SET_LOCATION', 2);
            } else if (location.kdtId) {
              commit('SET_LOCATION', 1);
            } else {
              commit('SET_LOCATION', 0);
            }
          }

          commit('SET_CONTENT', res.textContent);

          commit('SET_MEDIA', res.extraContents);
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

      const fromData = {
        postType: 1,
        postId: state.postId || 0,
        comeFrom: 0,
        extraContents: media,
        excludeStudentIds: [], // 反选的点评学员（全选时）
        kdtId: state.kdtId,
        locationType: state.locationType === -1 ? 0 : state.locationType,
        lessonNo: '',
        mentionedUsers: [], // 点评学员
        selectAllMark: 0, // 是否全选 默认 0 非全选
        textContent: state.textContent,
        visibility: 0, // 0: 全校可见, 1: 仅被点评学员可见, 2: 仅本节课学员
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
