import { DatePicker, DateRangePicker, Pop } from '@zent/compat';
import React, { useState } from 'react';
import { Checkbox, Radio, RadioGroup, NumberInput, Icon, Grid, IGridColumn } from 'zent';
import { Upload, Richtext } from '@youzan/react-components';
import { ExamPublishType, ExamValidityType, ExamLimitType } from '../../../types';
import { UEDITOR_TOOLBARS_S } from '../../../../../../constants/ueditor-toolbars';
import { getPctGoodsText } from '../../../utils';
import { EduGoodsSelector } from '@youzan/ebiz-components';
import CommonLink from 'components/common-link';
const { GoodsSelector } = EduGoodsSelector;

const { v4, cdnStatic } = _global.url;

export interface IPubConfigData {
  type: ExamPublishType;
  time?: string;
}

export interface IValidConfigData {
  type: ExamValidityType;
  rangeTime?: string[];
}

export interface ITimesConfigData {
  type: ExamLimitType;
  times?: number;
}

// 封面
export const CoverImage = ({ value, onChange }) => {
  const onUploadSuccess = (data) => {
    if (data.length === 0) return;
    // eslint-disable-next-line camelcase
    const { attachment_url, attachment_id, width, height } = data[0];
    const picData = {
      coverUrl: attachment_url,
      picWidth: width,
      picHeight: height,
      // eslint-disable-next-line camelcase
      picId: +attachment_id,
    };
    onChange(picData);
  };
  const handleItemDelete = () => {
    onChange('');
  };
  return value ? (
    <div className="image-sortable__item">
      <img src={value.coverUrl} />
      <a className="close-modal small" onClick={() => handleItemDelete()}>
        ×
      </a>
    </div>
  ) : (
    <Upload
      materials={true}
      type="image"
      tokenUrl={`${window._global.url.v4}/api/iron/materials/shopPubImgUploadToken.json`}
      maxAmount={1}
      kdtId={window._global.kdtId}
      onSuccess={onUploadSuccess}
      className="model-select-upload"
    />
  );
};

// 富文本
export const RichTextField = ({ value, onChange }) => {
  return (
    <Richtext
      value={value}
      onChange={(v) => {
        onChange(v);
      }}
      ueditorUrl={`${cdnStatic}/v2/vendor/ueditor/release/ueditor.all.min.202002232235.js`}
      uploadConfig={{
        maxSize: 3 * 1024 * 1024,
        fetchUrl: `${v4}/api/iron/materials/shopPubImg.json`,
        tokenUrl: `${v4}/api/iron/materials/shopPubImgUploadToken.json`,
      }}
      editorConfig={{
        wordCount: false,
        fetchImgUrl: `${v4}/api/iron/materials/shopPubImg.json`,
        toolbars: UEDITOR_TOOLBARS_S,
        initialFrameWidth: 680,
      }}
    />
  );
};

const pageSize = 10;
// 关联课程
export const RelatedCourse = ({ value, onChange }) => {
  const { open, data = [] } = value;
  const [current, setCurrent] = useState(1);
  const pageInfo = {
    current,
    total: data.length,
    pageSize,
  };
  const dataSets = data.slice((current - 1) * pageSize, current * pageSize);
  const onGridChange = (conf) => {
    setCurrent(conf.current);
  };
  const onConfirm = (goodsList) => {
    const list = goodsList.value;
    onChange({
      ...value,
      data: list.map((item) => ({
        alias: item.goodsAlias || item.alias,
        title: item.goodsName || item.title,
        type: item.owlItemType || item.type,
        goodsId: item.goodsId,
      })),
    });
  };
  const removeItem = (alias) => {
    const index = data.findIndex((item) => item.alias === alias);
    if (index > -1) {
      data.splice(index, 1);
      onChange({
        ...value,
        data: [...data],
      });
    }
  };
  const columns: IGridColumn[] = [
    {
      name: 'title',
      title: '课程名称',
      width: 200,
    },
    {
      title: '课程类型',
      width: 120,
      bodyRender: (data) => {
        return getPctGoodsText(data.type);
      },
    },
    {
      title: '操作',
      width: 120,
      textAlign: 'right',
      bodyRender: (data) => {
        return <a onClick={() => removeItem(data.alias)}>删除</a>;
      },
    },
  ];
  return (
    <div className="related-course">
      <Checkbox checked={open} onChange={(e) => onChange({ ...value, open: e.target.checked })}>
        开启
      </Checkbox>
      {open && (
        <GoodsSelector
          selected={{ type: 'part', value: data }}
          selectTypes={['part']}
          btnText="添加课程"
          onConfirm={onConfirm}
          showSoldOut={true}
          showGroupColumn={false}
          showJoinActivityColumn={false}
          maxGoodsNum={50}
          mapGoodsValue={(item) => {
            if (item.goodsPrice === 0 || item.isFree) {
              item.optional = false;
              item.notOptionalReason.push('0元和免费商品不可选');
            }
          }}
        />
      )}
      {open && data && data.length > 0 && (
        <Grid
          datasets={dataSets}
          columns={columns}
          paginationType="lite"
          pageInfo={pageInfo}
          onChange={onGridChange}
        />
      )}
    </div>
  );
};

