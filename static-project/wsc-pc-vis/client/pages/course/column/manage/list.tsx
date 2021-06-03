import React, { FC, useCallback, useRef, useEffect } from 'react';
import { Notify, IGridColumn, Button } from 'zent';
import { EasyList, ListPopupEditor, PopEllipsisText } from '@youzan/ebiz-components';
import { IListProps, IListContext } from '@youzan/ebiz-components/components/easy-list/types/list';
import mapKeysToCamelCase from '@youzan/utils/string/mapKeysToCamelCase';
import makeDateTimeStr from '@youzan/utils/date/makeDateTimeStr';
import HelpIcon from 'shared/components/help-icon';
import { nonnegaIntValidator } from 'fns/validation/nonnega-int';
import { isInStoreCondition } from 'fns/chain';
import { ListPopupEditorType } from '@youzan/ebiz-components/es/list-popup-editor';
import ActionMenu from './components/action-menu';
import renderItemStatus from '../common/utils/render-item-status';
import renderStatusCloumn from '../common/utils/render-status-cloumn';
import { openDialog as openDeleteDialog } from '../../components/pct-delete-dialog';
import { renderColumnImgItem } from './utils';
import { batchDeleteContent, directoryMoveContent, getContentsAndLives, putContentSort } from './api';
import { IListParams, IColumnItem } from './model';
import get from 'lodash/get';
import openDirectoryMoveDialog from './components/directory-move-dialog';
import { ArthurContainer } from '@youzan/arthur-scheduler-react';
const { List, EasyGrid } = EasyList;

export interface IContentFilterProps {
  type: number | string;
  name: string;
}

interface IProps {
  hideBdapp: boolean;
  alias: string;
  updateState: number;
  directoryId: number;
  filterData: IContentFilterProps;
  refreshTreeContainer: () => void;
}

