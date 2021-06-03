// 用于处理直接通过url方式进入页面,history.back没有用的情况的情况下回退到上一个页面的操作
import { createHashHistory } from 'history';

const history = createHashHistory();

function safeGoBack(targetUrl) {
  const href = window.location.href;
  history.goBack();
  setTimeout(() => {
    if (window.location.href === href) {
        history.push(targetUrl);
    }
  }, 500);
};

export default safeGoBack;