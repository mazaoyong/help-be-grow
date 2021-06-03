import { Pop, Table } from '@zent/compat';
import React, { Component } from 'react';
import { Button, Notify, Input } from 'zent';
import { format } from 'date-fns';
import { isInStoreCondition, arrayColumnWrapper, ShowWrapper } from 'fns/chain';
import { Img } from '@youzan/ebiz-components';
import benefitChoose from '../benefit-choose';
import Promotion from 'components/promotion';
import { showBdappCode } from 'common/api/request';
import { BRANCH_STORE_NAME } from 'constants/chain';

/* import {
  getBenefitColumns,
  addContentToBenefit,
  deleteContentToBenefit,
  modifySerialNo,
} from '../../api'; */
import { getBenefitDetailItems, addBenefitDetailItems, deleteBenefitDetailItems, modifySerialNo } from '../../api';
import { chainSupportBranch } from '../../chain';
import './style.scss';

const { ImgWrap } = Img;
const errMsg = '网络错误';
const TYPE_COLUMN = 1;

const isHqStore = isInStoreCondition({
  supportHqStore: true,
});

export default class BenefitColumsList extends Component {
  state = {
    datasets: [],
    isLoading: false,
    pageSize: 20,
    pageNumber: 1,
    total: 0,
    kw: '',
    serialNow: '',
    serialNowNo: '',
    hideBdapp: true,
  };

  componentDidMount() {
    this.fetch();
    // 检测是否是百度小程序店铺
    showBdappCode()
      .then(res => {
        if (res.mpId) {
          this.setState({ hideBdapp: false });
        }
      });
  }

  openDialog = () => {
    benefitChoose(
      {
        config: {
          alias: this.props.alias,
          ...window._global,
        },
        onChoose: data => {
          const ids = data.map(one => one.id);
          const type = data[0].type;
          addBenefitDetailItems({
            type,
            ids,
            packageAlias: this.props.alias,
          })
            .then(() => {
              Notify.success('添加成功');
              this.fetch({
                pageNumber: 1,
                kw: '',
              });
            })
            .catch(msg => {
              Notify.error(msg || errMsg);
            });
        },
      },
      'column',
    );
  };

  getFetchParams(conf) {
    const { pageNumber, pageSize, kw } = this.state;
    const { alias } = this.props;
    return {
      pageNumber,
      pageSize,
      kw,
      alias,
      type: 1,
      ...conf,
    };
  }

