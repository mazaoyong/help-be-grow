import { React, FC, createComponent } from '@youzan/tany-react';
import { Button } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';

interface IConfirmButton {
  isAuthorized: boolean;
  rigName?: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const ConfirmButton: FC<IConfirmButton> = (props) => {
  const { children, isAuthorized, rigName, onClick, loading, disabled } = props;

  return isAuthorized ? (
    <Button loading={loading} type="primary" disabled={disabled} onClick={onClick}>
      {children}
    </Button>
  ) : (
    <SamButton
      name={rigName}
      type="primary"
      onClick={onClick}
      loading={loading}
      disabled={disabled}
    >
      {children}
    </SamButton>
  );
};

export default createComponent(ConfirmButton);
