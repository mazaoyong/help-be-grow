import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Dialog, Alert, Menu, Notify } from 'zent';
import { find, get } from 'lodash';

import { IBatchUpdateFooterProps, IColumn, TStudentProfile } from '../../types';
import styles from './styles.m.scss';
import BatchStatus, { IBatchStatusProps } from './status';
import { formatSubmitValues, useFormFields } from '@ability-center/student/modify-student';
import { EasyFormArchive } from '@youzan/ebiz-components';
import { ZentForm } from 'zent/es/form/ZentForm';
import { batchUpdateRequest } from '../batch-update-footer/request';
import { estimateValidateTime, estimateValidateTimePerData } from '../../constants';
import { getSpecifiedHeader } from '../../api/prepare';
import { getStudentProfileByColumns } from '../../hooks/use-columns';
import { withRouter, WithRouterProps } from 'react-router';
import { formatSubmitOptions } from '../../utils/format-student-patch-value';

const { EasyForm } = EasyFormArchive;

function sleep(wait: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, wait);
  });
}

interface IBatchUpdateFormFooterProps {
  columns: any;
}

function BatchUpdateFormFooter(
  props: IBatchUpdateFooterProps & IBatchUpdateFormFooterProps & WithRouterProps,
) {
  const { selected, taskId, getPageValidateSummary, setSelected } = props;

  const [dialogVisible, setDialogVisible] = useState(false);
  const EasyFormRef = useRef<ZentForm<any>>();
  const [batchStatus, setBatchStatus] = useState<IBatchStatusProps['status']>(undefined);
  const [batchErrMsg, setBatchErrMsg] = useState('');
  const [selectedKey, setSelectedKey] = useState('');
  const [columns, setColumns] = useState<any[]>([]);
  const [studentProfile, setStudentProfile] = useState<TStudentProfile[]>([]);
  const branchKdtId = Number(get(props.location, 'query.kdtId', _global.kdtId));

  useEffect(() => {
    getSpecifiedHeader({ templateType: 0, kdtId: branchKdtId })
      .then(data => {
        if (Array.isArray(data)) {
          const dataColumns = data
            .sort((a, b) => a.sortNum - b.sortNum)
            .map((item: IColumn) => {
              const { attributeTitle, attributeKey } = item;
              return {
                title: attributeTitle,
                name: attributeKey,
              };
            });
          setColumns(dataColumns);
          const defaultSelectedKey = get(dataColumns, [0, 'name']);
          setSelectedKey(defaultSelectedKey);
          const profile = getStudentProfileByColumns(data);
          setStudentProfile(profile);
        }
      })
      .catch(Notify.error);
  }, [branchKdtId]);

  const { formFields } = useFormFields({
    applicableScene: 0,
    profileFields: studentProfile,
  });

  function resetSelectedKey() {
    const defaultSelectedKey = get(columns, [0, 'name']);
    setSelectedKey(defaultSelectedKey);
  }

  function renderTitle() {
    return (
      <>
        批量设置
        <span className={styles.selectedTip}>{`已选数据${selected.length}`}</span>
      </>
    );
  }

  function renderFooter() {
    const hide = batchStatus === 'success' || batchStatus === 'process';
    if (hide) {
      return <div style={{ height: '32px' }}></div>;
    }

    const confirmText = batchStatus === 'fail' ? '重试' : '确定';
    return (
      <>
        <Button onClick={handleDialogClose}>取消</Button>
        <Button type="primary" onClick={openBatchForm}>
          {confirmText}
        </Button>
      </>
    );
  }

  function handleMenuClick(_e, key) {
    if (selectedKey === key) return;
    setSelectedKey(key);
    setBatchStatus(undefined);
  }

  function handleClick() {
    if (!taskId) {
      Notify.error('未选择导入任务，请返回重试');
      return;
    }
    if (!selected.length) {
      Notify.error('请至少选择一条数据');
      return;
    }
    setDialogVisible(true);
  }

  function openBatchForm() {
    EasyFormRef.current && EasyFormRef.current.submit();
  }

  const handleSubmit = useCallback(
    (form: ZentForm<any>) => {
      const formValues = form.getValue();

      async function submitProcess() {
        try {
          setBatchStatus('process');
          const fieldName = selectedKey;
          const submitData: Record<string, any>[] = [];
          Object.keys(formValues).forEach((keyOrId: string) => {
            const targetValue = get(formValues, keyOrId);
            const targetKey = Number(keyOrId) ? 'attributeId' : 'attributeKey';
            const target = find(studentProfile, { [targetKey]: Number(keyOrId) || keyOrId });
            if (target) {
              submitData.push({
                attributeKey: get(target, 'attributeKey'),
                attributeId: get(target, 'attributeId'),
                dataType: get(target, 'dataType'),
                value: targetValue,
              });
            }
          });
          const formatValues = formatSubmitValues(submitData, formatSubmitOptions);
          const batchOptionValue = get(formatValues, '[0].value');
          const res = await batchUpdateRequest({
            fieldName,
            rowIds: selected,
            taskId,
            value: batchOptionValue,
          });

          const waitTime =
            selected.length > 3
              ? estimateValidateTimePerData * selected.length
              : estimateValidateTime;

          await sleep(waitTime);

          const { failCount = 0, successCount = 0 } = res;
          if (!failCount) {
            // Notify.success(`批量${batchOperationMap[fieldName]}成功`);
            Notify.success(`批量修改成功`);
          } else if (!successCount) {
            Notify.error('批量修改数据失败，请重新处理');
          } else {
            Notify.error(`${successCount}条数据处理成功，${failCount}条处理失败，请重新处理`);
          }
          setBatchStatus('success');
          await getPageValidateSummary({ taskId });
        } catch (error) {
          setBatchStatus('fail');
          setBatchErrMsg(error);
        }
      }
      submitProcess();
    },
    [getPageValidateSummary, selected, selectedKey, studentProfile, taskId],
  );

  function handleDialogClose() {
    setDialogVisible(false);
    resetSelectedKey();
    setBatchStatus(undefined);
    setSelected([]);
  }

  return (
    <>
      <Button className={styles.batchBtn} onClick={handleClick}>
        批量设置
      </Button>
      <Dialog
        className={styles.batchDialog}
        title={renderTitle()}
        visible={dialogVisible}
        onClose={handleDialogClose}
        footer={renderFooter()}
      >
        <div>
          <Alert>每次只能修改一项，修改后点击确定即可生效。如需修改多项，需多次操作。</Alert>
          <div className={styles.box}>
            <Menu className={styles.menu} mode="inline" onClick={handleMenuClick} inlineIndent={8}>
              {columns.map(({ name, title }) => {
                return (
                  <Menu.MenuItem
                    className={selectedKey === name ? styles.selectedMenuItem : styles.menuItem}
                    key={name}
                  >
                    {title}
                  </Menu.MenuItem>
                );
              })}
            </Menu>
            <div className={styles.rightContainer}>
              <div className={batchStatus && styles.hide}>
                <EasyForm
                  ref={form => (EasyFormRef.current = form)}
                  layout="horizontal"
                  config={formFields.filter(item => item.name === selectedKey)}
                  onSubmit={handleSubmit}
                ></EasyForm>
              </div>
              {batchStatus && (
                <div className={styles.content}>
                  <BatchStatus status={batchStatus} errMsg={batchErrMsg}></BatchStatus>
                </div>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default withRouter(BatchUpdateFormFooter);
