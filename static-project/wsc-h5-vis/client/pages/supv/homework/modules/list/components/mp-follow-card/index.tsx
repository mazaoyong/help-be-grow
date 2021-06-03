import { createComponent } from '@youzan/tany-vue';
import { QuickOpen, FollowMp } from '@youzan/vis-ui';
import { Button as VanButton } from 'vant';
import { getThemeColor } from '@youzan/vue-theme-plugin';
import './style.scss';

const openFollowMpPopup = QuickOpen.quickOpen(FollowMp);

export interface MpFollowCardProps {
  /** 公众号二维码 */
  qrUrl?: string;
  /** 关注信息的描述 */
  desc: string;
  /** 关注按钮文案 */
  buttonText: string;
  /** popup标题 */
  popupTitle: string;
  /** popup描述 */
  popupDesc: string;
}

function MpFollowCard(props: MpFollowCardProps) {
  const {
    qrUrl,
    desc,
    buttonText,
    popupTitle,
    popupDesc
  } = props;

  const handleFollowMp = () => {
    openFollowMpPopup({
      props: {
        title: popupTitle,
        qrcodeUrl: qrUrl,
        description: popupDesc
      }
    })
  }

  return (
    <div class="mp-follow-card">
      <div class="mp-follow-card__left">
        <p class="mp-follow-card__desc">{ desc }</p>
      </div>
      <div class="mp-follow-card__right">
        <VanButton 
          class="mp-follow-card__button"
          round
          color={getThemeColor('main')} 
          onClick={ handleFollowMp }
        >
          { buttonText }
        </VanButton>
      </div>
    </div>
  );
}

export default createComponent(MpFollowCard, {
  initialState: {
    /** 公众号二维码 */
    qrUrl: '',
    /** 关注信息的描述 */
    desc: '',
    /** 关注按钮文案 */
    buttonText: '',
    /** popup标题 */
    popupTitle: '',
    /** popup描述 */
    popupDesc: '',
  }
});