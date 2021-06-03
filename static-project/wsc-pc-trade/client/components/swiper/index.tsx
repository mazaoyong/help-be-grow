import React, { Component } from 'react';
import cx from 'classnames';
import { Icon } from 'zent';
import forEach from 'lodash/forEach';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import get from 'lodash/get';

import './index.scss';

interface ISwiperProps {
  uniqueId: number;
}

interface ISwiperState {
  containerWidth: string;
  offset: number;
  prevDisabled: boolean;
  nextDisabled: boolean;
  scrollIndex: number;
  widths: number[];
  itemsWidth: number;
}

const itemClassName = 'swiper--item';
const arrowPadding = 30;

const SwiperItem = ({ children, className }) => {
  const ck = cx(itemClassName, className);
  return <div className={ck}>{children}</div>;
};

const defaultState = {
  offset: 0,
  prevDisabled: true,
  nextDisabled: false,
  scrollIndex: 0,
};

class Swiper extends Component<ISwiperProps, ISwiperState> {
  swiperRef = React.createRef<HTMLDivElement>();
  resizeHandler?: () => void;
  constructor(props) {
    super(props);
    this.state = {
      ...defaultState,
      widths: [],
      itemsWidth: 0,
      containerWidth: '100%',
    };
  }

  componentWillReceiveProps(next) {
    if (!isEqual(next, this.props)) {
      this.resizeHandler && this.resizeHandler();
    }
    if (this.props.uniqueId !== next.uniqueId) {
      this.resetSwiper();
    }
  }

  componentDidMount() {
    this.computeWidth();
    this.resizeHandler = debounce(this.computeWidth, 100);
    window.addEventListener('resize', this.resizeHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandler!);
  }

  // reset swiper
  resetSwiper = () => {
    this.setState({
      ...defaultState,
    });
  };

  // 计算区域宽度
  computeWidth = () => {
    const swiper = this.swiperRef.current;
    const containerWidth = get(swiper, 'parentNode.offsetWidth', 0);
    if (containerWidth > 0) {
      const items = swiper!.querySelector('.swiper__list')!.childNodes;
      let itemsWidth = 0;
      const widths: number[] = [];

      forEach(items, item => {
        // @ts-ignore
        const width = item.offsetWidth;
        itemsWidth += width;
        widths.push(width);
      });

      this.setState({
        widths,
        containerWidth,
        itemsWidth,
      });
    }
  };

  // 下一页
  goNext = () => {
    const { containerWidth, itemsWidth, scrollIndex, widths, nextDisabled } = this.state;

    if (nextDisabled) {
      return;
    }
    const idx = scrollIndex + 1;
    let offset = 0;
    widths.forEach((item, index) => {
      if (index < idx) {
        offset += item;
      }
    });

    // 保证向右滑动不会被遮挡
    if (offset) {
      offset += arrowPadding;
    }

    let isDisabled = false;
    if (+containerWidth + offset > itemsWidth) {
      isDisabled = true;
    }

    this.setState({
      offset,
      scrollIndex: idx,
      nextDisabled: isDisabled,
      prevDisabled: false,
    });
  };

  // 上一页
  goPrev = () => {
    const { scrollIndex, widths, prevDisabled } = this.state;

    if (prevDisabled) {
      return;
    }
    const idx = scrollIndex - 1;

    let offset = 0;
    widths.forEach((item, index) => {
      if (index < idx) {
        offset += item;
      }
    });

    this.setState({
      offset,
      scrollIndex: idx,
      prevDisabled: idx === 0,
      nextDisabled: false,
    });
  };

  getArrows = () => {
    const { containerWidth, itemsWidth, prevDisabled, nextDisabled } = this.state;

    const prevArrowCls = cx('arrow arrow--prev', {
      'arrow--disabled': prevDisabled,
    });
    const nextArrowCls = cx('arrow arrow--next', {
      'arrow--disabled': nextDisabled,
    });

    if (+containerWidth >= itemsWidth) {
      return null;
    }

    return (
      <div>
        <div className={prevArrowCls} onClick={this.goPrev}>
          <Icon type="right" />
        </div>
        <div className={nextArrowCls} onClick={this.goNext}>
          <Icon type="right" />
        </div>
      </div>
    );
  };

  render() {
    const { children } = this.props;
    const { containerWidth, itemsWidth, offset } = this.state;

    const swiperCls = cx('swiper', {
      'swiper--show-arrow': +containerWidth < itemsWidth,
    });
    const style = {
      transform: `translateX(${-offset}px)`,
    };

    return (
      <div ref={this.swiperRef} style={{ width: containerWidth }} className={swiperCls}>
        {this.getArrows()}
        <div className="swiper__container">
          <div className="swiper__list" style={style}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default Object.assign(Swiper, {
  SwiperItem,
});
