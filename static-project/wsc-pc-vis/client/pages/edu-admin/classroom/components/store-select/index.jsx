
import { Select, Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Notify } from 'zent';
import { LinkGroup } from '@youzan/ebiz-components';
import { getStores } from '../../api';

const { getControlGroup } = Form;

class StoreSelect extends PureComponent {
  state = {
    data: [],
  };

  componentDidMount() {
    this.fetchData();
  }

  render() {
    const { value, width, lite } = this.props;
    const { data } = this.state;
    const placeholder = lite ? '全部' : '请选择';
    const modifiedData = lite ? [{ value: 0, text: '全部' }].concat(data) : data;
    return (
      <>
        <Select
          placeholder={placeholder}
          autoWidth
          data={modifiedData}
          width={width}
          value={value}
          onChange={this.handleSelect}
        />
        {!lite && this.renderLinkGroup()}
      </>
    );
  }

  handleSelect = e => {
    this.props.onChange({ value: e.target.value });
  };

  renderLinkGroup = () => <LinkGroup data={this.linkGroup} />;

  fetchData = () => {
    if (!window._components) {
      window._components = {};
    }
    if (window._components.store) {
      this.setState({ data: window._components.store });
      return;
    }
    this.doFetchData();
  };

  doFetchData = () => {
    if (!window._components) {
      window._components = {};
    }
    this.wrapLoading(
      getStores().then(data => {
        const store = this.formateData(data);
        window._components.store = store;
        this.setState({ data: store });
      }),
    );
  };

  wrapLoading = promise => {
    this.setState({ loading: true });
    return promise
      .catch(err => {
        Notify.error(err);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  formateData = data => data.map(item => ({ value: item.id, text: item.name }));

  linkGroup = [
    {
      text: '新建',
      href: `${window._global.url.www}/setting/store/indexv2#/list`,
      targetBlank: true,
    },
    {
      text: '刷新',
      onClick: this.doFetchData,
    },
  ];
}

export default StoreSelect;

export const StoreSelectField = getControlGroup(StoreSelect);
