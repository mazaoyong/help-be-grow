import ajax from 'fns/ajax';

const shop = {
  GetShopList(data) {
    return ajax({
      url: '/v4/vis/h5/edu/getShopList.json',
      method: 'POST',
      data,
      loading: false
    });
  },
  AuthBeforeEntryShop(data) {
    return ajax({
      url: '/v4/vis/h5/edu/authBeforeEntryShop.json',
      method: 'GET',
      data,
      loading: false
    });
  },
  GetStaffPerms(data) {
    return ajax({
      url: '/v4/vis/h5/edu/getStaffPerms.json',
      method: 'GET',
      data,
      loading: false
    });
  },
  GetStaffRole(data) {
    return ajax({
      url: '/v4/vis/h5/edu/findStaffRole.json',
      method: 'GET',
      data,
      loading: false
    });
  },
  searchShopForSwitch(data) {
    return ajax({
      url: '/v4/vis/h5/edu/searchShopForSwitch.json',
      method: 'GET',
      data,
      loading: false
    });
  },
  getShopMetaInfo(data) {
    return ajax({
      url: '/v4/vis/h5/edu/getShopMetaInfo.json',
      method: 'GET',
      data,
      loading: false
    });
  }
};

export default shop;
