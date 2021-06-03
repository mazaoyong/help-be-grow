// 左侧详情
import React, { useMemo } from 'react';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import { ShowWrapper } from 'fns/chain';
import { isEduHqStore } from '@youzan/utils-shop';
import store from '../../store';

import getCurClueId from '../../utils/get-cur-clueid';
import './style.scss';
import { SourceInfo as ActiveDetail } from '@ability-center/clue';
import { StudentCard, OtherStudentInfo, ApplicableSceneEnums, getAge } from '@ability-center/student';
import InfoTip from '@ability-center/student/info-tip';

// 处理年龄和生日的逻辑
function handleAge(items) {
  const birthDayConf = findIndex(items, { attributeKey: 'edu_stuBirth' });
  const ageConf = findIndex(items, { attributeKey: 'edu_stuAge' });

  if (birthDayConf > 0 && ageConf > 0) {
    const calcAge = getAge(get(items, `[${birthDayConf}].attributeValue`));
    if (calcAge) {
      items[ageConf].attributeValue = calcAge;
    }
  }
  return items;
}

const DetailPanel = () => {
  const clueId = getCurClueId();
  const storeState = store.useStoreState();
  const {
    attributes,
    source,
    createdAt,
    owners,
    revisitTime,
    ownerSchoolName,
    phase,
    identityNo,
    studentUpdateFlag,
    introducer,
  } = storeState;

  // 过滤头像，手机号和姓名
  const filtedAttributes = useMemo(() => {
    let ATTRS = attributes.filter(
      ({ attributeKey }) =>
        !['edu_stuAva', 'edu_stuName', 'edu_stuSex', 'edu_stuContractPhone'].includes(attributeKey)
    );

    // 处理生日和年龄
    ATTRS = handleAge(ATTRS);

    return ATTRS;
  }, [attributes]);

  if (!identityNo) return null;
  return (
    <aside className="clue-detail__panel">
      <StudentCard
        studentNo={identityNo}
        clueId={clueId}
        updatingSignal={studentUpdateFlag}
        applicableScene={ApplicableSceneEnums.CLUE_SCENE}
      >
        {() => {
          return (
            <>
              {filtedAttributes.length > 0 && (
                <>
                  {/* 微商城精简版不显示自定义资料项提示 */}
                  <ShowWrapper isInStoreCondition={isEduHqStore}>
                    <section className="clue-detail__panel__tip">
                      <InfoTip onRefresh={() => store.getAttributes(clueId)} />
                    </section>
                  </ShowWrapper>
                  {source && (
                    <>
                      <hr color="#EBEDF0" />
                      <section>
                        <ActiveDetail data={source} />
                      </section>
                    </>
                  )}
                </>
              )}
              <hr color="#EBEDF0" />
              <OtherStudentInfo
                phase={phase}
                revisitTime={revisitTime}
                createdAt={createdAt}
                ownerSchoolName={ownerSchoolName}
                owners={owners}
                introducer={introducer}
              />
            </>
          );
        }}
      </StudentCard>
    </aside>
  );
};

export default DetailPanel;
