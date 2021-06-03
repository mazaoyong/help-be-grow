import { get, each } from 'lodash';

export default {
  video(state, getters, rootState) {
    return get(rootState, 'goodsData.video', {});
  },

  hasVideo(state, getters) {
    return !!getters.video.videoUrl;
  },

  picturesWithVideo(state, getters, rootState) {
    const { pictures } = rootState.goodsData;

    if (getters.hasVideo) {
      const { video } = rootState.goodsData;

      return [{
        id: 0,
        url: get(video, 'coverUrl', ''),
        height: +get(video, 'coverHeight', 0),
        width: +get(video, 'coverWidth', 0),
      }].concat(pictures);
    }

    return pictures;
  },

  maxPictureRatio(state, getters) {
    const minRatio = 0.5;
    const maxRatio = 1.3;
    let ratio = minRatio;
    each(getters.picturesWithVideo, picture => {
      const { height = 0, width = 0 } = picture;
      if (height && width) {
        ratio = Math.max(ratio, height / width);
      }
    });
    ratio = Math.min(maxRatio, ratio);
    ratio = Math.max(minRatio, ratio);
    return ratio;
  },
};
