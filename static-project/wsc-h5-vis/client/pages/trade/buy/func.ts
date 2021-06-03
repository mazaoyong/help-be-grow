import { get } from 'lodash';
import { Toast } from 'vant';
import Args from '@youzan/utils/url/args';
import YZLocalStorage from '@youzan/utils/local_storage';

function sleep(time: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

interface IOrderCreation {
  config: {
    preToastDesc: string;
  };
}

const toastStorageKey = 'couponToast';

export async function buyPrepare(orderCreation: IOrderCreation) {
  if (!orderCreation) return;
  await sleep(300);
  const preToastDesc = get(orderCreation, 'config.preToastDesc');
  if (!preToastDesc) return;

  const bookKey = Args.get('book_key');
  function setStorage() {
    Toast(preToastDesc);
    YZLocalStorage.setItem(
      toastStorageKey,
      JSON.stringify({ bookKey, msg: preToastDesc }),
    );
  }
  const couponToastInfoStr = YZLocalStorage.getItem(toastStorageKey);
  if (!couponToastInfoStr) {
    setStorage();
    return;
  }
  let couponToastInfo;
  try {
    couponToastInfo = JSON.parse(couponToastInfoStr);
    const { bookKey: preBookKey } = couponToastInfo;
    if (preBookKey && preBookKey !== bookKey) {
      setStorage();
    }
  } catch (error) {
    setStorage();
  }
}
