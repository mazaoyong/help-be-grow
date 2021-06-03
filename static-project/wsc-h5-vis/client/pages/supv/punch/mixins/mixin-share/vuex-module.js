import { Toast } from 'vant';
import {
  getQrcode,
} from 'common/apis/qr';
import apis from '../../apis';
import {
  UPDATE_SHOW_SHARE_POPUP,
  UPDATE_CURRENT_SHARE_TYPE,
  UPDATE_AUTO_POP,
  UPDATE_AUTO_POP_TYPE,
  UPDATE_USER_INFO,
  UPDATE_PUNCH_INFO,
  UPDATE_SHARE_STATE,
  UPDATE_LONG_STATE,
  UPDATE_SHARE_POSTER,
  UPDATE_LONG_POSTER,
} from './mutation-types';
import { SHARE_STATE, QRCODE_TYPE, AUTO_POP_TYPE } from './constants';

export default function getVuexModule(initState) {
  return {
    state: {
      autoPop: false,
      autoPopType: AUTO_POP_TYPE.NONE,
      showPopup: false,
      currentShareType: 'share',

      shareState: SHARE_STATE.EMPTY,
      longState: SHARE_STATE.EMPTY,
      sharePoster: '',
      longPoster: '',

      userInfo: {
        avatar: '',
        punchDays: 0,
        name: '',
        fansId: '',
        fansType: '',
      },
      punchInfo: {
        alias: '',
        taskId: '',
        gciId: '',
        background: '',
        motto: '',
        userCount: 0,
        longQrcode: '',
        longQrcodeType: QRCODE_TYPE.NONE,
        shareQrcode: '',
        shareQrcodeType: QRCODE_TYPE.NONE,
        taskName: '--',
      },

      ...initState,
    },

    getters: {
      shareUrl(state) {
        return state.currentShareType === 'long' ? state.longPoster : state.sharePoster;
      },
    },

    mutations: {
      [UPDATE_SHOW_SHARE_POPUP](state, showPopup) {
        state.showPopup = showPopup;
      },
      [UPDATE_CURRENT_SHARE_TYPE](state, currentShareType) {
        state.currentShareType = currentShareType;
      },
      [UPDATE_AUTO_POP](state, autoPop) {
        state.autoPop = autoPop;
      },
      [UPDATE_AUTO_POP_TYPE](state, autoPopType) {
        state.autoPopType = autoPopType;
      },
      [UPDATE_USER_INFO](state, userInfo) {
        state.userInfo = userInfo;
      },
      [UPDATE_PUNCH_INFO](state, punchInfo) {
        state.punchInfo = punchInfo;
      },
      [UPDATE_SHARE_STATE](state, shareState) {
        state.shareState = shareState;
      },
      [UPDATE_LONG_STATE](state, longState) {
        state.longState = longState;
      },
      [UPDATE_SHARE_POSTER](state, sharePoster) {
        state.sharePoster = sharePoster;
      },
      [UPDATE_LONG_POSTER](state, longPoster) {
        state.longPoster = longPoster;
      },
    },

    actions: {
      fetchShareCardInfo({ state, commit }) {
        const { alias, taskId } = state.punchInfo;
        if (!alias || !taskId) return Toast('获取分享信息错误');

        return apis.getShareCardInfo({
          alias,
          taskId,
        })
          .then(res => {
            if (res) {
              const {
                autoPop,
                popType: autoPopType,
                avatar,
                cumulativeCount: punchDays,
                daySignBgPicUrl: background,
                daySignQuotes: motto,
                gciUserCount: userCount,
                longFigureQr: longQrcode,
                longFigureQrType: longQrcodeType,
                name: title,
                nickname: name,
                qr: shareQrcode,
                qrType: shareQrcodeType,
              } = res;

              commit(UPDATE_AUTO_POP, autoPop);
              commit(UPDATE_AUTO_POP_TYPE, autoPopType);
              commit(UPDATE_USER_INFO, {
                ...state.userInfo,
                avatar,
                punchDays,
                name,
              });
              commit(UPDATE_PUNCH_INFO, {
                ...state.punchInfo,
                background,
                motto,
                userCount,
                longQrcode: longQrcodeType === QRCODE_TYPE.MP
                  ? `data:image/png;base64,${longQrcode}` : longQrcode,
                longQrcodeType,
                shareQrcode: shareQrcodeType === QRCODE_TYPE.MP
                  ? `data:image/png;base64,${shareQrcode}` : shareQrcode,
                shareQrcodeType,
                title,
              });
            }
          });
      },

      fetchQrcode({ state, commit }) {
        const {
          alias,
          taskId,
          gciId,
        } = state.punchInfo;
        const {
          fansId: shareFansId,
          fansType: shareFansType,
        } = state.userInfo;

        return getQrcode({
          url: `${_global.url.h5}/wscvis/supv/punch/detail?kdtId=${_global.kdt_id}&alias=${alias}&taskId=${taskId}&gciId=${gciId}&si=${shareFansId}&st=${shareFansType}`,
          width: 63,
          height: 63,
        })
          .then(res => {
            if (res) {
              const {
                shareQrcodeType,
                longQrcodeType,
              } = state.punchInfo;
              let {
                shareQrcode,
                longQrcode,
              } = state.punchInfo;

              if (shareQrcodeType === 1) {
                shareQrcode = res;
              }
              if (longQrcodeType === 1) {
                longQrcode = res;
              }

              commit(UPDATE_PUNCH_INFO, {
                ...state.punchInfo,
                shareQrcode,
                longQrcode,
              });
            }
          });
      },

      fetchPoster({ state, commit }, { type }) {
        const {
          userInfo,
          punchInfo,
        } = state;

        return apis.getSharePoster({
          type,
          userInfo,
          punchInfo,
        })
          .then(res => {
            if (res && res.img) {
              commit(type === 'long' ? 'UPDATE_LONG_POSTER' : 'UPDATE_SHARE_POSTER', res.img);
            }
          })
          .catch(errMsg => {
            Toast(errMsg || '绘制分享海报失败');
          });
      },
    },
  };
}
