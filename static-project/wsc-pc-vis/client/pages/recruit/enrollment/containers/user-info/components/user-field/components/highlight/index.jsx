import { Pop } from '@zent/compat';
import React, { Component } from 'react';
import cx from 'classnames';
import debounce from 'lodash/debounce';
import identity from 'lodash/identity';

import WindowResizeHandler from './WindowResizeHandler';

class ClampLines extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.original !== nextProps.text) {
      return {
        original: nextProps.text,
        noClamp: false,
      };
    }
    return null;
  }

  static defaultProps = {
    className: '',
    prefix: 'zent',
    lines: 2,
    delay: 300,
    ellipsis: '...',
    showPop: true,
    popWidth: 250,
    trigger: 'hover',
    renderPop: identity,
    resizable: false,
    extra: null,
  };

  constructor(props) {
    super(props);

    this.element = null;
    this.innerElement = null;
    this.original = props.text;
    this.lineHeight = 0;

    this.state = {
      noClamp: false,
      text: '.',
      original: props.text,
    };
  }

  componentDidMount() {
    const { text } = this.props;
    if (text && !this.ssr) {
      this.lineHeight = this.element.clientHeight + 1;
      this.clampLines();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.text !== prevProps.text) {
      this.clampLines();
    }
  }

  handleResize = debounce(() => {
    this.setState({ noClamp: false });
    this.clampLines();
  }, this.props.delay);

  clampLines() {
    const original = this.state.original;
    let maxHeight = this.lineHeight * this.props.lines + 1;
    let start = 0;
    let middle = 0;
    let end = original.length;

    this.maxHeight = maxHeight;

    // WindowResizeHandler will exec a later call on unmounted element
    if (!this.innerElement) {
      return;
    }

    this.setState({ text: '' });

    // binary search to find suitable text size
    while (start <= end) {
      middle = Math.floor((start + end) / 2);
      this.innerElement.textContent =
        original.slice(0, middle) + this.getEllipsis();
      if (middle === original.length) {
        this.setState({
          text: original,
          noClamp: true,
        });
        return;
      }

      if (this.element.clientHeight <= maxHeight) {
        start = middle + 1;
      } else {
        end = middle - 1;
      }
    }

    this.innerElement.textContent =
      original.slice(0, middle - 1) + this.getEllipsis();
    this.setState({
      text: original.slice(0, middle - 1) + this.getEllipsis(),
    });
  }

  getEllipsis() {
    return !this.state.noClamp ? this.props.ellipsis : '';
  }

  renderResizable() {
    if (this.props.resizable) {
      return <WindowResizeHandler onResize={() => this.handleResize()} />;
    }
    return null;
  }

  renderClampedText() {
    const { className, prefix } = this.props;
    const classString = cx({
      [className]: className,
      [`${prefix}-clamp-lines`]: true,
    });
    return (
      <div
        className={classString}
        style={{ maxHeight: this.maxHeight, overflowY: 'hidden' }}
      >
        <div ref={e => (this.element = e)}>
          <span ref={e => (this.innerElement = e)}>
            {this.renderHighlight(this.state.text, this.props.keyword)}
          </span>
          {this.props.extra}
        </div>
        {this.renderResizable()}
      </div>
    );
  }

  renderHighlight(str = '', substr = '') {
    if (!str) {
      return '';
    }
    if (!substr) {
      return str;
    }
    const length = substr.length;
    const offset = str.search(substr);
    if (offset === -1) {
      return str;
    }
    const l1 = offset;
    const l2 = offset + length;
    const v1 = str.substr(0, l1);
    const v2 = str.substr(l1, length);
    const v3 = str.substr(l2);

    return (
      <span className="edu-enrollment-user-highlight">
        {v1}
        <a>{v2}</a>
        {v3}
      </span>
    );
  }

  render() {
    const {
      text,
      className,
      showPop,
      popWidth,
      trigger,
      renderPop,
      keyword,
    } = this.props;

    if (!text) {
      return null;
    }

    if (this.state.noClamp) {
      return (
        <div className={className}>
          {this.renderHighlight(text, keyword)}
          {this.renderResizable()}
        </div>
      );
    }

    if (showPop) {
      return (
        <Pop
          trigger={trigger}
          content={<div style={{ maxWidth: popWidth }}>{renderPop(text)}</div>}
        >
          {this.renderClampedText()}
        </Pop>
      );
    }

    return this.renderClampedText();
  }
}

export default ClampLines;
