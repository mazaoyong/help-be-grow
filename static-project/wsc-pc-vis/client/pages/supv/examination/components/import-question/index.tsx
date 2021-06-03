import React, { FC, useCallback, useState, useEffect } from 'react';

import { IDialogChildrenProps } from '@youzan/ebiz-components/es/types/dialog';
import { IListProps, IListContext } from '@youzan/ebiz-components/es/types/easy-list';
import { EasyList, Dialog } from '@youzan/ebiz-components';

import { findPageByCondition } from '../../../api/question-bank';

import { ClassifyList } from '@ability-center/supv/question-bank';

// @TODO: 从能力中心引入 questionBankListConfig
import { columnsConfig, questionBankListConfig } from './config';

import { Button } from 'zent';

import './styles.scss';

const { DialogFooter, DialogBody } = Dialog;
const { Filter, List, InlineFilter, Search, EasyGrid } = EasyList;

export interface IImportQuestionData {
  exitsQuestionIds: number[];
}

const ImportQuestion: FC<IDialogChildrenProps<number[], IImportQuestionData>> = ({
  dialogref,
  data,
}) => {
  const [currentCategoryId, setCurrentCategoryId] = useState<number>(0);
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [datasets, setDatasets] = useState<any[]>([]);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const questionListRef = React.useRef<IListContext | null>(null); // 列表的 Ref

  useEffect(() => {
    const defaultSelected = data.exitsQuestionIds || [];
    setSelectedKeys(defaultSelected);
  }, [data]);

  // 只要选择数据发生变化，就需要重新设置
  useEffect(() => {
    questionListRef.current &&
      questionListRef.current.action.setGlobalState({ selectedRowKeys: selectedKeys });
  }, [selectedKeys]);

  const handleClickClassifyList = useCallback((targetId) => {
    setCurrentCategoryId(targetId);
  }, []);

  // 当在列表中选择了某个题目，将题目的 id 添加到已选择列表中
  const handleSelect = useCallback(
    (selectedRowKeys: string[], changedRow: any) => {
      // 取消勾选
      if (selectedRowKeys.length === 0) {
        // 全部取消
        if (Array.isArray(changedRow) && changedRow.length === 0) {
          const allKeys = datasets.map((item) => item.id);
          setSelectedKeys(selectedKeys.filter((item) => !allKeys.includes(item)));
          // 单个取消
        } else if (changedRow !== null) {
          const key = changedRow.id;
          setSelectedKeys(selectedKeys.filter((item) => item !== key));
        }
      } else {
        // const keySets = new Set([...selectedKeys, ...selectedRowKeys.map(item => parseInt(item))]);
        setSelectedKeys(selectedRowKeys.map((item) => parseInt(item)));
      }
      return true;
    },
    [selectedKeys, datasets, setSelectedKeys],
  );

  // 请求题库列表数据
  const getQuestionBankList = React.useCallback<IListProps['onSubmit']>(
    (filter) => {
      const { page, pageSize, ...questionQuery } = filter;
      const questionListQuery = Object.assign({}, questionQuery, { categoryId: currentCategoryId });
      return findPageByCondition(questionListQuery as any, { pageNumber: page, pageSize }).then(
        (res) => {
          const { content, total, pageable } = res;
          if (content.length > 0) {
            setIsEmpty(false);
          } else {
            setIsEmpty(true);
          }
          setDatasets(content);
          return {
            dataset: content,
            pageInfo: {
              total,
              page: pageable.pageNumber,
            },
          };
        },
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCategoryId],
  );

  /* -------- 手动更新列表 START ---------- */
  const forceUpdate = useCallback(() => {
    questionListRef.current && questionListRef.current.action.refresh();
  }, []);
  // 当左侧的分类改变的时候，手动刷新列表
  useEffect(forceUpdate, [currentCategoryId]);
  /* -------- 手动更新列表 END ---------- */

  return (
    <>
      <DialogBody>
        <List
          ref={questionListRef}
          mode="none"
          onSubmit={getQuestionBankList}
          defaultFilter={{ pageSize: 10 }}
        >
          <section className="import-dialog-body">
            <aside className="import-dialog-body__aside">
              <div style={{ width: '100%' }}>
                <ClassifyList
                  needSystemDefault
                  popPosition="top-left"
                  onClickItem={handleClickClassifyList}
                />
              </div>
            </aside>
            <section className="import-dialog-body__grid">
              <InlineFilter
                left={null}
                right={[
                  <Filter
                    key="select-filter"
                    config={questionBankListConfig}
                    autoFilter
                    backgroundColor="transparent"
                  />,
                  <Search key="keyword-filter" name="title" placeholder="输入题目名称搜索" />,
                ]}
              />
              {isEmpty ? (
                <div className="empty">
                  <div>
                    <img src="https://img.yzcdn.cn/upload_files/2020/06/08/Fir2hBnyBBNIZThC_f9AV9ztESFp.png" />
                    <p>
                      暂无题目，
                      <a href="/v4/vis/supv/question-bank" target="_blank">
                        去添加
                      </a>
                    </p>
                  </div>
                </div>
              ) : (
                <EasyGrid
                  ellipsis={true}
                  columns={columnsConfig}
                  paginationType="lite"
                  rowKey="id"
                  selection={{
                    onSelect: handleSelect,
                  }}
                />
              )}
            </section>
          </section>
        </List>
      </DialogBody>
      <DialogFooter>
        <span style={{ marginRight: 16 }}>已选 {selectedKeys.length} 项</span>
        <Button
          onClick={() => {
            dialogref.close();
          }}
        >
          取消
        </Button>
        <Button
          type="primary"
          onClick={() => {
            dialogref.submit(selectedKeys);
          }}
        >
          确定
        </Button>
      </DialogFooter>
    </>
  );
};

export default ImportQuestion;
