import React, { FC, useMemo } from 'react';
import { Card } from 'zent';
import cx from 'classnames';
import get from 'lodash/get';
import { Operations } from '@youzan/react-components';
import '@youzan/react-components/es/components/operations/style/index.css';

import { isOperatorUnits, IOperatorUnit, CardItemPropsType, IColorSchema } from './types';
import CardHeader from './components/CardHeader';
import CardContent from './components/CardContent';
import 'zent/css/card.css';
import './styles.scss';

const defaultColorSchema: IColorSchema = {
  primaryColor: '#323233',
  secondaryColor: '#646566',
  interactionColor: '#155BD4',
  descriptionColor: '#969799',
  contentColor: '#323233',
};
const CardItem: FC<CardItemPropsType> = (props) => {
  const {
    rowData,
    className,
    headerClassName,
    contentGroup,
    renderContent,
    contentClassName,
    title = 'title',
    renderTitle,
    subtitle = 'subtitle',
    renderSubtitle,
    operators,
    renderOperators,
    colorSchema: passiveColorSchema,
    headerSplitRatio,
    border = true,
  } = props;
  const hasContent = (contentGroup && contentGroup.length) || renderContent !== undefined;
  const containerCls = useMemo(
    () =>
      cx(className, 'card-item-container', !hasContent && 'no-card-body', !border && 'no-border'),
    [border, className, hasContent]
  );
  const headerCls = useMemo(() => cx(headerClassName, 'card-item-header'), [headerClassName]);
  const contentCls = useMemo(() => cx(contentClassName, 'card-item-content'), [contentClassName]);

  const [TITLE, SUBTITLE] = useMemo(() => {
    const titleNode = get(rowData, title || '', null);
    const subtitleNode = get(rowData, subtitle || '', null);
    const titleRender = renderTitle;
    const subtitleRender = renderSubtitle;

    return [
      titleRender ? titleRender(rowData) : titleNode,
      subtitleRender ? subtitleRender(rowData) : subtitleNode,
    ];
  }, [title, renderTitle, subtitle, renderSubtitle, rowData]);

  const OPERATOR_LIST = useMemo(() => {
    if (!Array.isArray(operators)) {
      const operatorArray = [operators];
      if (isOperatorUnits(operatorArray)) {
        const label = get(operatorArray, '[0].label');
        const callback = get(operatorArray, '[0].callback');
        return [<OperatorUnit key={label} label={label} callback={callback} />];
      }
      return operatorArray;
    }
    if (isOperatorUnits(operators)) {
      return operators.map((operator) => {
        const { label, callback } = operator;
        return <OperatorUnit key={label} label={label} callback={callback} />;
      });
    }
    return operators;
  }, [operators]);

  const colorSchema = React.useMemo<IColorSchema>(
    () => ({
      ...defaultColorSchema,
      ...passiveColorSchema,
    }),
    [passiveColorSchema]
  );

  const OPERATORS = useMemo(() => {
    if (renderOperators) {
      return renderOperators(rowData);
    }
    if (!operators || (Array.isArray(operators) && operators.length === 0)) {
      return null;
    }
    return (
      <div style={{ color: colorSchema.interactionColor }}>
        <Operations items={OPERATOR_LIST} />
      </div>
    );
  }, [OPERATOR_LIST, colorSchema.interactionColor, operators, renderOperators, rowData]);

  return (
    <div className={containerCls}>
      <Card
        className="card-item-zent-card"
        title={
          <CardHeader
            title={TITLE}
            subtitle={SUBTITLE}
            headerClassName={headerCls}
            colorSchema={{
              primaryColor: colorSchema.primaryColor,
              secondaryColor: colorSchema.secondaryColor,
            }}
            operators={OPERATORS}
            ratio={headerSplitRatio}
          />
        }
      >
        {hasContent ? (
          <CardContent
            className={contentCls}
            contentGroup={contentGroup}
            rowData={rowData}
            colorSchema={{
              contentColor: colorSchema.contentColor,
              descriptionColor: colorSchema.descriptionColor,
            }}
            renderContent={renderContent}
          />
        ) : null}
      </Card>
    </div>
  );
};

export default CardItem;
export * from './types';

const OperatorUnit: FC<IOperatorUnit<any>> = (props) => {
  const { label, callback } = props;
  return <span onClick={callback}>{label}</span>;
};
