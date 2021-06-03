import { Popover } from '@zent/compat';
import React, { PureComponent } from 'react';

import './styles.scss';

export default class Select extends PureComponent {
  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.keyword !== state.outsideKeyword) {
      return {
        keyword: nextProps.keyword,
        outsideKeyword: nextProps.keyword,
      };
    }
    return null;
  }

  /**
   * keyword 关键字
   * outsideKeyword 外部传入的关键字
   * active 当前组件是否活跃
   * visible 是否展示下拉弹窗
   */
  state = {
    keyword: '',
    outsideKeyword: '',
    visible: false,
    active: false,
  };

  childRef = null;

  componentDidMount() {
    document.addEventListener('click', this.handleOutsideClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick);
  }

  handleOutsideClick = e => {
    if (this.state.visible || this.state.active) {
      if (this.childRef && this.childRef.contains(e.target)) {
        return;
      }
      this.setState({ visible: false, active: false });
    }
  };

  injectRef = ref => {
    this.childRef = ref;
  };

  toggleVisible = visible => {
    this.setState({ visible });
  };

  handleClick = () => {
    const { keyword } = this.state;
    const { onAsyncFilter } = this.props;
    this.setState({
      active: true,
    });
    if (onAsyncFilter) {
      onAsyncFilter(keyword).then(() => {
        if (this.state.active) {
          this.setState({ visible: true });
        }
      });
    }
  };

  handleChange = ({ keyword = '', visible = true }) => {
    const { onAsyncFilter, onChange } = this.props;
    this.setState({ keyword, visible });
    if (onChange) {
      // just for validate
      onChange({});
    }
    if (onAsyncFilter) {
      onAsyncFilter(keyword).then(() => {
        if (this.state.active) {
          this.setState({ visible: true });
        }
      });
    }
  };

  handleBlur = () => {
    const { value, onBlur } = this.props;
    if (onBlur) {
      onBlur(value);
    }
  };

  handleSelect = ({ mode, item }) => {
    const { onBlur, onChange } = this.props;
    const keyword = item.name;
    this.setState({
      keyword,
      visible: false,
    });
    if (onBlur) {
      setTimeout(() => {
        onBlur({ mode, item });
      }, 0);
    } else {
      onChange({ mode, item });
    }
  };

  handleNothing = () => {};

  render() {
    const {
      placeholder,
      options,
      value,
      disabled,
      triggerComp: Trigger,
      contentComp: Content,
    } = this.props;
    const { keyword, visible } = this.state;

    if (disabled) {
      return (
        <Trigger
          placeholder={placeholder}
          keyword={keyword}
          disabled={disabled}
          onBlur={this.handleNothing}
          onChange={this.handleNothing}
          onClick={this.handleNothing}
          injectRef={this.injectRef}
        />
      );
    }

    return (
      <Popover
        display="inline"
        width="380px"
        visible={visible}
        onVisibleChange={this.toggleVisible}
        position={Popover.Position.BottomCenter}
      >
        <Popover.Trigger.Base>
          <Trigger
            placeholder={placeholder}
            keyword={keyword}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            onClick={this.handleClick}
            injectRef={this.injectRef}
          />
        </Popover.Trigger.Base>
        <Popover.Content>
          <Content
            keyword={keyword}
            value={value}
            options={options}
            onChange={this.handleSelect}
          />
        </Popover.Content>
      </Popover>
    );
  }
}
