import React, { Component } from 'react';
import { Grid, BlockLoading } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';

import { format } from 'date-fns';

import FailWithPopup from '../../components/fail-with-popup';
import getPageRequest from '../../utils/get-pagerequest';
import { getClueList } from '../../api/list';

import './styles.scss';

const PAGESIZE = 20;
const initPageAndSort = {
  pageInfo: {
    current: 1,
    // totalItem: 0,
    total: 0,
    pageSize: PAGESIZE,
  },
  sortBy: '',
  sortType: '',
};

class ClueList extends Component {
  state = {
    loadingVisible: false,
    clueList: [],
    pageAndSort: initPageAndSort,
  }

  componentDidMount() {
    this.fetchClueList();
  }

  handleTableChange = (params) => {
    const { current, sortBy = '', sortType = '' } = params;
    this.setState({
      pageAndSort: {
        pageInfo: { ...this.state.pageAndSort.pageInfo, current },
        sortBy,
        sortType,
      },
    }, this.fetchClueList);
  };

  fetchClueList = () => {
    this.setState({
      loadingVisible: true,
    });
    const pageRequest = getPageRequest(this.state.pageAndSort.pageInfo);
    const query = {
      importType: 1,
    };
    getClueList({ pageRequest, query })
      .then(({ content, pageable, total }) => {
        // 设置tatal
        const { pageInfo } = this.state.pageAndSort;
        pageInfo.total = total;
        this.setState({
          clueList: content,
          pageAndSort: Object.assign(this.state.pageAndSort, { pageInfo: { ...pageInfo } }),
        });
      })
      .finally(() => {
        this.setState({
          loadingVisible: false,
        });
      });
  }

  columns = [
    {
      name: 'createdAt',
      title: '导入时间',
      bodyRender({ createdAt }) {
        return format(createdAt, 'YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      name: 'expectRowNum',
      title: '预期导入数',
      bodyRender({ importState, expectRowNum, failedMsg }) {
        if (importState === 0) {
          return '导入中';
        }
        if (importState === 2) {
          return failedMsg;
        }
        return expectRowNum;
      },
    },
    {
      name: 'successRowNum',
      title: '成功数',
      bodyRender({ importState, successRowNum }) {
        if (importState === 0) {
          return '-';
        }
        return successRowNum;
      },
    },
    {
      name: 'failedRowNum',
      title: '失败数',
      bodyRender(row) {
        const { importState } = row;
        if (importState === 0) {
          return '-';
        }
        return <FailWithPopup row={row} />;
      },
    },
    {
      title: '导入者',
      bodyRender(row) {
        if (row.operator) {
          return (
            <>
              <div>{row.staffName || ''}</div>
              <div>{row.operator.mobile || ''}</div>
            </>
          );
        }
        return '-';
      },
    },
    {
      title: '操作',
      textAlign: 'right',
      bodyRender: ({ importState, statisticsFileUrl }) => {
        if (importState === 0) {
          return <a onClick={this.fetchClueList}>刷新</a>;
        }
        if (statisticsFileUrl) {
          return <a href={statisticsFileUrl} download>下载失败报表</a>;
        }
        return null;
      },
    },
  ];

  render() {
    return (
      <div className="clueimport__container">
        <SamButton type="primary" name="编辑" href="#/add">批量导入线索</SamButton>
        <BlockLoading loading={this.state.loadingVisible}>
          <Grid
            datasets={this.state.clueList}
            columns={this.columns}
            onChange={this.handleTableChange}
            className="clueimport__container__list"
            {...this.state.pageAndSort}
          />
        </BlockLoading>
      </div>
    );
  }
};

export default ClueList;
