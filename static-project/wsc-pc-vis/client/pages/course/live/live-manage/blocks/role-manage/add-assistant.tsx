import { Pop } from '@zent/compat';
import React from 'react';
import { Button } from 'zent';

interface IAddAssistantProps {
  disabled: boolean;
  disabledContent: React.ReactNode;
  loading: boolean;
  actionName?: string;
  onAdd(): void;
}

const AddAssistant: React.FC<IAddAssistantProps> = ({
  onAdd,
  disabled,
  disabledContent,
  loading,
  actionName = '助教'
}) => {
  const handleClick = React.useCallback(() => {
    onAdd && onAdd();
  }, [onAdd]);

  if (disabled) {
    return (
      <Pop trigger="hover" content={disabledContent}>
        <Button
          disabled
          outline={false}
          bordered={false}
          icon="plus-circle"
          className="live-manage__roleManage add-assistant"
        >
          <span>添加{actionName}</span>
        </Button>
      </Pop>
    );
  }

  return (
    <Button
      outline={false}
      bordered={false}
      loading={loading}
      onClick={handleClick}
      icon="plus-circle"
      className="live-manage__roleManage add-assistant"
    >
      <span>添加{actionName}</span>
    </Button>
  );
};

export default AddAssistant;
