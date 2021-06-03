import React from 'react';
import Card from './components/card';
import PageWrapper from '../../components/page-wrapper';
import './style.scss';

export default function() {
  return (
    <PageWrapper step={1}>
      <div className="select">
        <div className="card-container">
          <Card
            title="单体版"
            subTitle="适用知识付费、单体教育培训机构"
            desc="用1个店铺来管理经营场景"
            submitText="开通店铺"
            onClick={() => {
              window.location = '#/createsingle';
            }}
          />
          <Card
            title="连锁版"
            subTitle="适用直营、加盟等连锁教育机构"
            desc="用1个总部来管理下属多个校区"
            submitText="开通店铺"
            onClick={() => {
              window.location = '#/createchain';
            }}
          />
        </div>
      </div>
    </PageWrapper>
  );
}
