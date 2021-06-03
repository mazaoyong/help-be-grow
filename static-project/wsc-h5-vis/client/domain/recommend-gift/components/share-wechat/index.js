import { QuickOpen } from '@youzan/vis-ui';
import Mock from './mock.vue';
import { getVuePoster } from '@/common/apis/poster';

const openMockPopup = QuickOpen.quickOpen(Mock);

const ___test___ = false;

export default async function(drawInfo) {
  if (___test___) {
    openMockPopup({ props: { drawInfo } });
    return { img: '' };
  }

  // 绘制海报，获取图片
  const data = await getVuePoster({
    pathname: 'ump/referral-invite/share-wechat',
    data: { drawInfo },
    snapshotConfig: {
      // 放大两倍
      width: 185,
      height: 148,
      type: 'png',
    },
  });

  return data;
}
