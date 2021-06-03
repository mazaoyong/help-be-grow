import React from 'react';
import {
  IEditParams,
  IModifyParams,
  ICreatedParams,
  getQuestionEditUrl,
  getClassifyManageUrl,
  getQustionBankImportUrl,
} from '../../../pages/supv/question-bank/utils/navigators';
import CommonLink, { IBaseCommonLinkProps } from 'components/common-link';

interface IBaseLinkProps<Q> {
  queries: Q;
  linkProps?: IBaseCommonLinkProps;
}

const QuestionEditLink: React.FC<IBaseLinkProps<IEditParams>> = (props) => {
  const { queries, linkProps } = props;

  return (
    <CommonLink url={getQuestionEditUrl(queries)} {...linkProps}>
      {props.children}
    </CommonLink>
  );
};

const ClassifyManageLink: React.FC<IBaseLinkProps<undefined>> = (props) => {
  const { linkProps } = props;

  return (
    <CommonLink url={getClassifyManageUrl()} {...linkProps}>
      {props.children}
    </CommonLink>
  );
};

const QustionBankImportLink: React.FC<IBaseLinkProps<undefined>> = (props) => {
  const { linkProps } = props;

  return (
    <CommonLink url={getQustionBankImportUrl()} {...linkProps}>
      {props.children}
    </CommonLink>
  );
};

export {
  QuestionEditLink,
  getQuestionEditUrl,
  ClassifyManageLink,
  getClassifyManageUrl,
  QustionBankImportLink,
  getQustionBankImportUrl,
};
export type { IEditParams, IModifyParams, ICreatedParams };
