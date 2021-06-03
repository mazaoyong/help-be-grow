import React, { Component } from 'react';
import { Notify } from 'zent';
import { getStoreList } from './api';
import { IStoreListItem } from './type';
import { isShowMultiStore } from 'constants/role';

interface IProps {}

interface IState {
  list: IStoreListItem[];
}

function withMultiStoreSelector(WrappedComponent) {
  if (!isShowMultiStore) {
    return WrappedComponent;
  }

  return class MultiStoreWrap extends Component<IProps, IState> {
    state: IState = {
      list: [{ id: 0, name: '全部网点' }],
    };

    componentDidMount() {
      getStoreList({ isOnline: 1 })
        .then((list = []) => {
          this.setState({ list: [{ id: 0, name: '全部网点' }, ...list] });
        })
        .catch(err => {
          Notify.error(err);
        });
    }

    render() {
      const { list } = this.state;
      const newProps = {
        storeList: list,
      };
      return <WrappedComponent {...this.props} {...newProps} />;
    }
  };
}

export interface IWithMultiStoreSelectorProps {
  storeList: IStoreListItem[];
}

export default withMultiStoreSelector;
