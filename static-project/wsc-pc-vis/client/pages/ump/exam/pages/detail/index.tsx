import React, { FC } from 'react';
import FilterList from './table';
import { withRouter, WithRouterProps } from 'react-router';

const Detail: FC<WithRouterProps> = props => {
  const { id: examId } = props.params;

  return (
    <FilterList examId={examId} />
  );
};

export default withRouter(Detail);
