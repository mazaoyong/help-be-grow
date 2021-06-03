import React from 'react';
import { Button, Icon } from 'zent';

import { ICollapseButtonRef } from '../../types/filter';

interface ICollapseButtonProps {
  labels?: [string, string];
  defaultValue: boolean;
  onChange(state: boolean): void;
}

const DEFAULT_LABELS = ['收起', '展开'];
export const CollapseButton = React.forwardRef<ICollapseButtonRef, ICollapseButtonProps>(
  function CollapseButtonInner(props, ref) {
    const { labels = DEFAULT_LABELS, defaultValue, onChange } = props;
    const [expandLabel, collapseLabel] = labels;
    const [value, setValue] = React.useState(defaultValue);
    const handleChangeState = React.useCallback(() => {
      setValue((prev) => !prev);
    }, []);

    React.useImperativeHandle(ref, () => ({
      toggleState(state) {
        setValue(state === 'expand');
      },
    }));

    /**
     * 需要将onChange的回调的调用放在这里，否则会产生一个warning
     * github issue链接：
     * @see https://github.com/facebook/react/issues/18178#issuecomment-592662192
     * 为什么react禁止在渲染过程中被其他组件更新state:
     * @see https://reactjs.org/blog/2020/02/26/react-v16.13.0.html#warnings-for-some-updates-during-render
     */
    React.useEffect(() => {
      onChange(value);
    }, [onChange, value]);
    return (
      <Button
        outline
        bordered={false}
        className="collapse-trigger"
        onClick={handleChangeState}
        type="primary"
      >
        {value ? expandLabel : collapseLabel}
        <Icon style={{ margin: '0 4px' }} type={value ? 'up' : 'down'} />
      </Button>
    );
  }
);
