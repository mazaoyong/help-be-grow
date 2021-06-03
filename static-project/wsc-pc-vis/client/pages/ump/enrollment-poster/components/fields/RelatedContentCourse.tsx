import { Pop } from '@zent/compat';
import React, { useMemo, useCallback, useEffect } from 'react';
import { Radio, Grid, IGridColumn, FormError } from 'zent';
import GoodsSelector from 'components/good-selector';
import { useStoreRelatedContent, useStoreByValidFlag } from '../../store';
import { RELATED_TYPE } from '../../contants';
import { fullfillImage, url as ZanUrl } from '@youzan/utils';
import { pick } from 'lodash';

const styleNamePrefix = 'related-content-course';
interface IRelatedContentCourseProps {
  onRadioChange: (e: any) => void;
}

const getGoodsListSelectedData = data => ({
  online: {
    type: 'part',
    value: [data],
  },
});

export default function RelatedContentCourse(props: IRelatedContentCourseProps) {
  const { onRadioChange } = props;
  const [formData, dispatch] = useStoreRelatedContent();
  const [isValid, setValid] = useStoreByValidFlag('relatedSelect');
  const { relatedType, course = null, resourceAlias = '' } = formData;

  const hasCourse = course !== null;
  useEffect(() => {
    if (hasCourse) {
      setValid(true);
    }
  }, [hasCourse, setValid]);

  const handleCourseChange = data => {
    const { url } = data;
    dispatch(
      'course',
      pick(data, ['url', 'title', 'pictures', 'alias', 'id', 'price']),
      ZanUrl.args.add(url, { resourceAlias }),
    );
  };
  const removeChoosed = useCallback(() => {
    dispatch('course', null, '');
  }, [dispatch]);
  const choosedColumn = useMemo<IGridColumn[]>(() => {
    return [
      {
        title: '课程',
        width: '230px',
        nowrap: true,
        textAlign: 'left',
        bodyRender: ({ pictures, title, url }) => {
          return (
            <div className={`${styleNamePrefix}__grid-cell`}>
              <img src={fullfillImage(pictures[0].url, '!50x50.jpg')} />
              <Pop trigger="hover" content={title}>
                <div className={`${styleNamePrefix}__grid-title`}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {title}
                  </a>
                </div>
              </Pop>
            </div>
          );
        },
      },
      {
        title: '金额（元）',
        width: '100px',
        nowrap: true,
        textAlign: 'right',
        bodyRender: ({ price }) => {
          return parseInt(price) / 100;
        },
      },
      {
        title: '操作',
        width: '60px',
        textAlign: 'right',
        bodyRender: () => {
          return (
            <a
              href="javascript:;"
              onClick={() => {
                removeChoosed();
              }}
            >
              删除
            </a>
          );
        },
      },
    ];
  }, [removeChoosed]);
  return (
    <>
      <Radio onChange={onRadioChange} checked={relatedType === RELATED_TYPE.COURSE}>
        课程
      </Radio>
      {relatedType === RELATED_TYPE.COURSE ? (
        <div
          className={`${styleNamePrefix} left-tab`}
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <GoodsSelector
            isOnlyEdu={true}
            singleMode={true}
            eduDetailGroup={true}
            hasSku={false}
            dialogClassName="poster-goods-selector"
            btnTxt={course ? '重新选择' : '选择课程'}
            selected={getGoodsListSelectedData(course)}
            onChange={handleCourseChange}
          />
          {course && (
            <Grid
              className={`${styleNamePrefix}__grid`}
              datasets={[course]}
              columns={choosedColumn}
              ellipsis={true}
              rowKey="alias"
            />
          )}
          {!isValid && <FormError>请选择课程</FormError>}
          <div className="desc-info">选择体验课、正式课、线上课商品，引导学员直接报名</div>
        </div>
      ) : (
        <br />
      )}
    </>
  );
}
