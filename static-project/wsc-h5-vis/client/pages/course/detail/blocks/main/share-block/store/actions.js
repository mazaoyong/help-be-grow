import compareVersions from '@youzan/utils/string/compareVersions';
import buildUrl from '@youzan/utils/url/buildUrl';
import { redirect } from '@/common/utils/custom-safe-link';
import { GOODS_TYPE_TO_OWL_TYPE } from '@/constants/course/goods-type';
import { ZNB } from '@youzan/wxsdk';
import isWeappRedirectToH5 from '../../../../utils/compareWeappVersion';
import * as API from '../api';

const TO_NATIVE_WEAPP_VERSION = '2.46.1';
export default {
  goInvite({ rootState, getters }) {
    const { isWeapp, weappVersion } = rootState.env;
    const { alias, title } = rootState.goodsData;
    const { finalAvatar, finalUsername } = rootState.user;
    if (isWeapp && weappVersion && compareVersions(weappVersion, TO_NATIVE_WEAPP_VERSION) > 0 &&
      !isWeappRedirectToH5()
    ) {
      try {
        const redirectH5 = buildUrl(`/wscvis/course/detail/${alias}?kdt_id=${rootState.kdtId}`, '', rootState.kdtId);
        const weappUrl = `/packages/paidcontent/invite-card/index?title=${title}&alias=${alias}&avatarUrl=${finalAvatar}&nickName=${finalUsername}&isDistribution=${rootState.activityData.isDistribution}&distributionMoney=${getters.inviteMap.maxProfit}&redirectH5=${encodeURIComponent(redirectH5)}`;
        ZNB.navigate({
          weappUrl,
        });
        return;
      } catch (error) {
        redirect({
          url: '/wscvis/ump/invite-card',
          query: {
            alias,
            owlType: GOODS_TYPE_TO_OWL_TYPE[rootState.goodsType],
          },
        });
      }
    }

    const seckillQuery = {};
    if (rootState.umpType) {
      seckillQuery.ump_type = rootState.umpType;
      seckillQuery.ump_alias = rootState.umpAlias;
    }

    redirect({
      url: '/wscvis/ump/invite-card',
      query: {
        alias,
        owlType: GOODS_TYPE_TO_OWL_TYPE[rootState.goodsType],
        ...seckillQuery,
      },
    });
  },
  register({ commit }) {
    API.register().then(res => {
      commit('updateRegitser', res.status === 1);
    });
  },
};
