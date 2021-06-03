import React, { Component } from 'react';
import { BreadcrumbNav } from '@youzan/react-components';
import { TAB_INDEX } from '../constants';
import '../styles/nav-wrapper.scss';
import SettingIcon from '../components/settingicon';

export default function(WrappedComponent, tabIndex) {
  return class extends Component {
    render() {
      const navs = [
        { id: TAB_INDEX.LIST, name: '预约列表', href: '#/list' },
        { id: TAB_INDEX.PANEL, name: '预约看板', href: '#/panel' },
      ];
      return (
        <div className="nav-wrapper">
          <BreadcrumbNav
            className="nav-wrapper__navbar"
            navs={navs}
            activeNav={tabIndex}
            hasBottomBorder
          />
          <SettingIcon />
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  };
}
