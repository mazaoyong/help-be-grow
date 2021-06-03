// 日签、长图
// 在任务详情页和打卡详情页都有用到
import { Toast } from 'vant';
import SessionStorage from '@youzan/utils/browser/session_storage';

import sharePopup from '../../components/share-popup';
import getVuexModule from './vuex-module';
import {
  UPDATE_SHARE_STATE,
  UPDATE_LONG_STATE,
  UPDATE_PUNCH_INFO,
  UPDATE_USER_INFO,
  UPDATE_SHOW_SHARE_POPUP,
  UPDATE_CURRENT_SHARE_TYPE,
} from './mutation-types';
import { SHARE_STATE, QRCODE_TYPE, AUTO_POP_TYPE } from './constants';

export default {
  name: 'mixin-share',

  components: {
    sharePopup,
  },

  data() {
    return {
      hasRegistered: false,
      isTask: location.href.indexOf('punch/task') > -1,
      isDetail: location.href.indexOf('punch/detail') > -1,
      errMsg: '',
      shareUrl: '',
      showSharePopup: false,
      openPopupAfterRegistered: false,
    };
  },

  watch: {
    showSharePopup(showSharePopup) {
      if (showSharePopup !== this.$store.state.share.showPopup) {
        this.$store.commit(UPDATE_SHOW_SHARE_POPUP, showSharePopup);
      }
    },
  },

  created() {
    // 如果是任务详情页
    if (this.isTask) {
      this.watchTaskCompleted();
    }
    // 如果是打卡详情页
    if (this.isDetail) {
      this.watchIsMine();
    }
  },

  methods: {
    registerShareBlock(store, userInfo, punchInfo) {
      // 注册 vuex module
      store.registerModule('share', getVuexModule({
        userInfo,
        punchInfo,
      }));

      // 监听变化
      this.$watch('$store.getters.shareUrl', shareUrl => (this.shareUrl = shareUrl));
      this.$watch('$store.state.share.showPopup', showPopup => (this.showSharePopup = showPopup));

      this.hasRegistered = true;
    },

    updateShareInfo(store, userInfo, punchInfo) {
      const { state, commit } = store;
      commit(UPDATE_PUNCH_INFO, {
        ...state.share.punchInfo,
        ...punchInfo,
      });
      commit(UPDATE_USER_INFO, {
        ...state.share.userInfo,
        ...userInfo,
      });
    },

    async genShareCard() {
      const { state, dispatch, commit } = this.$store;

      try {
        // 获取日签/长图数据
        await dispatch('fetchShareCardInfo');
        commit(UPDATE_SHARE_STATE, SHARE_STATE.HAS_DATA);
        commit(UPDATE_LONG_STATE, SHARE_STATE.HAS_DATA);
      } catch (errMsg) {
        this.errMsg = errMsg || '获取分享数据错误';
        return Toast(this.errMsg);
      }

      const {
        shareQrcodeType,
        longQrcodeType,
      } = state.share.punchInfo;

      try {
        // 获取H5打卡详情页二维码
        if (shareQrcodeType === QRCODE_TYPE.PAGE || longQrcodeType === QRCODE_TYPE.PAGE) {
          await dispatch('fetchQrcode');
          commit(UPDATE_SHARE_STATE, SHARE_STATE.HAS_QRCODE);
          commit(UPDATE_LONG_STATE, SHARE_STATE.HAS_QRCODE);
        } else {
          commit(UPDATE_SHARE_STATE, SHARE_STATE.HAS_QRCODE);
          commit(UPDATE_LONG_STATE, SHARE_STATE.HAS_QRCODE);
        }
      } catch (errMsg) {
        this.errMsg = errMsg || '获取二维码错误';
        return Toast(this.errMsg);
      }

      // 获取海报
      this.fetchPoster('share');
      this.fetchPoster('long');
    },

    async fetchPoster(type) {
      const { dispatch, commit } = this.$store;
      try {
        if (type === 'share') {
          await dispatch('fetchPoster', { type: 'share' });
          commit(UPDATE_SHARE_STATE, SHARE_STATE.COMPLETED);
        }
        if (type === 'long') {
          await dispatch('fetchPoster', { type: 'long' });
          commit(UPDATE_LONG_STATE, SHARE_STATE.COMPLETED);
        }
      } catch (errMsg) {
        this.errMsg = errMsg || '绘制海报图出错';
        return Toast(this.errMsg);
      }
    },

    watchTaskCompleted() {
      this.$watch('$store.state.task.config.isCompleted', async (isCompleted) => {
        if (isCompleted) {
          const {
            alias,
            user: {
              avatar,
            },
            task: {
              config: {
                clockInTimes: punchDays,
                fansId,
                fansType,
                taskId,
                gciId,
                taskName,
              },
            },
            myDiary: {
              contentData: {
                plainText: punchText,
                audio: punchAudios,
                images: punchImages,
              },
            },
          } = this.$store.state;
          const {
            finalUsername: name,
          } = _global.visBuyer;

          const userInfo = {
            avatar,
            punchDays,
            name,
            fansId,
            fansType,
            punchText,
            punchAudios,
            punchImages,
          };
          const punchInfo = {
            alias,
            taskId,
            gciId,
            taskName: taskName || '--',
          };

          if (this.hasRegistered) {
            // 切换日期时更新信息
            this.updateShareInfo(this.$store, userInfo, punchInfo);
          } else {
            // 页面初始化时
            // 打卡完成的时候
            this.registerShareBlock(this.$store, userInfo, punchInfo);
          }
          await this.genShareCard();

          // 如果是打卡完成后回到详情页，展示 popup
          if (this.openPopupAfterRegistered) {
            this.openSharePopup();
            this.openPopupAfterRegistered = false;
          }
        }
      });
    },

    watchIsMine() {
      this.$watch('$store.getters.isMine', (isMine) => {
        if (isMine) {
          const {
            taskId,
            diary: {
              avatar,
              cumulativeCount: punchDays,
              fansId,
              fansType,
              content: punchText,
              audios: punchAudios,
              images: punchImages,
              alias,
              gciId,
              taskName,
            },
          } = this.$store.state;
          const {
            finalUsername: name,
          } = _global.visBuyer;

          const userInfo = {
            avatar,
            punchDays,
            name,
            fansId,
            fansType,
            punchText,
            punchAudios,
            punchImages,
          };
          const punchInfo = {
            alias,
            taskId,
            gciId,
            taskName: taskName || '--',
          };

          this.registerShareBlock(this.$store, userInfo, punchInfo);
          this.genShareCard();
        }
      });
    },

    onShowShare(type) {
      this.$store.commit(UPDATE_CURRENT_SHARE_TYPE, type);
      this.$store.commit(UPDATE_SHOW_SHARE_POPUP, true);
    },

    openSharePopup() {
      if (this.hasRegistered) {
        const {
          autoPop,
          autoPopType,
        } = this.$store.state.share;

        if (autoPop) {
          this.$store.commit(
            UPDATE_CURRENT_SHARE_TYPE,
            autoPopType === AUTO_POP_TYPE.LONG ? 'long' : 'share',
          );
          this.$store.commit(UPDATE_SHOW_SHARE_POPUP, true);

          SessionStorage.removeItem('punch:completed');
        }
      } else {
        this.openPopupAfterRegistered = true;
      }
    },
  },
};
