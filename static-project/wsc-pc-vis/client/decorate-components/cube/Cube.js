import React, { Component } from 'react';
import cx from 'classnames';
import map from 'lodash/map';
import fill from 'lodash/fill';
import assign from 'lodash/assign';
import forEach from 'lodash/forEach';
import { Icon } from 'zent';
import fullfillImage from '@youzan/utils/fullfillImage';
import * as Helper from './helper';
import * as Constants from './constants';

export default class Cube extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subEntry: props.sub_entry,
      subEntryIndex: props.subEntryIndex, // 选中的魔方块对应下方的上传图片
      matrixData: this.getInitArray(props.width, props.height),
    };
  }

  getInitArray = (row, col) => {
    return fill(new Array(row), 0).map(() => fill(new Array(col), 0));
  };

  config = {
    record: false,
    pointStart: {},
    pointEnd: {},
  };

  componentWillReceiveProps(nextProps) {
    const subEntry = nextProps.sub_entry;
    const length = subEntry.length;
    if (length > 0) {
      this.setState({
        matrixData: Helper.initialCubeData(nextProps),
        subEntryIndex: nextProps.subEntryIndex,
      });
    } else {
      this.setState({
        matrixData: this.getInitArray(nextProps.width, nextProps.height),
        subEntryIndex: nextProps.subEntryIndex,
      });
    }
  }

  handleSureClick = () => {
    const { matrixData } = this.state;
    const subEntryData = Helper.addSubEntry(matrixData);
    const { sub_entry: subEntry, handleChangeCube } = this.props;
    forEach(subEntryData, item => {
      subEntry.push(item);
    });
    handleChangeCube(subEntry);
  };

  handleClick = (row, col) => {
    const config = this.config;
    if (config.record) {
      // 记录终点位置
      this.config = assign({}, config, { pointEnd: { row, col } }, { record: false });
      this.handleSureClick();
      return;
    }

    // 记录起始位置
    this.config = assign({}, config, {
      pointStart: { row, col },
      record: true,
    });
    this.renderActiveCube('choose', { row, col });
  };

  handleMouseOver = (row, col) => {
    const config = this.config;
    if (config.record) {
      this.renderActiveCube('hover', { row, col });
      this.config = assign({}, config, { pointEnd: { row, col } });
    }
  };

  /**
   * hover时重置矩阵
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  clearMatrix = data => {
    return data.map(item => {
      return item.map(value => {
        return value === 1 ? 0 : value;
      });
    });
  };

  /**
   * 矩阵绘图
   * @param  {[type]} type     [description]
   * @param  {[type]} pointEnd [description]
   * @return {[type]}          [description]
   */
  renderActiveCube = (type, pointEnd) => {
    let { matrixData } = this.state;
    const { pointStart } = this.config;

    // 计算可拖拽区域
    const minX = Math.min(pointStart.row, pointEnd.row);
    const maxX = Math.max(pointStart.row, pointEnd.row);
    const minY = Math.min(pointStart.col, pointEnd.col);
    const maxY = Math.max(pointStart.col, pointEnd.col);

    if (type === 'hover') {
      matrixData = this.clearMatrix(matrixData);
    }

    for (let i = minX; i <= maxX; i++) {
      for (let j = minY; j <= maxY; j++) {
        if (matrixData[i][j] !== 2) {
          if (type === 'hover') {
            matrixData[i][j] = matrixData[i][j] === 0 ? 1 : matrixData[i][j];
          } else {
            matrixData[i][j] = matrixData[i][j] === 1 ? 2 : 1;
          }
        } else {
          return;
        }
      }
    }

    this.setState({ matrixData });
  };

  /**
   * 鼠标离开cube区域时，去掉hover状态
   * @return {[type]} [description]
   */
  clearHoverMatrix = () => {
    const { matrixData } = this.state;
    const config = this.config;
    const newMatrix = matrixData.map(item => {
      return item.map(value => {
        if (value === 1) {
          return 0;
        }
        return value;
      });
    });

    this.config = assign({}, config, { record: false });
    this.setState({ matrixData: newMatrix });
  };

  render() {
    const { matrixData } = this.state;
    const { sub_entry: subEntry, width, show_method: showMethod } = this.props;
    const isCustom = showMethod === Constants.tempTypeMap.length - 1;
    const itemSize = (Constants.cubeWidth - (width + 1)) / width;
    const imageScale = Constants.cubeImageWidth / width;

    // 1行2个(showMethod = 0),1行3个(showMethod = 1),1行4个(showMethod = 2)模板下的图片宽高度 这三种情况下 图片高度根据第一张图片高度自适应
    const imageWidth = (Constants.cubeWidth - (showMethod + 3)) / (showMethod + 2);
    const imageHeight =
      subEntry.length > 0 && subEntry[0].image_id
        ? `${Math.floor((imageWidth / subEntry[0].image_width) * subEntry[0].image_height)}px`
        : `${Math.floor(imageWidth)}px`;
    const hasImageSubEntryOneRowTemp =
      subEntry.length > 0 && subEntry[0].image_id && showMethod <= 2;

    return (
      <div className="decorate-cube clearfix" onMouseLeave={this.clearHoverMatrix}>
        {map(matrixData, (item, rowIndex) => {
          return (
            <ul className="cube-row" key={rowIndex}>
              {map(item, (value, colIndex) => {
                return (
                  <li
                    onClick={value !== 2 ? this.handleClick.bind(this, rowIndex, colIndex) : null}
                    onMouseEnter={this.handleMouseOver.bind(this, rowIndex, colIndex)}
                    className={cx('cube-item', {
                      'item-selected': value === 2,
                      'item-selecting': value === 1,
                    })}
                    style={{
                      width: `${itemSize}px`,
                      height: hasImageSubEntryOneRowTemp ? imageHeight : `${itemSize}px`,
                    }}
                    key={`${rowIndex}-${colIndex}`}
                  >
                    {value === 0 && (
                      <span
                        style={{
                          lineHeight: hasImageSubEntryOneRowTemp ? imageHeight : `${itemSize}px`,
                        }}
                        className="plus-icon"
                      >
                        +
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          );
        })}
        {map(subEntry, (data, index) => {
          const subEntryItemWidth = `${data.width * itemSize + data.width - 1}px`;
          const subEntryItemHeight = `${data.height * itemSize + data.height - 1}px`;
          return (
            <div
              className={cx('cube-selected', {
                'cube-selected-click': this.state.subEntryIndex === index,
              })}
              key={index}
              onClick={() => this.props.handleChangeSubEntryIndex(index)}
              style={{
                width: subEntryItemWidth,
                height: hasImageSubEntryOneRowTemp ? imageHeight : subEntryItemHeight,
                top: `${data.y * itemSize + data.y}px`,
                left: `${data.x * itemSize + data.x}px`,
              }}
            >
              {data.image_id !== '' && (
                <img
                  src={fullfillImage(data.image_url)}
                  alt="cubeImage"
                  width={subEntryItemWidth}
                  height={hasImageSubEntryOneRowTemp ? imageHeight : subEntryItemHeight}
                />
              )}
              {data.image_id === '' &&
                (showMethod < 3 ? (
                  <div className="cube-selected-text">{`宽度${Math.round(
                    imageScale * data.width
                  )}像素`}</div>
                ) : (
                  <div className="cube-selected-text">
                    {`${Math.round(imageScale * data.width)}x${Math.round(
                      imageScale * data.height
                    )}${width >= 5 && data.width === 1 ? '' : '像素'}`}
                    {((showMethod >= 3 && showMethod < Constants.tempTypeMap.length - 1) ||
                      (isCustom &&
                        (width < 7 ||
                          (width === 7 && (data.width !== 1 || data.height !== 1))))) && (
                      <div>或同等比例</div>
                    )}
                  </div>
                ))}
              {isCustom && (
                <Icon
                  className="rc-design-editor-card-item-delete"
                  type="close-circle"
                  onClick={e => this.props.handleDeleteSubEntry(e)}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }
}
