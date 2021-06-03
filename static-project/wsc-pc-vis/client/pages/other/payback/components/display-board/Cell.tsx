import { Pop } from '@zent/compat';
import React from 'react';
import { LayoutRow as Row, LayoutCol as Col, Icon } from 'zent';

interface Props {
  kvKey: any;
  kvValue: any;
  divideNum: number;
  tooltip?: any;
  topRowClassName?: string;
  bottomRowClassName?: string;
  tooltipClassName?: string;
  linkDestination?: string;
  position?: string;
}

const Cell: React.SFC<Props> = ({
  kvKey,
  kvValue,
  divideNum,
  linkDestination,
  tooltip,
  position = 'top-center',
}) => {
  const content = <span className="zent-kvpair__tooltip">{tooltip}</span>;
  return (
    <Col span={divideNum} className="zent-kvpair__root">
      <div className="zent-kvpair__content">
        <Row className="zent-kvpair__top">
          <span>{kvKey}</span>
          {tooltip && (
            <Pop
              trigger="hover"
              position={position as any}
              centerArrow={true}
              content={content}
              wrapperClassName="zent-kvpair__tooltip-trigger"
            >
              <Icon type="help-circle" />
            </Pop>
          )}
        </Row>
        <Row className="zent-kvpair__bottom">
          {linkDestination ? (
            <a href={linkDestination} className="zent-kvpair__link">
              <span>{kvValue}</span>
            </a>
          ) : (
            <span>{kvValue}</span>
          )}
        </Row>
      </div>
    </Col>
  );
};

export { Cell };
