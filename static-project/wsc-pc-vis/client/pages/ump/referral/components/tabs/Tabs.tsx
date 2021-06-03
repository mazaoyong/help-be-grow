import React, { useEffect } from 'react';
import { Alert } from 'zent';
import { isInStoreCondition, ShowWrapper } from 'fns/chain/index';

const chainShopDesc = _global.isYZEdu ? '校区' : '网店';
export default function Tab(props) {
  const { children, routes } = props;
  useEffect(() => {
    const $app = document.querySelector('.app-inner');
    if (routes[1].path.includes('data')) {
      $app && $app.classList.add('no-pad');
    } else {
      $app && $app.classList.remove('no-pad');
    }

    window.scrollTo(0, 0);
  }, [routes]);

  return (
    <div className="referral-wrapper">
      <ShowWrapper isInStoreCondition={isInStoreCondition({ supportBranchStore: true })}>
        <Alert type="warning">
          推荐有奖活动由总部统一配置，{chainShopDesc}无法对内容进行修改，仅可查看。
        </Alert>
      </ShowWrapper>
      {children}
    </div>
  );
}
