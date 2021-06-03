import { Form, IFormCreateFormWrapperProps } from '@zent/compat';
import React, { Component } from 'react';
import { Button, Notify, Alert, IInputChangeEvent, BlockLoading, Icon } from 'zent';
import { Dialog } from '@youzan/ebiz-components';
import { Button as SamButton } from '@youzan/sam-components';

import get from 'lodash/get';
import clone from 'lodash/clone';
import { DataType as ProfileType } from '@ability-center/student';
import { isOverflow } from 'fns/text/caculate';

import {
  formatEditData,
  topAttributeKey,
  ATTR_TYPE_LABEL,
  formatCreateData,
  convertToTextValue,
  IStudentProfileItem,
  STANDARD_PROFILE_LIST,
} from '../../utils/pre-handle-data';
import { convertType } from '../../utils/convert-applicable-scene';
import ApplicableSceneBoxField from './components/applicable-scene-field';
import OptionGroup from './components/option-group';
import Add from './components/add-button';
import Option from './components/option';
import { createStudentProfileItem, updateStudentProfileItem, getRemoteConf } from '../../api/list';
import { IDialogChildrenProps } from '@youzan/ebiz-components/es/types/dialog';

interface DataType {
  type: convertType;
  attributeConf?: IStudentProfileItem;
}

interface ICustomState {
  options: Array<{
    value: any;
    text?: string;
  }>;
  hasError: {
    errorList: number[];
    errorMsg: string[];
  };
  loading: boolean;
  btnLoading: boolean;
  showCustomOpts: boolean;
  oldApplicableScenes?: IStudentProfileItem['applicableScenes'];
  remoteConf: Record<string, string>;
}

const { createForm, FormInputField, FormSelectField, Field } = Form;
const { openDialog, DialogBody, DialogFooter } = Dialog;
// 获取选项文案
const OPTIONS = (type: DataType['type'], renderTypes?: string) => {
  if (type === 'EDIT') {
    return ATTR_TYPE_LABEL.map((text: string, index: number) => ({
      text,
      value: index,
    }));
  }
  let renderTypesObject: Record<string, string>[] | undefined;
  try {
    renderTypesObject = JSON.parse(renderTypes || '[]');
  } catch (err) {
    // do nothing
  }
  return ATTR_TYPE_LABEL.map((text: string, index: number) => ({
    text,
    value: index,
  })).filter((opt, index) => {
    const { value } = opt;
    if (renderTypesObject && renderTypesObject.length) {
      return get(renderTypesObject, `[${index}].state`, true);
    } else {
      switch (value) {
        case ProfileType.IMAGE:
        case ProfileType.ADDRESS:
        case ProfileType.PHONE:
          return false;
        default:
          return true;
      }
    }
  });
};
// [单选, 多选]
const SHOW_CUSTOM_OPTIONS = [7, 8];

// 是否是标准资料项
const isStandardProfileItem = (attributeKey: IStudentProfileItem['attributeKey']) => {
  if (!attributeKey) {
    return false;
  }
  return STANDARD_PROFILE_LIST.findIndex(item => item === attributeKey) !== -1;
};
// 是否是选择型的数据类型
const isSelectLikeType = (type: number) => {
  if (isNaN(type)) {
    return false;
  }
  return SHOW_CUSTOM_OPTIONS.findIndex(_type => _type === type) !== -1;
};

interface IDialogData {
  conf: {
    type: convertType;
    attributeConf?: IStudentProfileItem;
  };
  parentRef: IDialogChildrenProps<any, any>['dialogref'];
}

type ICustomProfileProps = IDialogChildrenProps<any, IDialogData> &
IFormWrappedComp<IFormCreateFormWrapperProps>;

class CustomProfileItem extends Component<ICustomProfileProps, ICustomState> {
  constructor(props: ICustomProfileProps) {
    super(props);

    this.state = {
      options: [{ value: new Date().getTime() }],
      hasError: {
        errorList: [],
        errorMsg: [],
      },
      loading: props.data.conf.type === 'ADD',
      btnLoading: false,
      oldApplicableScenes: undefined,
      showCustomOpts: false,
      remoteConf: {},
    };
  }

