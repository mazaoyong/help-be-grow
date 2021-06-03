import { arrayColumnWrapper } from 'fns/chain';
import { isRetailMinimalistHqStore, isRetailMinimalistPartnerStore, isUnifiedHqStore, isUnitedPartnerStore } from '@youzan/utils-shop';

const enableLiveTab = !isRetailMinimalistHqStore && !isRetailMinimalistPartnerStore &&
 !isUnifiedHqStore && !isUnitedPartnerStore;

export const ADD_DIALOG_ID = 'inviteFrient';
// 专栏内容 tabs 选项卡
export const tabsOptions = arrayColumnWrapper([
  {
    title: '图文',
    key: 1,
  },
  {
    title: '音频',
    key: 2,
  },
  {
    title: '视频',
    key: 3,
  },
  {
    title: '直播',
    key: 4,
    chainState: enableLiveTab
  },
]);

export const DIR_TREE_ICON = 'https://img.yzcdn.cn/upload_files/2021/01/19/FozBG4ulMFBpsJNDTwlCAbiwFGpT.png';
