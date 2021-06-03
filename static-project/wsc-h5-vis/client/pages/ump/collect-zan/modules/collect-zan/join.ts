import { clickPraise } from './apis';
import { Toast } from 'vant';

/**
 * 助力好友
 */
export function supportFriend(params: {
  zanId: number;
  zanSetId: number;
}): Promise<any> {
  // 1. 发起助力请求
  // 2. 提示助力成功或失败
  // 成功则关闭弹窗(容器行为)

  return clickPraise(params)
    .then((res: any) => {
      if (res) {
        return Toast.success('助力成功');
      }
    }).catch((errMsg: string) => {
      Toast(errMsg || '助力失败');
    });
}
