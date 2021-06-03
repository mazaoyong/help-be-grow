import React from 'react';
import { Notify } from 'zent';
import { get } from 'lodash';
import { Button as SamButton } from '@youzan/sam-components';
import openAgreementDialog from 'components/agreements';
import { EXPORT_RECORD_TYPES, getExportRecordUrl } from '@ability-center/ump/export-record';
import defaultExportAgreement, {
  title as defaultAgreementDialogTitle,
} from 'components/agreements/contents/export-data';
import type { IRenderPropsType } from '@youzan/ebiz-components/es/types/easy-list/types/filter';

import styles from './styles.m.scss';

interface IExportButtonsProps {
  disabled?: boolean;
  /** 导出类型（见类型注释） */
  type: EXPORT_RECORD_TYPES;
  /** 导出按钮的回调函数，必须返回一个 Promise，且 Promise 的状态表示导出是否成功 */
  onExport: (filter?: IRenderPropsType) => Promise<any>;
  /** 导出按钮的文案，默认为导出 */
  exportButtonText?: string;
  /** 查看已导出列表按钮的文案，默认为查看已导出列表 */
  exportRecordButtonText?: string;
  /** 是否需要确认协议书，默认为 false */
  withAgreementConfirm?: boolean;
  /** 确认协议书的内容，应该为富文本，默认为数据导出授权协议书 */
  agreementContent?: string;
  /** 确认协议书弹窗的标题，默认为「数据导出」 */
  agreementDialogTitle?: string;
  /** 确认协议书弹窗的确认按钮文案，默认为「同意并导出」 */
  agreementDialogConfirmButton?: string;
  samName?: string;
  // 成功后是否自动跳转到对应的导出记录页面，后续扩展可以这样加
  // autoNavigation?: boolean;
  /**
   * 如果使用函数的方式渲染组件，就能够获得到filter实例，这时候能够绑定到filter属性上，
   * 即`(filter) => <ExportActions filter={filter} />`
   */
  filter?: IRenderPropsType;
  /**
   * 导出之前可以做一些前置校验，通过校验filter来判断是否进行下一步
   * 这个过程会在弹出同意协议之前进行
   */
  predicate?(filter?: IRenderPropsType): boolean;
}

const noop = () => true;

const ExportActions: React.FC<IExportButtonsProps> = props => {
  const {
    type,
    onExport,
    samName = '',
    disabled = false,
    exportButtonText = '导出',
    withAgreementConfirm = false,
    exportRecordButtonText = '查看已导出列表',
    agreementDialogConfirmButton = '同意并导出',
    agreementContent = defaultExportAgreement,
    agreementDialogTitle = defaultAgreementDialogTitle,
    filter,
    predicate = noop,
  } = props;

  /** 导出按钮的 loading 状态 */
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  /** 获得导出记录的 url，下面会复用 */
  const exportRecordListUrl = React.useMemo(() => getExportRecordUrl({ type }), [type]);

  const navigateToRecordList = React.useCallback(() => {
    window.open(exportRecordListUrl);
  }, [exportRecordListUrl]);

  /** onExport 的 Wrapper ， 吞掉 onExport 的错误，以判断是否需要跳转 */
  const onExportNormalized = React.useCallback(
    (passiveFilter?: IRenderPropsType): Promise<boolean> => {
      return onExport(passiveFilter)
        .then(() => true)
        .catch(err => {
          Notify.error(get(err, 'message', err));
          return false;
        });
    },
    [onExport],
  );

  /** 需要弹出授权弹窗的逻辑 */
  const handleExportWithAgreementConfirm = React.useCallback(
    (passiveFilter?: IRenderPropsType): Promise<boolean> => {
      // 为什么加这么一个变量，因为在授权弹窗场景下，创建任务失败需要关闭弹窗，但失败的时候不应该跳转到记录页
      let isSuccess = false;
      return openAgreementDialog({
        content: agreementContent,
        title: agreementDialogTitle,
        confirmText: agreementDialogConfirmButton,
        submitEffect: () =>
          onExportNormalized(passiveFilter).then(success => {
            isSuccess = success;
            return true; // 告知关闭弹窗
          }),
      })
        .afterClosed()
        .then(() => {
          return isSuccess;
        });
    },
    [agreementContent, onExportNormalized, agreementDialogTitle, agreementDialogConfirmButton],
  );

  const handleExport = React.useCallback(() => {
    const isValid = predicate(filter);
    if (!isValid) return;
    /** 根据是否需要授权来选择导出按钮的真正回调 */
    const exportHandler = withAgreementConfirm
      ? handleExportWithAgreementConfirm
      : onExportNormalized;
    setIsLoading(true);
    exportHandler(filter)
      .then(shouldNavigate => {
        if (shouldNavigate) {
          navigateToRecordList();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [
    predicate,
    withAgreementConfirm,
    handleExportWithAgreementConfirm,
    onExportNormalized,
    filter,
    navigateToRecordList,
  ]);

  return (
    <div className="export-actions__container">
      <SamButton disabled={disabled} name={samName} loading={isLoading} onClick={handleExport}>
        {exportButtonText}
      </SamButton>
      <SamButton
        outline
        type="primary"
        target="_blank"
        name={samName}
        bordered={false}
        disabled={disabled}
        href={exportRecordListUrl}
        className={styles.exportListLink}
      >
        {exportRecordButtonText}
      </SamButton>
    </div>
  );
};

export default ExportActions;
