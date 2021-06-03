
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Button, Dialog, Notify, Radio, BlockLoading } from 'zent';
import get from 'lodash/get';
import slice from 'lodash/slice';
import pick from 'lodash/pick';

import { isInStoreCondition, ShowWrapper } from 'fns/chain';

import { isEduShop } from '@youzan/utils-shop';

import CustomProfile, { DataType, getAge } from './components/custom-profile';
import InfoTip from '@ability-center/student/info-tip';

import SourceField from './components/source-field';

import { createClue, updateClueAPI, findListAllCampusAPI, findPagePowerStaffs, getRemoteConf, findUnifiedAttributeItems } from '../../api';
import './styles.scss';
import Affix from './components/affix';

const { createForm, FormSelectField, FormRadioGroupField, Field } = Form;
const { openDialog, closeDialog } = Dialog;

const dialogId = 'add-dialog';

const isEduChainMaster = isInStoreCondition({ supportEduHqStore: true });
const isEduChainBranch = isInStoreCondition({ supportEduBranchStore: true });

const ALTERNATIVE_VALUE_KEY = {
  'edu_stuName': 'name',
  'edu_stuAva': 'avatar',
  'edu_stuSex': 'sex',
  'edu_stuContractPhone': 'telephone',
};

/**
 * 通过props.data.attributes格式化编辑线索弹窗的初始值
 *
 * @author ChangeHow
 * @param {Array<{attributeKey: string; attributeValue: any; dataType: number}>} attrs
 * @param {{[key: string]: any}} expandValues
 * @return {Array<{value: any; [key: string]: any}>}
 */
function getInitValues(attrs, expandValues) {
  const res = [];
  attrs.forEach(attr => {
    const { attributeKey: name, attributeValue, dataType } = attr;
    let value = attributeValue || get(expandValues, ALTERNATIVE_VALUE_KEY[name], '');
    if (dataType === DataType.PROVINCE || dataType === DataType.ADDRESS) {
      const address = JSON.parse(attributeValue || '[]');
      if (address.length) {
        const provincePart = slice(address, 0, 3);
        const streetPart = get(address, '[3].name', '');
        value = [provincePart].concat(streetPart);
      }
    }
    res.push(Object.assign({}, attr, { value }));
  });
  return res;
}

const formatFields = fields => {
  return fields.map(field => {
    const { attributeKey, dataType } = field;
    if (attributeKey) {
      if (attributeKey === 'edu_stuContractWeChat' ||
      attributeKey === 'edu_stuName' ||
      attributeKey === 'edu_school') {
        let limitation = 20;
        if (attributeKey === 'edu_stuContractWeChat') {
          limitation = 30;
        }
        return Object.assign({}, field, {
          validations: {
            underLimit(_, value) {
              return String(value).length <= limitation;
            },
          },
          validationErrors: {
            underLimit: `最多填写${limitation}个字`,
          },
        });
      }
    }
    if (dataType === DataType.IMAGE) {
      field = Object.assign({}, field, {
        useRemote: true, // 申明这个之后，image组件会调用的是Upload.onSuccess
        materials: true,
        kdtId: window._global.kdtId,
        imgcdn: 'https://img.yzcdn.cn',
        tokenUrl: 'https://materials.youzan.com/shop/pubImgUploadToken.json',
      });
    }
    return field;
  });
};

// 线索管理插件获取表单配置迁移到新接口
const fetchFeilds = () => {
  // 因为表单组件复杂且是通用组件，要对返回数据做一层转换
  return findUnifiedAttributeItems({
    sceneId: 2,
  }).then(fields => fields.map(
    field => {
      const newField = pick(field, [
        'attrItem', 'attributeId', 'attributeKey', 'attributeTitle', 'attributeType',
        'createdAt', 'dataType', 'serialNo',
      ]);
      newField.applicableScenes = [{
        'applicableScene': 2,
        'required': field.needFill || false,
      }];
      return newField;
    }
  ));
};

class AddForm extends PureComponent {
  state = {
    attributes: get(this.props, 'data.attributes') || [],
    followers: [],
    campus: [],
    birthday: '',
    /**
     * @type {undefined|Array<{attributeId: number; attributeKey: string; dataType: number}>}
     */
    fields: [],
    loading: true,
    submiting: false,
    initValues: {},
    remoteConf: undefined,
  };

