import React, { useState, useEffect, useCallback, useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { Progress, Notify } from 'zent';
import { hashHistory } from 'react-router';
import { EasyList } from '@youzan/ebiz-components';
import { IFormatData, IListContext } from '@youzan/ebiz-components/es/types/easy-list';
import { Link as SamLink } from '@youzan/sam-components';
import { importProgressMap, IMPORT_TYPE_TEXT } from './constants';
import { IImportListProps, PollingItem, SortDirection, TextAlign } from './types';

import { arrayColumnWrapper, isInStoreCondition } from 'fns/chain';
import './styles.scss';

const { List, EasyGrid } = EasyList;

const ImportList = forwardRef<IListContext | null, IImportListProps>(
  function ImportListWithRef(props, ref) {
    const {
      className = '',
      findImportTaskByPageRequest,
      needValidation = true,
      enablePolling = true,
      validationRequest,
      findTaskProgress,
      handleReimport,
      recordPageUrl,
      hasImportType = false,
    } = props;

    const list = useRef<IListContext | null>(null);
    useImperativeHandle(ref, () => list.current as any);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [rowValidateMap, setRowValidateMap] = useState({});
    const [progressMap, setProgressMap] = useState({});

    const stopPolling = useCallback(() => {
      if (!timer || !timer.current) return;

      timer.current && clearTimeout(timer.current);
      timer.current = null;
    }, [timer]);

    useEffect(() => {
      return () => stopPolling();
    }, [stopPolling]);

    const fetchRowFieldErrorList = useCallback((taskIds: number[]) => {
      if (!needValidation) return;
      validationRequest!({ taskIds })
        .then(res => {
          if (res) {
            const rowValidateMap = {};
            res.map(item => {
              rowValidateMap[item.taskId] = item.errorRowNum;
            });
            setRowValidateMap(rowValidateMap);
          }
        })
        .catch(e => {
          Notify.error(e || '获取校验数据失败，请稍后重试');
        });
    }, [needValidation, validationRequest]);

    const fetchRecordList: (query) => Promise<IFormatData | any> = (query) => {
      const { page, pageSize } = query;

      const pageRequest = {
        pageNumber: page,
        pageSize,
        sort: {
          orders: [
            {
              direction: 'DESC' as SortDirection,
              property: 'created_at',
            },
          ],
        },
      };

      return findImportTaskByPageRequest({ pageRequest })
        .then(({ content, total }) => {
          if (needValidation && enablePolling) {
            // 如果有“导入中”或者导入前“数据校验中”状态的任务，需要轮询进度
            const pollingArr: PollingItem[] = [];
            const validateErrorArr: number[] = [];
            content.map(item => {
              if (item.importStage === 1 || item.importStage === 30) {
                pollingArr.push({
                  importStage: item.importStage,
                  taskId: item.id,
                });
              }
              if (item.importStage === 40) { // 校验部分失败
                validateErrorArr.push(item.id);
              }
            });

            if (validateErrorArr && validateErrorArr.length > 0 && !timer.current) { // 如果在轮询，不请求这个接口
              fetchRowFieldErrorList(validateErrorArr);
            }
            if (pollingArr && pollingArr.length > 0) {
              polling({ query: pollingArr }, true);
            }

            return {
              dataset: content,
              pageInfo: {
                page,
                pageSize,
                total,
              },
            };
          } else {
            return {
              dataset: content,
              pageInfo: {
                page,
                pageSize,
                total,
              },
            };
          };
        })
        .catch(err => Notify.error(err));
    };

    const polling = ({ query }, isInit = false) => {
      findTaskProgress && findTaskProgress({ query })
        .then((progressArr) => {
          // 防止上一页的 Api 请求没完成用户点击分页导致数据串掉
          if ((!isInit && !timer) || !progressArr) {
            return;
          }

          const progress = {};
          progressArr.map(item => {
            const { progressValue, taskId } = item;
            progress[taskId] = progressValue;
          });
          setProgressMap(progress);

          // 如果本页有数据处于“导入中”或导入前“校验中”状态
          if (query.some(item => item.importStage === 1 || item.importStage === 30)) {
            if (Object.values(progress).includes(100)) {
              list && list.current && list.current.action.refresh(); // 如果有进度100%的任务，马上刷新列表
            } else {
              timer.current = setTimeout(() => {
                polling({ query });
              }, 2000);
            };
          }
        }).catch(e => {
          Notify.error(e || '查询任务进度失败，请稍后重试');
          stopPolling();
        });
    };

    function hasColumn(visible, item) {
      if (!visible) return null;
      return item;
    }

    const getColumns = useMemo(() => arrayColumnWrapper([
      {
        name: 'createAt',
        title: '导入时间',
      },
      hasColumn(hasImportType, {
        name: 'importType',
        title: '导入信息',
        bodyRender({ importType }) {
          return IMPORT_TYPE_TEXT[importType] || '';
        },
      }),
      {
        name: 'expectRowNum',
        title: '预期导入数',
        bodyRender({ expectRowNum, importStage }) {
          if (expectRowNum === null || expectRowNum === undefined || importStage === 0) {
            return '-';
          }
          return expectRowNum;
        },
      },
      {
        name: 'successRowNum',
        title: '实际导入数',
        bodyRender({ importStage, successRowNum, failedRowNum }) {
          if (importStage === 2 || importStage === 60) { // 导入完成
            return <>
              <p>成功：{successRowNum}</p>
              <p>失败：{failedRowNum}</p>
            </>;
          } else if (importStage === 50 && successRowNum) {
            return <>
              <p>成功：{successRowNum}</p>
              <p>失败：{failedRowNum}</p>
            </>;
          }
          return '-';
        },
      },
      {
        name: 'targetKdtName',
        title: '学员所属校区',
        chainState: isInStoreCondition({
          supportEduHqStore: true,
        }),
      },
      {
        name: 'status',
        title: '导入状态',
        bodyRender({ importStage }) {
          if ([0, 1, 10, 30, 40, 50].includes(importStage)) {
            return <span className="success">{importProgressMap[importStage]}</span>;
          }
          if (importStage === 2 || importStage === 60) {
            return <span>导入完成</span>;
          }
          return <span className="fail">{importProgressMap[importStage]}</span>;
        },
      },
      {
        name: 'message',
        title: '说明',
        width: 170,
        bodyRender({ importStage, message, id }) {
          if (message) {
            return message;
          }
          if (importStage === 30 || importStage === 1) {
            return (<>
              {!id || !progressMap[id]
                ? <span>-</span>
                : <Progress
                  className="import-record-progress"
                  width={80}
                  strokeWidth={4}
                  normalColor="#2DA641"
                  percent={Number(progressMap[id])}
                />}
            </>);
          }
          if (!needValidation) return '-';
          if (importStage === 40 && rowValidateMap[id] > 0) {
            return <span>可能有{rowValidateMap[id]}条数据存在错误，请修改</span>;
          }
          return '-';
        },
      },
      {
        title: '操作人',
        bodyRender(row) {
          if (!row.operator) return '-';
          const { nickName, mobile } = row.operator;
          return (<><p>{nickName}</p><p>{mobile}</p></>);
        },
      },
      {
        title: '操作',
        textAlign: 'right' as TextAlign,
        width: 140,
        bodyRender: ({
          importStage, id, successRowNum, failedRowNum, failedFileUrl,
          operator, importType, targetKdtId,
        }) => {
          if (importStage === 2) {
            if (importType === 1 || importType === 2 || importType === 7) { // 一期数据
              if (failedFileUrl) {
                return (<a
                  href={failedFileUrl}
                  download
                >
                  下载失败报表
                </a>);
              }
              return '-';
            }
            if (importType === 7 && !failedFileUrl) { // 题库导入成功无操作
              return '-';
            }
            if (successRowNum > 0) {
              return (<span
                className="operation"
                onClick={() => { window.open(`${recordPageUrl}/${id}?type=${importType}`, '_blank'); }}
              >
                查看导入记录
              </span>);
            }
            return '-';
          }
          if (importStage === 1 || importStage === 20) {
            if (importStage === 1 && importType === 7) { // 题库导入中
              return (<span
                className="operation"
                onClick={() => { list.current && list.current.action.refresh(); }}
              >
                刷新
              </span>);
            }
            return successRowNum > 0
              ? (<p
                className="operation"
                onClick={() => { window.open(`${recordPageUrl}/${id}?type=${importType}`, '_blank'); }}
              >
                查看导入记录
              </p>)
              : '-';
          }
          if (importStage === 60) {
            const { userId = 0 } = operator;
            return (<>
              {userId !== _global.userId
                ? <SamLink
                  name='修改'
                  type="primary"
                  onClick={() => handleReimport && handleReimport(id, importType, failedRowNum, targetKdtId)}
                >
                  重新导入失败数据
                </SamLink>
                : <span
                  className="operation"
                  onClick={() => handleReimport && handleReimport(id, importType, failedRowNum, targetKdtId)}
                >
                  重新导入失败数据
                </span>
              }
              {successRowNum > 0
                ? <p
                  className="operation"
                  onClick={() => { window.open(`${recordPageUrl}/${id}?type=${importType}`, '_blank'); }}
                >
                  查看导入记录
                </p>
                : null
              }
            </>);
          }
          if (importStage === 40) {
            const { userId = 0 } = operator;
            return (<>
              {userId !== _global.userId
                ? (<SamLink
                  name='修改'
                  type="primary"
                  onClick={() => { hashHistory.push(`add/${id}/step=2?error=1&type=${importType}${targetKdtId !== _global.kdtId ? `&kdtId=${targetKdtId}` : ''}`); }}
                >
                  修改
                </SamLink>)
                : (<span
                  className="operation"
                  onClick={() => { hashHistory.push(`add/${id}/step=2?error=1&type=${importType}${targetKdtId !== _global.kdtId ? `&kdtId=${targetKdtId}` : ''}`); }}
                >
                  修改
                </span>)}
              {successRowNum > 0
                ? <p
                  className="operation"
                  onClick={() => { window.open(`${recordPageUrl}/${id}?type=${importType}`, '_blank'); }}
                >
                  查看导入记录
                </p>
                : null
              }
            </>);
          }
          if (importStage === 50) {
            const { userId = 0 } = operator;
            return (<>
              {userId !== _global.userId
                ? (<SamLink
                  name='修改'
                  type="primary"
                  onClick={() => { hashHistory.push(`add/${id}/step=2?type=${importType}${targetKdtId !== _global.kdtId ? `&kdtId=${targetKdtId}` : ''}`); }}
                >
                  导入
                </SamLink>)
                : (<span
                  className="operation"
                  onClick={() => { hashHistory.push(`add/${id}/step=2?type=${importType}${targetKdtId !== _global.kdtId ? `&kdtId=${targetKdtId}` : ''}`); }}
                >
                  导入
                </span>)}
              {successRowNum > 0
                ? <p
                  className="operation"
                  onClick={() => { window.open(`${recordPageUrl}/${id}?type=${importType}`, '_blank'); }}
                >
                  查看导入记录
                </p>
                : null
              }
            </>);
          }
          return '-';
        }
      },
    ]), [progressMap, rowValidateMap, handleReimport, needValidation, recordPageUrl]);

    return (
      <List mode="hash" ref={list} onSubmit={fetchRecordList}>
        <EasyGrid
          className={className}
          columns={getColumns}
        />
      </List>
    );
  }
);

export default ImportList;
