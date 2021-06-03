import { Pop, Popover } from '@zent/compat';
import React from 'react';
import { hashHistory } from 'react-router';
import { Button as SamButton, Link as SamLink } from '@youzan/sam-components';
import * as courseManageFetch from '../../../api/course-manage';
import { getCourseList, findPageByEduCourse } from '../../../api/educourse';
import './style.scss';
import { Notify, Button, Menu } from 'zent';
import { columns, filterOptions } from './utils/table-config';
import VipCutoffPop from './components/vip-cutoff-pop';
import VisList, { formatFilterOpts, VisFilter, VisGrid } from 'components/vis-list';
import handleBatchActions from './utils/batch-action-config';
import { arrayColumnWrapper, isInStoreCondition } from 'fns/chain';
import { get, assign, intersection } from 'lodash';
import { courseGroupSelectConfig } from '../../../group/components/WrapCourseGroupSelect';
import { PopSelector } from '@youzan/react-components';
import { batchModifyCourseGroup } from '../../../group/api';
import { getAllCourseGroup } from '../../../api/course-group';
import { isUnifiedBranchStore, isUnifiedHqStore, isHqStore, isSingleStore, isUnifiedShop } from '@youzan/utils-shop';
import { showBdappCode } from 'common/api/request';
import { EasyList } from '@youzan/ebiz-components';

import { onOpenLockDialogClick, LockType } from '@youzan/ebiz-components/es/lock-wrap/';

// const isEduChain = isInStoreCondition({ supportEduChainStore: true });
const supportUnifiedStore = isUnifiedBranchStore || isUnifiedHqStore;
const { Tabs } = EasyList;
class CourseTable extends React.Component {
  constructor(props) {
    super(props);
    this.shopInfo = {
      kdtId: '',
      shopName: '',
    };
    this.eduCourseInfo = {
      eduCourseName: '',
      eduCourseId: '',
    };
    this.state = {
      data: [],
      selected: [],
      selectedData: [],
      isShopSelected: false,
      queries: {},
      shopList: [],
      eduCourseList: [],
      hideBdapp: true,
      bdappCode: '',
      webviewpath: '',
      groupList: [],
      soldStatus: 2,
    };
  }

  onEduCourseSelected = (_, data) => {
    if (this.state.eduCourseList && this.state.eduCourseList.length) {
      const selectItem = this.state.eduCourseList.find(item => item.value === data);
      this.eduCourseInfo = {
        eduCourseName: selectItem ? selectItem.text : '',
        eduCourseId: selectItem ? selectItem.value : '',
      };
    }
  }

  onShopSelected = (_, data) => {
    if (this.state.shopList && this.state.shopList.length) {
      const selectItem = this.state.shopList.find(item => item.value === data);
      this.shopInfo = {
        shopName: selectItem ? selectItem.text : '',
        kdtId: selectItem ? selectItem.value : '',
      };
    }
  }

  getDefaultEducourseOptions = () => {
    // todo 有路由参数的时候需要回填
    const location = hashHistory.getCurrentLocation();
    const query = location.query || {};
    if (query.eduCourseName && query.eduCourseId) {
      this.eduCourseInfo = {
        eduCourseName: query.eduCourseName,
        eduCourseId: query.eduCourseId,
      };
      return { text: query.eduCourseName, value: query.eduCourseId };
    }
  };

  getDefaultShopOptions = () => {
    // todo 有路由参数的时候需要回填
    const location = hashHistory.getCurrentLocation();
    const query = location.query || {};
    if (query.shopName && query.kdtId) {
      this.shopInfo = {
        shopName: query.shopName,
        kdtId: query.kdtId,
      };
      return { text: query.shopName, value: query.kdtId };
    }
  };

  getIsSelected() {
    return this.state ? this.state.isShopSelected : false;
  }

