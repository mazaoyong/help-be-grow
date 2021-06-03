import React, { PureComponent, createRef } from 'react';
import { Notify, closeDialog, Button, Validators, ValidateOption } from 'zent';
import { hashHistory } from 'react-router';
import { Button as SamButton } from '@youzan/sam-components';
import get from 'lodash/get';
import { Dialog as EbizDialog, Select } from '@youzan/ebiz-components';

import ImportPage from 'components/import-page';
import ChooseField from '../choose-field';
import estimateRows from '../../utils/estimate-rows';
import { FILE_TEMPLATE, dialogIdMap, IMPORT_TYPE, IMPORT_INFO_TYPE } from '../../constants';
import { createImportTask, findTaskProgress } from '../../api/import';
import { findPageAllCampus } from '../../api/shop';
import { isEduHqStore } from 'fns/chain/index';
import PollingDialog from '../polling-dialog';
import './styles.scss';
import ChooseImportInfo from '../choose-import-info';
import ImportTemplate from '../import-template';
import checkTemplateProcess from '../check-template-process';

const { openDialog } = EbizDialog;

const VALIDATE_OPTION = ValidateOption.IncludeUntouched | ValidateOption.IncludeChildrenRecursively;

class FileUpload extends PureComponent {
  state = {
    fileUrl: '',
    templateUrl: FILE_TEMPLATE.withCourse,
    agreeProtocol: true,
    loading: false,
    fileSize: 0,
    branchKdtId: 0,
  };

  formRef = createRef();

  preCourseImportType = null;

  componentWillUnmount() {
    closeDialog(dialogIdMap.validatePolling);
    closeDialog(dialogIdMap.confirmDialog);
  }

  handleTypeChange = type => {
    const { onImportTypeChange } = this.props;
    this.preCourseImportType = type;
    onImportTypeChange(type);
  };

  handleImportInfoChange = importInfo => {
    const { onImportTypeChange } = this.props;
    let nextImportType;
    if (importInfo === IMPORT_INFO_TYPE.StudentInfo) {
      nextImportType = IMPORT_TYPE.byStudentInfo;
    } else {
      nextImportType = this.preCourseImportType || IMPORT_TYPE.byCourse;
    }
    onImportTypeChange(nextImportType);
  };

  toggleAgreeProtocol = e => {
    this.setState({ agreeProtocol: e.target.checked });
  };

