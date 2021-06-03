import { Pop } from '@zent/compat';
import { DataType } from '@ability-center/student';
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { IGridColumn, Notify } from 'zent';

import { getHeader } from '../../api/prepare';
import { IMPORT_TYPE, importColumns, studentInfoColumnsPrefix } from '../../constants';
import { IColumn, TStudentProfile } from '../../types';
import styles from './styles.m.scss';

// 剔除对应class，course特有列
function filterColumnsByType(columns, importType) {
  if (!importType) return columns;
  let dataColumns = columns;

  if (importType === IMPORT_TYPE.byCourse) {
    dataColumns = dataColumns.filter(item => item.type !== 'class');
  } else if (importType === IMPORT_TYPE.byClass) {
    dataColumns = dataColumns.filter(item => item.type !== 'course');
  }
  return dataColumns;
}

// 格式化课程名称列;如果为0展示“0（通用课时包）”
function addColumnBodyRender(item) {
  if (item.bodyRender) {
    return item;
  }
  item.bodyRender = column => {
    const { rowFieldMap } = column;
    const rowItem = item.name && rowFieldMap[item.name];
    if (!rowItem) return;
    const value =
      rowItem.name === 'courseName' && rowItem.value === '0' ? '0（通用课时包）' : rowItem.value;
    return (
      <>
        <p title={value} className="ellipsis-2">
          {value || '-'}
        </p>
        {rowItem.rowFieldValidateInfo && (
          <p className={styles.listErrorMsg}>{rowItem.rowFieldValidateInfo.message}</p>
        )}
      </>
    );
  };
  return item;
}

const addressBodyRender = item => column => {
  const { rowFieldMap } = column;
  const rowItem = item.name && rowFieldMap[item.name];
  if (!rowItem) return;
  const value = rowItem.value;
  return (
    <>
      {value ? (
        <Pop className={styles.pop} trigger="hover" position="top-right" content={value}>
          <p className="ellipsis-2">
            {value}
          </p>
        </Pop>
      ) : (
        <span>-</span>
      )}

      {rowItem.rowFieldValidateInfo && (
        <p className={styles.listErrorMsg}>{rowItem.rowFieldValidateInfo.message}</p>
      )}
    </>
  );
};

function formatColumnsBodyRender(columns) {
  return columns.map(addColumnBodyRender);
}

const formatColumns = compose(formatColumnsBodyRender, filterColumnsByType);

export function getStudentProfileByColumns(columns: IColumn[]): TStudentProfile[] {
  if (!Array.isArray(columns)) {
    return [] as TStudentProfile[];
  }
  const result = columns
    .sort((a, b) => a.sortNum - b.sortNum)
    .map((item: IColumn) => {
      const { attrItem, needFill } = item;

      return {
        ...item,
        needFill,
        attrItem: attrItem.map(({ order, value }) => ({ id: value, order, value })),
        applicableScenes: [
          {
            required: needFill,
          },
        ],
      };
    });
  return result;
}
interface IUseColumnsProps {
  importType: IMPORT_TYPE;
  branchKdtId?: number;
  updateSignal?: number;
}

export default function useColumns({ importType, branchKdtId, updateSignal }: IUseColumnsProps) {
  const needDynamic = importType === IMPORT_TYPE.byStudentInfo;
  const defaultColumns = needDynamic
    ? studentInfoColumnsPrefix
    : formatColumns(importColumns, importType);
  const [columns, setColumns] = useState<IGridColumn[]>(defaultColumns);
  const [loading, setLoading] = useState(false);
  const [studentProfile, setStudentProfile] = useState<TStudentProfile[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getHeader({
          templateType: 0,
          kdtId: branchKdtId,
        });
        if (Array.isArray(data)) {
          const dataColumns = data
            .sort((a, b) => a.sortNum - b.sortNum)
            .map((item: IColumn, idx: number) => {
              const { attributeTitle, attributeKey, dataType } = item;
              let opts = {};
              if (idx <= 1) {
                opts = { fixed: 'left', width: 144 };
              }
              if (dataType === DataType.ADDRESS || dataType === DataType.PROVINCE) {
                Object.assign(opts, {
                  width: 200,
                  bodyRender: addressBodyRender({
                    ...item,
                    title: attributeTitle,
                    name: attributeKey,
                  }),
                });
              }
              return addColumnBodyRender({
                title: attributeTitle,
                name: attributeKey,
                ...opts,
              });
            });
          setColumns(dataColumns);
          const profile = getStudentProfileByColumns(data);
          setStudentProfile(profile);
        }
      } catch (error) {
        Notify.error(error || '获取资料项失败');
      }
      setLoading(false);
    }
    if (needDynamic) {
      fetchData();
    }
  }, [branchKdtId, importType, needDynamic, updateSignal]);

  return { columns, loading, studentProfile };
}
