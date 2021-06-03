import { IZanMutations } from './types';

export default {
  updateInited(state, payload) {
    state.inited = payload;
  },
  updateZanDetail(state, payload) {
    state.zanDetail = payload;
  },
  updateGoodsData(state, payload) {
    state.goodsData = payload;
  },
  updateQrcodeUrl(state, payload) {
    state.qrcodeUrl = payload;
  },
  updatePosterUrl(state, payload) {
    state.posterUrl = payload;
  },
  updateShareCoverUrl(state, payload) {
    state.shareCoverUrl = payload;
  },
  updateShowShareGuide(state, payload) {
    state.showShareGuide = payload;
  },
  updateShowPoster(state, payload) {
    state.showPoster = payload;
  },
  updateShowHost(state, payload) {
    state.showHostDialog = payload;
  },
  updateShowGuest(state, payload) {
    state.showGuestDialog = payload;
  },
  updateAvatar(state, payload) {
    state.userInfo.avatar = payload;
  },
} as IZanMutations;