  submit = async () => {
    const { importType } = this.props;
    const { fileUrl } = this.state;
    const formRef = get(this.formRef, 'current');
    if (!formRef) return;

    try {
      let res = await formRef.validate(VALIDATE_OPTION);
      let validateStatus = 1;
      res &&
        res.forEach(item => {
          if (item) {
            validateStatus = 0; // form验证失败，有错误字段
          }
        });

      if (!validateStatus) {
        return;
      }
      if (!fileUrl) {
        Notify.error('请先上传文件');
        return;
      }

      const subshop =
        this.formRef.current.getValue() && get(this.formRef.current.getValue(), 'subshop[0]');
      this.setState({ loading: true });
      const branchKdtId = get(subshop, 'kdtId');

      if (importType === IMPORT_TYPE.byStudentInfo) {
        try {
          await checkTemplateProcess({
            fileUrl,
            branchKdtId: branchKdtId || _global.kdtId,
          });
        } catch (error) {
          Notify.error(error || '校验模板失败');
          throw error;
        }
      }

      createImportTask({
        importType,
        subshop: subshop && subshop.kdtId,
        importFile: {
          fileUrl,
          privateUrl: true,
        },
        targetKdtName: subshop ? subshop.shopName : get(_global, 'shopInfo.shopName'),
      })
        .then(data => {
          if (data) {
            hashHistory.replace(`add/${data}/step=1`);
            const dialogId = dialogIdMap.validatePolling;
            openDialog(PollingDialog, {
              dialogId,
              className: 'polling-dialog-wrapper',
              style: { minWidth: '280px' },
              mask: true,
              closeBtn: false,
              close: () => closeDialog(dialogId),
              maskClosable: false,
              data: {
                pollingRequest: findTaskProgress,
                requestParams: {
                  query: [
                    {
                      taskId: data,
                      importStage: 30, // 导入前校验
                    },
                  ],
                },
                quant: estimateRows(this.state.fileSize),
                nextPage: `add/${data}/step=2?type=${importType}${
                  branchKdtId ? `&kdtId=${branchKdtId}` : ''
                }`,
                type: '校验',
              },
            })
              .afterClosed()
              .catch(); // 防止中断轮询报warning
          }
        })
        .catch(e => {
          Notify.error(e || '校验文件错误，请稍后重试');
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    } catch (error) {
      console.warn(error);
      this.setState({ loading: false });
    }
  };

  getShopOptions = (query, pageConditions) => {
    const name = query || '';
    return findPageAllCampus({
      shopCampusQuery: { hqKdtId: null, name },
      pageRequest: {
        ...pageConditions,
        pageNumber: pageConditions.current,
      },
    }).then(res => {
      const { content = [], total } = res || {};
      const options = content.map(item => {
        return {
          text: item.shopName,
          value: {
            kdtId: item.kdtId,
            shopName: item.shopName,
          },
        };
      });

      this.setState({ shopList: options });
      return {
        options,
        pageInfo: {
          current: pageConditions.current,
          total,
        },
      };
    });
  };

  getImportInfoByType = () => {
    return this.props.importType === IMPORT_TYPE.byStudentInfo
      ? IMPORT_INFO_TYPE.StudentInfo
      : IMPORT_INFO_TYPE.CourseInfo;
  };

  renderImportInfoField = () => {
    return {
      name: 'importInfo',
      label: '导入信息：',
      component: ChooseImportInfo,
      required: true,
      defaultValue: this.getImportInfoByType(),
      props: () => {
        const value = this.getImportInfoByType();
        return {
          value,
          onChange: this.handleImportInfoChange,
          index: 0,
        };
      },
    };
  };

  renderImportTypeField = () => {
    if (this.props.importType === IMPORT_TYPE.byStudentInfo) {
      return {
        name: 'importTemplate',
        label: '导入模板：',
        index: 1,
        className: 'choose-field-container',
        component: ImportTemplate,
        // defaultValue: this.props.importType,
        props: () => {
          return {
            branchKdtId: this.state.branchKdtId,
          };
        },
      };
    }
    return {
      name: 'assign',
      label: '导入方式：',
      required: true,
      index: 1,
      className: 'choose-field-container',
      component: ChooseField,
      defaultValue: this.props.importType,
      props: () => {
        return {
          value: this.props.importType,
          onChange: this.handleTypeChange,
        };
      },
    };
  };

  render() {
    return (
      <>
        <ImportPage
          className="batchimport batchimport-form"
          formRef={this.formRef}
          prefields={[this.renderImportInfoField(), this.renderImportTypeField()]}
          suffields={[
            {
              name: 'subshop',
              label: '学员所属校区：',
              component: Select,
              required: true,
              validators: [Validators.required('请选择导入学员所属校区')],
              props: () => {
                return {
                  className: 'choose-shop',
                  fetchOnOpened: true,
                  mode: 'async',
                  fetchOptions: this.getShopOptions,
                  placeholder: '请选择校区',
                  index: 3,
                };
              },
              watch: [
                {
                  dep: 'subshop',
                  fn: data => {
                    const branchKdtId = get(data, '[0].kdtId', 0);
                    this.setState({ branchKdtId });
                  },
                },
              ],
              show: {
                fn: () => isEduHqStore,
              },
            },
          ]}
          updateFieldsId={this.getImportInfoByType()}
          enableTemplateField={false}
          enableUploadField
          uploadFieldLabel="上传文件："
          fileMaxSize={2}
          agreeProtocol={this.state.agreeProtocol}
          toggleAgreeProtocol={this.toggleAgreeProtocol}
          onUploadFileChange={fileInfo => {
            const { value, size } = fileInfo;
            this.setState({ fileUrl: value, fileSize: size });
          }}
        />
        <div className="app-design">
          <div className="app-actions">
            <div className="form-actions new-actions text-center">
              <SamButton
                name="编辑"
                type="primary"
                loading={this.state.loading}
                disabled={!this.state.agreeProtocol}
                onClick={this.submit}
              >
                下一步
              </SamButton>

              <Button onClick={() => hashHistory.push('list')}>取消</Button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default FileUpload;