  getShopOptions = (query, pageConditions) => {
    const { name = null } = query || {};
    const id = this.eduCourseInfo.eduCourseId ? { id: this.eduCourseInfo.eduCourseId } : null;
    const eduCourseShopQuery = {
      kdtId: null,
      name,
      ...id,
    };
    return findPageByEduCourse({ eduCourseShopQuery, pageRequest: pageConditions }).then(
      (res) => {
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
        this.setState({
          shopList: this.state.shopList.concat(options),
        });
        return options;
      },
    );
  };

  getEduCourseOptions = (query, pageConditions) => {
    const { name = null } = query || {};
    const courseParams = {
      pageNumber: pageConditions.pageNumber,
      pageSize: pageConditions.pageSize,
      sort: pageConditions.sort,
      name,
    };
    if (this.shopInfo && this.shopInfo.shopName && this.shopInfo.kdtId) {
      courseParams['kdtId'] = this.shopInfo.kdtId;
    }
    return getCourseList({
      ...courseParams,
    }).then(
      (res) => {
        const { content = [] } = res || {};
        const options = content.map(item => {
          return {
            text: item.name,
            value: item.id,
          };
        });
        if (pageConditions.pageNumber === 1) {
          options.unshift({ text: '全部', value: '' });
        }
        this.setState({
          eduCourseList: this.state.eduCourseList.concat(options),
        });
        return options;
      },
    );
  };

  /**
   * 保存快捷修改的改动
   *
   * @param {string} name 数据中的key
   * @param {number} index 数据所在的位置
   * @param {any} value 数据的值
   * @param {boolean} useSku 是否使用sku数据修改接口
   */
  submitQuickEdit(name, index, value, useSku = false, alias, kdtId = null) {
    const { data } = this.state;
    try {
      const target = data[index];
      this.setState({ loading: true });
      let promise = null;
      if (useSku) {
        const productQuickUpdateSkuDTO = {
          productAlias: alias,
          skus: value,
          skuType: target.skuSize > 0 ? 2 : 1,
          kdtId,
        };
        promise = courseManageFetch.quickUpdateProductSkuByAlias(productQuickUpdateSkuDTO);
      } else {
        const productQuickUpdateDTO = {
          [name]: value,
          productAlias: alias,
          kdtId,
        };
        promise = courseManageFetch.quickUpdateProductByAlias(productQuickUpdateDTO);
      }
      this.successCallBack(promise, '修改信息成功', true);
    } catch (err) {
      throw new Error(err);
    }
  }

  duplicateCourse(item) {
    window.open(`/v4/vis/edu/course#/course-manage/add/${item.alias}`);
    // const promise = courseManageFetch.putDuplicateCourse(item.alias);
    // this.successCallBack(promise, '复制课程成功');
  }

  /**
   * 请求完成之后的回调，提示信息以及刷新页面
   *
   * @param {promise} promise 请求
   * @param {string} hint undefined
   */
  successCallBack(promise, hint, notIndex) {
    this.refreshList().loading();
    promise
      .then(data => {
        if (data) {
          Notify.success(hint);
          this.refreshList().refresh(notIndex);
        }
      })
      .catch(err => {
        this.refreshList().cancelLoading();
        Notify.error(err);
      });
  }

  /**
   * 控制编辑按钮是否强制显示
   *
   * @param {string} ref 引用
   * @param {string} value 值
   */
  toggleShowEditIcon(ref, value = '') {
    const ele = this[ref];
    if (ele) {
      ele.setAttribute('style', `visibility: ${value}`);
    }
  }
  // 推广按钮弹窗
  togglePromoteModal(visible) {
    if (visible) {
      courseManageFetch.finishTask({ code: 1040 });
    }
  }

  // 当没有数据的时候显示的内容
  tablePlaceholder() {
    const { isRiskLock } = this.props;
    if (isInStoreCondition({ supportBranchStore: true })) {
      return (
        <div className="course-table__container course-table__container__des">
          还没有数据
        </div>
      );
    }
    return (
      <div className="course-table__container course-table__container__des">
        还没有数据，你可以
        <SamLink name='编辑'
          onClick={onOpenLockDialogClick(isRiskLock, LockType.COURSE_SHOP, () =>
            hashHistory.push(`/course-manage/add`)
          )}
        >
          <span className="course-table__container__action">发布线下课</span>
        </SamLink>
      </div>
    );
  }

