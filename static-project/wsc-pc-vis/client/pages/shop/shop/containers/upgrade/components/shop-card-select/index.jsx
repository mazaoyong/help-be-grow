import React from 'react';
import { BlockLoading, Pagination, Notify } from 'zent';
import { queryModifiableShops } from '../../../../api';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import ShopCard from '../shop-card';
import cx from 'classnames';

import './style.scss';

export default class shopCardSelect extends React.Component {
  static propTypes = {
    mobile: PropTypes.string,
    shopKdtId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onSelect: PropTypes.func,
    className: PropTypes.string,
  };

  static defaultProps = {
    mobile: get(window, '_global.userInfo.account', ''),
    className: '',
  };

  state = {
    list: [],
    // 分页相关
    current: 1,
    pageSize: 6,
    totalItem: 0,
    // loading
    loading: false,
  };

  componentDidMount() {
    this.getShopList();
  }

  getShopList(currentPage = 1) {
    const { shopKdtId, onSelect, mobile } = this.props;

    this.setState({ loading: true });
    queryModifiableShops({
      mobile,
      pageNum: currentPage,
      pageSize: this.state.pageSize,
    })
      .then(ret => {
        const paginator = ret.paginator || {};
        this.setState({
          list: ret.items,
          current: paginator.page,
          totalItem: paginator.totalCount,
          loading: false,
        });

        // 默认选中逻辑
        if (!shopKdtId) {
          const defaultChoose = (ret.items || [])[0];
          if (defaultChoose) onSelect(defaultChoose.kdtId, defaultChoose);
        }
      })
      .catch(err => {
        Notify.error(`获取店铺列表失败${err || err.msg}`);
        this.setState({ loading: false });
      });
  }

  render() {
    const { list, loading, current, totalItem, pageSize } = this.state;
    const { shopKdtId, onSelect, className = '' } = this.props;
    return (
      <div className={`card-select ${className}`}>
        <BlockLoading loading={loading}>
          {list.length > 0 ? (
            <>
              <div className="card-select__cards">
                {list.map(data => {
                  const { kdtId } = data;
                  const shopCardProps = {
                    data,
                    onCheck: () => onSelect(kdtId, data),
                    checked: shopKdtId === kdtId,
                  };
                  return <ShopCard key={kdtId} {...shopCardProps} />;
                })}
              </div>
              <Pagination
                className="card-select__pagination"
                current={current}
                totalItem={totalItem}
                pageSize={pageSize}
                onChange={({ current: page }) => this.getShopList(page)}
              />
            </>
          ) : (
            <div className={cx('card-select__empty', { hide: loading })}>
                没有可升级的微商城店铺，请创建新店铺
            </div>
          )}
        </BlockLoading>
      </div>
    );
  }
}
