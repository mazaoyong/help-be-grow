import { React, useState, useCallback, createComponent } from '@youzan/tany-react';
import { Dialog, Button, Disabled, FormError } from 'zent';
import cx from 'classnames';
import { EasyList } from '@youzan/ebiz-components';
import { Link as SamLink } from '@youzan/sam-components';
import useEduClassListModel, { AssignmentListModelType } from './model';

import { ISelectClassDialogContent, IClassSelector } from './types';
import { ISelectedClass } from '../../types';

import './styles.scss';

const { List, InlineFilter, EasyGrid, Search } = EasyList;

const { openDialog, closeDialog } = Dialog;

const content = (
  { selected, onChange }: ISelectClassDialogContent,
) => {
  const {
    handleFetchEduClassList,
    columns,
    listRef,
    refreshList,
    EduClassSelectorDialogId,
  } = useEduClassListModel() as AssignmentListModelType;

  const [selectedClass, setSelectedClass] = useState(selected);

  const onSelectedClassChange = useCallback((_, __, currentRow) => {
    const { id: classId, eduClassName } = currentRow || {};
    setSelectedClass({
      classId,
      name: eduClassName,
    });
    return true;
  }, []);

  return (
    <div className="class-selector__content">
      <List
        ref={listRef}
        mode="none"
        onSubmit={handleFetchEduClassList}
        defaultFilter={{ pageSize: 5 }}
        delay={500}
      >
        <InlineFilter
          left={[
            <SamLink
              key="class-manage"
              className="class-manage"
              name="新建班级"
              href="/v4/vis/edu/page/educlass#/list"
              target="_blank"
              rel="noopener noreferrer"
            >
              班级管理
            </SamLink>,
            <span key="refresh" className="operation" onClick={refreshList}>
              刷新
            </span>,
          ]}
          right={<Search key="search" name="name" placeholder="搜索班级名称" />}
        />
        <EasyGrid
          columns={columns as any}
          rowKey="id"
          scroll={{ x: 808 }}
          selection={{
            selectType: 'single',
            selectedRowKeys: selectedClass ? [(selectedClass?.classId as unknown) as string] : [],
            onSelect: onSelectedClassChange,
          }}
          emptyLabel={listRef?.current?.state?.filter?.name ? '' : <span>暂无数据</span>}
        />
        <div className="bottom-actions">
          <Button onClick={() => closeDialog(EduClassSelectorDialogId)}>取消</Button>
          <Button
            type="primary"
            onClick={() => {
              onChange(selectedClass);
              closeDialog(EduClassSelectorDialogId);
            }}
            disabled={!selectedClass || !selectedClass.classId}
          >
            确定
          </Button>
        </div>
      </List>
    </div>
  );
};

const grid = (
  { detail, onDelete, disabled }: { detail: ISelectedClass; onDelete: () => void, disabled?: boolean },
) => {
  const { getSelectedColumns } = useEduClassListModel();

  return (
    <EasyGrid
      className="class-selector__grid"
      columns={getSelectedColumns(onDelete, disabled) as any}
      rowKey="classId"
      paginationType="mini"
      datasets={[detail]}
      pageSize={1}
    />
  );
};

const ClassSelector = (props: IClassSelector) => {
  const { value, onChange, disabled, dialogProps } = props;
  const { EduClassSelectorDialogId } = useEduClassListModel();

  const openClassSelectDialog = useCallback(() => {
    if (disabled) {
      return;
    }
    openDialog({
      dialogId: EduClassSelectorDialogId,
      title: '班级选择',
      children: <SelectorContent selected={value} onChange={onChange} />,
      ...dialogProps,
    });
  }, [disabled, EduClassSelectorDialogId, value, onChange, dialogProps]);

  const onDelete = useCallback(() => onChange(null), [onChange]);

  return (
    <div className="class-selector">
      <Disabled value={!!disabled}>
        <span className={cx('operation', { disabled })} onClick={openClassSelectDialog}>
          {value ? '修改已选班级' : '选择班级'}
        </span>
        {value && <div className="selected-class">
          <EduClassGrid detail={value} onDelete={onDelete} disabled={disabled} />
          {value?.isDeleted ? <FormError style={{ marginTop: '16px' }}>所选班级已被删除</FormError> : null}
        </div>}
      </Disabled>
    </div>
  );
};

const SelectorContent = createComponent(content);

const EduClassGrid = createComponent(grid);

const ClassSelectorComponent = createComponent(ClassSelector);

export default ClassSelectorComponent;
