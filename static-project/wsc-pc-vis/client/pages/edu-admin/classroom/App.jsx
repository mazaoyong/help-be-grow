import React, { PureComponent } from 'react';
import { VisList, VisFilter, VisTable, VisSearch } from 'components/vis-list';
import { Dialog, Button } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';
import { LinkGroup } from '@youzan/ebiz-components';
import { getKdtId } from 'common/utils';

import Edit from './Edit';
import { deleteClassroom, getClassrooms } from './api';
import StoreSelect from './components/store-select';
import { PrimitiveShopSelector as ShopChoose } from '@ability-center/shop/shop-choose';

import { CSDefaultOptionsWrapper, chainSupportOnlyHq, chainSupportAllEduStore, chainSupportOnlySingle } from './chain';
import { showWrapper, arrayColumnWrapper, arrayWrapper } from 'fns/chain';

const { openDialog, closeDialog } = Dialog;
const ChainAddClassroomButton = showWrapper(chainSupportAllEduStore, Button);

export default class App extends PureComponent {
  render() {
    return (
      <div className="classroom-list">
        <div>
          <ChainAddClassroomButton type="primary" className={this.options.length === 1 ? 'classroom-addroom' : ''} onClick={this.handleCreateShow}>
            新建教室
          </ChainAddClassroomButton>
        </div>
        <VisList>
          {
            this.options.length === 1
              ? <VisSearch position='right' className='educourse-search' name="classroomName" placeholder="教室名称" />
              : <VisFilter
                {
                  ...{
                    defaultValue: this.defaultOptions,
                    options: this.options,
                    bottomActions: this.renderBottomAction,
                    labelWidth: '80px'
                  }
                }
              />
          }
          <VisTable
            {...{
              ref: table => (this.VisTable = table),
              rowKey: 'id',
              columns: arrayWrapper({
                2: chainSupportOnlyHq,
                3: chainSupportOnlySingle
              }, this.columns),
              fetchData: this.fetchData,
              emptyLabel: <span>还没有数据，你可以<a href="javascript: void(0);" onClick={this.handleCreateShow}>新建教室</a></span>
            }}
          />
        </VisList>
      </div>
    );
  }

  handleCreateShow = () => {
    const type = 'create';
    openDialog({
      dialogId: type,
      title: '新建教室',
      children: <Edit type={type} onClose={this.handleEditClose(type)} />
    });
  };

  handleEditShow = item => () => {
    openDialog({
      dialogId: item.id,
      title: '编辑教室',
      children: <Edit type="edit" value={item} onClose={this.handleEditClose(item.id)} />
    });
  };

  handleEditClose = id => () => {
    closeDialog(id);
    this.VisTable.refetchData.refresh(true);
  };

  handleRemoveShow = item => () => {
    openDialog({
      dialogId: item.id,
      title: '删除教室',
      children: `确定删除教室"${item.classroomName}"吗`,
      footer: (
        <>
          <SamButton name="编辑" onClick={this.handleRemove(item)}>删除</SamButton>
          <Button type="primary" onClick={() => closeDialog(item.id)}>
            我再想想
          </Button>
        </>
      )
    });
  };

  handleRemove = item => () => {
    deleteClassroom({
      id: item.id,
      kdtId: getKdtId({ data: item })
    }).then(() => {
      closeDialog(item.id);
      this.VisTable.refetchData.refresh(true);
    });
  };

  fetchData = params => {
    const _params = this.filterQuery(params);
    return getClassrooms(_params).then(data => {
      const {
        content,
        pageable: { pageNumber },
        total
      } = data;
      return {
        datasets: content,
        current: pageNumber,
        total
      };
    });
  };

  filterQuery = ({ filterConditions = {}, pageConditions = {} }) => {
    const query = Object.keys(filterConditions)
      .filter(key => {
        const item = filterConditions[key];
        if (key === 'addressId') {
          return item && item !== '0';
        }
        return item;
      })
      .reduce((obj, key) => Object.assign(obj, { [key]: filterConditions[key] }), {});
    const { pageNumber, pageSize } = pageConditions;

    return {
      query,
      pageRequest: {
        pageNumber,
        pageSize,
        sort: { orders: [{ direction: 'DESC', property: 'created_at' }] }
      }
    };
  };

  renderBottomAction = filter => {
    const { submit, reset } = filter;
    return (
      <div className="classroom-filter">
        <Button type="primary" onClick={submit}>
          筛选
        </Button>
        <a className="classroom-filter_reset" onClick={reset}>
          重置筛选条件
        </a>
      </div>
    );
  };

  getOperations = item => [
    {
      text: '编辑',
      onClick: this.handleEditShow(item)
    },
    {
      text: '删除',
      onClick: this.handleRemoveShow(item)
    }
  ];

  defaultOptions = CSDefaultOptionsWrapper({
    classroomName: '',
    addressId: 0,
    kdtId: _global.kdtId
  });
  options = arrayColumnWrapper([
    {
      type: 'Input',
      name: 'classroomName',
      label: '教室名称：',
      props: {
        placeholder: ''
      }
    },
    {
      type: 'Custom',
      name: 'kdtId',
      label: '所属校区：',
      format: (data) => Promise.resolve(data.target),
      lite: true,
      component: ShopChoose,
      chainState: chainSupportOnlyHq
    },
    {
      type: 'Custom',
      name: 'addressId',
      label: '上课地点：',
      lite: true,
      component: StoreSelect,
      chainState: chainSupportOnlySingle
    }
  ]);
  columns = [
    {
      title: '教室名称',
      name: 'classroomName',
      width: '30%'
    },
    {
      title: '可容纳人数',
      name: 'capacity',
      width: '30%',
      bodyRender: item => (item.capacity === -1 ? '-' : item.capacity)
    },
    {
      title: '所属校区',
      name: 'shopName',
      width: '30%'
    },
    {
      title: '上课地点',
      name: 'addressName',
      width: '30%',
      bodyRender: item => (item.addressName || '-')
    },
    {
      title: '操作',
      width: 160,
      textAlign: 'right',
      fixed: 'right',
      bodyRender: item => <LinkGroup data={this.getOperations(item)} />
    }
  ];
}
