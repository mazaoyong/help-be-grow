import { Toast } from 'vant';
import get from 'lodash/get';
import { ajax } from '@youzan/vis-ui';
import * as SafeLink from '@youzan/safe-link';
import Args from 'zan-utils/url/args';

import { getCollectInfoSettings } from '@/common-api/collect-info';
import { NeedVerifyCodeEnum } from '@/constants/course/collect-info-type';

import { customizePostDataAdaptor } from 'pco/utils';

export default {
  name: 'knowledgeMixin',

  data() {
    return {
      collectInfoSetting: null,
      collectInfoDTO: {},
      knowledgeAlias: Args.get('alias') || '',
      needVerifyCode: false,
    };
  },

  methods: {
    getCollectInfoByAlias() {
      if (this.knowledgeAlias) {
        getCollectInfoSettings({
          aliasList: [this.knowledgeAlias],
          scene: 1,
        }).then(data => {
          /** @type {Array<Record<string, any>>} */
          const collectInfoSetting = get(data, '[0].collectSetting', []);
          this.collectInfoSetting = collectInfoSetting || [];
          this.needVerifyCode =
            get(data, '[0].needVerifyCode', NeedVerifyCodeEnum.UNNEED) ===
            NeedVerifyCodeEnum.NEED;
        });
      } else {
        Toast('获取知识商品失败');
      }
    },
    handleSubmitCollectInfo(values) {
      this.collectInfoDTO.customizeItems = customizePostDataAdaptor(
        get(this, 'collectInfoSetting', []),
        values,
      );
    },
    submitKnowledgeReward() {
      try {
        const command = this.getPostCommand(this.collectInfoDTO);
        ajax({
          method: 'POST',
          url: '/wscvis/edu/reward/getKnowledgeReward.json',
          contentType: 'application/json; charset=utf-8',
          withCredentials: true,
          data: command,
        }).then(isSuccess => {
          if (isSuccess) {
            Toast({
              type: 'success',
              duration: 1000,
              forbidClick: true,
              message: '领取成功',
            });
            setTimeout(() => {
              const redirectUrl = Args.get('redirectUrl') || '';
              if (redirectUrl) {
                SafeLink.redirect({
                  url: redirectUrl,
                });
              }
            }, 1500);
          } else {
            Toast('领取失败，请重试');
          }
        }).catch(Toast);
      } catch (err) {
        console.error(err);
        Toast('出错了，请稍后再试');
      }
    },
    getPostCommand(infoCollect) {
      return {
        alias: this.knowledgeAlias,
        activityInfo: {
          bizId: Args.get('bizId'),
          channel: Args.get('channel'),
        },
        infoCollect,
      };
    },
  },
};
