import React, { Component } from 'react';
import { Switch } from 'zent';
import { isWscBranchStore, isUnifiedBranchStore, isInStoreCondition, isRetailMinimalistPartnerStore, isUnifiedPartnerStore } from 'fns/chain';

const isRetailMinifyBranchShop = isInStoreCondition({
  supportMinifyRetailBranchShop: true,
});
export default class SettingItem extends Component {
  render() {
    const { title, checked, component = null, onChange } = this.props;

    return (
      <div className="setting-item">
        <div className="setting-item-header">
          <div className="setting-item-header__titile">{title}</div>
          <Switch
            checked={checked}
            size="small"
            onChange={() => onChange()}
            disabled={isWscBranchStore || isUnifiedBranchStore || isUnifiedPartnerStore ||
              isRetailMinifyBranchShop || isRetailMinimalistPartnerStore}
          />
        </div>
        <div className="setting-item-body">{component}</div>
      </div>
    );
  }
}