  // 额外添加的

  handleTableSelected = selectedRows => {
    const selected = selectedRows.map(item => item.alias);
    this.setState({ selected, selectedData: selectedRows });
  };

  /**
   * 处理各种行为的点击事件
   *
   * @param {string} type 根据传入的参数，返回不同的处理
   */
  handleActions(type) {
    // 需要先取出用户选中的项目，并对其进行操作
    const { selected } = this.state;
    if (selected.length === 0) {
      Notify.error('请选择至少一个商品进行批量操作');
      return 0;
    }
    let nextSelected = selected;
    let extraInfo = null;
    const needFilterLockTypes = ['inSale', 'stopSale', 'removeItem'];
    if (needFilterLockTypes.includes(type)) {
      const { selectedData } = this.state;
      const lockTypes = ['publish', 'delete'];
      let hasFilter = false;
      // 选中数据并且数据中有商品锁字段
      if (selectedData.length && selectedData[0].lockType) {
        nextSelected = selectedData.reduce((total, selectedItem) => {
          if (!Array.isArray(selectedItem.lockType)) {
            const { alias } = selectedItem;
            total.push(alias);
            return total;
          };
          const needLock = selectedItem.lockType.some(atomicLock => {
            const intersectionLocks = intersection(atomicLock.fields, lockTypes);
            if (intersectionLocks.length) {
              hasFilter = true;
              return true;
            }
            return false;
          });
          if (needLock) return total;
          const { alias } = selectedItem;
          total.push(alias);
          return total;
        }, []);
      }
      if (hasFilter) {
        extraInfo = {
          effectedNum: nextSelected.length,
          lockNum: selected.length - nextSelected.length,
        };
      }
    }
    if (nextSelected.length === 0) {
      Notify.error('商品正在参加营销活动，修改失败');
      return 0;
    }
    const methods = handleBatchActions.call(this, nextSelected, extraInfo);
    try {
      // eslint-disable-next-line prefer-rest-params
      methods[type].apply(this, [].slice.call(arguments, 1));
    } catch (err) {
      Notify.error('执行操作出现了一个错误');
      throw new Error(err);
    }
  }

