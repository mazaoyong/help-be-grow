
import { Form as ZentForm } from '@zent/compat';
/**
 * 升级有赞教育店铺
 */
import React from 'react';
import { Button, Sweetalert, Notify } from 'zent';
import formatMoney from 'zan-utils/money/format';
import AgreeField from '../../../../components/agree-field';
import BusinessField from '../../../../components/business-field';
import ShopCardSelect from '../shop-card-select';
import VersionField from '../version-field';
import RecommendField from '../recommend-field';
import CaptchaField from '../captcha-field';
import StepLine from '../step-line';
import TotalPrice from '../total-price';
import DescCard from '../desc-card';
import { getOnSellGoods, upgradeToEduShop } from '../../../../api';
import PropTypes from 'prop-types';
import YZLocalStorage from 'zan-utils/browser/local_storage';
import { genYopData } from './constants';
import { wscPkgPrice, versionMap, periods } from '../../constants';
import PeriodField from '../period-field';

import './style.scss';

const { Form, Field, createForm } = ZentForm;

class SubmitForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
  };

  state = {
    // 选中的店铺信息
    choosedShop: {},
    // 选中的店铺中是否存在在售实物商品
    hasPhysicalGoods: true,
    // 主营类目
    business: 0,
    // 商业化版本 1 基础版 2 专业版
    version: versionMap.BASIC,
    // 选择年限
    period: periods[0],
    versionPrice: 0,
    // 微商城扩展包周期/年，可选0表示不购买
    wscPkgPeriod: 1,
    // 验证码
    captchaCode: '',
    // 同意协议
    agree: true,
  };

  onShopCardSelect = (kdtId, data) => {
    this.setState({ choosedShop: data, version: versionMap.BASIC });
    getOnSellGoods({ kdtId })
      .then(ret => this.setState({ hasPhysicalGoods: ret.hasPhysicalGoods }))
      .catch(_e => Notify.error('获取店铺状态失败，请稍后重试'));
  };

  onSubmit = values => {
    const { choosedShop, wscPkgPeriod } = this.state;
    values = Object.assign(values, {
      kdtId: choosedShop.kdtId,
      mobile: choosedShop.contactMobile,
    });
    return upgradeToEduShop(values)
      .then(ret => {
        if (ret.captchaRes.success) {
          if (wscPkgPeriod) {
            // 如果订购实物商城，额外提醒一下
            return new Promise((resolve) => {
              Sweetalert.alert({
                title: '订购提醒',
                className: 'upgrade-shop__submit-dialog',
                content: (
                  <p>
                    订购「微商城扩展包」后，可售卖实物商品、电子卡券、活动票务等商品，以及配套的多种免费营销应用，但不包含如热力图、推广分析等需单独收费的营销应用。
                  </p>
                ),
                parentComponent: this,
                onConfirm: () => resolve(values),
              });
            });
          } else {
            return values;
          }
        } else {
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject('验证码校验失败');
        }
      })
      .catch(err => {
        Notify.error(err || '提交失败，请检查填写信息');
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject(err || '提交失败，请检查填写信息');
      });
  };

  render() {
    const { handleSubmit } = this.props;
    const {
      choosedShop,
      business,
      version,
      period,
      wscPkgPeriod,
      captchaCode,
      versionPrice,
      agree,
      hasPhysicalGoods,
    } = this.state;

    // wscPkgPeriod 1 勾选了拓展包
    const wscPkgPeriodPrice = wscPkgPeriod ? wscPkgPrice : 0;
    return (
      <div className="upgrade-shop">
        <Form onSubmit={handleSubmit(this.onSubmit)} horizontal>
          <StepLine
            text="① 请选择更换为有赞教育的店铺"
            rightLink={{
              title: '查看切换规则',
              url: `${window._global.url.bbs}/forum.php?mod=viewthread&tid=674369`,
            }}
          />
          <ShopCardSelect
            className="upgrade-shop-card-select"
            shopKdtId={choosedShop.kdtId}
            onSelect={(kdtId, data) => this.onShopCardSelect(kdtId, data)}
          />

          <StepLine text="② 请选择更换后的主营类目" />
          <Field
            className="upgrade-business"
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
            handleChange={business => this.setState({ business })}
          />

          <StepLine text="③ 请选择更换后的服务" />
          <Field
            className="upgrade-version"
            name="version"
            label="软件版本："
            value={version}
            component={VersionField}
            handleChange={(value, price) =>
              this.setState({ version: value, versionPrice: price })
            }
          />

          <Field
            className="upgrade-period"
            name="period"
            label="软件周期："
            value={period}
            component={PeriodField}
            onSelectChange={(value) =>
              this.setState({ period: value, wscPkgPeriod: wscPkgPeriod === 0 ? 0 : value })
            }
          />

          <Field
            className="upgrade-recommend"
            name="recommend"
            label="推荐购买："
            value={wscPkgPeriod}
            component={RecommendField}
            period={period}
            version={version}
            hasPhysicalGoods={hasPhysicalGoods}
            handleChange={(value) =>
              this.setState({ wscPkgPeriod: value })
            }
          />

          <TotalPrice
            className="upgrade-total-price"
            price={formatMoney(versionPrice * period + wscPkgPeriodPrice * wscPkgPeriod, false)}
          />

          {choosedShop.contactMobile ? (
            <>
              <StepLine text="④ 请验证身份" />
              <Field
                className="upgrade-captcha"
                name="captcha"
                label="验证码："
                value={captchaCode}
                mobile={choosedShop.contactMobile}
                countryCode={choosedShop.contactCountryCode}
                component={CaptchaField}
                handleChange={value => this.setState({ captchaCode: value })}
              />
            </>
          ) : null}

          <DescCard className="upgrade-desc-card" />

          <Field
            className="upgrade-agree"
            name="agree"
            value={agree}
            text="我已阅读并同意"
            component={AgreeField}
            handleChange={e => this.setState({ agree: e.target.checked })}
          />

          <div className="upgrade-submit">
            <Button
              disabled={!choosedShop.contactMobile || !agree || !captchaCode || !business}
              className="create-shop-btn"
              htmlType="submit"
              size="large"
              type="primary"
            >
              去订购
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

const SubmitFormContainer = createForm()(SubmitForm);

export default class UpgradeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    document.title = '升级店铺';
  }

  onSubmit = values => {
    return values;
  };

  onSubmitSuccess = values => {
    const saveKey = `order_${new Date().valueOf()}`;
    const { version = 0, period = 2, recommend = 0, kdtId } = values;
    YZLocalStorage.setItem(saveKey, JSON.stringify(genYopData(version, period, recommend)));
    const doubleCheck = YZLocalStorage.getItem(saveKey);
    if (doubleCheck) {
      const { v4 = '//www.youzan.com/v4', www } = _global.url;
      // Sweetalert.alert({
      //   title: '订购提醒',
      //   content: '请在新打开的窗口完成订单，订单支付成功后将会自动开始店铺切换操作。',
      //   onConfirm: () => (window.location.href = `${base}/v2/shop/list#/`),
      // });
      const yopUrl = `${v4}/subscribe/order/confirm?itemKey=${saveKey}`;
      // window.open(`${www}/account/team/change.html?kdt_id=${kdtId}&redirect=https:${yopUrl}`);
      location.href = `${www}/account/team/change.html?kdt_id=${kdtId}&redirect=https:${yopUrl}`;
    } else {
      Notify.error('订单数据生成失败，请联系客服');
    }
  };

  render() {
    return (
      <div>
        <SubmitFormContainer onSubmitSuccess={this.onSubmitSuccess} onSubmit={this.onSubmit} />
      </div>
    );
  }
}
