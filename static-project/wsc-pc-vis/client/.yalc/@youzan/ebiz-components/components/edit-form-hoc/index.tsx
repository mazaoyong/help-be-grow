import React, { useEffect, ComponentType, FC } from 'react';
import { Dialog, Button } from 'zent';
import './style.scss';
// @ts-ignore
import { hashHistory } from 'react-router';

type IRouterType = 'hash' | 'history';

const { openDialog, closeDialog } = Dialog;

const handleWindowClose = (e: Event) => {
  e.returnValue = true;
};

// popstate可监听浏览器的回退/前进事件，此外popstate事件当进入页面或通过a链接跳转时均会触发，故此处使用e.state使popstate可控
const handleGoBack = (e: { state: any }) => {
  if (e.state) {
    openGoBackDialog();
  }
};

const handleRedirect = (url: string, type?: IRouterType) => {
  if (type === 'history') {
    location.href = url;
  } else {
    openGoBackDialog(url);
  }

};

const removeListener = () => {
  window.removeEventListener('beforeunload', handleWindowClose);
  window.removeEventListener('popstate', handleGoBack);
};

const openGoBackDialog = (url?: string) => {
  const dialogId = 'closeDoubleConfirm';
  openDialog({
    dialogId,
    children: (
      <div>
        <p>此时离开将丢失已编辑的内容，是否离开？</p>
      </div>
    ),
    footer: (
      <>
        <Button
          onClick={() => {
            closeDialog(dialogId);
            window.history.back()
          }}
        >
          取消
        </Button>
        <Button
          onClick={() => {
            closeDialog(dialogId);
            removeListener();
            if (url) {
              hashHistory.push(url);
            } else {
              if (window.history.state) {
                // 为了中和useEffect进入页面的pushState
                hashHistory.goBack();
              }
              hashHistory.goBack();
            }
          }}
          type="primary"
        >
          确定
        </Button>
      </>
    ),
  });
};

const goBackWithoutConfirm = () => {
  removeListener();
  // 为了中和useEffect进入页面的pushState
  if (window.history.state) {
    hashHistory.go(-2);
  }
  // 兼容页面没有加载完成时的回退
  hashHistory.goBack();
};

const redirectWithoutConfirm = (url: string, hashRouter: boolean = true) => {
  removeListener();
  if (window.history.state) {
    hashHistory.go(-2);
  }
  // 防止先执行浏览器跳转，之后执行回退。（如果不使用异步，难以控制回退和浏览器popState顺序）
  setTimeout(() => {
    if (hashRouter) {
      hashHistory.push(url);
    } else {
      window.location.href = url;
    }
  }, 100);
};

const EditFormHOC = <P extends Record<string, any> = any>(WrappedComponent: ComponentType<P>) => {
  const ExitForm: FC<P> = (props) => {
    useEffect(() => {
      // 点击浏览器回退事件会先触发popstate，随后触发popstate监听事件，写两个的作用是保证history.state不为空
      window.history.pushState(
        { name: 'browserBack' },
        'on browser back click',
        window.location.href
      );
      window.history.pushState({ name: 'initState' }, '', '');

      window.addEventListener('beforeunload', handleWindowClose);
      window.addEventListener('popstate', handleGoBack);
      return () => {
        window.removeEventListener('beforeunload', handleWindowClose);
        window.removeEventListener('popstate', handleGoBack);
      };
    }, []);

    return <WrappedComponent {...props} />;
  };

  return ExitForm;
};

const EditFormHOCRef = <P extends Record<string, any> = any>(WrappedComponent: ComponentType<P>) => {
  const ExitForm: FC<P> = (props, ref) => {
    useEffect(() => {
      // 点击浏览器回退事件会先触发popstate，随后触发popstate监听事件，写两个的作用是保证history.state不为空
      window.history.pushState(
        { name: 'browserBack' },
        'on browser back click',
        window.location.href
      );
      window.history.pushState({ name: 'initState' }, '', '');

      window.addEventListener('beforeunload', handleWindowClose);
      window.addEventListener('popstate', handleGoBack);
      return () => {
        window.removeEventListener('beforeunload', handleWindowClose);
        window.removeEventListener('popstate', handleGoBack);
      };
    }, []);

    return <WrappedComponent {...props} ref={ref}/>;
  };

  return React.forwardRef(ExitForm);
};


export default {
  EditFormHOC,
  EditFormHOCRef,
  redirectWithoutConfirm,
  goBackWithoutConfirm,
  handleGoBack,
  removeListener,
  handleRedirect,
};

export * from './types';
