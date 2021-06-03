<template>
  <div class="post-edit-media-v">
    <vis-img-uploader-single
      v-if="localVideos.length === 0 && canUploadImg"
      :max="9"
      :max-size="maxSizeImg"
      :value="imgs"
      token-url="/wscvis/getQiniuAggregateUploadToken.json"
      :options="{
        mediaAccessType: 1,
        storeType: 2,
        channel: 'owl_ceres_img',
      }"
      @finish="onFinish"
      @change="onChange"
    />

    <vis-video-uploader
      v-if="localImgs.length === 0 && canUploadVideo"
      :value="videos"
      :style="{
        marginLeft: `${localImgs.length === 0 && localVideos.length === 0 ? 8 : 0 }px`
      }"
      token-url="/wscvis/videoUploadToken.json"
      confirm-url="/wscvis/confirmVideoUpload.json"
      publish-url="/wscvis/publishVideo.json"
      :max-size="maxSizeVideo"
      @change="onChangeVideo"
      @finish="onFinishVideo"
      @playing="onPlaying"
    />
  </div>
</template>

<script>
import {
  ImgUploaderSingle,
  VideoUploader,
} from '@youzan/vis-ui';
import { MAX_SIZE_IMG, MAX_SIZE_VIDEO } from '../constants';
import { setValidTimer as countVideoPlayed } from '@/vis-shared/utils/count-played';
export default {
  name: 'post-edit-media',

  components: {
    'vis-img-uploader-single': ImgUploaderSingle,
    'vis-video-uploader': VideoUploader,
  },

  data() {
    return {
      localImgs: this.$store.state.edit.imgList, // 用来判断是否有本地图片
      localVideos: this.$store.state.edit.videoList, // 用来判断是否有本地视频
      maxSizeImg: MAX_SIZE_IMG,
      maxSizeVideo: MAX_SIZE_VIDEO,
      canUploadVideo: false,
      canUploadImg: false,
    };
  },

  computed: {
    imgs() {
      return this.$store.state.edit.imgList;
    },
    videos() {
      return this.$store.state.edit.videoList;
    },
    postContentRestriction() {
      const config = this.$store.state.edit.ceresConfig;
      if (!config) return 0;
      return config.postContentRestriction;
    },

  },

  watch: {
    imgs(newValue) {
      this.localImgs = newValue;
    },
    videos(newValue) {
      this.localVideos = newValue;
    },
    postContentRestriction(newValue) {
      this.canUploadImg = newValue & 1;
      this.canUploadVideo = newValue & 2;
    },
  },

  methods: {
    onFinish(imgs) {
      console.log('finish imgs', imgs);

      this.$store.commit('edit/SET_MEDIA_BY_USER', {
        list: imgs,
        type: 0,
      });
    },
    onChange(imgs) {
      console.log('change imgs', imgs);
      this.localImgs = imgs;
    },
    onChangeVideo(videos) {
      console.log('change videos', videos);
      this.localVideos = videos;
    },
    onFinishVideo(videos) {
      console.log('finish videos', videos);
      this.$store.commit('edit/SET_MEDIA_BY_USER', {
        list: videos,
        type: 2,
      });
    },
    onPlaying(videoId) {
      if (videoId) {
        countVideoPlayed({
          channel: 'owl_ceres_post',
          videoId,
          component: 'edu_moments_video',
        });
      }
    },
  },
};
</script>

<style lang="scss">
  .post-edit-media-v {
    margin-top: 20px;
    display: flex;
  }
</style>
