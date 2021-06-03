import { Popover } from '@zent/compat';
import React, { FC, useState, useCallback } from 'react';
import { Menu, Icon } from 'zent';
import { IWorkbookRelClassPageDTO } from 'domain/workbook-domain/types';

const { MenuItem } = Menu;

interface IWorkbookSelectorProps {
  total?: number;
  workbookList: IWorkbookRelClassPageDTO[];
  value: number;
  onChange: (value: number) => void;
  // handleWorkbookIdChange: (id: number) => void;
}

const WorkbookSelector: FC<IWorkbookSelectorProps> = (props) => {
  const { total, workbookList, value, onChange } = props;

  const [visible, toggleVisible] = useState(false);

  // const [open, toggleOpen] = useState(false);

  const onMenuChange = useCallback(
    (e, key: string) => {
      onChange(Number(key));

      setCurWorkbook({
        workbookId: Number(key),
        title: e.target?.innerText || '',
      });

      toggleVisible(false);
    },
    [onChange],
  );

  const [curWorkbook, setCurWorkbook] = useState<IWorkbookRelClassPageDTO | undefined>(
    workbookList?.find((wb) => wb.workbookId === value),
  );

  return total ? (
    <div className="workbook-selector">
      {total > 1 ? (
        <Popover
          className="zent-doc-popover"
          position={Popover.Position.AutoBottomLeft}
          display="inline"
          cushion={5}
          visible={visible}
          onVisibleChange={v => toggleVisible(v)}
        >
          <Popover.Trigger.Click onClick={() => toggleVisible(true)}>
            <h2 className="operation">
              {curWorkbook?.title}
              <Icon type={visible ? 'caret-up' : 'caret-down'} />
            </h2>
          </Popover.Trigger.Click>
          <Popover.Content>
            <Menu onClick={onMenuChange}>
              {workbookList.map((workbook) => (
                <MenuItem key={String(workbook.workbookId)}>{workbook.title}</MenuItem>
              ))}
            </Menu>
          </Popover.Content>
        </Popover>
      ) : (
        <h2>{curWorkbook?.title}</h2>
      )}
    </div>
  ) : null;
};

export default WorkbookSelector;
