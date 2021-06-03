import { Toast } from 'vant';
import { SceneEnum } from 'definitions/api/owl/api/SmsCaptchaFacade/sendSmsCaptcha';
import { submitCollectInfo } from 'common-api/collect-info';
import { SUCCESS, SUBMITED_COLLECT_INFO } from '@/constants/api-code';

const MAX_RETRY_TIMES = 3;
let retryTimes = 0;

interface ISubmitCollectInfoParams {
  attributeItems: any;
  bizAlias: string;
  scene: SceneEnum;
  onSuccess?: () => void;
  onFailed?: () => void;
}

// 提交信息采集资料项（失败重试 3 次）
export function handleSubmitCollectInfo(data: ISubmitCollectInfoParams) {
  const {
    attributeItems,
    bizAlias,
    scene,
    onSuccess,
    onFailed,
  } = data;

  // 超过最大重试次数
  if (retryTimes >= MAX_RETRY_TIMES) {
    retryTimes = 0;
    onFailed && onFailed();
    Toast.fail('网络错误，请稍后重试');
    return;
  }

  retryTimes++;

  submitCollectInfo({
    attributeItems,
    bizAlias,
    scene,
  }).then((res: any) => {
    const { code, msg } = res;

    if (code === SUCCESS) {
      onSuccess && onSuccess();
    } else if (code === SUBMITED_COLLECT_INFO) {
      Toast.fail(msg);
      // 刷新页面
      setTimeout(location.reload.bind(location), 2000);
    } else {
      handleSubmitCollectInfo(data);
    }

    retryTimes = 0;
  }).catch(() => {
    // 重试
    handleSubmitCollectInfo(data);
  });
};