  componentDidMount() {
    const { data, zentForm } = this.props;
    const { type, attributeConf } = data.conf;
    if (data.parentRef) {
      data.parentRef.close();
    }
    if (attributeConf) {
      // 如果有数据，需要手动控制回填;
      zentForm.initialize(attributeConf);
    }
    if (type === 'EDIT' && attributeConf) {
      // 如果是编辑模式，需要对数据进行格式化
      const dataType = Number(get(attributeConf, 'dataType'));
      const oldApplicableScenes = get(attributeConf, 'applicableScenes');
      this.setState({
        options: convertToTextValue(attributeConf),
        showCustomOpts: isSelectLikeType(dataType),
        oldApplicableScenes,
      });
    } else {
      // 如果是新建资料项，需要去拿一下选项配置，根据配置判断有哪些配置被禁用了
      getRemoteConf()
        .then(data => this.setState({ remoteConf: data }))
        .finally(() => this.setState({ loading: false }));
    }
  }

  // 检测选项
  validatingOptions = (): boolean => {
    const { options, showCustomOpts } = this.state;
    // 检查自定义选项是否有没有填写的
    let errorList: number[] = [];
    const errorMsg: string[] = [];
    if (showCustomOpts) {
      errorList = options
        .filter(opt => {
          const { text } = opt;
          if (text) {
            const isOver20 = isOverflow(text, 20, 1);
            if (isOver20) {
              errorMsg.push('选项内容不能超过20个字');
            }
            return isOver20;
          }
          const isEmpty = text === undefined || text === '';
          if (isEmpty) {
            errorMsg.push('选项内容不能为空');
          }
          return isEmpty;
        })
        .map(item => item.value);
    }
    this.setState({
      hasError: {
        errorList,
        errorMsg,
      },
    });
    if (errorList.length) {
      return false;
    }
    return true;
  };

  submit = value => {
    const { options } = this.state;
    const { data, dialogref } = this.props;
    const {
      conf: { type, attributeConf },
    } = data;

    const isValidOptions = this.validatingOptions();
    // 如果有错误，禁止提交
    if (!isValidOptions) {
      return void 0;
    }

    // 对form表单进行格式化
    const formData = Object.assign({}, value, {
      attrItem: options,
      attributeKey: get(attributeConf, 'attributeKey'),
      attributeId: get(attributeConf, 'attributeId'),
    });
    // 添加选项的时候，如果没有触发过适用场景，会返回一个''，默认是两个场景都选中并且是必选
    const query =
      type === 'ADD'
        ? formatCreateData(formData)
        : formatEditData(formData, this.state.oldApplicableScenes);

    if (type === 'ADD' && !query.applicableScenes) {
      query.applicableScenes = [
        {
          applicableScene: 1,
          required: true,
        },
        {
          applicableScene: 1,
          required: true,
        },
      ];
    }
    if (!query.serialNo) {
      query.serialNo = 0;
    }
    const fetch = type === 'ADD' ? createStudentProfileItem : updateStudentProfileItem;

    fetch(query)
      .then(data => {
        const prefix = type === 'ADD' ? '添加' : '修改';
        if (data) {
          Notify.success(`${prefix}成功`);
          dialogref.submit('done');
          dialogref.close();
        } else {
          Notify.error(`${prefix}失败`);
        }
      })
      .catch(err => Notify.error(err))
      .finally(() => this.setState({ btnLoading: false }));
  };

  // 添加或者删除选项
  setSize = (size: number, value?: any): ICustomState['options'] => {
    let options = this.state.options;
    // 不能删除最后一个
    if (size < 1) {
      return options;
    }
    if (size <= options.length) {
      // 删除了数据
      if (value === undefined) {
        return options;
      }
      return options.filter(opt => get(opt, 'value') !== value);
    }
    if (options.length === 40) {
      Notify.error('最多只能添加40个选项');
      return options;
    }
    // 添加选项
    return options.concat({
      // 添加选项的时候，value仅作为标识使用
      value: new Date().getTime(),
    });
  };

  // 是否显示自定义选项
  toggleShowCustomOpts = (value: number) => {
    this.setState({
      showCustomOpts: isSelectLikeType(value),
    });
  };

  // 设置自定义选项
  setCustomOption = (evt: IInputChangeEvent) => {
    const text = evt.target.value;
    const index = evt.currentTarget.getAttribute('data-index');

    if (index) {
      const { options } = this.state;
      const duplicateOpts = clone(options);
      duplicateOpts[index].text = text;
      this.setState(
        {
          options: duplicateOpts,
        },
        this.validatingOptions,
      );
    }
  };

