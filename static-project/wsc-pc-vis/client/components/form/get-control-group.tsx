import React, { PureComponent } from 'react';
import cx from 'classnames';
import has from 'lodash/has';

export default Control => {
  return class ControlGroup extends PureComponent<any> {
    private dom?: HTMLElement;
    private control?: HTMLElement;
    private currentActive: boolean;
    constructor(props) {
      super(props);
      this.currentActive = false;
    }
    componentDidMount() {
      document.addEventListener('mousedown', this.handleBlur);
    }
    componentWillUnmount() {
      document.removeEventListener('mousedown', this.handleBlur);
    }
    getControlInstance = () => {
      return this.control;
    };
    ref = dom => {
      this.dom = dom;
    };
    render() {
      const {
        required = false,
        helpDesc = '',
        notice = '',
        label = '',
        className = '',
        displayError,
        ...props
      } = this.props;

      const showError =
        displayError === undefined ? props.isDirty && props.error !== null : displayError;
      const groupClassName = cx({
        'zent-form__control-group': true,
        'zent-form__control-group--active': props.isActive,
        'has-error': showError,
        [className]: true,
      });

      const controlRef = isFunctional(Control)
        ? {}
        : {
          ref: instance => {
            this.control = instance;
          },
        };

      return (
        <div className={groupClassName}>
          <label className="zent-form__control-label">
            {required ? <em className="zent-form__required">*</em> : null}
            {label}
          </label>
          <div className="zent-form__controls" ref={this.ref}>
            <Control {...props} {...controlRef} />
            {showError && <p className="zent-form__error-desc">{props.error}</p>}
            {notice && <p className="zent-form__notice-desc">{notice}</p>}
            {helpDesc && <p className="zent-form__help-desc">{helpDesc}</p>}
          </div>
        </div>
      );
    }
    handleBlur = (e: any) => {
      const currentClicked = this.dom && this.dom.contains(e.target);
      const popupClicked = has(e, 'path.some') && e.path.some(path => /zent-select-popup/.test(path.className));
      if (currentClicked && !this.currentActive) {
        // 1. 如果点击当前组件，但是当前组件并不活跃，那么标记为活跃
        this.currentActive = true;
        return;
      }
      if (!currentClicked && !popupClicked && this.currentActive) {
        // 2. 用户点到除了弹窗外的别的地方去了，同时当前组件活跃，触发 blur
        this.currentActive = false;
        setTimeout(() => this.props.onBlur(this.props.value));
      }
    };
  };
};

function isFunctional(Component) {
  return typeof Component !== 'string' && typeof Component.prototype.render !== 'function';
}
