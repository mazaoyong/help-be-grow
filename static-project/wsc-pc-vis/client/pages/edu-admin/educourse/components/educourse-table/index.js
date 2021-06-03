import { Popover } from '@zent/compat';
import React, { PureComponent, Component } from 'react';
import { VisList, VisTable, VisFilter, VisSearch } from 'components/vis-list';
import { hashHistory } from 'react-router';
import { Notify, Dialog } from 'zent';
import { Link as SamLink, Button as SamButton } from '@youzan/sam-components';
import { getCourseList, deleteEduCourseV2 } from '../../../api/educourse';
import { findPageAllCampus } from '../../../api/shop';
import { isInStoreCondition, arrayColumnWrapper, switchWrapper, ShowWrapper } from 'fns/chain';
import { filterOptions } from './filteroption';
import { SchoolTD } from '../shop-number-selector';
import { ScheduleNewDialog } from '../../../../new-dialogs';
import get from 'lodash/get';
import './index.scss';

import { onOpenLockDialogClick, LockType } from '@youzan/ebiz-components/es/lock-wrap/';
const { openDialog, closeDialog } = Dialog;

export default class EduCourseTable extends (PureComponent || Component) {
  constructor(props) {
    super(props);
    this.state = {
      isShopSelected: false,
      shopName: '',
      shopList: [],
    };
  }

  wrapTrialText = (isTrail, content) => {
    return isTrail ? '-' : content;
  };

  columns = () => [
    {
      title: '课程名称',
      width: '25%',
      bodyRender: data => {
        return (
          <div>
            <div>{data.name}</div>
            {!!data.isTrial && (
              <div style={{ fontSize: '12px', color: '#999' }}>默认的仅能用于办理试听的课程</div>
            )}
          </div>
        );
      },
    },
    {
      title: '适用年龄',
      bodyRender: data => {
        return <span>{this.getAgeRange(data.minApply, data.maxApply, data.applyType)}</span>;
      },
    },
    {
      title: '开班数',
      needSort: true,
      name: 'class_num',
      bodyRender: data => {
        return this.wrapTrialText(
          data.isTrial,
          <span>
            <a
              href="javascript:;"
              onClick={() =>
                this.openPage(
                  `${_global.url.v4}/vis/edu/page/educlass#/list?eduCourseId=${data.id}&eduCourseName=${data.name}&kdtId=${data.kdtId}`,
                )
              }
            >
              {data.classNum}
            </a>
          </span>,
        );
      },
    },
    {
      title: '关联线上售卖',
      needSort: true,
      name: 'product_num',
      bodyRender: data => {
        return this.wrapTrialText(
          data.isTrial,
          <span>
            <a
              href="javascript:;"
              onClick={() =>
                this.openPage(
                  `${_global.url.v4}/vis/edu/course#/course-manage/list?eduCourseId=${data.id}&eduCourseName=${data.name}&kdtId=${data.kdtId}`,
                )
              }
            >
              {data.productNum}
            </a>
          </span>,
        );
      },
    },
    {
      title: '上课校区',
      bodyRender: data => {
        return this.wrapTrialText(data.isTrial, <SchoolTD data={data} />);
      },
      chainState: isInStoreCondition({
        supportHqStore: !this.state.isShopSelected,
      }),
    },
    {
      title: '创建时间',
      name: 'created_at',
      bodyRender: data => {
        const createDate = new Date(data.createdAt);
        return this.wrapTrialText(
          data.isTrial,
          <span>{`${createDate.getFullYear()}-${createDate.getMonth() +
            1}-${createDate.getDate()}`}</span>,
        );
      },
    },
    {
      minWidth: isInStoreCondition({ supportEduHqStore: !this.state.isShopSelected })
        ? '170px'
        : null,
      textAlign: 'right',
      title: '操作',
      bodyRender: data => {
        return this.wrapTrialText(
          data.isTrial,
          <div>
            <span>
              {ShowWrapper({
                children: (
                  <>
                    <SamLink
                      name="编辑"
                      onClick={onOpenLockDialogClick(this.props.isRiskLock, LockType.COURSE_SHOP, () =>
                        this.openPage(
                          `${_global.url.v4}/vis/edu/course#/course-manage/add?eduCourseId=${data.hqCourseId || data.id}&eduCourseName=${data.name}`,
                        )
                      )}
                    >
                      {` 发布线上售卖 `}
                    </SamLink>
                    <span className="educourse-demiliter">|</span>
                  </>
                ),
                isInStoreCondition: isInStoreCondition({
                  supportEduSingleStore: true,
                  supportEduHqStore: true, // todo: add privilege check
                }),
              })}
              <SamLink
                name="编辑"
                onClick={() =>
                  ScheduleNewDialog.open('新建日程', {
                    kdtId: data.kdtId,
                    query: {
                      eduCourseId: data.id,
                    },
                  })
                }
              >
                {` 排课 `}
              </SamLink>
              <span className="educourse-demiliter">|</span>
              <SamLink
                name="编辑"
                onClick={() =>
                  this.openPage(
                    `${_global.url.v4}/vis/edu/page/educlass#/list?add=1&eduCourseId=${
                      data.id
                    }&eduCourseName=${data.name}&kdtId=${data.kdtId}`,
                  )
                }
              >
                {` 开班 `}
              </SamLink>
              {ShowWrapper({
                children: (
                  <>
                    <span className="educourse-demiliter">|</span>
                    <Popover
                      className="zent-doc-popover"
                      position={Popover.Position.BottomLeft}
                      display="inline"
                      cushion={5}
                    >
                      <Popover.Trigger.Click>
                        <SamLink>{` ... `}</SamLink>
                      </Popover.Trigger.Click>
                      <Popover.Content>
                        <div className="educourse-more-option">
                          <div>
                            <SamLink name="编辑" onClick={() => this.onEduCourseEdit(data.hqCourseId || data.id)}>
                              {` 编辑 `}
                            </SamLink>
                          </div>{' '}
                          <div>
                            <SamLink
                              name="编辑"
                              onClick={() => this.onEduCourseDelete(data.hqCourseId || data.id, data.name)}
                            >
                              {` 删除 `}
                            </SamLink>
                          </div>
                        </div>
                      </Popover.Content>
                    </Popover>
                  </>
                ),
                isInStoreCondition: isInStoreCondition({
                  supportEduSingleStore: true,
                  supportEduHqStore: true, // todo: add privilege check
                }),
              })}
            </span>
          </div>,
        );
      },
    },
  ];