const FilterList: FC<IProps> = (props) => {
  const { hideBdapp, alias, updateState, directoryId, filterData, refreshTreeContainer } = props;
  const listRef = useRef<IListContext>(null);

  const updateList = useCallback<(forbiddenTreeRender?: boolean) => void>((forbiddenTreeRender) => {
    listRef && listRef.current && listRef.current.action.refresh();
    if (!forbiddenTreeRender) { // 禁止状态树刷新
      refreshTreeContainer && refreshTreeContainer();
    }
  }, [refreshTreeContainer]);

  // 排序
  const onSerialChange = useCallback<(item: IColumnItem) => <T>(data: T) => void | Promise<T>>(
    (item) => {
      return (serialNo) => {
        const { alias, media_type: mediaType } = item;

        putContentSort({
          alias,
          channel: mediaType === 4 ? 4 : 2,
          serialNo: Number(serialNo || 0),
        })
          .then(() => {
            updateList(true);
          })
          .catch((msg) => {
            Notify.error(msg);
          });
      };
    },
  [updateList],
  );

  useEffect(() => {
    updateList(true);
  }, [updateState, updateList, directoryId, filterData.name, filterData.type]);

  useEffect(() => {
    listRef && listRef.current && listRef.current.action.setPage(1);
  }, [directoryId]);

  const kdtWhiteListConfig = get(window._global, 'kdtWhiteListConfig', '');
  const rootKdtId = get(window._global, 'shopInfo.rootKdtId');
  // 如果在总部的kdtId在白名单内 || 当前是总部、单店，则允许编辑
  const showIndexEdit =
    `${kdtWhiteListConfig}`.split(',').includes(`${rootKdtId}`) ||
    isInStoreCondition({
      supportHqStore: true,
      supportRetailSingleShop: true,
      supportSingleStore: true,
    });

  const columns = useCallback(() => [
    {
      title: '内容',
      width: '230px',
      fixed: 'left',
      bodyRender(item: IColumnItem) {
        return renderColumnImgItem(item);
      },
    },
    {
      title: renderStatusCloumn(),
      width: '105px',
      bodyRender(item: IColumnItem) {
        const statusObj = renderItemStatus(item);
        return <p className={statusObj.errorClass}>{statusObj.statusDesc}</p>;
      },
    },
    {
      title: '所属目录',
      width: '150px',
      bodyRender(item) {
        return <PopEllipsisText text={item.directory_path || '未关联上目录，请手动将该内容移动至某个目录下'} tagName="div" count={10} style={{ color: item.directory_path ? '#323233' : '#df4545' }} />;
      },
    },
    {
      title: (
        <div>
          序号
          <HelpIcon
            help="点击数字输入序号，对专栏中的内容排序，序号越大越靠前"
            position="top-center"
            type="help-circle"
          />
        </div>
      ),
      name: 'column_serial_no',
      width: '80px',
      needSort: !(directoryId === 0),
      textAlign: 'center',
      bodyRender(item: IColumnItem) {
        const { column_serial_no: serialNo } = item;
        if (showIndexEdit) {
          return (
            <ListPopupEditor
              type={ListPopupEditorType.NUM}
              initialValue={serialNo}
              validate={nonnegaIntValidator}
              onSubmit={onSerialChange(item)}
            >
              <span>{serialNo}</span>
            </ListPopupEditor>
          );
        } else {
          return <span>{serialNo}</span>;
        }
      },
    },
    {
      title: '开售时间',
      name: 'publish_at',
      needSort: !(directoryId === 0),
      bodyRender: (item: IColumnItem) => {
        const cls = item.status === 2 ? 'gray' : '';
        return <p className={cls}>{item.publish_at ? makeDateTimeStr(item.publish_at) : '－'}</p>;
      },
    },
    {
      title: '操作',
      width: '210px',
      fixed: 'right',
      textAlign: 'right',
      bodyRender(item: IColumnItem) {
        return <ActionMenu item={item} hideBdapp={hideBdapp} reload={updateList} />;
      },
    },
  ] as IGridColumn[], [directoryId, hideBdapp, onSerialChange, showIndexEdit, updateList]);

  const getNewFetchParams = useCallback((conf) => {
    const params = mapKeysToCamelCase(conf);
    const { page, pageSize, sortType = 'DESC', sortBy } = params;
    const onlySort = sortBy;
    const data: IListParams = {
      pageNumber: Number(page) || 1,
      pageSize,
      order: sortType ? sortType.toUpperCase() : 'DESC',
      orderBy: 'column_serial_no',
      subSortBy: 'publish_at',
      onlySort,
      columnAlias: alias,
      directoryId,
      status: filterData.type,
      keyWord: filterData.name,
    };

    return data;
  }, [alias, directoryId, filterData.name, filterData.type]);

  const fetchList = useCallback<IListProps['onSubmit']>((state) => {
    return new Promise((resolve, reject) => {
      const params = getNewFetchParams(state);
      getContentsAndLives(params)
        .then((res) => {
          const { list = [], total = 0, pageable = {} } = res;
          const { pageNumber = 0, pageSize = 0 } = pageable;
          resolve({
            dataset: list,
            pageInfo: { page: pageNumber, pageSize, total },
          });
        })
        .catch((err) => {
          reject(err);
          Notify.error(err);
        });
    });
  }, [getNewFetchParams]);

  const onBatchMove = useCallback((selectedRows: any[]) => {
    if (!selectedRows || !selectedRows.length) {
      Notify.error('请选择要批量移动的内容');
      return;
    }
    if (selectedRows.length > 200) {
      Notify.error('最多选择200条内容进行操作');
      return;
    }
    openDirectoryMoveDialog({
      enableType: 'leaf',
      showUnClassify: true,
      onConfirm: (targetNode) => {
        const moveContentDTO = {
          id: targetNode.id,
          columnAlias: alias,
          // eslint-disable-next-line camelcase
          contentList: selectedRows.map(({ alias, media_type, directory_id: dirId }) => ({
            alias,
            mediaType: media_type,
            directoryId: dirId || directoryId,
          })),
        };
        return directoryMoveContent({
          moveContentDTO,
        }).then((res) => {
          if (Array.isArray(res) && res.length) {
            const errLength = res.length;
            const errMsg: string = res.slice(0, 10).map(item => item.contentName).join(',');
            Notify.error(`以下内容未移动成功：${errMsg}${errLength > 10 ? `...等${errLength}篇内容` : ''}`, 2000);
          } else {
            Notify.success('移动内容中，请手动刷新列表', 2000);
          }
          updateList();
        });
      },
      columnAlias: alias,
    });
  }, [alias, directoryId, updateList]);

  const onBatchDelete = useCallback((selectedRows: any[]) => {
    if (!selectedRows || !selectedRows.length) {
      Notify.error('请选择要批量删除的内容');
      return;
    }
    if (selectedRows.length > 200) {
      Notify.error('最多选择200条内容进行操作');
      return;
    }
    openDeleteDialog({
      alias: selectedRows.map(({ alias, media_type: contentType }) => ({ alias, contentType })),
      type: 'content',
      isBatch: true,
      onDelete: () => {
        const command = {
          columnAlias: alias,
          deleteChannel: false,
          // eslint-disable-next-line camelcase
          aliasList: selectedRows.map(({ alias, media_type, directory_id: dirId, title }) => ({
            alias,
            contentType: media_type,
            contentName: title,
            directoryId: dirId || directoryId,
          })),
        };
        batchDeleteContent({ command }).then((res) => {
          if (Array.isArray(res) && res.length) {
            const errLength = res.length;
            const errMsg: string = res.slice(0, 10).map(item => item.contentName).join(',');
            Notify.error(`以下内容未删除成功：${errMsg}${errLength > 10 ? `...等${errLength}篇内容` : ''}`);
          } else {
            Notify.success('批量删除内容成功');
          }
          updateList();
        });
      },
    });
  }, [alias, directoryId, updateList]);

  return (
    <List ref={listRef} onSubmit={fetchList} mode="hash">
      <EasyGrid
        className="column-manage__grid"
        columns={columns()}
        emptyLabel="还没有专栏内容"
        rowKey="alias"
        easySelection
        scroll={{ x: 1200 }}
        batchRender={(selectedRows) => (
          <ArthurContainer name="dirManage" namespace="知识付费" preventDefault>
            {
              (model) => (<>
                <span className="span-select-all">当页全选</span>
                <Button disabled={!model.available} onClick={() => onBatchMove(selectedRows)}>移动</Button>
                <Button disabled={!model.available} onClick={() => onBatchDelete(selectedRows)}>删除</Button>
              </>)
            }
          </ArthurContainer>
        )}
      />
    </List>
  );
};

export default FilterList;
