import React from 'react';
import { isInStoreCondition, ShowWrapper } from 'fns/chain/index';
import ShopSelector from 'components/field/shop-selector';

export default function SupportShop({ label, isView, campusList = [], campusType = 0 }) {
  return ShowWrapper({
    children: (
      <ShopSelector
        shopInfo={{
          applicableCampusList: campusList,
          applicableCampusType: campusType,
        }}
        isEdit={isView}
        label={label}
        isCheckRemove={false}
        isCanDelete={!isView}
        required={true}
      />
    ),
    isInStoreCondition: isInStoreCondition({
      supportEduHqStore: true,
    }),
  });
}