  componentDidMount() {
    const { attributes } = this.state;
    if (attributes.length) {
      this.setState({
        initValues: getInitValues(attributes, this.props.data),
      });
    }
    getRemoteConf().then(data => this.setState({ remoteConf: data }));
    // 获取自定义资料项信息

    Promise.all([
      findPagePowerStaffs(),
      fetchFeilds(),
    ])
      .then(([staff, fields]) => {
        const followers = staff.map(item => ({
          value: item.adminId,
          text: item.name,
        }));
        if (Array.isArray(fields) && fields.length) {
          fields = formatFields(fields);
        }
        this.setState({ followers, fields });
      })
      .catch(err => Notify.error(err))
      .finally(() => this.setState({ loading: false }));
    if (isEduChainMaster) {
      findListAllCampusAPI().then(data => {
        const campus = [{
          value: window._global.kdtId,
          text: '总部',
        }].concat(data.map(item => ({
          value: item.kdtId,
          text: item.shopName,
        })));
        this.setState({ campus });
      });
    }
  }

  handleCancel = () => {
    closeDialog(dialogId);
  };

  onSubmit = data => {
    const form = this.state.fields.map(field => {
      const { dataType, attributeKey, attributeId } = field;
      const name = attributeKey || attributeId;
      let value = get(data, name, '');
      if (dataType === DataType.ADDRESS || dataType === DataType.PROVINCE) {
        // 如果是地址的话
        if (value.length) {
          const provincePart = get(value, '[0]', []);
          // 只有详细地址类型才是四个项都有的
          if (dataType === DataType.ADDRESS) {
            const streetPart = get(value, '[1]', '');
            value = JSON.stringify(provincePart.concat({ code: 0, name: streetPart }));
          } else {
            value = JSON.stringify(provincePart);
          }
        } else {
          value = '';
        }
      }
      return {
        attributeKey,
        attributeId,
        attributeValue: String(value),
      };
    });

    this.props.zentForm.asyncValidateForm(() => {
      const { type } = this.props;

      let userId;
      let receiveType = data.receiveType;
      switch (type) {
        case 'mine':
          userId = window._global.userId;
          break;
        case 'pool':
        case 'all':
          userId = data.userId || undefined;
          break;
        default:
      }
      if (receiveType === undefined) {
        receiveType = userId ? 1 : 0;
      }

      let targetKdtId = data.targetKdtId;
      if (!targetKdtId) {
        targetKdtId = window._global.kdtId;
      }

      let kdtType = 1;
      if (targetKdtId !== window._global.kdtId) {
        kdtType = 2;
      }
      if (isEduChainBranch) {
        kdtType = 3;
      }

      // 更新
      const promise = get(this.props, 'data.isEdit') ? updateClueAPI({
        clueId: get(this.props, 'data.clueId'),
        attributes: form,
        name: data.edu_stuName,
        telephone: data.edu_stuContractPhone,
      }) : createClue({
        attributes: form,
        clueAddDistribute: {
          kdtType,
          receiveType,
          userId,
          targetKdtId: data.targetKdtId || window._global.kdtId,
        },
        name: data.edu_stuName,
        sourceId: data.source && data.source[1],
        telephone: String(data.edu_stuContractPhone),
      });

      this.setState({ submiting: true });

      promise
        .then(data => {
          closeDialog(dialogId);
          const clueId = data && data.clueId;
          this.props.afterAdd(clueId, userId);
        })
        .catch(err => {
          this.setState({ submiting: false });
          Notify.error(err);
        });
    });
  };

  renderFollower = () => {
    const { type } = this.props;
    const { receiveType, targetKdtId, campus, followers } = this.state;
    if (isEduChainMaster) {
      switch (type) {
        case 'all':
        case 'pool':
          return (
            <>
              <FormSelectField
                name="targetKdtId"
                label="所属校区："
                width="200px"
                data={campus}
                onChange={targetKdtId => {
                  this.setState({ targetKdtId });
                  setTimeout(this.props.zentForm.asyncValidateForm);
                }}
                asyncValidation={(values, value) => {
                  if (value) return Promise.resolve();
                  return Promise.reject('请选择所属校区');
                }}
                required
              />
              {
                targetKdtId === window._global.kdtId ? (
                  <FormRadioGroupField
                    name="receiveType"
                    label="分配方式："
                    value={0}
                    onChange={e => this.setState(
                      { receiveType: e.target.value },
                      this.props.zentForm.asyncValidateForm
                    )}
                  >
                    <div className="edu-clue-radio-block">
                      <Radio value={0}>分配到总部公海池</Radio>
                    </div>
                    <div>
                      <Radio value={1}>分配给总部员工</Radio>
                      <FormSelectField
                        name="userId"
                        className="edu-clue-inline-field"
                        disabled={receiveType !== 1}
                        data={followers}
                        filter={(item, keyword) => item.text.includes(keyword)}
                        asyncValidation={(values, value) => {
                          if (receiveType && (!value)) {
                            return Promise.reject('请选择员工');
                          }
                          return Promise.resolve();
                        }}
                      />
                    </div>
                  </FormRadioGroupField>
                ) : null
              }
            </>
          );
        case 'mine':
          return (
            <div className="cluepool-field">
              <div className="cluepool-field_label">跟进人：</div>
              <div className="cluepool-field_text">手动新增的线索，默认分配给自己</div>
            </div>
          );
        default:
          return null;
      }
    }
    switch (type) {
      case 'all':
        return (
          <FormSelectField
            name="userId"
            label="跟进人："
            data={followers}
            filter={(item, keyword) => item.text.includes(keyword)}
            asyncValidation={(values, value) => {
              if (value) return Promise.resolve();
              return Promise.reject('请选择跟进人');
            }}
            required
          />
        );
      case 'pool':
        return (
          <FormSelectField
            name="userId"
            label="跟进人："
            data={followers}
            filter={(item, keyword) => item.text.includes(keyword)}
          />
        );
      case 'mine':
        return (
          <div className="cluepool-field">
            <div className="cluepool-field_label">跟进人：</div>
            <div className="cluepool-field_text">手动新增的线索，默认分配给自己</div>
          </div>
        );
      default:
        return null;
    }
  }

