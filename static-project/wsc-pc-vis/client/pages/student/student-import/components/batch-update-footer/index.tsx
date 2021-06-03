import { Popover } from '@zent/compat';
import React, { FC, useState, useCallback } from 'react';
import { Menu, Button, Icon, Notify } from 'zent';
import { IOption, IPageRequest } from '@youzan/ebiz-components/es/types/select';
import get from 'lodash/get';

import { getCourseList, getClassList } from '../../api/confirm';
import BatchOptionPop from '../batch-ops-pop';
import { batchOperationMap, estimateValidateTime, estimateValidateTimePerData } from '../../constants';
import { batchUpdateRequest } from './request';
import { IBatchUpdateFooterProps } from '../../types';
import './styles.scss';

const BatchUpdateFooter: FC<IBatchUpdateFooterProps> = ({
  importType,
  taskId,
  selected,
  setSelected,
  getPageValidateSummary,
  branchKdtId,
}) => {
  const [batchOptionValue, setBatchOptionValue] = useState<string>('');
  const [batchMenuVisible, toggleBatchMenuVisible] = useState(false);

  const handleBatchOptionChange = useCallback(e => {
    if (Number(e)) {
      setBatchOptionValue(String(Number(e))); // 取整
    } else if (typeof (e) === 'string') {
      setBatchOptionValue(e);
    } else if (Array.isArray(e)) {
      setBatchOptionValue(e[0]); // ebizSelect单选默认返回array
    } else {
      setBatchOptionValue(e.target.value);
    };
  }, [setBatchOptionValue]);

  const onBatchSubmit = useCallback(fieldName => {
    if (!taskId) {
      Notify.error('未选择导入任务，请返回重试');
      return;
    }
    if (!selected || !selected.length) {
      Notify.error('请至少选择一条数据');
      return;
    }
    if (batchOptionValue === null || batchOptionValue === undefined || batchOptionValue === '') {
      Notify.error('批量修改条件不能为空');
      return;
    }

    return batchUpdateRequest({
      fieldName,
      rowIds: selected,
      taskId,
      value: batchOptionValue,
    }).then(res => {
      return new Promise<void | null>((resolve) => setTimeout(() => {
        if (res) {
          const { failCount = 0, successCount = 0 } = res;
          if (!failCount) {
            Notify.success(`批量${batchOperationMap[fieldName]}成功`);
          } else if (!successCount) {
            Notify.error('批量修改数据失败，请重新处理');
          } else {
            Notify.error(`${successCount}条数据处理成功，${failCount}条处理失败，请重新处理`);
          };
          getPageValidateSummary({ taskId });
          resolve(null);
        }
      }, selected.length > 3
        ? estimateValidateTimePerData * selected.length
        : estimateValidateTime));
    }).catch(e => {
      Notify.error(e || '网络错误，请稍后重试');
    }).finally(() => {
      setSelected([]);
      toggleBatchMenuVisible(false);
    });
  }, [selected, taskId, batchOptionValue,
    setSelected, getPageValidateSummary]);

  const fetchCourseOptions = useCallback((name: string, pageRequest: IPageRequest):
  Promise<{ options: IOption[]; pageInfo: IPageRequest; }> => {
    return getCourseList({
      kdtId: branchKdtId || _global.kdtId,
      name,
      isTrial: 0,
      pageSize: pageRequest.pageSize || 20,
      pageNumber: pageRequest.current || 1,
    })
      .then(data => {
        const { content = [], pageable, total } = data;
        const options = content.map(course => ({
          text: course.name,
          value: course.name,
        }));

        if (pageable.pageNumber === 1) {
          options.unshift({
            text: '0（通用课时包）',
            value: '0',
          });
        }

        return {
          options,
          pageInfo: {
            current: pageable.pageNumber || 1,
            total: total || 0,
          },
        };
      });
  }, [branchKdtId]);

  const fetchClassOptions = useCallback((query: string, pageRequest) => {
    const eduClassNameQuery = {
      className: query,
      kdtId: branchKdtId || _global.kdtId,
    };

    return getClassList({
      eduClassNameQuery,
      pageRequest: {
        pageNumber: pageRequest.current,
        pageSize: pageRequest.pageSize,
      },
    }).then(({ content = [], total, pageable }) => {
      const options = content.map(klass => ({
        text: get(klass, 'eduClassName'),
        value: get(klass, 'eduClassName'),
      }));

      return {
        options,
        pageInfo: {
          current: pageable.pageNumber || 1,
          total: total || 0,
        },
      };
    });
  }, [branchKdtId]);

  return (
    <Popover
      display="inline"
      cushion={3}
      position={Popover.Position.TopRight}
      visible={batchMenuVisible}
      onVisibleChange={() => {
        toggleBatchMenuVisible(val => !val);
      }}
    >
      <Popover.Trigger.Click>
        <Button className="batch-more" onClick={() => {
          if (batchMenuVisible) {
            toggleBatchMenuVisible(false);
          }
        }}>
          <span>更多</span>
          {batchMenuVisible
            ? <Icon className="more-caret-down" type="caret-down" />
            : <Icon className="more-caret-up" type="caret-up" />
          }
        </Button>
      </Popover.Trigger.Click>
      <Popover.Content>
        <Menu className="stu-import-batch-operation">
          {importType === 5 && <Menu.MenuItem>
            <BatchOptionPop
              opmode="ebizSelect"
              placeholder="请选择课程"
              selectProps={{
                filter: true,
                mode: 'async',
                fetchOnOpened: true,
                fetchOptions: fetchCourseOptions,
              }}
              value={batchOptionValue}
              handleChange={handleBatchOptionChange}
              onConfirm={() => onBatchSubmit('courseName')}
              onClose={() => setBatchOptionValue('')}
            >
              <span className="action">修改课程</span>
            </BatchOptionPop>
          </Menu.MenuItem>}
          {importType === 5 && <Menu.MenuItem>
            <BatchOptionPop
              opmode="numberinput"
              placeholder="请填写购买课时"
              value={batchOptionValue}
              handleChange={handleBatchOptionChange}
              onConfirm={() => onBatchSubmit('totalCourseTime')}
              onClose={() => setBatchOptionValue('')}
            >
              <span className="action">修改购买课时</span>
            </BatchOptionPop>
          </Menu.MenuItem>}
          {importType === 6 && <Menu.MenuItem>
            <BatchOptionPop
              opmode="ebizSelect"
              placeholder="请选择班级"
              selectProps={{
                filter: true,
                mode: 'async',
                fetchOnOpened: true,
                fetchOptions: fetchClassOptions,
              }}
              value={batchOptionValue}
              handleChange={handleBatchOptionChange}
              onConfirm={() => onBatchSubmit('className')}
              onClose={() => setBatchOptionValue('')}
            >
              <span className="action">修改班级</span>
            </BatchOptionPop>
          </Menu.MenuItem>}
          <Menu.MenuItem>
            <BatchOptionPop
              opmode="select"
              selectOptions={[
                { text: '现金支付', value: '现金支付' },
                { text: '标记付款-自有支付宝', value: '标记付款-自有支付宝' },
                { text: '标记付款-自有微信支付', value: '标记付款-自有微信支付' },
                { text: '标记付款-自有POS刷卡', value: '标记付款-自有pos刷卡' },
              ]}
              placeholder="请选择支付方式"
              value={batchOptionValue}
              handleChange={handleBatchOptionChange}
              onConfirm={() => onBatchSubmit('payTool')}
              onClose={() => setBatchOptionValue('')}
            >
              <span className="action">修改支付方式</span>
            </BatchOptionPop>
          </Menu.MenuItem>
          <Menu.MenuItem>
            <BatchOptionPop
              opmode="date"
              placeholder="请选择报名时间"
              value={batchOptionValue}
              handleChange={handleBatchOptionChange}
              onConfirm={() => onBatchSubmit('enrollTime')}
              onClose={() => setBatchOptionValue('')}
            >
              <span className="action">修改报名时间</span>
            </BatchOptionPop>
          </Menu.MenuItem>
        </Menu>
      </Popover.Content>
    </Popover>
  );
};

export default BatchUpdateFooter;
