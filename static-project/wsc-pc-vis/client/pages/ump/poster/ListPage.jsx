import { Pop, Select, Table } from '@zent/compat';
import React, { Component } from 'react';
import { Notify, Input } from 'zent';
import { VisButton, VisLink } from 'fns/router';
import get from 'lodash/get';
import fullfillImage from 'zan-utils/fullfillImage';
import formatDate from 'zan-utils/date/formatDate';
import { arrayColumnWrapper, isInStoreCondition, ShowWrapper } from 'fns/chain/index';
import classnames from 'classnames';
import Promotion from './components/Promotion';
import { getPosterLists, terminatePosterActive, deletePosterActive, getEffectLists } from './api';
import { findListAllCampus } from 'common/api/shop';
import { BRANCH_STORE_NAME } from 'constants/chain';

const isHqStore = isInStoreCondition({
  supportHqStore: true,
});

const isBranchStore = isInStoreCondition({
  supportBranchStore: true,
});

const defaultLoadingImg = 'https://b.yzcdn.cn/v2/image/loader.gif';
// 是否为微信服务号

const isEffectType = type => {
  return type === 'effect';
};

export default class ListPage extends Component {
  state = {
    tableLoading: true,
    type: '',
    datasets: [],
    title: '',
    paginator: {
      pageSize: 10, // 每页个数
      current: 1,
      total: 0, // 总条目个数
    },
    campusList: [], // 校区列表
    userLike: '',
    campusKdtId: '', // 选中的校区
    isMpAccount: get(window._global, 'mpAccount.serviceType') === 2,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.params.type !== prevState.type) {
      return {
        type: nextProps.params.type,
        paginator: {
          ...prevState.paginator,
          current: 1,
        },
      };
    }
    return null;
  }

  componentDidMount() {
    const { type } = this.state;
    if (isEffectType(type)) {
      this.getPosterLists = this.getPosterEffectLists;
    } else {
      this.getPosterLists = this.getPosterNormalLists;
    }
    this.getPosterLists();
    this.filterCampusList();
  }

  componentDidUpdate(_, prevState) {
    const { type } = this.state;
    if (prevState.type !== type) {
      if (isEffectType(type)) {
        this.getPosterLists = this.getPosterEffectLists;
      } else {
        this.getPosterLists = this.getPosterNormalLists;
      }
      this.getPosterLists();
    }
  }

  handleSearchChange = evt => {
    this.setState({
      title: evt.target.value,
    });
  };

  onTableChange = conf => {
    this.getPosterLists(conf.current);
  };

  getPosterEffectLists(current) {
    this.setState({
      tableLoading: true,
    });

    const { userLike, campusKdtId, paginator } = this.state;
    const req = {
      userLike,
      pageSize: paginator.pageSize,
      pageIndex: current || paginator.current,
    };
    if (campusKdtId && isHqStore) { // 如果是总店，且选择了校区
      req.campusKdtId = campusKdtId;
    }

    getEffectLists(req)
      .then(({ content, pageable, total }) => {
        this.setState({
          datasets: content,
          paginator: {
            pageSize: pageable.pageSize,
            current: pageable.pageNumber,
            total,
          },
        });
      })
      .catch(msg => {
        Notify.error(msg);
      })
      .finally(() => {
        this.setState({
          tableLoading: false,
        });
      });
  }

  getPosterNormalLists(current) {
    this.setState({
      tableLoading: true,
    });

    const { type, title, paginator } = this.state;
    const req = {
      title,
      pageSize: paginator.pageSize,
      pageIndex: current || paginator.current,
    };

    if (['0', '1', '2'].includes(type)) {
      req.status = type;
    } else {
      req.status = -1;
    }

    getPosterLists(req)
      .then(({ content, pageable, total }) => {
        this.setState({
          datasets: content,
          paginator: {
            pageSize: pageable.pageSize,
            current: pageable.pageNumber,
            total,
          },
        });
      })
      .catch(msg => {
        Notify.error(msg);
      })
      .finally(() => {
        this.setState({
          tableLoading: false,
        });
      });
  }

  // 删除海报活动
  handleDelete = id => {
    this.setState({
      tableLoading: true,
    });
    deletePosterActive(id)
      .then(() => {
        this.getPosterLists();
        Notify.success('删除成功！');
      })
      .catch(({ msg }) => {
        Notify.error(msg);
        this.setState({
          tableLoading: false,
        });
      });
  };

  // 结束活动
  handleTerminate = id => {
    this.setState({
      tableLoading: true,
    });
    terminatePosterActive(id)
      .then(() => {
        this.getPosterLists();
      })
      .catch(({ msg }) => {
        Notify.error(msg);
        this.setState({
          tableLoading: false,
        });
      });
  };

  getColumns() {
    const columns = [
      {
        title: '活动内容',
        name: 'title',
        width: '20%',
        textAlign: 'left',
        bodyRender: item => {
          const imgClass = classnames({
            'img-loading': !item.previewUrl,
          });

          return (
            <div className="grad-with-img">
              <img
                className={imgClass}
                src={fullfillImage(item.previewUrl || defaultLoadingImg, '!40x72.png')}
                alt="poster"
              />
              <p>{item.title}</p>
            </div>
          );
        },
      },
      {
        title: '有效时间',
        width: '165px',
        textAlign: 'left',
        bodyRender: item => {
          return (
            <span>
              {formatDate(item.startAt, 'YYYY-MM-DD HH:mm:ss')}至 <br />
              {formatDate(item.endAt, 'YYYY-MM-DD HH:mm:ss')}
            </span>
          );
        },
      },
      {
        title: '活动状态',
        width: '10%',
        textAlign: 'left',
        bodyRender: ({ status }) => {
          switch (status) {
            case 0:
              return '未开始';
            case 1:
              return '进行中';
            case 2:
              return '已结束';
            default:
              return '-';
          }
        },
      },
      {
        title: '海报生成次数',
        name: 'createNum',
        textAlign: 'left',
      },
      {
        title: '拉新用户数',
        name: 'invitedNum',
        textAlign: 'left',
      },
      {
        title: `适用${BRANCH_STORE_NAME}`,
        chainState: isHqStore,
        name: 'campus',
        textAlign: 'left',
        bodyRender: item => {
          return (
            <span>{ item.isAllCampus ? '全部' : null }</span>
          );
        },
      },
      {
        title: '操作',
        width: '20%',
        bodyRender: item => {
          return (
            <div>
              <VisLink className="ui-link--split" to={`/poster/edit/${item.id}`}>
                { (item.status === 2 || isBranchStore) ? '查看' : '编辑' }
              </VisLink>
              {item.status === 1 && !isBranchStore && (
                <Pop
                  trigger="click"
                  position="top-center"
                  content="确定结束活动？"
                  onConfirm={() => this.handleTerminate(item.id)}
                >
                  <span className="ui-link--split"> 结束活动 </span>
                </Pop>
              )}
              {item.status === 1 && !isBranchStore && !isHqStore && (
                <div className="split-symbol"></div>
              )}
              {item.status === 1 && !isHqStore && (
                <Pop
                  content={<Promotion id={item.id} />}
                  trigger="click"
                  centerArrow
                  position="left-center"
                >
                  <span className="ui-link--split"> 推广 </span>
                </Pop>
              )}
              {item.status !== 1 && !isBranchStore && (
                <Pop
                  trigger="click"
                  position="left-center"
                  content="确定删除?"
                  onConfirm={() => this.handleDelete(item.id)}
                >
                  <span className="ui-link--split"> 删除 </span>
                </Pop>
              )}
            </div>
          );
        },
      },
    ];

    return arrayColumnWrapper(columns);
  }

  getEffectColumns() {
    return [
      {
        title: '活动名称',
        name: 'activityName',
        width: '15%',
        textAlign: 'left',
      },
      {
        title: '订单信息',
        width: '15%',
        textAlign: 'left',
        bodyRender: item => {
          return (
            <span>
              <span className="poster__list-orderinfo">{item.orderNo}</span>
              <ShowWrapper
                isInStoreCondition={isInStoreCondition({ supportBranchStore: true })}
              >
                <br />
                {item.shopName}
              </ShowWrapper>
            </span>
          );
        },
      },
      {
        title: '创建时间',
        width: '165px',
        textAlign: 'left',
        bodyRender: item => {
          return <span>{formatDate(item.rewardTime, 'YYYY-MM-DD HH:mm:ss')}</span>;
        },
      },
      {
        title: '用户信息',
        textAlign: 'left',
        width: '15%',
        bodyRender: item => {
          return (
            item.nickname || item.phone
              ? <>
                <div>{item.nickname}</div>
                <div>{item.phone}</div>
              </>
              : <div>用户未登录，暂无信息</div>
          );
        },
      },
      {
        title: '活动奖励',
        name: 'prizeName',
        width: '15%',
        textAlign: 'left',
      },
      {
        title: '奖励价值',
        name: 'prizeValue',
        width: '15%',
        textAlign: 'left',
      },
      {
        title: '拉新人数',
        width: '15%',
        name: 'inviteNum',
      },
    ];
  }

  render() {
    const { title, datasets, paginator, type, userLike, campusList, campusKdtId, isMpAccount } = this.state;

    return (
      <div className="poster-container">
        {
          isEffectType(type)
            ? <div className="effect_search">
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
                <VisButton type="primary" onClick={this.handleSearchSubmit}>
                  筛选
                </VisButton>
                <VisButton type="primary" className="btn-reset" outline onClick={this.handleResetForm}>
                  清空筛选条件
                </VisButton>
              </div>
            </div>
            : <div className="list-filter clearfix">
              <ShowWrapper
                isInStoreCondition={!isInStoreCondition({ supportBranchStore: true })}
              >
                <VisButton type="primary" pctCheck disabled={!isMpAccount} to="/poster/add">
                  新建海报
                </VisButton>
              </ShowWrapper>
              <div className="filter-right">
                <Input
                  icon="search"
                  value={title}
                  placeholder='搜索'
                  onChange={this.handleSearchChange}
                  onPressEnter={() => this.getPosterLists()}
                />
              </div>
            </div>
        }
        <Table
          columns={isEffectType(type) ? this.getEffectColumns() : this.getColumns()}
          datasets={datasets}
          pageInfo={paginator}
          onChange={conf => {
            this.onTableChange(conf);
          }}
          loading={this.state.tableLoading}
          emptyLabel="还没有海报"
        />
      </div>
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
    this.setState({ paginator: {
      current: 1,
      pageSize: 10,
    } });
    this.getPosterEffectLists();
  };
  handleResetForm = () => {
    this.setState({ userLike: '' });
    this.setState({ campusKdtId: '' });
    setTimeout(() => {
      this.handleSearchSubmit();
    }, 0);
  };

  async filterCampusList() { // 获取校区列表
    const data = await findListAllCampus({});
    let campusList = [{
      value: 0,
      text: `全部${BRANCH_STORE_NAME}`,
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
}
