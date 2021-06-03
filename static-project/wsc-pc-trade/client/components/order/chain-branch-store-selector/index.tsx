import React, { Component } from 'react';
import { Notify } from 'zent';
import { getBranchShopList } from './api';
import { isWscHqStore } from '@youzan/utils-shop';
import { ISelect } from './type';

interface IProps {}

interface IState {
  list: ISelect[];
}
function withBranchShopSelector(WrappedComponent, condation: boolean = false) {
  if (!(isWscHqStore || condation)) {
    return WrappedComponent;
  }

  return class WscHqWrap extends Component<IProps, IState> {
    public state: IState = {
      list: [
        {
          text: '全部',
          value: 0,
        },
      ],
    };

    public componentDidMount() {
      getBranchShopList()
        .then((res = []) => {
          const shopList = res.map(({ kdtId, shopName }) => {
            return {
              key: kdtId,
              text: shopName,
              value: kdtId,
            };
          });
          this.setState({
            list: [
              {
                text: '全部',
                value: 0,
              },
              ...shopList,
            ],
          });
        })
        .catch(err => {
          Notify.error(err);
        });
    }

    public render() {
      const { list } = this.state;
      const newProps = {
        subShopList: list,
      };
      return <WrappedComponent {...this.props} {...newProps} />;
    }
  };
}

export interface IWithBranchShopSelectorProps {
  subShopList: ISelect[];
}

export default withBranchShopSelector;