  // 底部按钮
  batchComponents = groupList => {
    const supportModifyGroup = (isHqStore || isSingleStore) && !isUnifiedShop;
    const isChain = isInStoreCondition({ supportEduChainStore: true });
    // 商品锁禁用按钮
    const disabledConfig = {
      stopSale: false,
      inSale: false,
      removeItem: false,
    };

    const bottomPanel = arrayColumnWrapper([
      {
        child: <span key="batch1">当页全选</span>,
      },
      {
        child: <SamButton
          className="btn__start-sell"
          key="batch2"
          ref={btn => (this.stopSale = btn)}
          onClick={this.handleActions.bind(this, 'inSale')}
          disabled={disabledConfig.inSale}
        >
          上架销售
        </SamButton>,
        chainState: isInStoreCondition({
          supportHqStore: this.getIsSelected(),
          supportEduBranchStore: true,
          supportEduSingleStore: true,
        }),
      },
      {
        child: <SamButton
          key="batch3"
          onClick={this.handleActions.bind(this, 'stopSale')}
          disabled={disabledConfig.stopSale}
        >
          停止销售
        </SamButton>,
        chainState: isInStoreCondition({
          supportHqStore: this.getIsSelected(),
          supportEduBranchStore: true,
          supportEduSingleStore: true,
        }),
      },
      {
        child: <SamButton
          name='编辑'
          key="batch4"
          ref={btn => (this.removeBtn = btn)}
          onClick={this.handleActions.bind(this, 'removeItem')}
          disabled={disabledConfig.removeItem}
        >
          删除
        </SamButton>,
        chainState: isInStoreCondition({
          supportEduHqStore: !this.getIsSelected(),
          supportEduSingleStore: true,
        }),
      },
      {
        child: <SamButton name='编辑'><Pop
          key="batch5"
          trigger="click"
          position="top-left"
          content={
            <VipCutoffPop
              alias={this.state.selected}
              onOk={this.handleActions.bind(this, 'vipDiscount')}
            />
          }
        >
          会员折扣
        </Pop></SamButton>,
        chainState: isInStoreCondition({
          supportEduHqStore: !this.getIsSelected(),
          supportEduSingleStore: true,
        }) && isChain,
      },
      {
        chainState: supportModifyGroup,
        child: <Popover key="batch6" display="inline" cushion={5} position={Popover.Position.TopCenter}>
          <Popover.Trigger.Hover>
            <Button className="btn__more">更多</Button>
          </Popover.Trigger.Hover>
          <Popover.Content>
            <Menu className="course-table__footer__more">
              {
                supportModifyGroup && (
                  <Menu.MenuItem>
                    <PopSelector
                      data={groupList}
                      title="修改分组"
                      onConfirm={this.batchModifyGroup}
                      more={<a href="/v4/vis/course/group/list">管理</a>}
                      withCheckBox={false}
                      dataShape={
                        {
                          text: 'title',
                          value: 'groupId',
                        }
                      }
                      position="bottom-center"
                      className="group-pop-select"
                    >
                      修改分组
                    </PopSelector>
                  </Menu.MenuItem>
                )
              }
              {
                isInStoreCondition({
                  supportEduHqStore: !this.getIsSelected(),
                  supportEduSingleStore: true,
                }) && (
                  <Menu.MenuItem><Pop
                    key="batch5"
                    trigger="click"
                    position="top-left"
                    content={
                      <VipCutoffPop
                        alias={this.state.selected}
                        onOk={this.handleActions.bind(this, 'vipDiscount')}
                      />
                    }
                  >
                    会员折扣
                  </Pop></Menu.MenuItem>
                )
              }
            </Menu>
          </Popover.Content>
        </Popover>,
      },
    ]);

    return bottomPanel.map(item => item.child);
  };

  batchModifyGroup = (checkedList) => {
    const { selectedData } = this.state;
    if (checkedList.length === 0) {
      Notify.error('请先选择分组');
      return;
    }
    if (selectedData.length === 0) {
      Notify.error('请先选择线下课');
      return;
    }
    batchModifyCourseGroup({
      groupIds: checkedList.map(item => item.groupId),
      itemIds: selectedData.map(item => item.id),
    }).then(() => {
      Notify.success('更新成功');
      this.refreshList();
    }).catch(() => {
      Notify.error('更新失败');
    });
  }

  // 刷新页面
  refreshList = () => this.VisTable.refetchData;

  pushQuery = (data) => {
    const location = hashHistory.getCurrentLocation();
    const shopInfo = this.shopInfo;
    const eduCourseInfo = this.eduCourseInfo;
    let query = location.query;

    if (shopInfo) {
      query = { ...query, ...shopInfo };
    }

    if (eduCourseInfo) {
      query = { ...query, ...eduCourseInfo };
    }

    if (data && !data.kdtId) {
      const soldStatus = 2;
      query = { ...query, soldStatus };
    }
    location.query = query;

    if (shopInfo.shopName || eduCourseInfo.eduCourseName) {
      hashHistory.replace(location);
    }
  }

  renderBottomAction = filter => {
    const { data, submit, reset } = filter;
    const onSubmit = () => {
      submit();
      this.pushQuery(data());
    };

    const onRest = () => {
      this.shopInfo = {
        kdtId: '',
        shopName: '',
      };
      this.eduCourseInfo = {
        eduCourseName: '',
        eduCourseId: '',
      };
      reset();
    };
    return (
      <>
        <SamButton type="primary" onClick={onSubmit}>
          筛选
        </SamButton>
        <span className="filter__actions__reset" onClick={onRest}>
          重置筛选条件
        </span>
      </>
    );
  };