  onEduCourseEdit = id => {
    this.props.onEduCourseEdit(id);
  };

  openPage = url => {
    window.open(url);
  };

  onEduCourseDelete = (id, name) => {
    const _this = this;
    openDialog({
      dialogId: 'eduCoursedeleteDialog',
      title: '删除课程',
      children: <span>确定要删除“{name}”课程？</span>,
      footer: (
        <div>
          <SamButton
            name="编辑"
            outline
            style={{ marginRight: '8px' }}
            onClick={() => {
              deleteEduCourseV2({ eduCourseDeleteCommand: { id } })
                .then(res => {
                  closeDialog('eduCoursedeleteDialog');
                  _this.refreshList().refresh();
                })
                .catch(err => {
                  Notify.error(err);
                  closeDialog('eduCoursedeleteDialog');
                });
            }}
          >
            删除
          </SamButton>
          <SamButton
            type="primary"
            style={{ marginRight: '16px' }}
            onClick={() => {
              closeDialog('eduCoursedeleteDialog');
            }}
          >
            我再想想
          </SamButton>
        </div>
      ),
    });
  };

  getAgeRange = (minApply, maxApply, applyType) => {
    if (maxApply === 10000) {
      if (minApply === 10000) {
        return '-';
      }
      return `${minApply}${applyType === 0 ? '月' : '岁'}以上`;
    } else if (maxApply === minApply) {
      return `${minApply}${applyType === 0 ? '月' : '岁'}`;
    }
    return `${minApply}~${maxApply}${applyType === 0 ? '月' : '岁'}`;
  };

