import { Link as SamLink, Button as SamButton } from '@youzan/sam-components';
import { Button, Dialog, Grid, Notify, Tag, ClampLines } from 'zent';
import { Operations } from '@youzan/react-components';
import formatDate from 'zan-utils/date/formatDate';
import React, { Component } from 'react';
import classnames from 'classnames';
import get from 'lodash/get';
import { ShowWrapper, isInStoreCondition } from 'fns/chain';
import { BRANCH_STORE_NAME } from 'constants/chain';
import { isUnifiedShop } from '@youzan/utils-shop';
import { Img, EasyList } from '@youzan/ebiz-components';
import { getExportRecordUrl, EXPORT_RECORD_TYPES } from '@ability-center/ump/export-record';
import { RECORDS_OPTIONS, enableStore, chainSupportPartnerStore as partnerStore } from './data';
import { getRecordsLists, exportRecords } from '../api';
import CustomInfo from '../components/buyer-info';
import { receiverInfoAdaptor, setRecordId } from './utils';
import CheckBuy from '../components/check-buy';
import './style.scss';

const { Filter } = EasyList;
const { ImgWrap } = Img;
const { openDialog, closeDialog } = Dialog;
const exportUrl = getExportRecordUrl({ type: EXPORT_RECORD_TYPES.RECORD_ORDER });

