import React from 'react';
import cx from 'classnames';
import ChooseMenu from '@youzan/react-components/es/components/choose-dialog/ChooseMenu';
import get from 'lodash/get';
import CustomLinkNotice from '../custom-link-notice';
import '@youzan/react-components/es/components/choose-dialog/style';
import './style/index.scss';

export default React.forwardRef((props, ref) => {
  const {
    globalConfig = {},
    settings = {},
    linkMenuItems,
    hasPopoverTrigger = true,
    menuStyle,
    value,
    onChange,
    onMenuClick,
  } = props;

  // change: 插入 自定义链接 是否 展示提示组件的 标识
  const newGlobalConfig = Object.assign(globalConfig, {
    show_custom_link_notice_content: get(_global, 'has_order_weapp.isValid', false),
  });

  const cls = cx('deco-choose-menu', {
    'deco-choose-menu--has-popover': hasPopoverTrigger,
  });

  return (
    <div className={cls}>
      <ChooseMenu
        ref={ref}
        isWeapp={globalConfig.is_weapp_setting === 1}
        isMultiStore={settings.isMultiStore}
        hasPointsStore={globalConfig.pointsstore_status === 1}
        menuItems={linkMenuItems}
        hasPopoverTrigger={hasPopoverTrigger}
        menuStyle={menuStyle}
        value={value}
        onChoose={onChange}
        onMenuClick={onMenuClick}
        config={newGlobalConfig}
        noticeComponent={CustomLinkNotice}
        useCouponV2={globalConfig.in_choose_coupon_v2 || false}
      />
    </div>
  );
});
