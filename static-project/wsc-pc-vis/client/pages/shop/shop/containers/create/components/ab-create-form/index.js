
import { Form as ZentForm } from '@zent/compat';
/**
 * 创建有赞教育店铺
 */
import React from 'react';
import { hashHistory } from 'react-router';
import { Button, Notify } from 'zent';
import TeamNameField from '../../../../components/team-name-field';
import MapRegionFields from '../../../../components/map-region-fields';
import AgreeField from '../../../../components/agree-field';
import BusinessField from '../../../../components/business-field';
import { checkShopName, createEduShop, createEduHQ } from '../../../../api';
import { getAutomaticGeolocation } from '../../../../utils';
import { createShopLog, createShopSuccessLog } from '../../../../utils/log';
import './style.scss';

const { Form, Field, createForm } = ZentForm;
const { FormSelectField } = Form;

class SubmitForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      agree: true,
      teamName: props.defaultShopName || '',
      business: 0,
      location: {},
      address: '',
      lngAndLat: {},
      isChain: 0,
    };
  }

  componentDidMount() {
    this.getAmapLocation();
  }

  getAmapLocation = () => {
    try {
      getAutomaticGeolocation(data => {
        const {
          province, city, district, adcode, township = '', street = '', streetNumber = ''
        } = data.addressComponent;
        const { position = {} } = data;
        this.setState({
          location: {
            province,
            city,
            area: district,
            county_id: adcode,
          },
          address: township + street + streetNumber,
          lngAndLat: position
        });
      });
    } catch (err) {
      console.error(err);
    }
  }

  asyncValidation = (values, value) => {
    return new Promise((resolve, reject) => {
      if (!value.trim()) {
        reject('店铺名称不能为空');
        return false;
      }

      checkShopName({
        shopName: value,
      })
        .then(res => {
          if (res.isValid || res.valid) {
            resolve();
          } else {
            const { failedReason = '' } = res;
            if (failedReason.includes('已被使用')) {
              Notify.info('店铺名称重复，为您自动生成近似名称，完成创建后仍可后台修改', 4000);
              this.setState({
                teamName: `${value}-${Math.random().toString(36).slice(2).substr(0, 4)}`
              });
              return resolve();
            }
            return reject(res.failedReason || '店铺名称不可用');
          }
        })
        .catch(_msg => {
          reject('店铺名称不可用');
        });
    });
  };

  handleBusinessChange = (business, _params) => {
    this.setState({
      business,
    });
  };

  render() {
    const { handleSubmit } = this.props;
    const { business, location, address, lngAndLat, isChain } = this.state;
    return (
      <div className="create-shop">
        <Form onSubmit={handleSubmit(this._submit)} horizontal>
          <Field
            name="team_name"
            type="text"
            label="店铺名称："
            value={this.state.teamName}
            validations={{ required: true }}
            validationErrors={{ required: '店铺名称不能为空' }}
            component={TeamNameField}
            placeholder="请输入店铺、品牌、机构全称"
            asyncValidation={this.asyncValidation}
          />

          <FormSelectField
            name="isChain"
            label="店铺形态："
            className="create-shop__chain-select"
            data={[
              { value: 0, text: '单体（管理单个店铺）' },
              { value: 1, text: '连锁（管理总部及下属分店）' },
            ]}
            value={this.state.isChain}
            placeholder="请选择店铺形态"
            validations={{ required: true }}
            validationErrors={{ required: '请选择店铺形态' }}
            onChange = {value => this.setState({ isChain: value })}
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
            handleChange={this.handleBusinessChange}
          />

          <div className="location-wrapper">
            <MapRegionFields
              location={location}
              address={address}
              lngAndLat={lngAndLat}
              validationMap={{
                address: {},
                lngAndLat: {}
              }}
              handleChange={(key, value) => this.setState({ [key]: value })}
            />
          </div>

          <Field
            name="agree"
            label=" "
            isChain={!!isChain}
            value={this.state.agree}
            text="我已阅读并同意"
            component={AgreeField}
            handleChange={this.handleAgreeChange}
          />

          <div>
            <Button
              disabled={!this.state.agree}
              loading={this.props.loading}
              className="create-shop-btn"
              htmlType="submit"
              size="large"
              type="primary"
            >
              创建店铺
            </Button>
          </div>
        </Form>
      </div>
    );
  }

  _submit = values => {
    return values;
  };

  handleAgreeChange = e => {
    this.setState({
      agree: e.target.checked,
    });
  };
}
const SubmitFormContainer = createForm()(SubmitForm);

export default class CreateShop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    document.title = '创建店铺';
  }

  onSubmit = values => {
    return values;
  };

  onSubmitSuccess = values => {
    const { business, location, address, team_name, lngAndLat, isChain } = values; /* eslint-disable-line*/
    const addInfo = {
      city: location.city,
      countyId: location.county_id,
      county: location.area,
      province: location.province,
      address,
      lng: (lngAndLat.lng || '').toString(),
      lat: (lngAndLat.lat || '').toString(),
    };

    this.setState({
      loading: true,
      limitAlertVisible: false,
      limitCaptchaVisible: false,
    });

    createShopLog();
    const createFn = isChain ? createEduHQ : createEduShop;
    createFn({
      address: addInfo,
      shopName: team_name,
      businessId: business
    })
      .then(res => {
        const { kdtId } = res || {};
        createShopSuccessLog(kdtId);
        this.setState({
          loading: false,
        });
        hashHistory.push({
          pathname: '/finish',
          query: {
            title: encodeURIComponent(values.team_name),
            kdtId: kdtId,
          },
        });
      })
      .catch(res => {
        this.setState({ loading: false });
        const { msg } = res;
        Notify.error(msg || '创建失败，请重试或联系人工客服');
        // 暂不处理不同code异常
        // if (+code === 10350) {
        //   // 未付费店铺已达10家
        //   this.setState({
        //     limitAlertVisible: true,
        //   });
        // } else if (+code === 10351) {
        //   // 未付费店铺已达5家
        //   this.setState({
        //     limitCaptchaVisible: true,
        //   });
        // } else if (+code === 10352) {
        //   this.setState({
        //     limitCaptchaVisible: true,
        //   });
        //   this.refs.captcha.reloadCaptcha();
        //   Notify.error('请输入正确的验证码');
        // } else {
        //   Notify.error(msg || '创建失败');
        // }
      });
  };

  render() {
    return (
      <div>
        <SubmitFormContainer
          loading={this.state.loading}
          onSubmitSuccess={this.onSubmitSuccess}
          onSubmit={this.onSubmit}
          defaultShopName={this.props.defaultShopName}
        />
      </div>
    );
  }
}