const defaultFilter = () => ({
  keyword: '',
  date: ['', ''],
  selectedKdtIdList: [0], // 选中的校区
});
class PaidRecords extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datasets: [],
      total: 0,
      type: '0',
      page: 1,
      size: 20,
      isLoading: false,
      filter: defaultFilter(),
      campusList: [], // 校区列表
    };
    this.maskRef = React.createRef();
  }

  componentDidMount() {
    this.fetch();
  }

  handleFilterChange = (_, data) => {
    this.setState({
      filter: data,
    });
  };

  onSearch = () => {
    this.setState({ page: 1 }, () => {
      this.fetch();
    });
  }

  onExportClick() {
    const conf = this.getFetchParams();
    const { startDate, endDate } = conf;
    if (!startDate || !endDate) {
      return Notify.error('起始或结束时间不能为空');
    }

    Notify.success('正在申请导出...', 10000);
    exportRecords(conf)
      .then(() => {
        Notify.clear();
        Notify.success('导出请求成功！');
        window.open(exportUrl);
      })
      .catch(msg => {
        Notify.clear();
        Notify.error(msg || '网络错误！');
      });
  }

  getFetchParams() {
    const state = this.state;
    const params = {
      page: state.page,
      size: state.size,
      orderNo: state.filter.keyword,
      startDate: state.filter.date[0] ? `${state.filter.date[0]} 00:00:00` : '',
      endDate: state.filter.date[1] ? `${state.filter.date[1]} 23:59:59` : '',
      kdtIdList: [],
    };
    if (enableStore && state.filter.selectedKdtIdList[0] !== 0) {
      // kdtIdListArr.push(state.filter.selectedKdtIdList);
      params.kdtIdList = state.filter.selectedKdtIdList;
    }
    return params;
  }

  // 显示订购人和送礼接收人的信息
  showCustomInfo(customInfo, title) {
    openDialog({
      title,
      style: { width: '500px' },
      dialogId: 'BUYERINFODIALOG',
      children: <CustomInfo data={customInfo} />,
      footer: (
        <Button type="primary" onClick={() => closeDialog('BUYERINFODIALOG')}>
          我知道了
        </Button>
      ),
    });
  }

  fetch = () => {
    const conf = this.getFetchParams();
    const errMsg = '网络错误';
    this.setState({ isLoading: true });

    getRecordsLists(conf)
      .then(res => {
        this.setState({
          datasets: (res.data || []).map(setRecordId),
          total: res.count,
        });
      })
      .catch(msg => {
        Notify.error(msg || errMsg);
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  onTableChange = conf => {
    this.setState(
      {
        page: conf.current,
      },
      () => {
        this.fetch();
      },
    );
  };

  handleResetFilter = () => {
    this.setState({ filter: defaultFilter() });
  }

  getColumns() {
    return [
      {
        title: '订购内容',
        width: '280px',
        fixed: 'left',
        bodyRender: item => {
          const imgWrapCls = classnames({
            'img-box': true,
            'type-icon text': item.type === 2 && item.mediaType === 1,
            'type-icon audio': item.type === 2 && item.mediaType === 2,
            'type-icon video': item.type === 2 && item.mediaType === 3,
            'type-icon live': item.type === 4,
          });
          return (
            <div className="grad-with-img">
              <div className={imgWrapCls}>
                <ImgWrap width="107px" height="60px" src={item.cover} fullfill="!100x100.jpg" />
              </div>
              <div className="content-box">
                <ClampLines lines="2" text={item.title} />
                {item.is_free ? (
                  <Tag style={{ marginLeft: 5 }} outline color="#4b0">
                    试读
                  </Tag>
                ) : null}
                {item.biz_type === 1 ? (
                  <Tag className="fenxiao-tag" color="#4b8">
                    分销
                  </Tag>
                ) : null}
              </div>
            </div>
          );
        },
      },
      {
        title: '订购人',
        width: '185px',
        bodyRender: item => {
          return (
            <p className="record-order-text-break">{item.buyerName ? item.buyerName : '－'}</p>
          );
        },
      },
      {
        title: '手机号',
        name: 'mobile',
        bodyRender(item) {
          let mobile = get(item, 'buyerInfo.mobileString', '-');
          if (String(mobile).length > 11) {
            const countryCode = mobile.slice(0, 3);
            const phoneNumber = mobile.slice(-11);
            mobile = countryCode.concat(' ', phoneNumber);
          }
          if (mobile === 0) {
            return '-';
          }
          return mobile;
        },
      },
      {
        title: '订购时间',
        name: 'description',
        width: '185px',
        bodyRender: item => {
          return item.purchaseTime ? formatDate(item.purchaseTime, 'YYYY-MM-DD HH:mm:ss') : '－';
        },
      },
      {
        title: '微信号',
        name: 'weiXin',
        bodyRender(item) {
          return (
            <div style={{ width: '150px' }}>
              <ClampLines lines="1" text={get(item, 'buyerInfo.weiXin', '-')} />
            </div>
          );
        },
      },
      {
        title: '交易单号',
        name: 'orderNo',
        bodyRender: item => {
          return (
            <div>
              <p className="record-order-text-break">{item.orderNo}</p>
              <ShowWrapper
                isInStoreCondition={isInStoreCondition({ supportHqStore: true }) || partnerStore}
              >
                <p>
                  所属{BRANCH_STORE_NAME}：{item.shopName}
                </p>
              </ShowWrapper>
            </div>
          );
        },
      },
      {
        title: '金额(元)',
        textAlign: 'right',
        bodyRender: item => {
          return <p>{(item.price / 100).toFixed(2)}</p>;
        },
      },
      {
        title: '操作',
        textAlign: 'right',
        fixed: 'right',
        bodyRender: item => {
          if (isUnifiedShop) {
            return '-';
          }
          const items = [];
          if (get(item, 'buyerInfo') !== undefined) {
            items.push(
              <SamLink
                key="buyerInfo"
                onClick={() => this.showCustomInfo(item.buyerInfo, '订购人信息')}
              >
                订购人信息
              </SamLink>,
            );
          }

          if (get(item, 'receiveInfoDTO') !== undefined) {
            items.push(
              <SamLink
                key="recevierInfo"
                onClick={() =>
                  this.showCustomInfo(receiverInfoAdaptor(item.receiveInfoDTO), '领取人信息')
                }
              >
                送礼领取信息
              </SamLink>,
            );
          }
          if (items.length === 0) {
            return '-';
          }
          return <Operations items={items} />;
        },
      },
    ];
  }

  render() {
    const state = this.state;

    return (
      <div className="ump-record">
        <CheckBuy />
        <Filter
          config={RECORDS_OPTIONS}
          value={state.filter}
          onChange={this.handleFilterChange}
          onSubmit={this.onSearch}
          onReset={this.handleResetFilter}
          actionsOption={{
            beforeReset: [
              <Button key="batchExport" type="primary" onClick={() => this.onExportClick()}>
                批量导出
              </Button>,
              <SamButton key="exportList" href={exportUrl} target="_blank">
                导出记录
              </SamButton>,
            ],
          }}
        />
        <Grid
          rowKey="id"
          scroll={{ x: 1450 }}
          emptyLabel="还没有订购记录"
          columns={this.getColumns()}
          onChange={this.onTableChange}
          datasets={this.state.datasets}
          loading={this.state.isLoading}
          pageInfo={{
            pageSize: this.state.size,
            current: this.state.page,
            total: this.state.total,
          }}
        />
      </div>
    );
  }
}

export default PaidRecords;
