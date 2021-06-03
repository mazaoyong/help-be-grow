
import { Form as ZentForm } from '@zent/compat';
/**
 * 创建有赞教育店铺
 */
import React from 'react';
import { hashHistory } from 'react-router';
import { Button, Notify } from 'zent';
import ajax from 'zan-pc-ajax/lib';
import TeamNameField from '../../../../components/team-name-field';
import MapRegionFields from '../../../../components/map-region-fields';
import AgreeField from '../../../../components/agree-field';
import BusinessField from '../../../../components/business-field';
import { checkShopName } from '../../../../api';
import { getAutomaticGeolocation } from '../../../../utils';
import { createShopLog, createShopSuccessLog } from '../../../../utils/log';
import './style.scss';

const { Form, Field, createForm } = ZentForm;

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
    };
  }

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

  asyncValidation = (values, value) => {
    return new Promise((resolve, reject) => {
      if (!value.trim()) {
        reject('店铺名称不能为空');
        return false;
      }

      checkShopName({
        shopName: value,
        isSingle: true,
      })
        .then(res => {
          if (res.isValid || res.valid) {
            resolve();
          }
          return reject(res.failedReason || '店铺名称不可用');
        })
        .catch(msg => {
          reject('店铺名称不可用');
        });
    });
  };

  handleBusinessChange = (business, params) => {
    this.setState({
      business,
    });
  };

  render() {
    const { handleSubmit } = this.props;
    const { business, location, address, lngAndLat } = this.state;
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
              handleChange={(key, value) => this.setState({ [key]: value })}
            />
          </div>

          <Field
            name="agree"
            label=" "
            isChain={false}
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
    const { business, location, address, team_name } = values; /* eslint-disable-line*/
    const addInfo = {
      city: location.city,
      countyId: location.county_id,
      county: location.area,
      province: location.province,
      address,
    };

    this.setState({
      loading: true,
      limitAlertVisible: false,
      limitCaptchaVisible: false,
    });

    createShopLog();
    ajax({
      url: `${_global.url.v4}/vis/edu/shop/createEduShop.json`,
      type: 'post',
      data: {
        address: addInfo,
        shopName: team_name,
        businessId: business,
      },
      rawResponse: true,
    })
      .then(res => {
        const { kdtId } = res.data || {};
        createShopSuccessLog(kdtId);
        this.setState({
          loading: false,
        });
        hashHistory.push({
          pathname: '/finish',
          query: {
            title: encodeURIComponent(values.team_name),
            kdtId: res.data.kdtId,
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