  renderSource = isEdit => {
    if (isEdit) {
      return null;
    }

    return (
      <>
        <div className="edu-clue-vertical-line"></div>
        <Field
          name="source"
          label="来源："
          width="200px"
          component={SourceField}
          value={[]}
          required
          asyncValidation={(values, value) => {
            if (value && value.length > 0) return Promise.resolve();
            return Promise.reject('请选择线索来源');
          }}
        />
        {this.renderFollower()}
      </>
    );
  }

  handleValueChange = (name, val) => {
    // 如果存在生日并且存在年龄的时候，就需要设置年龄field的值
    const form = this.props.zentForm.getFormValues();
    if (name === 'edu_stuBirth') {
      this.props.zentForm.setFieldsValue(Object.assign({}, form, {
        'edu_stuAge': getAge(val),
      }));
    }
  }

  refetchFields = () => {
    this.setState({ loading: true });
    fetchFeilds().then(fields => {
      if (Array.isArray(fields) && fields.length) {
        fields = formatFields(fields);
      }
      this.setState({ fields });
    })
      .catch(err => Notify.error(err))
      .finally(() => this.setState({ loading: false }));
  }

  render() {
    // const { FieldWrapper } = this;
    const { handleSubmit } = this.props;
    const { fields, loading, initValues, remoteConf, submiting } = this.state;
    const isEdit = this.props.data && this.props.data.isEdit;

    return (
      <BlockLoading loading={loading} className="add-dialog__loading">
        <Form className="edupool-add-dialog" horizontal onSubmit={handleSubmit(this.onSubmit)}>
          <CustomProfile
            fields={fields}
            applicableScenes={2}
            remoteConf={remoteConf}
            initialValue={initValues}
            onChange={this.handleValueChange}
          />
          <ShowWrapper isInStoreCondition={isEduShop}>
            <div className="cluepool-info-tip">
              <InfoTip onRefresh={this.refetchFields} />
            </div>
          </ShowWrapper>
          {this.renderSource(isEdit)}
          <Affix scrollClassName="zent-dialog-r" loading={loading}>
            <div className="cluepool-add-button-group">
              <Button type="primary" outline onClick={this.handleCancel}>取消</Button>
              <Button type="primary" htmlType="submit" loading={submiting}>{isEdit ? '更新' : '保存'}</Button>
            </div>
          </Affix>
        </Form>
      </BlockLoading>
    );
  }

  FieldWrapper = ({ children, name }) => {
    const _attribute = this.state.attributes && this.state.attributes.find(
      attribute => (name || children.props.name) === attribute.attributeKey
    );
    if (_attribute) {
      return React.cloneElement(children, {
        label: _attribute.attributeTitle + '：',
        disabled: children.props.disabled === undefined ? _attribute.isDelete : children.props.disabled,
      });
    }
    return null;
  }
}

export default function openAddDialog(type, afterAdd, data = {}) {
  const WrappedForm = createForm({ scrollToError: true })(AddForm);
  openDialog({
    dialogId,
    title: data.isEdit ? '编辑线索' : '添加线索',
    style: {
      maxHeight: 'calc(100% - 56px)',
      overflow: 'auto',
      paddingBottom: '0px',
    },
    children: <WrappedForm type={type} afterAdd={afterAdd} data={data} />,
  });
}
