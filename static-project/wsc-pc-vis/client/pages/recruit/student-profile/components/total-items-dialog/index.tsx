import React, { FC, useState, useEffect, useMemo, useCallback } from 'react';
import { Button, Grid, Notify } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';

import get from 'lodash/get';
import find from 'lodash/find';
import chunk from 'lodash/chunk';
import difference from 'lodash/difference';
import { VisSearch } from 'components/vis-list';

import { openCustomProfileItem } from '../custom-profile-dialog';
import { getAllStudentProfileListByKdtId } from '../../api/list';
import { Dialog } from '@youzan/ebiz-components';
import { allStudentProfileCols } from '../../utils/student-profile-columns';
import { IDialogChildrenProps } from '@youzan/ebiz-components/es/types/dialog';

interface ParamsAndResponse {
  addItems: any[];
  selectedData: any[];
}

interface AddProfileItemsProps {
  addItems: any[];
  fetchList(params: any): void;
}

const { openDialog, DialogBody, DialogFooter } = Dialog;
const PAGESIZE = 5;
const INIT_PAGEINFO = {
  current: 1,
  pageSize: PAGESIZE,
  totalItem: 0,
};

// TODO: zent7 Loading/Grid
const AddProfileItems: FC<IDialogChildrenProps<ParamsAndResponse, AddProfileItemsProps>> = props => {
  const { dialogref, data } = props;
  const [pageInfo, setPageInfo] = useState(INIT_PAGEINFO);
  const [loading, toggleLoading] = useState(false);
  const [datasets, setData] = useState([] as any[]);
  const [attributeTitle, setAttrTitle] = useState('');
  const [selectedRowKeys, setSelected] = useState([] as string[]);
  // const [checkState, setCheckState] = useState({
  //   checked: false,
  //   indeterminate: false,
  // } as ICheckboxProps<string>);

  const fetchList = useCallback((params?: { current?: number }) => {
    toggleLoading(true);
    // 拿到所有数据
    if (!loading) {
      const pageRequest = {
        pageNumber: get(params, 'current') || 1,
        pageSize: 50,
      };
      getAllStudentProfileListByKdtId({
        pageRequest,
        query: { name: attributeTitle },
      })
        .then(data => {
          const content: any[] = get(data, 'content', []);
          setData(content);
          if (content.length) {
            const selectedStandradProfile = content.filter(c => get(c, 'choose')).map(c => get(c, 'id'));
            setSelected([...new Set(selectedRowKeys.concat(selectedStandradProfile))]);
            setPageInfo({
              current: get(params, 'current') || pageInfo.current,
              pageSize: PAGESIZE,
              totalItem: get(data, 'total', 0),
            });
          }
        })
        .catch(err => Notify.error(err))
        .finally(() => toggleLoading(false));
    }
  }, [attributeTitle, loading, pageInfo, selectedRowKeys]);

  const handleSubmit = useCallback(() => {
    const selectedStandardKey = datasets.filter(data => data.choose).map(data => data.id);
    const diff = difference(selectedRowKeys, selectedStandardKey);
    const selectedData = diff.map(id => {
      const _data = find(datasets, { id });
      return {
        attributeId: id,
        dataType: _data.dataType,
        attributeTitle: _data.name,
      };
    });
    dialogref.submit({
      addItems: diff,
      selectedData,
    });
  }, [datasets, dialogref, selectedRowKeys]);

  const handleSelect = useCallback((selectedKeys: any) => {
    if ((selectedKeys as number[]).length > 30) {
      Notify.error('最多添加30个资料项');
      return void 0;
    } else {
      setSelected(selectedKeys);
    }
  }, []);

  // grid change
  const handleGridChange = useCallback(params => {
    setPageInfo({
      current: params.current,
      pageSize: PAGESIZE,
      totalItem: pageInfo.totalItem,
    });
  }, [pageInfo.totalItem]);

  const showAddCustomProfileItemDialog = useCallback(() => {
    openCustomProfileItem({
      type: 'ADD',
    }, dialogref)
      .then(() => {
        data.fetchList({ current: 1 });
      });
  }, [dialogref, data]);

  // 前端翻页
  const currentPageItems = useMemo(() => {
    if (datasets) {
      const chunks = chunk(datasets, PAGESIZE);
      return chunks[pageInfo.current - 1];
    }
    return [];
  }, [pageInfo, datasets]);

  // componentDidMount
  useEffect(fetchList, []);

  return (
    <>
      <DialogBody>
        <SamButton
          outline
          name="编辑"
          type="primary"
          bordered={false}
          className="profile-list__dialog-button"
          onClick={showAddCustomProfileItemDialog}
        >
          自定义资料项
        </SamButton>
        <VisSearch
          name="title"
          position="right"
          placeholder="请输入资料项名称"
          onChange={({ title }) => setAttrTitle(title)}
          onSubmit={() => {
            setPageInfo(INIT_PAGEINFO);
            fetchList({ current: 1 });
          }}
        />
        <div className="profile-list__grid-checkbox__container">
          <Grid
            rowKey="id"
            loading={loading}
            pageInfo={pageInfo}
            datasets={currentPageItems}
            onChange={handleGridChange}
            columns={allStudentProfileCols}
            selection={{
              selectedRowKeys,
              onSelect: handleSelect,
              getCheckboxProps({ choose }: any) {
                return {
                  disabled: choose,
                };
              },
            }}
          />
          {/* <Checkbox className="profile-list__select-all" {...checkState}>全选</Checkbox> */}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button onClick={dialogref.close}>取消</Button>
        <SamButton name="编辑" type="primary" onClick={handleSubmit}>确认</SamButton>
      </DialogFooter>
    </>
  );
};

export function openAddProfileItemsDialog(addItems: number[], fetchList: (params: any) => void) {
  const dialogRef = openDialog(AddProfileItems, {
    dialogId: 'add_profile_items',
    title: '添加资料项',
    data: { addItems, fetchList },
    className: 'profile-list__dialog',
    style: {
      width: '580px',
    },
  });

  return dialogRef.afterClosed();
}
