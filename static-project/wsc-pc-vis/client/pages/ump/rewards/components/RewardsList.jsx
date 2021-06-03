import VisList, { VisFilterTable } from 'components/vis-list';
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { Notify } from 'zent';
import { isArray, map, omit } from 'lodash';
import { filterOptions, rewardColumns } from './rewardlist-config';
import { Button as SamButton } from '@youzan/sam-components';
import { getRewardsList, updateRewardStatus } from '../common/api';
import { findListAllCampus } from 'common/api/shop';
import { REWARDS_TYPE_MAP } from '../constants';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

const DEFAULT_CAMPUS = { value: 0, text: '全部' };

class RewardsList extends PureComponent {
  state = {
    campusList: [DEFAULT_CAMPUS],
    campusId: DEFAULT_CAMPUS.value,
  }

  shouldRest = false;

  defaultValue = {
    awardType: 0,
    status: 0,
    rewardNodeType: 0,
    activityName: '',
    campusKdtId: DEFAULT_CAMPUS.value,
    activityStatus: 0,
  };

  componentDidMount() {
    this.fetchCampus();
  }

  componentDidUpdate() {
    if (this.shouldRest) {
      this.reset();
      this.shouldRest = false;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.rewardNodeType !== this.props.rewardNodeType) {
      this.shouldRest = true;
    }

    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState); ;
  }

  fetchCampus() {
    findListAllCampus().then(data => {
      let campusList = [DEFAULT_CAMPUS];
      if (isArray(data)) {
        campusList = campusList.concat(map(data, campus => ({
          text: campus.shopName,
          value: campus.kdtId,
        })));
      } else {
        campusList = [{ value: -1, text: '暂无校区' }];
      }
      this.setState({
        campusList,
      });
    });
  }

  updateStatus = (rewardActivityId, activityStatus) => {
    return updateRewardStatus({ rewardActivityStatusUpdateCommand: { rewardActivityId, activityStatus } });
  }

  renderBottomAction = filter => {
    const { submit, reset } = filter;
    return (
      <>
        <SamButton type="primary" onClick={submit}>
          筛选
        </SamButton>
        <span className="filter__actions__reset" onClick={reset}>
          重置筛选条件
        </span>
      </>
    );
  };

  refreshList = () => this.VisTable.Table.refetchData;

  reset = () => {
    const resetFilter = get(this.VisTable, 'Filter.filter.reset', () => {});
    resetFilter();
  };

  fetchData = ({ filterConditions, pageConditions }) => {
    const { rewardNodeType } = this.props;
    this.setState({
      campusId: +filterConditions.campusKdtId,
    });
    pageConditions['sort']['orders'] = [{
      direction: 'DESC',
      property: 'created_at',
    }];
    if (!+filterConditions.campusKdtId) {
      filterConditions = omit(filterConditions, 'campusKdtId');
    }
    const rewardActivityQuery = {
      awardType: 0,
      status: 0,
      ...filterConditions,
      rewardNodeType: REWARDS_TYPE_MAP[rewardNodeType],
    };
    return getRewardsList({ pageRequest: pageConditions, rewardActivityQuery }).then(data => {
      if (data && data.content) {
        return {
          datasets: data.content,
          total: data.total,
          current: data.pageable.pageNumber,
        };
      }
      return data;
    }).catch(() => {
      Notify.error('获取奖励活动列表失败');
    });
  };

  render() {
    const { rewardNodeType } = this.props;
    return (
      <VisList>
        <VisFilterTable
          ref={table => (this.VisTable = table)}
          filterProps={
            {
              defaultValue: this.defaultValue,
              options: filterOptions.call(this),
              bottomActions: this.renderBottomAction,
            }
          }
          tableProps={
            {
              columns: rewardColumns.call(this, rewardNodeType),
              fetchData: this.fetchData,
              rowKey: 'activityId',
              scroll: {
                x: 1200,
              },
            }
          }
        >
        </VisFilterTable>
      </VisList>
    );
  }
}

export default withRouter(RewardsList);
