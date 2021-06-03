import React from 'react';
import DeliveryBtn from './DeliveryBtn';

interface IProps {
  onSubmit: () => void;
  loading: boolean;
  handleSubmit: (param: any) => () => void;
  disabled?: boolean;
  footer?: ((func: any) => React.ReactNode) | null;
}

class WrapperWithFooter extends React.Component<IProps> {
  handleSubmit = () => {
    const { onSubmit } = this.props;
    onSubmit();
  };

  renderDeliveryBtn() {
    const { loading, disabled, handleSubmit } = this.props;
    return (
      <DeliveryBtn
        loading={loading}
        disabled={disabled}
        onClick={handleSubmit(this.handleSubmit)}
      />
    );
  }

  renderFooter() {
    const { footer, handleSubmit } = this.props;
    if (footer) {
      return footer(handleSubmit(this.handleSubmit));
    }
    return this.renderDeliveryBtn();
  }

  render() {
    return (
      <div>
        {this.props.children}
        <div className="action-footer">{this.renderFooter()}</div>
      </div>
    );
  }
}

export default WrapperWithFooter;
