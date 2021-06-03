import { Grid, Notify } from 'zent';
import React, { useState, FC, useEffect, useCallback } from 'react';
import { VisSearch } from 'components/vis-list';
import { Button as SamButton } from '@youzan/sam-components';

import get from 'lodash/get';

import studentProfileCols from '../../utils/student-profile-columns';
import { getProfileItemList, deleteStudentProfileItem, addProfileItems } from '../../api/list';
import preHandleDatasets from '../../utils/pre-handle-data';
import { openAddProfileItemsDialog } from '../../components/total-items-dialog';
import { openCustomProfileItem } from '../../components/custom-profile-dialog';
import ConditionPop from '../../components/condition-pop';
import handleUrlAction from '../../utils/handle-url-action';

const PAGESIZE = 10;

const calCurPage = pageInfo => {
  const { totalItem, pageSize, current } = pageInfo;
  if (current <= 1 || totalItem <= 0 || pageSize <= 0) {
    return 1;
  }
  if (totalItem - 1 - (current - 1) * pageSize > 0) { // 删除后还在当前页
    return current;
  }
  return current - 1;
};

const StudentProfileList: FC<{}> = () => {
  const [pageInfo, setPageInfo] = useState({
    current: 1,
    pageSize: PAGESIZE,
    totalItem: 0,
  });
  const [sortInfo, setSortInfo] = useState({
    sortBy: 'serialNo',
    sortType: 'desc',
  } as {sortBy: string; sortType: 'desc' | 'asc' | undefined});
  const [loading, toggleLoading] = useState(false);
  const [addedItems, modifyAddedItems] = useState([] as number[]);
  const [isOver30, setOver30] = useState(false);
  const [datasets, setData] = useState([] as any[]);
  const [attributeTitle, setAttrTitle] = useState('');

  const fetchList = useCallback((params?: {[key: string]: any}): void => {
    toggleLoading(true);
    const pageRequest = {
      pageNumber: get(params, 'current', pageInfo.current),
      pageSize: PAGESIZE,
      sort: {
        orders: [{
          direction: (get(sortInfo, 'sortType') || 'desc').toUpperCase(),
          property: get(sortInfo, 'sortBy', 'serialNo'),
        }],
      },
    };
    getProfileItemList({ query: { attributeTitle }, pageRequest })
      .then(data => {
        const content = get(data, 'content', []);
        const total = get(data, 'total', 0);
        setOver30(total >= 30);
        const [handledData, _addedItems] = preHandleDatasets(content);
        modifyAddedItems(_addedItems);
        setData(handledData);
        setPageInfo({
          current: pageRequest.pageNumber,
          pageSize: PAGESIZE,
          totalItem: get(data, 'total', 0),
        });
      })
      .catch(err => {
        Notify.error(err);
      })
      .finally(() => {
        toggleLoading(false);
      });
  }, [attributeTitle, pageInfo, sortInfo]);

  // 添加学员资料项弹窗
  const handleAddProfileItems = useCallback(() => {
    openAddProfileItemsDialog(addedItems, fetchList)
      .then(({ selectedData }) => {
        const batchAddValues = selectedData.map(data => ({
          itemId: data.attributeId,
          dataType: data.dataType,
          name: data.attributeTitle,
        }));
        addProfileItems(batchAddValues)
          .then(data => {
            if (data) {
              Notify.success('添加成功');
            } else {
              Notify.error('添加失败');
            }

            // 添加成功跳转第一页刷新
            fetchList({ current: 1 });
          })
          .catch(err => {
            Notify.error(err);
          });
      });
  }, [addedItems, fetchList]);

  // grid change
  const handleGridChange = useCallback(params => {
    const current = get(params, 'current');
    if (current) {
      setPageInfo(Object.assign({}, pageInfo, {
        current,
      }));
    }
    if (params.sortBy || params.sortType) {
      setSortInfo({
        sortBy: get(params, 'sortBy', sortInfo.sortBy),
        sortType: get(params, 'sortType', sortInfo.sortType),
      });
    }
  }, [pageInfo, sortInfo.sortBy, sortInfo.sortType]);

  const editRow = useCallback(row => {
    openCustomProfileItem({
      type: 'EDIT',
      attributeConf: row,
    })
    // 编辑之后也是在当前页面刷新
      .finally(fetchList);
  }, [fetchList]);

  const deleteRow = useCallback(row => {
    const { attributeId } = row;
    deleteStudentProfileItem({
      attrItemId: attributeId,
    })
      .then(() => {
        Notify.success('删除成功');
        // 删除成功之后停留在当前页，如果当页没有数据则跳到前一页
        fetchList({ current: calCurPage(pageInfo) });
      })
      .catch(err => {
        Notify.error(err);
      });
  }, [fetchList, pageInfo]);

  // updating sort info or page number
  useEffect(fetchList, [sortInfo, pageInfo.current]);

  // 处理url特殊行为 ⚠️只能在页面第一次载入调用该方法，不能设置deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => handleUrlAction({ fetchList }), []);

  return (
    <div className="profile-list__container">
      <ConditionPop disabled={isOver30} addonProps={{
        trigger: 'hover',
        content: '最多添加30个资料项',
        position: 'right-center',
      }}>
        <SamButton
          name="编辑"
          type="primary"
          disabled={isOver30}
          className="profile-list__container-button"
          onClick={handleAddProfileItems}
        >
          添加学员资料项
        </SamButton>
      </ConditionPop>
      <VisSearch
        name="title"
        position="right"
        placeholder="请输入资料项名称"
        onChange={({ title }) => setAttrTitle(title)}
        onSubmit={() => fetchList({ current: 1 })}
      />
      <Grid
        {...sortInfo}
        loading={loading}
        datasets={datasets}
        rowKey="attributeId"
        pageInfo={pageInfo}
        onChange={handleGridChange}
        columns={studentProfileCols({ editRow, deleteRow })}
      />
    </div>
  );
};

export default StudentProfileList;
