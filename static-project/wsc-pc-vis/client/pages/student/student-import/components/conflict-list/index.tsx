import { Pop } from '@zent/compat';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Grid, Notify, Tag } from 'zent';
import get from 'lodash/get';
import { openModifyStudent, StudentDetailLink } from '@ability-center/student';

import { batchDeleteRows, getRowById, getSameData, saveRow } from '../../api/confirm';
import { dialogIdMap, estimateValidateTime } from '../../constants';

import {
  IImportStudentGridColumn,
  getDuplicateRowsRequest,
  IRowData,
  IConflictListProps,
} from '../../types';
import styles from './styles.m.scss';
import {
  formatStudentPatchValue,
  formatSubmitOptions,
  isErrorItem,
} from '../../utils/format-student-patch-value';
import getGridScroll from '../../utils/get-grid-scroll';
import commonStyles from '../../styles/style.m.scss';

const PAGE_SIZE = 5;

// 格式化学员姓名列;增加tag本次导入、已有学员”
function formatStudentNameColumn(dataColumns) {
  return dataColumns.map(item => {
    return {
      ...item,
      bodyRender: column => {
        const { rowFieldMap, flag } = column;
        const rowItem = item.name && rowFieldMap[item.name];
        if (!rowItem) return;
        const { value, name } = rowItem;

        if (name === 'edu_stuName') {
          const tagMsg = flag === 1 ? '已有学员' : '本次导入';
          return (
            <div title={value} className="ellipsis-2">
              <span>{value}</span>
              <Tag className={styles.tag} theme="grey" outline>
                {tagMsg}
              </Tag>
            </div>
          );
        }
        return (
          <p title={value} className="ellipsis-2">
            {value || '-'}
          </p>
        );
      },
    };
  });
}

