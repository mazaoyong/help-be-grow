import React, { useMemo, useState, forwardRef } from 'react';
import { Grid, IGridColumn } from 'zent';
import { date } from '@youzan/utils';
import { HolidaySelectDialog } from '../holiday-select-dialog';
import { CustomHolidayData, createHoliday } from '../../../../edu-admin/api/holiday';
import { HolidayModify } from '../../../../edu-admin/settings/containers/holiday/components/holiday-modify';

interface HolidaySelectProps {
  isCreate?: boolean;
  queryKdtId?: number;
  visible?: boolean;
  value: CustomHolidayData[];
  onChange: (newValue: CustomHolidayData[]) => void;
  displayError?: boolean;
}

export const HolidaySelect = forwardRef(({
  isCreate, queryKdtId, value, onChange, visible = false, displayError = false,
}: HolidaySelectProps, ref: React.Ref<HTMLDivElement>) => {
  const [holidaySelectVisible, setHolidaySelectVisible] = useState(false);
  const [holidayModifyVisible, setHolidayModifyVisible] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  const selectHolidayColumns: IGridColumn<any>[] = useMemo(() => [
    {
      title: '节假日名称',
      bodyRender: (item) => item.name,
    },
    {
      title: '起止日期',
      bodyRender: (item) => `${date.makeDateStr(item.startTime)}至${date.makeDateStr(item.endTime)}`,
    },
    {
      title: '操作',
      textAlign: 'right',
      bodyRender: (item) => {
        return isCreate ? (
          <a
            href="javascript:void(0);"
            onClick={() => {
              onChange(value.filter(it => it.id !== item.id));
              setPageNumber((value.length - 1) / 5 <= pageNumber - 1 ? pageNumber - 1 : pageNumber,);
            }}
          >
            删除
          </a>
        ) : (
          <span style={{ color: '#999' }}>删除</span>
        );
      },
    },
  ], [value, pageNumber, isCreate, onChange]);
  return (
    <div style={{ marginLeft: 154, marginBottom: 24, display: visible ? 'block' : 'none' }} ref={ref}>
      {isCreate &&
      <a
        href="javascript:void 0;"
        onClick={() => setHolidaySelectVisible(true)}
        style={{ display: 'inline-block', marginBottom: value.length > 0 ? 16 : 0 }}
      >
        选择节假日
      </a>}
      {value.length > 0 ? (<Grid
        columns={selectHolidayColumns}
        paginationType="mini"
        datasets={value.slice(
          5 * pageNumber - 5,
          5 * pageNumber,
        )}
        rowKey="id"
        pageInfo={{
          current: pageNumber,
          pageSize: 5,
          total: value.length,
        }}
        onChange={({ current = 1 }) => setPageNumber(current)}
      />) : (displayError &&
        <p className="zent-form__error-desc" style={{ color: '#df4545' }}>请选择节假日</p>
      )}
      <HolidaySelectDialog
        visible={holidaySelectVisible}
        onClose={() => setHolidaySelectVisible(false)}
        onSelect={(rows) => {
          setHolidaySelectVisible(false);
          setPageNumber(1);
          onChange(rows);
        }}
        onCreate={() => {
          setHolidaySelectVisible(false);
          setHolidayModifyVisible(true);
        }}
        queryKdtId={queryKdtId}
        selected={value}
      />
      <HolidayModify
        create
        visible={holidayModifyVisible}
        onClose={() => setHolidayModifyVisible(false)}
        onModify={(item) => createHoliday({ item }).then(() => {
          setHolidaySelectVisible(true);
          setHolidayModifyVisible(false);
        })}
      />
    </div>
  );
});
