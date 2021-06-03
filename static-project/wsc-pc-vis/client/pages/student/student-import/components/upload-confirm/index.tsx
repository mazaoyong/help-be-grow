import React, { FC, useState, useEffect } from 'react';
import { Dialog, Grid, Notify } from 'zent';
import { withRouter, WithRouterProps } from 'react-router';
import { get } from 'lodash';

import { dialogIdMap, IMPORT_TYPE } from '../../constants';
import { IUploadConfirmProps } from '../../types';
import './styles.scss';
import useGridDataLoader from './use-grid-data-loader';
import useColumns from './use-columns';
import useBatchRender from './use-batch-render';
import useActions from './use-actions';
import useOpenFormDialog from './use-open-form';
import useHeader from './use-header';
import usePagination from './use-pagination';
import useValidateSummary from './use-validate-summary';
import useColumnsCommon from '../../hooks/use-columns';
import useAreaOptions from './use-area-options';
import useLocationInfo from './use-location-info';
import getGridScroll from '../../utils/get-grid-scroll';
import { checkTemplateProcessByTaskId } from '../check-template-process';

const { closeDialog } = Dialog;

const UploadConfirm: FC<IUploadConfirmProps & WithRouterProps> = props => {
  const { importType, location } = props;

  const [taskId, setTaskId] = useState<number>(0);

  const { current, setCurrent } = usePagination();
  const { errOnly, toggleErrOnly } = useLocationInfo(location);

  const [refreshSignal, setRefreshSignal] = useState(0);

  const branchKdtId = Number(get(props.location, 'query.kdtId', _global.kdtId));

  const { columns: headerColumns, studentProfile } = useColumnsCommon({
    importType,
    branchKdtId,
    updateSignal: refreshSignal,
  });

  function refreshPageData() {
    setRefreshSignal(prev => prev + 1);
  }

  const { areaOptions } = useAreaOptions();

  const {
    taskTotal,
    errDataNo,
    getPageValidateSummary,
    dataset,
    total,
    listLoading,
  } = useValidateSummary({
    taskId,
    errOnly,
    current,
  });

  // hooks 封装
  const { selected, setSelected, onGridChange } = useGridDataLoader({
    setCurrent,
  });

  const { open, upsertDialogOpen, setUpsertDialogOpen } = useOpenFormDialog({
    importType,
    branchKdtId,
    taskId,
    getPageValidateSummary,
    studentProfile,
    areaOptions,
  });

  const { headerElement } = useHeader({
    open,
    taskId,
    setCurrent,
    taskTotal,
    errDataNo,
    toggleErrOnly,
    errOnly,
  });

  useEffect(() => {
    if (!props.params || !props.params.id) return;

    const nextTaskId = Number(props.params.id);
    setTaskId(nextTaskId);
    getPageValidateSummary({ taskId: nextTaskId });

    return () => {
      // close all dialogs that might be open
      Object.keys(dialogIdMap).map(id => {
        closeDialog(dialogIdMap[id]);
      });
    };
  }, [props.params, getPageValidateSummary]);

  useEffect(() => {
    if (!taskId || !refreshSignal) return;
    getPageValidateSummary({ taskId });
  }, [getPageValidateSummary, refreshSignal, taskId]);

  useEffect(() => {
    if (importType !== IMPORT_TYPE.byStudentInfo || !taskId) return;
    checkTemplateProcessByTaskId({
      taskId,
      onProcessComplete: () => getPageValidateSummary({ taskId }),
    }).catch(e => {
      Notify.error(e);
      console.warn(e);
    });
  }, [taskId, importType, getPageValidateSummary]);

  const { columns, dataColumns } = useColumns({
    importType,
    taskId,
    branchKdtId,
    getPageValidateSummary,
    open,
    upsertDialogOpen,
    setUpsertDialogOpen,
    studentProfile,
    columns: headerColumns,
    areaOptions,
  });

  const { batchComponent } = useBatchRender({
    importType,
    taskId,
    selected,
    setSelected,
    branchKdtId,
    getPageValidateSummary,
    current,
    setCurrent,
    dataColumns,
  });

  const { appActions } = useActions({
    taskId,
    taskTotal,
    branchKdtId,
    toggleErrOnly,
    importType,
    onRefresh: refreshPageData,
  });

  return (
    <>
      <div className="upload-confirm">
        {headerElement}
        <Grid
          columns={columns}
          key={columns.length}
          datasets={dataset}
          pageInfo={{
            current: current,
            pageSize: 10,
            total,
          }}
          onChange={onGridChange}
          loading={listLoading}
          selection={
            {
              selectedRowKeys: selected,
              onSelect: (selectedkeys: number[]) => {
                setSelected(selectedkeys);
              },
            } as any
          }
          scroll={getGridScroll(importType, columns.length)}
          batchRender={batchComponent}
        />
      </div>
      <div className="app-design">{appActions}</div>
    </>
  );
};

export default withRouter(UploadConfirm);
