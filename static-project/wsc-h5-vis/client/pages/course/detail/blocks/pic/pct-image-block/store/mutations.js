export default {
  networkType(state, networkType) {
    state.networkType = networkType;
  },

  playStatus(state, playStatus) {
    state.playStatus = playStatus;
  },

  willFinish(state, willFinish) {
    state.willFinish = willFinish;
  },

  cancelNext(state, cancelNext) {
    state.cancelNext = cancelNext;
  },

  autoplay(state, autoplay) {
    state.autoplay = autoplay;
  },
};
