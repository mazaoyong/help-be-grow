import React, { Component } from 'react';
import * as api from '../../../../api/course-manage';
import { BlockLoading, Input, Button } from 'zent';
import accDiv from 'zan-utils/number/accDiv.js';
import accMul from 'zan-utils/number/accMul.js';

export default class extends Component {
  static defaultProps = {
    submitQuickEdit: () => { },
    terminateSubmit: () => { },
    label: '',
    productAlias: '',
    skuSize: 1,
    type: 'text',
    required: true,
  };

  constructor(props) {
    super(props);
    if (props.productAlias === '') {
      throw new Error('快捷便捷sku需要商品alias');
    }

    const _arr = new Array(props.skuSize);
    const skuInfo = Array.from(_arr, _ => ({}));
    const value = _arr.fill(0);

    this.state = {
      isValid: _arr.fill(true),
      hasInvalid: false,
      loading: props.productAlias !== '',
      value,
      skuInfo,
      keysLength: 0,
    };
  }

  componentDidMount() {
    const { productAlias, name, type, kdtId = null } = this.props;
    // 获取多规格的数据
    api
      .findProductSkus({ productAlias, kdtId })
      .then(data => {
        const value = data.map(d => ({
          [name]: type === 'currency' ? accDiv(d[name], 100) : d[name],
          skuId: d.id || null,
        }));
        this.setState({ value, skuInfo: data });
      })
      .finally(() => this.setState({ loading: false }));
  }

  handleChange(index, e) {
    const { type, name, validate, maxLength, required } = this.props;
    const { value, isValid } = this.state;
    const userInput = e.target.value;
    if (maxLength && userInput > maxLength) return void 0;
    // 如果存在输入检验
    let noInvalid = false;
    if (validate) {
      noInvalid = validate(userInput);
      if (type === 'currency' || type === 'number') {
        // 如果是货币类型，就需要比对是否是数字
        noInvalid = !isNaN(userInput) && noInvalid;
      }
    }
    if (required) {
      if (userInput === '') {
        noInvalid = true;
      }
    }
    isValid[index] = noInvalid;
    value[index][name] = userInput;
    this.setState({ value, isValid, hasInvalid: !noInvalid });
  }

  // 渲染sku信息
  renderSkuInfo() {
    const { label, type, width, name, disabled, showPrice = null } = this.props;
    const { skuInfo, value, isValid } = this.state;
    if (skuInfo.length && skuInfo[0].id) {
      // 首先要先获取全部的key的长度
      const keys = Object.keys(skuInfo[0]).filter(i => /k\d$/.test(i.toString()));
      const keysLength = keys.filter((_, i) => skuInfo[0][`k${i + 1}`] !== '').length;

      const skuTitle = (
        <thead key="sku-title">
          <tr>
            {Array.from(new Array(keysLength)).map((_, i) => (
              <td key={`key-${i + 1}`}>{skuInfo[0][`k${i + 1}`]}</td>
            ))}
            {showPrice && <td>价格</td>}
            <td className="sku-required">{label}</td>
          </tr>
        </thead>
      );
      const skuContentList = skuInfo.map((sku, index) => {
        const v = value[index][name];
        const content = Array.from(new Array(keysLength)).map((_, i) => {
          i += 1;
          return <td style={{ maxWidth: '80px', wordWrap: 'break-word' }} key={`value-${i}-${i}`}>{sku[`v${i}`]}</td>;
        });
        // 渲染编辑
        if (showPrice) {
          content.push(
            <td>
              <span> {`¥${sku['price'] / 100}`}</span>
            </td>,
          );
        }
        content.push(
          <td className="sku-required" key={`v${keysLength}-${keysLength + 1}`}>
            <Input
              className={`${!isValid[index] ? 'input-disable' : ''}`}
              value={v}
              disabled={disabled}
              width={width || 80}
              type={type === 'currency' ? 'number' : type}
              onChange={this.handleChange.bind(this, index)}
              onPressEnter={this.handleSubmit.bind(this)}
            />
          </td>,
        );
        return (
          <tr className="sku-container__row" key={`sku-content-${index}`}>
            {content}
          </tr>
        );
      });
      const skuContent = <tbody key="sku-content-conatiner">{skuContentList}</tbody>;
      return {
        node: [skuTitle, skuContent],
        size: keysLength + 1,
      };
    }
    return {
      node: null,
      size: 1,
    };
  }

  // 在提交之前需要对数据进行格式化，如果type是currency类型，那么每个值都要乘100
  handleSubmit() {
    const { submitQuickEdit, type, name } = this.props;
    const { value } = this.state;
    if (type === 'currency') {
      value.forEach(v => {
        const _value = v[name];
        v[name] = accMul(Number(_value), 100);
      });
    }
    this.setState({ value }, () => submitQuickEdit.call(this));
  }

  render() {
    const { terminateSubmit, disabled } = this.props;
    const { hasInvalid } = this.state;
    const skuList = this.renderSkuInfo();
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <BlockLoading containerClass="sku-container" loading={this.state.loading}>
          {skuList.node && (
            <>
              <div className="sku-container__row title">
                <table>{skuList.node[0]}</table>
              </div>
              <div className="sku-container__row sku-content no-border">
                <table>{skuList.node[1]}</table>
              </div>
            </>
          )}
        </BlockLoading>
        {!this.state.loading && (
          <section className="shortcut-pop__container-action sku-right">
            { !disabled && <Button
              type="primary"
              disabled={hasInvalid}
              width={40}
              onClick={this.handleSubmit.bind(this)}
            >
              保存
            </Button>}
            <Button width={40} type={disabled ? 'primary' : ''} onClick={terminateSubmit.bind(this)}>
              { !disabled ? '取消' : '关闭'}
            </Button>
          </section>
        )}
      </div>
    );
  }
}
