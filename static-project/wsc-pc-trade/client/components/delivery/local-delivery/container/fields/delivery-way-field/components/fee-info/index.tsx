import React, { PureComponent } from 'react';
import { Icon, BlockLoading, Notify, Pop } from 'zent';

import { getLocalPartnerFeeInfo } from '../../../../../api';

import './styles.scss';

interface IProps {
  businessType: number;
  appId: string;
  channelId: number;
  isCloudTag: boolean;
}

interface IState {
  show: boolean;
  showTextArr: string[];
  errorText: string;
}

class FeeInfo extends PureComponent<IProps, IState> {
  state: IState = {
    show: true,
    showTextArr: [],
    errorText: '',
  };

  // componentWillUnmount() {
  //   // 避免内存泄漏
  //   this.setState = () => {};
  // }

  componentWillReceiveProps(nextProps) {
    if (nextProps.businessType !== this.props.businessType && nextProps.businessType !== 0) {
      this.onShow(true);
    }
  }

  onShow = (needLoading = false) => {
    if (this.props.businessType === 0) {
      return;
    }

    needLoading && this.setState({ show: true });
    if (this.state.show) {
      getLocalPartnerFeeInfo({
        appId: this.props.appId,
        deliveryChannel: this.props.channelId,
        isCloudTag: this.props.isCloudTag,
      })
        .then(data => {
          this.setState({
            show: false,
            showTextArr: data.showText.split('\n'),
          });
        })
        .catch(err => {
          Notify.error(err);
          this.setState({ show: false, errorText: err });
        });
    }
  };

  render() {
    const { show, showTextArr, errorText } = this.state;
    return (
      <Pop
        trigger="hover"
        position="bottom-right"
        onShow={this.onShow}
        content={
          this.props.businessType !== 0 ? (
            <BlockLoading loading={show}>
              <div className="fee-info">
                {!errorText && (
                  <>
                    <p>配送费参考：</p>
                    {showTextArr.map((item, index) => (
                      <p key={index}>{item}</p>
                    ))}
                  </>
                )}
                <p style={{ color: !errorText ? 'red' : '' }}>
                  {errorText ||
                    '以上仅作为参考，配送公司可能动态调价，具体根据发货时间时显示的费用为主'}
                </p>
              </div>
            </BlockLoading>
          ) : (
            <div>请先选择业务类型</div>
          )
        }
      >
        <p className="fee-info-trigger">
          配费说明 <Icon type="help-circle" />
        </p>
      </Pop>
    );
  }
}

export default FeeInfo;
