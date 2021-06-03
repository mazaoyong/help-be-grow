<template>
  <base-course :tag="tagName" :content-list="contentList" />
</template>

<script>
import { format as formatDate } from 'date-fns';
import { OWL_TYPE, OWL_TYPE_DESC } from '@/constants/course/owl-type';
import { MEDIA_TYPE_DESC } from '@/constants/course/media-type';
import { LIVE_STATUS } from '@/constants/course/live-status';
import { LIVE_TYPE } from '@/constants/course/live-type';

import BaseCourse from '../base-course';

export default {
  name: 'pct-course',

  components: {
    BaseCourse,
  },

  state: ['goods'],

  getters: ['singleGoods', 'isContent', 'isLive'],

  computed: {
    tagName() {
      const { owlType } = this.singleGoods;
      if (owlType === OWL_TYPE.CONTENT) {
        const { mediaType } = this.liveExtraData;
        const mediaTagName = MEDIA_TYPE_DESC[mediaType];

        if (mediaTagName) {
          return mediaTagName;
        }
      }
      return OWL_TYPE_DESC[owlType];
    },

    liveExtraData() {
      const { alias } = this.singleGoods;
      return this.goods.extra[alias] || {};
    },

    contentList() {
      const list = [];

      const liveStatusDesc = this.getLiveStatusDesc();

      if (liveStatusDesc) {
        list.push(liveStatusDesc);
      }

      return list;
    },
  },

  methods: {
    getLiveStatusDesc() {
      const { liveStatus, liveStart, liveType } = this.liveExtraData;
      switch (liveStatus) {
        case LIVE_STATUS.UNSTART:
          if (!liveStart) return;
          const startTime = formatDate(
            new Date(liveStart),
            'YYYY-MM-DD HH:mm:ss'
          );
          return {
            icon: 'live-unstart',
            text: `直播将于 ${startTime} 开始`,
          };

        case LIVE_STATUS.LIVING:
          return {
            icon: 'live-progress',
            text: '直播进行中',
          };

        case LIVE_STATUS.REWATCH:
          if (liveType === LIVE_TYPE.VOICE_PICTURE_TEXT) {
            return {
              icon: 'live-end',
              text: '直播已结束，可回看',
            };
          }

          if (liveType === LIVE_TYPE.YZ_EDU_LIVE) {
            return {
              icon: 'live-end',
              text: '直播已结束，暂未开启回放',
            };
          }
          break;

        case LIVE_STATUS.PLAYBACK:
          return {
            icon: 'live-end',
            text: '直播已结束，可回看',
          };

        case LIVE_STATUS.PRE_PLAYBACK:
          return {
            icon: 'live-unstart',
            text: '直播已结束，回放正在准备中，准备完成后可回看',
          };
      }
    },
  },
};
</script>