// 信息采集开启
interface IInfoCollectOpenProps {
  value: boolean;
  onChange: any;
  disabled?: boolean;
  needBuy?: boolean;
  available?: boolean;
}
export const InfoCollectOpen = (props: IInfoCollectOpenProps) => {
  const { value, onChange, disabled } = props;
  const showNeedBuy = React.useMemo(() => {
    if (props.available) return false;
    return props.needBuy || false;
  }, [props.available, props.needBuy]);

  return (
    <div className="info-collect">
      <Checkbox
        disabled={disabled || false}
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      >
        开启
      </Checkbox>
      {showNeedBuy && (
        <p className="intro-order zent-form__help-desc">
          <span>用户购买课程时可填写手机号、微信号等信息，用户不再失联</span>
          <CommonLink
            target="__blank"
            href={`${_global.url.v4}/subscribe/appmarket/appdesc/board?id=40832`}
          >
            了解详情
          </CommonLink>
        </p>
      )}
    </div>
  );
};

// 发布配置
export const PubConfig = ({
  value,
  onChange,
}: {
  value: IPubConfigData;
  onChange: (val: IPubConfigData) => void;
}) => {
  const { type, time } = value;
  return (
    <RadioGroup
      value={type}
      onChange={(e) => onChange({ ...value, type: e.target.value || ExamPublishType.PUBLISH })}
    >
      <div className="radio-item">
        <Radio value={ExamPublishType.PUBLISH}>立即发布</Radio>
      </div>
      <div className="radio-item">
        <Radio value={ExamPublishType.TIMER}>定时发布</Radio>
        {type === ExamPublishType.TIMER && (
          <DatePicker
            showTime
            value={time}
            format="YYYY-MM-DD HH:mm:ss"
            // valueType="number"
            min={new Date()}
            onChange={(e) => {
              onChange({ ...value, time: e.toString() });
            }}
          />
        )}
      </div>
      <div className="radio-item">
        <Radio value={ExamPublishType.REVOKE}>暂不发布</Radio>
      </div>
    </RadioGroup>
  );
};

// 有效期配置
export const ValidConfig = ({
  value,
  onChange,
}: {
  value: IValidConfigData;
  onChange: (val: IValidConfigData) => void;
}) => {
  const { type, rangeTime } = value;
  return (
    <RadioGroup
      value={type}
      onChange={(e) => onChange({ ...value, type: e.target.value || ExamValidityType.FOREVER })}
    >
      <Radio value={ExamValidityType.FOREVER}>长期有效</Radio>
      <Radio value={ExamValidityType.TIME_LIMIT}>限时有效</Radio>
      {type === ExamValidityType.TIME_LIMIT && (
        <DateRangePicker
          showTime
          min={new Date()}
          className="vertical-middle"
          format="YYYY-MM-DD HH:mm:ss"
          value={rangeTime as any}
          onChange={(e) => {
            // @ts-ignore
            onChange({ ...value, rangeTime: e });
          }}
        />
      )}
    </RadioGroup>
  );
};

// 时长配置
export const DurationConfig = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) => {
  return (
    <div className="duration-field">
      <NumberInput
        value={value}
        onChange={(e) => onChange(+(e || 0))}
        showStepper
        integer
        min={0}
        max={1440}
        placeholder="0表示无限制"
      />
      <div className="duration-text">分钟</div>
    </div>
  );
};

// 考试次数配置
export const TimesConfig = ({
  value,
  onChange,
}: {
  value: ITimesConfigData;
  onChange: (val: ITimesConfigData) => void;
}) => {
  const { type, times } = value;
  return (
    <RadioGroup
      className="times-config-group"
      value={type}
      onChange={(e) => onChange({ ...value, type: e.target.value || ExamLimitType.LIMIT })}
    >
      <Radio value={ExamLimitType.LIMIT}>每人限考</Radio>
      {type === ExamLimitType.LIMIT && (
        <div className="times-config-input">
          <NumberInput
            value={times}
            onChange={(e) => onChange({ ...value, times: +(e || 1) })}
            showStepper
            integer
            min={1}
            max={99}
          />
          <div className="times-config-text">次</div>
        </div>
      )}
      <Radio value={ExamLimitType.NO_LIMIT}>不限</Radio>
    </RadioGroup>
  );
};

// 重考间隔
export const ReExamInterval = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number | null) => void;
}) => {
  return (
    <div className="reexam-interval-field">
      <NumberInput
        placeholder="0小时，表示不限制"
        min={0}
        max={8760.99}
        decimal={2}
        value={value}
        onChange={(val) => onChange(val != null && val.length > 0 ? +val : null)}
      />
      <span>小时</span>
      <Pop
        trigger="hover"
        content="重考时间间隔：完成批阅后开始计时，计时结束后才可再次考试"
        position="bottom-center"
      >
        <Icon type="error-circle" />
      </Pop>
    </div>
  );
};