export default function ConflictList(props: IConflictListProps) {
  const {
    taskId,
    dataSignCode,
    importType,
    upsertDialogOpen,
    setUpsertDialogOpen,
    // branchKdtId = 0,
    dataColumns = [],
    rowId,
    studentProfile,
    areaOptions,
  } = props;
  const [current, setCurrent] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [totalDataset, setTotalDataset] = useState<IRowData[]>([]); // 全量拉取的重复数据列表
  const [curDataset, setCurDataset] = useState<IRowData[]>([]); // 前端分页
  const [loading, toggleLoading] = useState<boolean>(false);

  const getConflictRows = useCallback((_query: getDuplicateRowsRequest) => {
    toggleLoading(true);
    return getSameData({ rowId })
      .then(data => {
        const rows = data.map(row => ({
          id: get(row, 'row.rowId', 0),
          ...row,
        }));
        setTotalDataset(rows || []);
        setCurDataset(rows.slice(0, 5) || []);
        setTotal(rows.length || 0);
      })
      .catch(e => {
        Notify.error(e || '获取重复数据失败，请稍后重试');
      })
      .finally(() => {
        toggleLoading(false);
      });
  }, []);

  useEffect(() => {
    getConflictRows({
      taskId,
      rowStates: [10], // 校验成功
      dataSignCode,
    });
  }, [taskId, dataSignCode, getConflictRows]);

  useEffect(() => {
    if (!totalDataset || totalDataset.length === 0) return;

    setCurDataset(totalDataset.slice(PAGE_SIZE * (current - 1), PAGE_SIZE * current));
  }, [current, totalDataset]);

  const onGridChange = pageable => {
    const { current = 1 } = pageable;
    setCurrent(current);
  };

  const open = useCallback(
    (taskId: number, rowIndex: number, item: any) => {
      if (upsertDialogOpen) {
        return;
      }
      setUpsertDialogOpen(true);
      const dialogId = dialogIdMap.upsertStudent;
      openModifyStudent({
        dialogId,
        title: '修改',
        data: {
          applicableScene: 0,
          validateSignal: isErrorItem(item),
          showInfoTip: false,
          studentNo: 1,
          fetchProfileApi: async () => studentProfile,
          fetchStudentInfoApi: formatStudentPatchValue({ item, areaOptions, studentProfile }),
          formatSubmitOptions,
        },
        className: commonStyles.studentDialog,
      })
        .afterClosed()
        .then(values => {
          const fieldValues = values.map(({ attributeKey, value }) => {
            return {
              name: attributeKey,
              value,
            };
          });

          return saveRow({
            rowFields: fieldValues,
            taskId,
            rowId: rowIndex,
          })
            .then(res => {
              if (res === true) {
                return new Promise(resolve =>
                  setTimeout(() => {
                    Notify.success('保存成功');
                    // handleStudentUpsert();
                    resolve(true);
                  }, 1000),
                ); // 新建、修改的保存等待后端校验数据1秒
              }
              throw res;
            })
            .then(() => {
              getRowById({ query: { taskId, rowId: rowIndex } })
                .then((res: IRowData) => {
                  const index = totalDataset.findIndex((val: IRowData) => {
                    return val.id === rowIndex;
                  });
                  totalDataset.splice(index, 1, Object.assign({}, res, { id: rowIndex }));
                  setTotalDataset([...totalDataset]);
                })
                .catch(e => {
                  Notify.error(e || '获取行状态失败，请稍后重试');
                });
            })
            .catch(e => {
              Notify.error(e || '网络错误，请稍后重试');
            });
        })
        .catch(() => {
          // do nothing
        })
        .finally(() => {
          setUpsertDialogOpen(false);
        });
    },
    [upsertDialogOpen, setUpsertDialogOpen, areaOptions, studentProfile, totalDataset],
  );

  const handleDelete = useCallback(
    (id: number) => {
      return batchDeleteRows({
        rowIds: [id],
        taskId,
      })
        .then(res => {
          if (res) {
            const { failCount = 0, successCount = 0 } = res;
            return new Promise(resolve =>
              setTimeout(() => {
                if (successCount === 1) {
                  Notify.success(`删除成功`);
                } else if (failCount === 1) {
                  Notify.error('删除失败');
                }

                if (total - 1 === PAGE_SIZE * (current - 1)) {
                  // 如果删除之后当前页为空
                  setCurrent(1);
                }
                const index = totalDataset.findIndex((val: IRowData) => {
                  return val.id === id;
                });
                totalDataset.splice(index, 1);
                setTotalDataset([...totalDataset]);
                setTotal(prevTotal => prevTotal - 1);
                resolve(null);
              }, estimateValidateTime),
            );
          }
        })
        .catch(e => {
          Notify.error(e || '删除失败，请稍后重试');
        });
    },
    [taskId, totalDataset, total, current],
  );

  const columns: IImportStudentGridColumn[] = useMemo(
    () =>
      formatStudentNameColumn(dataColumns).concat({
        title: '操作',
        name: 'operation',
        width: 140,
        fixed: 'right',
        textAlign: 'right',
        bodyRender: item => {
          const { row, student, flag } = item;
          let errMsg: string = '';
          const validateInfoArr = get(row, 'rowValidateInfos') || [];
          if (validateInfoArr.some(item => item.validateCode === 102003)) {
            errMsg = '数据冲突';
          }
          if (flag && student) {
            const { studentId, studentNo } = student;

            return (
              <div className={styles.operation}>
                <StudentDetailLink studentId={studentId} params={{ studentNo: studentNo }}>
                  查看
                </StudentDetailLink>
              </div>
            );
          }

          return (
            <div className={styles.operation}>
              <span
                className={styles.action}
                onClick={() => open(item.taskId, item.row.rowId, item)}
              >
                修改
              </span>
              <Pop
                className="pop-delete-confirm"
                position="top-right"
                trigger="click"
                content={<p>删除后将不可恢复，确定删除？</p>}
                confirmText="确定"
                cancelText="取消"
                onConfirm={() => handleDelete(item.id)}
              >
                <span className={styles.action}>删除</span>
              </Pop>
              <span className={styles.errMsg}>{errMsg}</span>
            </div>
          );
        },
      }),
    [dataColumns, handleDelete, open],
  );

  return (
    <>
      <div className={styles.header}>
        <p>本次导入的数据与系统中存在的学员数据冲突。</p>
        <p>
          如果你希望本次数据覆盖新的数据，可忽略提示，直接导入；如果你不希望覆盖，请先修改后再导入。
        </p>
      </div>
      <Grid
        columns={columns}
        datasets={curDataset}
        pageInfo={{
          current: current,
          pageSize: PAGE_SIZE,
          total,
        }}
        onChange={onGridChange}
        loading={loading}
        scroll={getGridScroll(importType, columns.length)}
      />
    </>
  );
}
