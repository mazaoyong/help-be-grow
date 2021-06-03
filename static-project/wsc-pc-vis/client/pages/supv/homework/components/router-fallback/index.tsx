import { React, createComponent } from '@youzan/tany-react';
import { ErrorBoundary } from 'zent';
import CommonLink from 'components/common-link';

import './styles.scss';

const { withErrorBoundary } = ErrorBoundary;

// todo: 拆成props放到公共组件中使用
const targetPageLink = '/v4/vis/supv/homework/workbook/list';
const targetPageName = '作业本列表';

export const RouterFallback = () => {
  setTimeout(() => window.location.replace(targetPageLink), 5000);

  return (
    <div className="common-router-fallback">
      <p>您所访问的页面不存在，页面将在5秒后返回{targetPageName}。</p>
      <p>
        如果您的浏览器没有自动跳转，请点击
        <CommonLink
          href={targetPageLink}
        >
          这里
        </CommonLink>
        。
      </p>
    </div>
  );
};

const withRouterFallback = (Component: React.ComponentType) => {
  return (
    withErrorBoundary({
      Component,
      FallbackComponent: createComponent(RouterFallback),
    })
  );
};

export default withRouterFallback;