  // 渲染自定义选项数据
  renderOptions = (): null | React.ReactNode[] => {
    const { options, hasError } = this.state;
    const size = options.length;
    // 添加选项按钮方法
    const add = () =>
      this.setState({
        options: this.setSize(size + 1),
      });

    let renderedOpts: React.ReactNode[] = [];
    if (options.length) {
      const _options = options.map((opt, index) => {
        // 是否错误
        const errorIndex = hasError.errorList.findIndex(val => val === opt.value);
        const minus = () =>
          this.setState({
            options: this.setSize(size - 1, opt.value),
          });
        return (
          <Option
            opt={opt}
            minus={minus}
            index={index}
            key={opt.value}
            isError={errorIndex !== -1}
            errorMsg={hasError.errorMsg[errorIndex]}
            onChange={this.setCustomOption}
          />
        );
      });
      renderedOpts = renderedOpts.concat(_options);
    }

    return renderedOpts.concat(size >= 40 ? null : <Add key="addCustomOptions" add={add} />);
  };

  render() {
    const { dialogref, handleSubmit, data } = this.props;
    const { showCustomOpts, btnLoading, loading, remoteConf } = this.state;
    const { type, attributeConf } = data.conf;

    const isHasAttributeKey = get(attributeConf, 'attributeKey', '') !== '';
    const isEditableGender =
      type === 'EDIT' && get(attributeConf, 'dataType') === ProfileType.GENDER;

    // ⚠️剔除图片的数据类型
    const renderTypes = get(remoteConf, 'renderTypes');
    const filteredOptions = OPTIONS(type, renderTypes);
    return (
      <Form horizontal onSubmit={handleSubmit(this.submit)}>
        <BlockLoading loading={loading}>
          <DialogBody>
            {type === 'EDIT' && showCustomOpts && (
              <Alert type="warning" className="profile-list">
                修改选项内容或删除选项，都会造成学员已勾选的结果失效，请谨慎操作。
              </Alert>
            )}
            <FormInputField
              required
              type="text"
              width="240px"
              label="资料项名称："
              name="attributeTitle"
              placeholder="最多7个字"
              disabled={isHasAttributeKey}
              helpDesc={
                !isHasAttributeKey && (
                  <div style={{ width: '342px' }}>
                    <Icon type="info-circle" />
                    &nbsp;适用于“线索管理”场景时，不支持在线索导入模板中使用
                  </div>
                )
              }
              validations={{
                required: true,
                maxLength: 7,
              }}
              validationErrors={{
                maxLength: '资料项名称最多7个字符',
                required: '请填写资料项名称',
              }}
            />
            <FormSelectField
              required
              width="240px"
              data={filteredOptions}
              label="数据类型："
              placeholder="请选择"
              name="dataType"
              disabled={type === 'EDIT'}
              validations={{
                required: true,
              }}
              validationErrors={{
                required: '请选择数据类型',
              }}
              onChange={this.toggleShowCustomOpts}
            />
            {/** 是否是选择型的数据类型或者是编辑状态下的性别类型 */
              (showCustomOpts || isEditableGender) &&
              (isStandardProfileItem(get(attributeConf, 'attributeKey')) || isEditableGender ? (
                <OptionGroup
                  style={{
                    width: '336px',
                    lineHeight: '32px',
                    fontSize: '12px',
                  }}
                  dataType={get(attributeConf, 'dataType') as ProfileType}
                  value={get(attributeConf, 'attrItem', [])}
                />
              ) : (
                this.renderOptions()
              ))}
            <FormInputField
              label="序号："
              type="number"
              width="240px"
              name="sourceSerialNo"
              disabled={topAttributeKey[get(attributeConf, 'attributeKey', '')]}
              max={999}
              value={0}
              placeholder="越大越靠前"
            />
            <Field
              label="适用场景："
              name="applicableScenes"
              type={type || 'ADD'}
              attributeConf={attributeConf}
              component={ApplicableSceneBoxField}
            />
          </DialogBody>
        </BlockLoading>
        <DialogFooter>
          <Button onClick={dialogref.close}>取消</Button>
          <SamButton name="编辑" loading={btnLoading} htmlType="submit" type="primary">
            确定
          </SamButton>
        </DialogFooter>
      </Form>
    );
  }
}

const CustomProfileItemForm = createForm()(CustomProfileItem);

export function openCustomProfileItem(
  conf: DataType,
  parentRef?: IDialogChildrenProps<any, any>['dialogref'],
) {
  const dialogRef = openDialog(CustomProfileItemForm as any, {
    dialogId: 'custom_profile_item',
    title: conf.type === 'ADD' ? '添加自定义资料项' : '编辑资料项',
    data: {
      conf,
      parentRef,
    },
    className: 'profile-list__dialog',
    style: {
      width: '580px',
      paddingBottom: 0,
    },
  });

  return dialogRef.afterClosed();
}
