import React from 'react';
import { ShopChoose as PrimitiveShopSelector } from 'pages/shop/components/shop-choose';
export { ShopChooseControll, getShopList, ShopChoose as PrimitiveShopSelector } from 'pages/shop/components/shop-choose';

/**
 * 原来的校区选择，onChange是入参是event对象，这里再包裹一下抛出
 */
export const ShopChoose: React.FC<any> = (passiveProps: any) => {
  const { onChange, ...restProps } = passiveProps || {};
  const handleChange = React.useCallback(
    (evt: any) => {
      if (onChange) onChange(evt.target.value);
    },
    [onChange],
  );
  return <PrimitiveShopSelector {...restProps} onChange={handleChange} />;
};
