import { Pop } from '@zent/compat';
import React, { FC } from 'react';
import { Icon, PopEllipsisText } from '@youzan/ebiz-components';
import { Divider } from '../student-card';

const MemberList: FC<{ members: Record<string, any>[] }> = ({ members }) => {
  if (members && !members.length) {
    return null;
  }
  return (
    <Divider className="student-detail__contractList">
      {members.map((member, index) => {
        const { roleName, wxFans, memberName = '', userId } = member;
        return (
          <div key={index} className="student-card__content-line">
            <label>{roleName || '创建人'}</label>
            <div className="primary">
              <a
                className="rolename"
                href={`/v4/scrm/customer/manage#/detail?yzUid=${userId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <PopEllipsisText text={memberName} count={5} />
              </a>
              <Pop
                trigger="hover"
                position="top-center"
                content={wxFans ? '家长已关注公众号' : '家长未关注公众号'}
              >
                <span>
                  <Icon
                    type="wechat"
                    color={wxFans ? '#13BA08' : '#DCDEE0'}
                    size="18px"
                    className="wxFans"
                  ></Icon>
                </span>
              </Pop>
            </div>
          </div>
        );
      })}
    </Divider>
  );
};

export default MemberList;
