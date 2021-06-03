import React from 'react';
import { AuditStatus } from '../../definitions';
import BtnJoin from './BtnJoin';

interface Props {
  status: AuditStatus;
  applyLoading: boolean;
  ServiceLink: string;
  handleApply: () => void;
}

const Btn: React.StatelessComponent<Props> = ({
  applyLoading,
  handleApply,
  ServiceLink,
}) => {
  return <BtnJoin ServiceLink={ServiceLink} handleApply={handleApply} applyLoading={applyLoading} />;
};

export default Btn;
