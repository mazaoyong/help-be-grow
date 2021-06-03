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
            desc="可一站式发布课程售卖、在线营销、管理线索、教务、学员、资产数据等，进行商业变现、教学服务、品牌传播等。"
            submitText="开通店铺"
            onClick={() => {
              window.location = '#/createsingle';
            }}
          />
          <Card
            title="连锁版"
            subTitle="适用直营、加盟等连锁教育机构"
            desc="总部可根据经营模式灵活配置校区管理方式， 教务、学员服务可交由单校区独立管理，总部可管控资金、课程、商品、查看经营数据等。"
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
