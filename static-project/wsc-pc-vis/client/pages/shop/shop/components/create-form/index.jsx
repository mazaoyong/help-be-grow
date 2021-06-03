
import { Form as ZentForm } from '@zent/compat';
/**
 * 创建连锁总店form组件，目前只给连锁总店使用，后面单店创建统一form结构后，复用此组件
 */
import React from 'react';
import { Button } from 'zent';
import TeamNameField from '../team-name-field';
import AgreeField from '../agree-field';
import BusinessField from '../business-field/';
import MapRegionFields from '../map-region-fields/';
import { checkShopName } from '../../api';
import { getAutomaticGeolocation } from '../../utils';
import './style.scss';

const { Form, Field, createForm } = ZentForm;

class SubmitForm extends React.Component {
  state = {
    teamName: '',
    business: 0,
    location: {},
    address: '',
    lngAndLat: {},
    agree: true,
  };

  componentDidMount() {
    this.getAmapLocation();
  }

  getAmapLocation = () => {
    try {
      getAutomaticGeolocation(data => {
        const { province, city, district, adcode } = data.addressComponent;
        this.setState({
          location: {
            province,
            city,
            area: district,
            county_id: adcode,
          },
        });
      });
    } catch (err) {
      console.error(err);
    }
  }

  submit = values => {
    return values;
  };

  render() {
    const { handleSubmit } = this.props;
    const { teamName, business, location, address, agree, lngAndLat } = this.state;
    return (
      <div className="new-create-form">
        <Form onSubmit={handleSubmit(this.submit)} horizontal>
          <Field
            name="teamName"
            type="text"
            label="机构名称："
            value={teamName}
            validations={{ required: true }}
            validationErrors={{ required: '机构名称不能为空' }}
            component={TeamNameField}
            placeholder="请输入店铺、品牌、机构全称"
            asyncValidation={(values, value) => {
              return new Promise((resolve, reject) => {
                if (!value.trim()) {
                  reject('机构名称不能为空');
                  return false;
                }

                checkShopName({
                  shopName: value,
                  isSingle: false,
                })
                  .then(res => {
                    if (res.isValid || res.valid) {
                      resolve();
                    }
                    return reject(res.failedReason || '机构名称不可用');
                  })
                  .catch(msg => {
                    reject('机构名称不可用');
                  });
              });
            }}
          />

          <Field
            name="business"
            label="主营类目："
            value={business}
            component={BusinessField}
            validations={{
              required(values, value) {
                return value > 0;
              },
            }}
            validationErrors={{ required: '请选择主营类目' }}
            handleChange={(business, params) => this.setState({ business })}
          />

          <div className="location-wrapper">
            <MapRegionFields
              location={location}
              address={address}
              lngAndLat={lngAndLat}
              handleChange={(key, value) => this.setState({ [key]: value })}
            />
          </div>

          <Field
            name="agree"
            label=" "
            isChain={true}
            value={agree}
            text="我已阅读并同意"
            component={AgreeField}
            handleChange={e => this.setState({ agree: e.target.checked })}
          />

          <div>
            <Button
              disabled={!agree}
              loading={this.props.loading}
              className="create-shop-btn"
              htmlType="submit"
              size="large"
              type="primary"
            >
              创建总部
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

const SubmitFormContainer = createForm()(SubmitForm);
export default SubmitFormContainer;