  getRowConf(rowData, _index) {
    return {
      canSelect: !rowData.isSync,
    };
  }

  fetchData = ({ filterConditions, pageConditions }) => {
    filterConditions.soldStatus = this.state.soldStatus;
    if (!filterConditions.kdtId && isInStoreCondition({ supportEduHqStore: true })) {
      filterConditions.soldStatus = 2;
    }
    if (filterConditions.courseSellType === '') {
      delete filterConditions.courseSellType;
    }
    if (filterConditions.eduCourseId === '') {
      delete filterConditions.eduCourseId;
    }
    const groupId = get(filterConditions, 'groupId[0]');
    delete filterConditions.groupId;
    if (groupId) {
      filterConditions.groupId = groupId;
    }
    return courseManageFetch
      .findPageByCondition({
        courseQuery: filterConditions,
        pageRequest: pageConditions,
      })
      .then(({ content, total, pageable }) => {
        const location = hashHistory.getCurrentLocation();
        const shopName = location.query.shopName && location.query.kdtId ? location.query.shopName : '';
        if (filterConditions.kdtId && shopName && !this.state.isShopSelected) {
          this.setState({ isShopSelected: true });
        }
        if (!filterConditions.kdtId && this.state.isShopSelected) {
          this.setState({ isShopSelected: false });
        }
        return ({
          datasets: content,
          total,
          current: pageable.pageNumber,
        });
      });
  };

  getSoldStatusTabs = () => {
    const isSelected = this.getIsSelected();
    const disabled = isInStoreCondition({
      supportEduHqStore: !isSelected,
    });
    return (
      isSelected || !isInStoreCondition({ supportEduHqStore: true })
        ? [
          { value: 2, label: '全部', disabled },
          { value: 0, label: '出售中', disabled },
          { value: 1, label: '已售罄', disabled },
          { value: -1, label: '已停售', disabled },
        ]
        : [
          { value: 2, label: '全部', disabled },
        ]
    );
  }

  componentDidMount() {
    // 异步获取课程分组数据
    getAllCourseGroup().then(res => {
      this.setState({
        groupList: res.content,
      });
    });
    // 检测是否是百度小程序店铺
    showBdappCode()
      .then(res => {
        if (res.mpId) {
          this.setState({ hideBdapp: false });
        }
      });
  }

  /** TODO: 使用EasyList重构！！！ */
  render() {
    const { groupList } = this.state;
    let { defaultValue, options } = formatFilterOpts(filterOptions(this,
      supportUnifiedStore ? [] : [courseGroupSelectConfig]));
    defaultValue = assign(
      { eduCourseId: '', kdtId: '', soldStatus: 2, groupId: [''] },
      defaultValue,
    );
    return (
      <React.Fragment>
        <section className="course-table__container">
          <VisList>
            <VisFilter
              defaultValue={defaultValue}
              options={options}
              bottomActions={this.renderBottomAction}
            />
            <Tabs
              name="soldStatus"
              defaultValue={defaultValue.soldStatus}
              tabs={this.getSoldStatusTabs()}
              onChange={value =>
                this.setState(
                  { soldStatus: value },
                  /** TODO: 后面必须要删掉这个！！！ */ () => this.refreshList().refresh(),
                )
              }
            />
            <VisGrid
              ref={table => (this.VisTable = table)}
              rowKey="alias"
              columns={columns(this)}
              emptyLabel={this.tablePlaceholder()}
              batchComponents={this.batchComponents(groupList)}
              initQueries={defaultValue}
              selectable={true}
              scroll={{ x: 1500 }}
              getRowConf={this.getRowConf}
              fetchData={this.fetchData}
              onSelect={this.handleTableSelected}
              onDataChange={data => this.setState({ data })}
            />
          </VisList>
        </section>
      </React.Fragment>
    );
  }
}
export default CourseTable;
