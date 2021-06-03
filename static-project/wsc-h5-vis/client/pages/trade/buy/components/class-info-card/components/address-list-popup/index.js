import { get } from 'lodash';
import { Popup } from '@youzan/vis-ui';
import AddressList from './components/address-list';

/**
 *打开地址列表弹窗
 *
 * @param {{props: { addressList: any[], chosenAddressId: number | undefined }}} params - 入参
 * @return {Promise<any>}
 */
export const openAddressListPopup = params => {
  const num = get(params, 'props.addressList.length', 0);
  return Popup.getOpenPopup(AddressList, {
    props: {
      title: `上课地点 (${num})`,
      closeable: true,
    },
  })(params);
};