  fetchData = ({ filterConditions, pageConditions }) => {
    const { eduCourseName = '', eduCourseAreaId = null } = filterConditions;
    const sort = { orders: [ ...get(pageConditions, 'sort.orders', []), { direction: 'DESC', property: 'id' } ] };
    return getCourseList({
      pageNumber: pageConditions.pageNumber,
      pageSize: pageConditions.pageSize,
      name: eduCourseName,
      kdtId: eduCourseAreaId,
      sort: sort,
    }).then(res => {
      if (
        !this.state.isShopSelected &&
        eduCourseAreaId &&
        isInStoreCondition({ supportEduHqStore: true })
      ) {
        this.setState({
          isShopSelected: true,
        });
      } else if (
        this.state.isShopSelected &&
        !eduCourseAreaId &&
        isInStoreCondition({ supportEduHqStore: true })
      ) {
        this.setState({
          isShopSelected: false,
        });
      }
      return {
        datasets: res.content || [],
        total: res.total,
        current: res.pageable.pageNumber,
      };
    });
  };

  refreshList = () => this.VisTable.refetchData;

  pushQuery = data => {
    const location = hashHistory.getCurrentLocation();
    const query = location.query;
    const name = {
      shopName: this.state.shopName,
    };
    if (name.shopName) {
      location.query = { ...query, ...name };
    }

    if (name.shopName) {
      hashHistory.replace(location);
    }
  };

  renderBottomAction = filter => {
    const { submit, reset } = filter;
    const onSubmit = () => {
      submit();
      this.pushQuery();
    };
    return (
      <>
        <SamButton type="primary" onClick={onSubmit}>
          筛选
        </SamButton>
        <span className="filter__actions__reset" onClick={reset}>
          重置筛选条件
        </span>
      </>
    );
  };

  getDefaultEduShopOption = () => {
    // todo 有路由参数的时候需要回填
    const location = hashHistory.getCurrentLocation();
    const query = location.query || {};
    if (query.eduCourseAreaId && query.shopName) {
      return { text: query.shopName, value: query.eduCourseAreaId };
    }
  };

  onShopSelected = (data, val) => {
    if (this.state.shopList && this.state.shopList.length) {
      this.setState({
        shopName: this.state.shopList.find(item => item.value === val).text,
      });
    }
  };

  getShopOptions = (query, pageConditions) => {
    const { name = null } = query || {};
    return findPageAllCampus({
      shopCampusQuery: { hqKdtId: null, name },
      pageRequest: pageConditions,
    }).then(res => {
      const { content = [] } = res || {};
      const options = content.map(item => {
        return {
          text: item.shopName,
          value: item.kdtId,
        };
      });
      if (pageConditions.pageNumber === 1) {
        options.unshift({ text: '全部', value: '' });
      }

      this.setState({ shopList: this.state.shopList.concat(options) });
      return options;
    });
  };

  render() {
    return (
      <div>
        <VisList>
          {/* <VisSearch position='right' className='educourse-search' name="eduCourseName" placeholder="课程名称" /> */}
          {switchWrapper({
            supportEduBranchStore: () => (
              <VisSearch
                position="right"
                className="educourse-search"
                name="eduCourseName"
                placeholder="课程名称"
              />
            ),
            supportEduHqStore: () => {
              return (
                <VisFilter
                  {...{
                    defaultValue: {
                      eduCourseName: '',
                      eduCourseAreaId: '',
                    },
                    options: filterOptions(this),
                    bottomActions: this.renderBottomAction,
                  }}
                ></VisFilter>
              );
            },
            supportEduSingleStore: () => (
              <VisSearch
                position="right"
                className="educourse-search"
                name="eduCourseName"
                placeholder="课程名称"
              />
            ),
          })}
          <VisTable
            ref={table => (this.VisTable = table)}
            columns={arrayColumnWrapper(this.columns())}
            initQueries={{ sortBy: 'created_at' }}
            rowKey="alias"
            fetchData={this.fetchData}
          />
        </VisList>
      </div>
    );
  }
}
