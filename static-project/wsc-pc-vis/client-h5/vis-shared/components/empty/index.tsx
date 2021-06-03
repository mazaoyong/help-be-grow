import { createComponent } from "@youzan/tany-vue";
import { Button as VanButton } from 'vant';
import * as SafeLink from '@youzan/safe-link';
import { ImgWrap } from '@youzan/vis-ui';
import get from 'lodash/get';
import { getThemeColor } from '@youzan/vue-theme-plugin';
import './style.scss';

interface IEmptyProps {
  buttonText?: string;
  infoText: string;
  showButton?: boolean;
  buttonCallback?: () => void;
}

/** 空态页 */
function Empty(props: IEmptyProps) {
  const {
    infoText,
    buttonText, 
    showButton,
    buttonCallback
  } = props;

  return (
    <div class="empty">
      <ImgWrap class="empty__icon" props={{ src: 'https://b.yzcdn.cn/public_files/018703b22543866c8af50cb7c1c5f4ae.png', width: '80px', height: '80px' }} />
      <p class="empty__info">{ infoText }</p>
      { 
        showButton 
        ? (<VanButton class="empty__button" round color={ getThemeColor('main') } onClick={ buttonCallback }>{ buttonText }</VanButton>)
        : null
      }
    </div>
  )
}

export const getDefaultCallback = () => {
  const wapUrl = get(window, '_global.wap_url.wap', '//h5.youzan.com/v2');
  const kdtId = get(window, '_global.kdt_id', 0);

  return () => SafeLink.redirect({ url: `${wapUrl}/showcase/homepage?kdt_id=${kdtId}`, kdtId: kdtId });
}

export default createComponent(Empty, {
  initialState: {
    buttonText: '去逛逛',
    infoText: '',
    showButton: true,
    buttonCallback: getDefaultCallback()
  }
});
