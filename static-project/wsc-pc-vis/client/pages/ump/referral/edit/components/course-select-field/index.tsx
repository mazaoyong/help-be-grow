import React, { FC, useCallback, useMemo } from 'react';
import { IGridColumn, Grid, ClampLines } from 'zent';
import buildUrl from '@youzan/utils/url/buildUrl';
import { Img } from '@youzan/ebiz-components';
import { CHANNELS } from '@youzan/react-components/es/components/goods-selector/constant';
import NewGoodsSelector from 'components/good-selector';
import fen2yuan from 'fns/fen2yuan';

import './styles.scss';

interface ICourseSelectFieldProps {
  value: any;
  disabled: boolean;
  onChange: (data: any) => void;
}

const { ImgWrap } = Img;

const RECOMMEND_POLITE = 6; // 推荐有奖活动id

const CourseSelectField: FC<ICourseSelectFieldProps> = ({ value, disabled, onChange }) => {
  const handleChange = useCallback(
    (data: any) => {
      onChange(data);
    },
    [onChange],
  );

  const onDelete = useCallback(() => {
    handleChange({});
  }, [handleChange]);

  const columns: IGridColumn[] = useMemo(
    () => [
      {
        title: '课程',
        width: '240px',
        bodyRender: (data) => {
          const { pictures } = data;
          const imgUrl = ((pictures || []).length && pictures[0].url) || '';
          return (
            <div className="goods-field-course">
              <ImgWrap src={imgUrl} width="106px" height="60px" />
              <div className="goods-field-title">
                <a
                  href={buildUrl(
                    `https://h5.youzan.com/v2/goods/${data.alias}?fromStore=true`,
                    '',
                    _global.kdtId,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ClampLines
                    popWidth={350}
                    lines={2}
                    text={data.title}
                  />
                </a>
              </div>
            </div>
          );
        },
      },
      {
        title: '金额（元）',
        textAlign: 'right',
        bodyRender: (data) => {
          return fen2yuan(data.price);
        },
      },
      {
        title: '参与规格',
        textAlign: 'left',
        bodyRender: (data) => {
          return data.skuSize ?? '-';
        },
      },
      {
        title: '操作',
        textAlign: 'right',
        bodyRender: () => {
          return disabled ? '-' : <a onClick={onDelete}>删除</a>;
        },
      },
    ],
    [disabled, onDelete],
  );

  const customChannels = useMemo(() => {
    const customManageUrl = `${_global.url.v4}/vis/edu/course#/course-manage/list`;
    return [
      {
        ...CHANNELS[0],
        manageURL: {
          wsc: customManageUrl,
          retail: customManageUrl,
        },
      },
      ...CHANNELS.slice(1),
    ];
  }, []);

  let ignoreGroup = {};
  if (!window._global.isYZEdu) {
    ignoreGroup = {
      online: {
        value: [10],
      },
    };
  }

  return (
    <div className="goods-field-wrapper">
      {!disabled && (
        <NewGoodsSelector
          singleMode={true}
          hasSku={false}
          eduDetailGroup={true}
          activityType={RECOMMEND_POLITE}
          onChange={handleChange}
          btnTxt={value.alias ? '修改已选课程' : '选择课程'}
          dialogClassName="referral-goods-selector-dialog"
          ignoreGroup={ignoreGroup}
          selected={value || {}}
          channels={['online']}
          customChannels={customChannels}
        />
      )}
      {value.alias && <Grid datasets={[value]} columns={columns} />}
    </div>
  );
};

export default CourseSelectField;
