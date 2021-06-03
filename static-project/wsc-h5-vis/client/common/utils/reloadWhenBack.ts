import UA from '@youzan/utils/browser/ua_browser';

const defaultCallback = () => {
  if (UA.isIOS()) {
    window.onpageshow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };
  }
};

export default function cbWhenBack(cb?: () => void) {
  if (cb) {
    cb();
  } else {
    defaultCallback();
  }
}
