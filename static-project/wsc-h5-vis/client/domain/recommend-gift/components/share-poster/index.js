import { QuickOpen } from '@youzan/vis-ui';
import App from './index.vue';
import Mock from './mock.vue';
import { getVuePoster } from '@/common/apis/poster';

const openPopup = QuickOpen.quickOpen(App);
const openMockPopup = QuickOpen.quickOpen(Mock);

const ___test___ = false;

export default async function(drawInfo) {
  if (___test___) {
    openMockPopup({ props: { drawInfo } });
    return;
  }

  let templatePath = '';
  if (drawInfo.bgType === 1) {
    templatePath = 'ump/referral-invite/share-poster_custom';
  } else {
    templatePath = 'ump/referral-invite/share-poster';
  }

  // 绘制海报，获取图片
  const data = await getVuePoster({
    pathname: templatePath,
    data: { drawInfo },
    snapshotConfig: {
      // 放大两倍
      width: 300,
      height: 450,
      type: 'png',
    },
  });

  openPopup({ props: { poster: data.img } });
}
