import React, { Component } from 'react';
import { Grid, BlockLoading, Notify } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';

import { format } from 'date-fns';
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
    this.stopPolling();
    const { current, sortBy = '', sortType = '' } = params;
    this.setState({
      pageAndSort: {
        pageInfo: { ...this.state.pageAndSort.pageInfo, current },
        sortBy,
        sortType,
      },
    }, this.fetchClueList);
  };

  componentWillUnmount() {
    this.stopPolling();
  }

  timer = null;

  stopPolling = () => {
    this.timer && clearTimeout(this.timer);
    this.timer = null;
  }

  polling = ({ pageRequest, query }, isInit = false) => {
    getClueList({ pageRequest, query })
      .then(({ content, pageable, total }) => {
        // 防止上一页的 Api 请求没完成用户点击分页导致数据串掉
        if ((!isInit && !this.timer) ||
         this.state.pageAndSort.pageInfo.current !== pageRequest.pageNumber) {
          return;
        }

        // 设置tatal
        const { pageInfo } = this.state.pageAndSort;
        pageInfo.total = total;
        this.setState({
          clueList: content,
          pageAndSort: Object.assign(this.state.pageAndSort, { pageInfo: { ...pageInfo } }),
        });
        // 如果有数据在导入中，继续请求
        if (content.some(item => item.importState === 0)) {
          this.timer = setTimeout(
            () => { this.polling({ pageRequest, query }); },
            3000,
          );
        }
      }).catch(
        (msg) => {
          Notify.error(`${msg},请刷新页面。`);
          this.stopPolling();
        },
      )
      .finally(() => {
        this.state.loadingVisible && this.setState({
          loadingVisible: false,
        });
      });
  }

  fetchClueList = () => {
    this.setState({
      loadingVisible: true,
    });
    const pageRequest = getPageRequest(this.state.pageAndSort.pageInfo);
    const query = {
      importType: 1,
    };
    this.polling(
      { pageRequest, query },
      true,
    );
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
      bodyRender({ importState, expectRowNum }) {
        if (importState === 0 || importState === 2) {
          return '-';
        }
        return expectRowNum;
      },
    },
    {
      name: 'successRowNum',
      title: '实际导入数',
      bodyRender(row) {
        const { importState, successRowNum, failedRowNum } = row;
        if (importState === 0 || importState === 2) {
          return '-';
        }
        return (
          <>
            {!!successRowNum &&
              (<div>成功：{successRowNum}</div>)
            }
            {!!failedRowNum && (
              <div>失败：{failedRowNum}</div>
            )
            }
          </>
        );
      },
    },
    {
      title: '操作人',
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
      title: '导入状态',
      bodyRender(row) {
        const { importState } = row;
        switch (importState) {
          case 0:
            return '导入中';
          case 1:
            return '导入完成';
          case 2:
            return '导入失败';
          default:
            return '-';
        }
      },
    },
    {
      title: '说明',
      bodyRender({ failedStatistics, importState, failedMsg, importPercent }) {
        if (importState === 0) {
          return `已导入${importPercent || '0%'}`;
        }
        if (importState === 2) {
          return failedMsg;
        }
        return Array.isArray(failedStatistics) && failedStatistics.length
          ? '请下载失败报表，修改后重新导入'
          : '-';
      },
    },
    {
      title: '操作',
      textAlign: 'right',
      bodyRender: ({ statisticsFileUrl }) => {
        if (statisticsFileUrl) {
          return <a href={statisticsFileUrl} download>下载失败报表</a>;
        }
        return '-';
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
