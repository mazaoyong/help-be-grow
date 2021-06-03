import React from 'react';
import { LayoutRow as Row, LayoutCol as Col } from 'zent';
import { isNil, isArray } from 'lodash';
import { Cell } from './Cell';

import './style.scss';

interface Props {
  values: { [key: string]: any };
  keys: { [key: string]: any };
  tooltips?: { [key: string]: any };
  links?: { [key: string]: any };
  title?: string;
  cell?: typeof React.Component;
  divides?: number;
  className?: string;
  datasets?: any[];
}

const DIVIDES = {
  5: [5, 5, 4, 5, 5],
  7: [3, 3, 4, 4, 4, 3, 3],
};

function getPos(index, d) {
  if (index % d === 0) return 'top-left';
  if ((index + 1) % d === 0 && index + 1 >= d) return 'top-right';
  return 'top-center';
}

class DisplayBoard extends React.Component<Props> {
  public static defaultProps = {
    className: '',
    datasets: [],
    keys: {},
    values: {},
    links: {},
    tooltips: {},
  };

  constructor(props: Props) {
    super(props);
    this.state = { loading: false };
    this.calculate = this.calculate.bind(this);
    this.calculateWithTitle = this.calculateWithTitle.bind(this);
    this.getSafeValue = this.getSafeValue.bind(this);
    this.getDataSets = this.getDataSets.bind(this);
    this.renderCells = this.renderCells.bind(this);
  }

  private calculate(num: any) {
    if (this.props.divides) {
      return this.props.divides;
    }

    if (24 % num === 0) {
      return 24 / num;
    }

    return DIVIDES[num];
  }

  private calculateWithTitle() {
    const { keys } = this.props;
    const datasets = this.props.datasets as any[];
    const num = (datasets.length > 0 ? datasets.length : Object.keys(keys).length) + 1;

    if (24 % num === 0) {
      return 24 / num;
    }
    return DIVIDES[num][0];
  }

  private getSafeValue(value) {
    return isNil(value) ? '' : value;
  }

  private getDataSets() {
    const { tooltips, values, keys, links } = this.props;
    const datasets = this.props.datasets as any[];
    if (datasets.length > 0) {
      return datasets;
    }
    return Object.keys(keys).map(key => {
      return {
        key: keys[key],
        value: this.getSafeValue(values[key]),
        link: this.getSafeValue((links as any)[key]),
        tooltip: this.getSafeValue((tooltips as any)[key]),
      };
    });
  }

  private renderCells() {
    const cell = this.props.cell;

    const datasets = this.getDataSets() as any[];
    const Node = cell || Cell;
    const divides = this.calculate(datasets.length);
    const d = 24 / divides;
    return datasets.map((data, index) => {
      const position = getPos(index, d);
      return (
        <Node
          key={index}
          kvKey={data.key}
          kvValue={this.getSafeValue(data.value)}
          tooltip={this.getSafeValue(data.tooltip)}
          linkDestination={this.getSafeValue(data.link)}
          divideNum={isArray(divides) ? divides[index] : divides}
          position={position}
        />
      );
    });
  }

  public render() {
    const { title, className } = this.props;

    return (
      <div className={`zent-display-board__root ${className}`}>
        {title ? (
          <Row className="zent-display-board--title">
            <Col className="zent-display-board__title" span={this.calculateWithTitle()} />
            <Col span={24 - this.calculateWithTitle()}>
              <Row className="zent-display-board__cells">{this.renderCells()}</Row>
            </Col>
          </Row>
        ) : (
          <Row className="zent-display-board__cells">{this.renderCells()}</Row>
        )}
      </div>
    );
  }
}

export { DisplayBoard };
