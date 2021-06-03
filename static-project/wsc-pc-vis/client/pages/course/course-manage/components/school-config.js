import { Pop } from '@zent/compat';
import React, { useState } from 'react';
import { Tag, Icon, Radio, Dialog, Button, Checkbox, Notify, Alert } from 'zent';
import ShortcutPop from '../components/course-table/components/shortcut-pop';
import { setBatchSetSellStatus } from '../../api/course-manage';
import { Icon as EbizIcon } from '@youzan/ebiz-components';
import { SELL_STATUS } from '../constants';
const RadioGroup = Radio.Group;
const { openDialog, closeDialog } = Dialog;

export const defaultOptions = {
  keyword: '',
  status: ''
};

export const options = [
  {
    type: 'Input',
    name: 'keyword',
    label: '校区名称：',
    props: {
      placeholder: ''
    }
  },
  {
    type: 'Select',
    name: 'status',
    label: '出售状态：',
    data: [
      {
        value: '',
        text: '全部'
      },
      {
        value: 0,
        text: '出售中'
      },
      {
        value: -1,
        text: '已停售'
      },
      {
        value: 1,
        text: '已售罄'
      }
    ]
  }
];

export const columns = ({ onDialogChecked, dialogCheck, submitQuickEdit, isClassCourse, refresh, skuSize }) => [
  {
    title: '校区',
    bodyRender({ name, lifecycleStatus }) {
      return <div className="config-school-name">
        <span>{name}</span>
        {lifecycleStatus === 'close' && <Tag className="shop-status-tag" disabled >打烊</Tag>}
      </div>;
    }
  },
  {
    title: '名额',
    bodyRender({ alias, price, kdtId = null, totalStock, operateCampusStock = false }, { row }) {
      const hasPrivilege = operateCampusStock && !isClassCourse;
      const tipContent = (hasPrivilege, isClassCourse) => {
        if (hasPrivilege) return null;
        else if (isClassCourse) {
          return <Alert type="warning">
            <span className="sku-config-tips">只能在班级里修改名额，<a style={{
              color: '#38F' }} href={`https://www.youzan.com/v4/vis/edu/page/educlass#/list`}>去设置</a></span>
          </Alert>;
        } else {
          return <Alert type="warning">
            <span>总部不能修改该校区的招生名额，<a style={{ color: '#38F' }} href={`/v4/shop/select-store?hqKdtId=${window._global.kdtId}&redirect=`}>切换校区</a></span>
          </Alert>;
        }
      };
      return <div className="config-school-stocknum">
        <span>{totalStock}</span>
        <Pop
          trigger="click"
          position="bottom-left"
          wrapperClassName="shortcut-pop"
          centerArrow
          // onShow={ctx.toggleShowEditIcon.bind(ctx, `stock${row}`, 'visible')}
          // onClose={ctx.toggleShowEditIcon.bind(ctx, `stock${row}`)}
          content={
            <>
              {tipContent(hasPrivilege, isClassCourse)}
              <ShortcutPop
                name="stockNum"
                label="名额"
                kdtId={kdtId}
                index={row}
                showPrice
                disabled={!hasPrivilege}
                defaultValue={totalStock}
                type="number"
                onOk={(name, index, value, useSku = false) =>
                  submitQuickEdit(name, index, value, useSku, alias, kdtId)}
                productAlias={alias}
                useSku
                required
                skuSize={skuSize}
                validate={val => Number(val) >= 0 && val - Number(val).toFixed(0) === 0}
              />
            </>
          }
        >
          <div className="hover-visibleBtn" >
            {
              hasPrivilege ? <Icon type="edit-o" style={{ color: '#c3c3c3' }} />
                : <EbizIcon type="lookup" size="16px" color="#c3c3c3" />
            }
          </div>
        </Pop>
      </div>;
    }
  },
  {
    title: '出售状态',
    bodyRender({ status }) {
      const sellStatus = status === -1 ? 2 : status;
      return <span>{SELL_STATUS[sellStatus]}</span>;
    }
  },
  {
    title: '操作',
    bodyRender({ status, alias, kdtId, hasLock = false }) {
      const RadioBody = () => {
        const onStopSellOK = (checked, value) => {
          if (checked && !dialogCheck) {
            onDialogChecked(checked);
          }
          SetCourseStatus({ alias, kdtId }, value === 0).then(resp => {
            closeDialog('course-school-config-dialog');
            refresh();
          }).catch(err => {
            Notify.error(err);
            closeDialog('course-school-config-dialog');
          });
        };

        const onStopSellCancel = () => {
          closeDialog('course-school-config-dialog');
        };

        const onRadioChange = (e) => {
          const value = e.target.value;
          const Foot = (props) => {
            const [ checked, setChecked ] = useState(false);
            return <>
              <Checkbox checked={checked} onChange={(e) => { setChecked(e.target.checked); }}>本次设置不再提示此弹窗</Checkbox>
              <Button onClick={onStopSellCancel} >取消</Button>
              <Button onClick={() => onStopSellOK(checked, value)} type="primary" >确定</Button>
            </>;
          };

          if (value === -1 && !dialogCheck) {
            openDialog({
              title: '停止销售线下课',
              dialogId: 'course-school-config-dialog',
              children: <div>停止线下课售卖后，已购买的学员仍旧可以继续上课。未购买的用户将无法购买，确定停止</div>,
              footer: <Foot />
            });
          } else {
            SetCourseStatus({ alias, kdtId }, value === 0).then(resp => {
              refresh();
            }).catch(err => {
              Notify.error(err);
            });
          }
        };

        return <RadioGroup disabled={hasLock} onChange={onRadioChange} value={status === -1 ? -1 : 0}>
          <Radio value={0}>上架销售</Radio>
          <Radio value={-1}>停止销售</Radio>
        </RadioGroup>;
      };
      return <RadioBody />;
    }
  }
];

function SetCourseStatus({ alias, kdtId }, value) {
  return setBatchSetSellStatus({
    sellStatusProductModelList: [{
      alias,
      kdtId
    }],
    sell: !!value
  });
}
