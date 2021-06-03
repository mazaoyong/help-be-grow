
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Button, Notify } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';
import { StoreSelectField } from './components/store-select';
import { ShopChooseControll } from '@ability-center/shop/shop-choose';
import { createClassroom, updateClassroom } from './api';
import { chainSupportOnlyHqShowWrapper, chainSupportOnlySingleShowWrapper } from './chain';

const { createForm, FormInputField, FormNumberInputField, Field } = Form;
const CSOnlyHqShowField = chainSupportOnlyHqShowWrapper(Field);
const ChainOnlySingleShowField = chainSupportOnlySingleShowWrapper(Field);

class Edit extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      isEdit: false,
    };
  }

  componentDidMount() {
    const { value } = this.props;
    const formattedValue = this.formatInput(value || {});
    if (formattedValue.classroomName) {
      this.setState({
        isEdit: true,
      });
    }
  }

  render() {
    const { value } = this.props;
    const { loading, isEdit } = this.state;
    const formattedValue = this.formatInput(value || {});
    return (
      <Form className="classroom-edit" horizontal onSubmit={this.props.handleSubmit(this.handleSubmit)}>
        <FormInputField
          name="classroomName"
          type="text"
          label="教室名称："
          value={formattedValue.classroomName}
          placeholder="最多输入20个字"
          width={250}
          required
          validations={{
            validate(values, value) {
              if (!value) {
                return '请输入教室名称';
              }
              if (value.length > 20) {
                return '最多输入20个字';
              }
              return true;
            },
          }}
        />
        <CSOnlyHqShowField
          name="kdtId"
          label="所属校区："
          value={formattedValue.kdtId}
          required
          disabled={isEdit}
          placeholder={isEdit ? formattedValue.shopName : '选择校区'}
          width={180}
          validations={{
            required(values, value) {
              return !!value;
            },
          }}
          refresh={true} // 是否显示刷新按钮
          create={true} // 是否显示新建按钮
          addAll={false}
          validationErrors={{
            required: '请选择所属校区',
          }}
          component={ShopChooseControll}
        />
        <ChainOnlySingleShowField
          name="addressId"
          label="上课地点："
          value={formattedValue.addressId}
          required
          width={180}
          validations={{
            required(values, value) {
              return !!value;
            },
          }}
          validationErrors={{
            required: '请选择上课地点',
          }}
          component={StoreSelectField}
        />
        <FormNumberInputField
          name="capacity"
          width={180}
          value={formattedValue.capacity}
          label="可容纳人数："
          validations={{
            validate(values, value) {
              if (value >= 10000) {
                return '请输入少于10000的值';
              }
              return true;
            },
          }}
          min={0}
        />
        <div className="classroom-edit_footer">
          <Button onClick={this.handleCancel}>取消</Button>
          <SamButton name="编辑" loading={loading} type="primary" htmlType="submit">
            保存
          </SamButton>
        </div>
      </Form>
    );
  }

  handleSubmit = async (values, zentForm) => {
    this.setState({ loading: true });
    const formattedValues = this.formatOutput(values);
    try {
      const { type, value: { id } = {} } = this.props;
      if (type === 'create') {
        await createClassroom(formattedValues);
      } else {
        formattedValues.id = id;
        await updateClassroom(formattedValues);
      }
      this.props.onClose();
    } catch (err) {
      Notify.error(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  handleCancel = () => {
    this.props.onClose();
  };

  formatOutput = data => {
    if (!data.capacity) {
      data.capacity = -1;
    }

    if (!data.kdtId) {
      data.kdtId = _global.kdtId;
    }
    return data;
  };

  formatInput = data => {
    if (data.capacity === -1) {
      data.capacity = '';
    }
    return data;
  };
}

export default createForm()(Edit);