  fetch(conf) {
    const { alias } = this.props;
    conf = this.getFetchParams(conf);
    this.setState({ isLoading: true });
    getBenefitDetailItems(conf)
      .then(data => {
        (data.content || []).forEach(item => {
          item.publishAt = format(item.publishAt, 'YYYY-MM-DD HH:mm:ss');
        });
        this.setState({
          pageNumber: conf.pageNumber,
          datasets: data.content || [],
          total: data.total,
          kw: conf.kw,
          alias,
        });
      })
      .catch(msg => {
        Notify.error(msg || errMsg);
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  onPageChange = ({ current }) => {
    this.fetch({
      pageNumber: current,
    });
  };

  onSearch = e => {
    const kw = e.target.value;
    this.fetch({
      kw,
      pageNumber: 1,
    });
  };

  delete = id => {
    deleteBenefitDetailItems({
      type: TYPE_COLUMN,
      ids: [id],
      packageAlias: this.props.alias,
    })
      .then(() => {
        Notify.success('移除成功');
        this.fetch({
          pageNumber: 1,
          kw: '',
        });
      })
      .catch(msg => {
        Notify.error(msg || errMsg);
      });
  };

  setSerialNow = (id, serialNo) => {
    this.setState({
      serialNow: id,
      serialNowNo: serialNo,
    });
  };

  onSerialNoChange = e => {
    const num = +e.target.value;
    if (Number.isInteger(num)) {
      modifySerialNo({
        serialNo: num,
        alias: this.props.alias,
        id: this.state.serialNow,
        type: TYPE_COLUMN,
      })
        .then(() => {
          let list = this.state.datasets;
          list = list.slice().map(one => {
            if (one.id === this.state.serialNow) {
              one.serialNo = num;
            }
            return one;
          });
          Notify.success('序号修改成功');
          this.setState({
            datasets: list,
            serialNow: '',
            serialNowNo: '',
          });
        })
        .catch(msg => {
          Notify.error(msg || errMsg);
          this.setState({
            serialNow: '',
            serialNowNo: '',
          });
        });
    }
  };

  renderStatusCloumn = () => {
    const Content = Pop.withPop(() => {
      return (
        <div className="column-pop-text">
          <p>
            <span>出售中：</span>
            专栏已发布上线，买家可看
          </p>
          <p>
            <span>已停售：</span>
            专栏未发布上线，买家不可看
          </p>
        </div>
      );
    });

    return (
      <div className="table-list-column">
        状态
        <Pop trigger="hover" position="right-center" content={<Content />}>
          <i className="zenticon zenticon-help-circle help-icon" />
        </Pop>
      </div>
    );
  };

  getColumns = () => {
    return [
      {
        title: '专栏名称',
        width: '40%',
        bodyRender: item => {
          return (
            <div className="benefit-content-item__name">
              <div className="benefit-content-item__cover">
                <ImgWrap
                  width="80px"
                  height="45px"
                  src={item.cover}
                  fullfill="!100x100.jpg"
                />
              </div>
              <div className="benefit-content-item__title ellipsis">
                <a href={!isHqStore ? item.url : null} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </div>
            </div>
          );
        },
      },
      {
        title: '类型',
        width: '40px',
        bodyRender: () => {
          return <span>专栏</span>;
        },
      },
      {
        title: this.renderStatusCloumn(),
        width: '100px',
        bodyRender: item => {
          return <p>{item.status === 1 ? '出售中' : '已停售'}</p>;
        },
      },
      {
        title: '开售时间',
        bodyRender: item => {
          return item.status === 3 ? <span>-</span> : <span>{item.publishAt}</span>;
        },
      },
      {
        title: '序号',
        bodyRender: item => {
          if (chainSupportBranch) {
            return (<span>{item.serialNo}</span>);
          } else {
            if (this.state.serialNow === item.id) {
              return (
                <Input
                  type="number"
                  className="serial-input"
                  width={60}
                  defaultValue={item.serialNo}
                  onBlur={this.onSerialNoChange}
                  onPressEnter={this.onSerialNoChange}
                />
              );
            }
          }
          return (
            <span onClick={() => this.setSerialNow(item.id, item.serialNo)}>
              {item.serialNo || 0}
            </span>
          );
        },
      },
      {
        title: `适用${BRANCH_STORE_NAME}`,
        bodyRender: item => {
          return '全部';
        },
        chainState: isInStoreCondition({
          supportHqStore: true,
        }),
      },
      {
        title: '操作',
        width: '140px',
        bodyRender: item => {
          return (
            <div>
              <ShowWrapper
                isInStoreCondition={isInStoreCondition({
                  supportBranchStore: true,
                  supportSingleStore: true,
                })}
              >
                <Promotion
                  data={{
                    url: item.url,
                    alias: item.alias,
                    pagepath: `packages/edu/webview/index?targetUrl=${encodeURIComponent(
                      `https://h5.youzan.com/wscvis/course/detail/${item.alias}?kdt_id=${_global.kdtId}`,
                    )}`,
                    webviewPath: `/packages/edu/webview/index?targetUrl=${encodeURIComponent(
                      `https://h5.youzan.com/wscvis/course/detail/${item.alias}?kdt_id=${_global.kdtId}`,
                    )}`,
                    hideBdapp: this.state.hideBdapp,
                  }}
                >
                  <span className="ui-link--split">推广</span>
                </Promotion>
              </ShowWrapper>
              <a className="ui-link--split" href={`/v4/vis/course/column/edit/${item.alias}`}>
                {isInStoreCondition({ supportHqStore: true, supportSingleStore: true })
                  ? '编辑'
                  : '查看'}
              </a>
              <ShowWrapper
                isInStoreCondition={isInStoreCondition({
                  supportHqStore: true,
                  supportSingleStore: true,
                })}
              >
                <span className="ui-link--split" onClick={() => this.delete(item.id)}>
                  移除
                </span>
              </ShowWrapper>
            </div>
          );
        },
      },
    ];
  };

  render() {
    return (
      <div className="benefit-content-list">
        <ShowWrapper
          isInStoreCondition={isInStoreCondition({ supportHqStore: true, supportSingleStore: true })}
        >
          <div className="benefit-content-list__header">
            <Button type="primary" onClick={this.openDialog}>
            添加专栏
            </Button>
          </div>
        </ShowWrapper>
        <Table
          className="benefit-content-list__body"
          columns={arrayColumnWrapper(this.getColumns())}
          datasets={this.state.datasets}
          loading={this.state.isLoading}
          emptyLabel="还没有加入专栏"
          onChange={this.onPageChange}
          pageInfo={{
            limit: this.state.pageSize,
            current: this.state.pageNumber,
            total: this.state.total,
          }}
        />
      </div>
    );
  }
}
