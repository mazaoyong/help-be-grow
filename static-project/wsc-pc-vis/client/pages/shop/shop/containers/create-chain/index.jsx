import React from 'react';
import { hashHistory } from 'react-router';
import { Notify } from 'zent';
import PageWrapper from '../../components/page-wrapper';
import CreateForm from '../../components/create-form';
import { createEduHQ } from '../../api';
import { createShopLog, createShopSuccessLog } from '../../utils/log';
import './style.scss';

export default class App extends React.Component {
  state = {
    loading: false,
  }

  componentDidMount() {
    // 连锁创建白名单校验
    if (!_global.yzEduChainWhitelist) {
      Notify.success('有赞教育连锁版即将正式上线，敬请期待');
      window.location = '#/select';
    }
  }

  onSubmitSuccess = (values) => {
    const { business: businessId, location, address: detailAdd, teamName: shopName, lngAndLat } = values;
    const address = {
      city: location.city,
      countyId: location.county_id,
      county: location.area,
      province: location.province,
      address: detailAdd,
      lng: lngAndLat.lng.toString(),
      lat: lngAndLat.lat.toString(),
    };
    this.setState({ loading: true });

    createShopLog();
    createEduHQ({ address, shopName, businessId })
      .then(res => {
        createShopSuccessLog(res.kdtId);
        hashHistory.push({
          pathname: '/finish',
          query: {
            title: encodeURIComponent(shopName),
            kdtId: res.kdtId,
          },
        });
      })
      .catch(e => {
        Notify.error(e || '创建失败，请重试或联系人工客服');
      })
      .finally(() => this.setState({ loading: false }));
  }

  render() {
    return (
      <PageWrapper step={2}>
        <CreateForm
          onSubmitSuccess={this.onSubmitSuccess}
          loading={this.state.loading}
        />
      </PageWrapper>
    );
  }
}
