<template>
  <error-message
    message="当前访问人数过多，请稍后重试"
    button-text="重新进入直播间"
    @click="onClick"
  />
</template>

<script>
import { Toast } from 'vant';
import Args from '@youzan/utils/url/args';
import * as CustomSafeLink from '@/common/utils/custom-safe-link';
import ErrorMessage from '@/components/error-message';
import { LIVE_TYPE } from 'constants/course/live-type';

import * as Api from './api';

export default {
  name: 'app',

  components: {
    ErrorMessage,
  },

  methods: {
    onClick() {
      const alias = Args.get('alias');
      const liveType = +Args.get('liveType');

      if (liveType === LIVE_TYPE.YZ_EDU_LIVE && alias) {
        if (top === self) {
          return CustomSafeLink.redirect({
            url: `/wscvis/course/live/video/room`,
            query: {
              alias,
            },
          });
        } else {
          // 兼容旧数据处理
          return parent.location.reload();
        }
      }

      if (liveType === LIVE_TYPE.POLYV_LIVE && alias) {
        return Api.getPolyvLiveLink(alias)
          .then(response => {
            if (response.code === 0) {
              if (response.link) {
                return CustomSafeLink.redirect({
                  url: response.link,
                });
              } else {
                throw new Error();
              }
            } else {
              throw response;
            }
          })
          .catch(error => {
            Toast(error.msg || '网络错误');
            if (error.code === 321100099) {
              return CustomSafeLink.redirect({
                url: `/wscvis/knowledge/index`,
                query: {
                  alias,
                  page: 'livedetail',
                },
              });
            }
          });
      }

      Toast('未知错误');
    },
  },
};
</script>
