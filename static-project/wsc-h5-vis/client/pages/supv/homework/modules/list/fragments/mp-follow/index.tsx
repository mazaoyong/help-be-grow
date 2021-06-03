import { createComponent } from '@youzan/tany-vue';

import MpFollowCard from '../../components/mp-follow-card';

import get from 'lodash/get';


const isFollow = get(window, '_global.mpFollowed', true);
const wxMpQrUrl = get(window, '_global.mp_account.qrcode_url', '');
const h5Url = get(window, '_global.wap_url.h5', '//h5.youzan.com')
const mpQrUrl = `${h5Url}/v2/weixin/scan/wximg.jpeg?s=${encodeURIComponent(wxMpQrUrl)}`;
const mpId = get(window, '_global.mp_account.id', 0);

function MpFollow() {
  return (
    <div>
      {
        !isFollow && mpId
        ? (
          <MpFollowCard props={{
            qrUrl: mpQrUrl,
            desc: '关注公众号，不错过每次作业布置和老师批改提醒',
            buttonText: '立即关注',
            popupTitle: '关注公众号',
            popupDesc: '长按识别二维码，关注公众号开启新课程提醒'
          }}/>
        )
        : null
      }
    </div>
  )
}

export default createComponent(MpFollow);