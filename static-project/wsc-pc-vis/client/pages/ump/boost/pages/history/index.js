import { Select, Table } from '@zent/compat';
import React, { Component } from 'react';
import { Input, Button } from 'zent';
import formatDate from 'zan-utils/date/formatDate';
import { listHisotryAPI } from '../../api';
import { findListAllCampus } from 'common/api/shop';
import { arrayColumnWrapper, isInStoreCondition, ShowWrapper } from 'fns/chain/index';
import { BRANCH_STORE_NAME } from 'constants/chain';
import TipAlert from '../../components/TipAlert';
import Header from '../../components/Header';

const isHqStore = isInStoreCondition({
  supportHqStore: true
});

export default class History extends Component {
  state = {
    current: 1,
    total: 0,
    pageSize: 20,
    datasets: [],
    campusList: [], // 校区列表
    userLike: '',
    campusKdtId: '' // 选中的校区
  };
  componentDidMount() {
    const { current, pageSize } = this.state;
    this.filterCampusList();
    this.filterHistoryList(current, pageSize);
  }

  getColumns() {
    const columns = [
      {
        title: '活动名称',
        name: 'activity_name'
      },
      {
        title: '订单信息',
        width: '25%',
        bodyRender(data) {
          return (
            <>
              <div className="boost-history_word-break">{data.order_no}</div>
              <div>{formatDate(data.reward_time, 'YYYY-MM-DD HH:mm:ss')}</div>
            </>
          );
        }
      },
      {
        title: `所属${BRANCH_STORE_NAME}`,
        name: 'shop_name',
        chainState: isHqStore
      },
      {
        title: '用户信息',
        width: '15%',
        bodyRender(data) {
          return (
            data.nickname || data.phone
              ? <>
                <div>{data.nickname}</div>
                <div>{data.phone}</div>
              </>
              : <div>用户未登录，暂无信息</div>
          );
        }
      },
      {
        title: '活动奖励',
        name: 'prize_name',
      },
      {
        title: '奖励价值（元）',
        name: 'prize_value',
        textAlign: 'right',
      },
      // 奖励价值和助力人数靠的太近，增加一空列起到分隔效果
      {
        width: '90px',
      },
      {
        title: '助力人数',
        name: 'invite_num',
        textAlign: 'left',
      }
    ];

    return arrayColumnWrapper(columns);
  }

  render() {
    const { current, total, pageSize, datasets, campusList, userLike, campusKdtId } = this.state;
    return (
      <>
        <Header />
        <TipAlert />
        <div className="boost-history_search">
          <div className="search-item">
            <label className="label">用户信息:</label>
            <Input
              name="user"
              type="text"
              value={userLike}
              placeholder="请输入用户名称/手机号"
              onChange={this.handleUserChange}
            />
          </div>
          <ShowWrapper
            isInStoreCondition={isInStoreCondition({ supportHqStore: true })}
          >
            <div className="search-item">
              <label className="label">所属{BRANCH_STORE_NAME}:</label>
              <Select
                name="campus"
                data={campusList}
                value={campusKdtId}
                onChange={this.handleCampusChange}
              />
            </div>
          </ShowWrapper>
          <div className="form-actions">
            <Button type="primary" onClick={this.handleSearchSubmit}>
              筛选
            </Button>
            <Button type="primary" className="btn-reset" outline onClick={this.handleResetForm}>
              清空筛选条件
            </Button>
          </div>
        </div>
        <Table
          className="boost-wrapper"
          columns={this.getColumns()}
          pageInfo={{ current, total, pageSize }}
          datasets={datasets}
          onChange={this.handleTableChange}
          rowKey="order_no"
        />
      </>
    );
  }

  reRender = () => {
    this.forceUpdate();
  };
  handleUserChange = e => {
    this.setState({ userLike: e.target.value });
  };
  handleCampusChange = e => {
    this.setState({ campusKdtId: e.target.value });
  };
  handleSearchSubmit = () => {
    const current = 1;
    const { pageSize } = this.state;
    this.setState({ current });
    this.filterHistoryList(current, pageSize);
  };
  handleResetForm = () => {
    this.setState({ userLike: '' });
    this.setState({ campusKdtId: '' });
    setTimeout(() => {
      this.handleSearchSubmit();
    }, 0);
  };
  handleTableChange = ({ current }) => {
    const { pageSize } = this.state;
    this.setState({ current });
    this.filterHistoryList(current, pageSize);
  };

  async filterCampusList() { // 获取校区列表
    const data = await findListAllCampus({});
    let campusList = [{
      value: 0,
      text: `全部${BRANCH_STORE_NAME}`
    }];
    if (data.length === 0) {
      campusList = [{ value: 0, text: `暂无${BRANCH_STORE_NAME}` }];
    }
    const parsedCampusList = data.map(campus => { // 生成符合select组件的数据格式
      const obj = {};
      obj.value = campus.kdtId;
      obj.text = campus.shopName;
      return obj;
    });
    campusList = [...campusList, ...parsedCampusList];
    this.setState({ campusList });
  }
  async filterHistoryList(pageNumber, pageSize) {
    const { kdtId } = window._global.kdtId;
    const { userLike, campusKdtId } = this.state;
    const query = { userLike };
    if (campusKdtId && isHqStore) { // 如果是总店，且选择了校区
      query.campusKdtId = campusKdtId;
    }
    const { content: datasets, total } = await listHisotryAPI({
      kdtId,
      pageRequest: { pageNumber, pageSize },
      query
    });
    this.setState({ datasets, total });
  }
}
