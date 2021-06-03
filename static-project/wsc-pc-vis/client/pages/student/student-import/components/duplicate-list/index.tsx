import { Pop } from '@zent/compat';
import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
import { Grid, Notify, Dialog } from 'zent';
import get from 'lodash/get';
import {
  batchDeleteRows,
  findSameRows,
  findRowsByPage,
  getRowById,
  saveRow,
} from '../../api/confirm';
import { dialogIdMap, estimateValidateTime, IMPORT_TYPE } from '../../constants';
import UpsertStudent from '../upsert-student';

import {
  IDuplicateListProps,
  IImportStudentGridColumn,
  getPageDataRequest,
  getDuplicateRowsRequest,
  IRowData,
} from '../../types';
import './styles.scss';
import { openModifyStudent } from '@ability-center/student';
import {
  formatStudentPatchValue,
  formatSubmitOptions,
  isErrorItem,
} from '../../utils/format-student-patch-value';
import getGridScroll from '../../utils/get-grid-scroll';
import commonStyles from '../../styles/style.m.scss';

const PAGE_SIZE = 5;

const { openDialog, closeDialog } = Dialog;

const DuplicateList: FC<IDuplicateListProps> = ({
  taskId,
  dataSignCode,
  importType,
  upsertDialogOpen,
  setUpsertDialogOpen,
  branchKdtId = 0,
  dataColumns = [],
  studentProfile,
  areaOptions,
}) => {
  const [current, setCurrent] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [totalDataset, setTotalDataset] = useState<IRowData[]>([]); // 全量拉取的重复数据列表
  const [curDataset, setCurDataset] = useState<IRowData[]>([]); // 前端分页
  const [loading, toggleLoading] = useState<boolean>(false);

  const getDuplicateRows = useCallback((query: getDuplicateRowsRequest) => {
    toggleLoading(true);
    return findSameRows(query)
      .then(data => {
        const rows = data.map(row => ({
          id: get(row, 'row.rowId'),
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

  const getPageData = useCallback((query: getPageDataRequest) => {
    toggleLoading(true);
    return findRowsByPage({
      query,
      pageRequest: {
        pageNumber: 1, // 假分页，只请求第一页
        pageSize: PAGE_SIZE,
        sort: {
          orders: [
            {
              direction: 'ASC',
              property: 'id',
            },
          ],
        },
      },
    }).then(res => {
      const { content } = res;
      const dataset = content.map(item => ({
        id: get(item, 'row.rowId'),
        ...item,
      }));

      setCurDataset(dataset || []);
      toggleLoading(false);
    });
  }, []);

  useEffect(() => {
    const rowState = importType === IMPORT_TYPE.byStudentInfo ? 20 : 10;
    getDuplicateRows({
      taskId,
      rowStates: [rowState], // 校验成功
      dataSignCode,
    });
  }, [taskId, dataSignCode, getDuplicateRows, importType]);

  useEffect(() => {
    if (!Array.isArray(totalDataset)) return;
    setCurDataset(totalDataset.slice(PAGE_SIZE * (current - 1), PAGE_SIZE * current));
  }, [current, totalDataset]);

  const onGridChange = pageable => {
    const { current = 1 } = pageable;
    setCurrent(current);
  };

  const openCourse = useCallback(
    (taskId: number, rowIndex: number) => {
      if (upsertDialogOpen) return;

      setUpsertDialogOpen(true);
      const dialogId = dialogIdMap.upsertStudent;
      const onSave = () => {
        getRowById({ query: { taskId, rowId: rowIndex } })
          .then((res: IRowData) => {
            const index = totalDataset.findIndex((val: IRowData) => {
              return val.id === rowIndex;
            });
            totalDataset.splice(index, 1, Object.assign({}, res, { id: rowIndex }));
            setTotalDataset(totalDataset);
          })
          .catch(e => {
            Notify.error(e || '获取行状态失败，请稍后重试');
          });
        getPageData({ taskId, rowIds: curDataset.map(item => Number(get(item, 'row.rowId'))) });
        closeDialog(dialogId);
      };
      const onClose = () => {
        closeDialog(dialogId);
      };
      const openUpsertStudentDialog = () => {
        openDialog({
          dialogId,
          title: '修改数据',
          className: 'upsert-student-dialog-wrapper',
          children: (
            <UpsertStudent
              importType={importType}
              onSave={onSave}
              onClose={onClose}
              rowId={rowIndex}
              taskId={taskId}
              branchKdtId={branchKdtId}
            />
          ),
          maskClosable: false,
          onClose: () => {
            setUpsertDialogOpen(false);
          },
        });
      };
      // 打开dialog
      openUpsertStudentDialog();
    },
    [
      upsertDialogOpen,
      setUpsertDialogOpen,
      getPageData,
      curDataset,
      totalDataset,
      importType,
      branchKdtId,
    ],
  );

  const openStudentInfo = useCallback(
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
                  setTotalDataset(totalDataset);
                })
                .catch(e => {
                  Notify.error(e || '获取行状态失败，请稍后重试');
                });
              getPageData({
                taskId,
                rowIds: curDataset.map(item => Number(get(item, 'row.rowId'))),
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
    [
      upsertDialogOpen,
      setUpsertDialogOpen,
      areaOptions,
      studentProfile,
      curDataset,
      getPageData,
      totalDataset,
    ],
  );
  const open = importType === IMPORT_TYPE.byStudentInfo ? openStudentInfo : openCourse;

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
                } else {
                  getPageData({
                    taskId,
                    rowIds: totalDataset
                      .filter(item => get(item, 'row.rowId') !== id)
                      .slice(PAGE_SIZE * (current - 1), PAGE_SIZE * current)
                      .map(item => Number(get(item, 'row.rowId'))),
                  });
                }
                setTotalDataset(prev => prev.filter(item => get(item, 'row.rowId') !== id));
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
    [taskId, total, current, getPageData, totalDataset],
  );

  const columns: IImportStudentGridColumn[] = useMemo(
    () =>
      dataColumns
        .map(item => {
          item.bodyRender = column => {
            const { rowFieldMap } = column;
            const rowItem = item.name && rowFieldMap[item.name];
            if (!rowItem) return;
            const value =
              rowItem.name === 'courseName' && rowItem.value === '0'
                ? '0（通用课时包）'
                : rowItem.value; // 如果为0展示“0（通用课时包）”
            return (
              <p title={value} className="ellipsis-2">
                {value || '-'}
              </p>
            );
          };
          return item;
        })
        .concat({
          title: '操作',
          name: 'operation',
          width: 140,
          fixed: 'right',
          textAlign: 'right',
          bodyRender: item => {
            const { row } = item;
            let errMsg: string = '';
            const validateInfoArr = get(row, 'rowValidateInfos') || [];
            if (validateInfoArr.some(item => item.validateCode === 102001)) {
              // 相同数据
              errMsg = '存在相同数据';
            }
            return (
              <div className="upload-confirm-list-operations">
                <span className="action" onClick={() => open(item.taskId, item.row.rowId, item)}>
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
                  <span className="action">删除</span>
                </Pop>
                <span className="list-error-msg">{errMsg}</span>
              </div>
            );
          },
        }),
    [dataColumns, handleDelete, open],
  );

  return (
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
  );
};

export default DuplicateList;
