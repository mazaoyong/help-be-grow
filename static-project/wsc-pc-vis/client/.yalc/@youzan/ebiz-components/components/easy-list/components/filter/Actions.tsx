import React from 'react';
import { Button, IButtonProps } from 'zent';

import { IRenderPropsType, IFilterProps, ActionCustomNodeType } from '../../types/filter';

export const Actions: React.FC<
  {
    filter: IRenderPropsType;
  } & IFilterProps['actionsOption']
> = ({ filter, isLink = false, beforeReset, afterReset }) => {
  const { submit, reset } = filter;
  const RESET_BUTTON_PROPS: IButtonProps = React.useMemo(
    () =>
      isLink
        ? {
            bordered: false,
            outline: true,
          }
        : {
            bordered: false,
            outline: true,
          },
    [isLink]
  );

  const lambdaRenderNode = React.useCallback(
    (alternativeNode: ActionCustomNodeType): React.ReactNode => {
      if (!alternativeNode) return null;
      /* istanbul ignore next */
      const Node =
        typeof alternativeNode === 'function' ? alternativeNode(filter) : alternativeNode;
      return <div className="custom-btn">{Node}</div>;
    },
    [filter]
  );

  return (
    <div data-testid="easy-filter-actions" className="easy-filter__actions action-container">
      <div className="easy-filter__actions btn-group">
        <div className="preset-btn">
          <Button role="submit" loading={filter.getLoading()} type="primary" onClick={submit}>
            筛选
          </Button>
        </div>
      </div>
      <div className="easy-filter__actions link-group">
        {lambdaRenderNode(beforeReset)}
        <div className="preset-btn">
          <Button
            {...RESET_BUTTON_PROPS}
            role="reset"
            className="link-btn"
            type="primary"
            onClick={reset}
          >
            重置筛选条件
          </Button>
        </div>
        {lambdaRenderNode(afterReset)}
      </div>
    </div>
  );
};
