import React, { Component } from 'react';
import { Button, Notify } from 'zent';
import BootPage from '../clueplugin/App';

import formatDate from 'zan-utils/date/formatDate';
import { Button as SamButton } from '@youzan/sam-components';
import { isEduShop } from '@youzan/utils-shop';

import { VisList, VisTable } from 'components/vis-list';
import { LinkGroup, ListPopupEditor } from '@youzan/ebiz-components';
import { createPluginWrapper } from '@ability-center/clue/plugin-framework';

import openAddDialog from './components/add-dialog';
import openDeleteDialog from './components/delete-dialog';
import { findTransferReason, deleteTransferReason, updateTransferReason } from './api';
import { nonnegaIntValidator } from 'fns/validation/nonnega-int';
import { menus } from '../common/clue-plugin-config';

import './styles.scss';

class ClueTransfer extends Component {
  render() {
    return (
      <div>
        <SamButton
          name="编辑"
          className="edu-clue-trigger-add"
          type="primary"
          onClick={this.handleAdd}
        >
          添加流转原因
        </SamButton>
        <VisList>
          <VisTable
            ref={dom => {
              this.tableDom = dom;
            }}
            emptyLabel=""
            rowKey="alias"
            columns={this.columns}
            initQueries={this.defaultValue}
            fetchData={this.fetchData}
          />
        </VisList>
      </div>
    );
  }

  defaultValue = {};

  options = {};

  renderBottomActions = ({ submit, reset }) => (
    <>
      <Button type="primary" onClick={submit}>
        筛选
      </Button>
      <span className="filter__actions__reset" onClick={reset}>
        重置筛选条件
      </span>
    </>
  );

  fetchData = ({ pageConditions }) => {
    const pageRequest = {
      pageNumber: pageConditions.pageNumber || 1,
      pageSize: pageConditions.pageSize || 20,
      sort: {
        orders: [
          {
            direction: 'DESC',
            property: 'serial_no',
          },
          {
            direction: 'DESC',
            property: 'created_at',
          },
        ],
      },
    };
    return findTransferReason({ pageRequest }).then(
      ({ content, pageable: { pageNumber }, total }) => ({
        datasets: content,
        current: pageNumber,
        total: total,
      }),
    );
  };

  columns = [
    {
      title: '流转原因',
      name: 'reason',
    },
    {
      title: '序号',
      name: 'serialNo',
      bodyRender: row => {
        return (
          <ListPopupEditor
            samName="编辑"
            type="NUM"
            initialValue={row.serialNo}
            validate={nonnegaIntValidator}
            onSubmit={this.handleSerialNoEdit(row)}
          >
            {row.serialNo}
          </ListPopupEditor>
        );
      },
    },
    {
      title: '创建时间',
      bodyRender: row => formatDate(row.createdAt, 'YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '适用操作',
      bodyRender: row =>
        []
          .concat(row.applyGiveUpClue ? '放弃线索' : [])
          .concat(row.applyTransferClue ? '转让线索' : [])
          .concat(row.applyDeleteClue ? '删除线索' : [])
          .join('、'),
    },
    {
      title: '操作',
      textAlign: 'right',
      bodyRender: row => {
        const links = [
          {
            onClick: this.handleEdit(row),
            text: '编辑',
            samName: '编辑',
          },
          {
            onClick: this.handleDelete(row),
            text: '删除',
            samName: '编辑',
          },
        ];
        return <LinkGroup data={links} value={row} />;
      },
    },
  ];

  handleAdd = () => {
    openAddDialog({ afterAdd: this.handleAfterAdd });
  };

  handleAfterAdd = () => {
    this.tableDom.refetchData.refresh();
  };

  handleSerialNoEdit = ({
    applyGiveUpClue,
    applyTransferClue,
    applyDeleteClue,
    reason,
    reasonId,
  }) => serialNo => {
    const command = {
      reason,
      reasonId,
      serialNo: Number(serialNo || 0),
      config: {
        applyGiveUpClue,
        applyTransferClue,
        applyDeleteClue,
      },
    };
    if (+serialNo > 99999999) {
      Notify.error('序号不能超过最大限制99999999');
    } else {
      updateTransferReason({ command })
        .then(() => {
          this.tableDom.refetchData.refresh();
        })
        .catch(err => {
          Notify.error(err);
        });
    }
  };

  handleEdit = value => () => {
    openAddDialog({ value, afterAdd: this.handleAfterAdd });
  };

  handleDelete = value => () => {
    const afterDelete = () => {
      return deleteTransferReason({ reasonId: value.reasonId })
        .then(() => {
          this.tableDom.refetchData.refresh();
        })
        .catch(err => {
          Notify.error(err);
        });
    };
    openDeleteDialog({ afterDelete });
  };
}

export default createPluginWrapper({ title: '线索管理', BootPage, menus, enabled: !isEduShop })(ClueTransfer);
