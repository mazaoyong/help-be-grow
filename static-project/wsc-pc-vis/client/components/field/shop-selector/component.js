
import { Form, Table } from '@zent/compat';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Radio, Notify, Dialog } from 'zent';
import Schoolchooser from '@ability-center/shop/school-selector';
import { BRANCH_STORE_NAME } from 'constants/chain';
import assign from 'lodash/assign';
import { checkEduCourse } from './api';
import { Foot } from './Foot';
const { getControlGroup } = Form;
const RadioGroup = Radio.Group;
const pageSize = 5;
const { openDialog, closeDialog } = Dialog;

function SchoolSelector(props) {
  // 请埃里克大哥有空重构一下，这个组件已经不是你最初的宝宝了
  // isCanDelete: 是否能删除已选择的校区
  const { value, onChange, id, isEdit, isCheckRemove, isCanDelete = false } = props;
  const isDisableDelete = isEdit && !isCheckRemove && !isCanDelete;
  const columns = [{
    title: BRANCH_STORE_NAME,
    bodyRender: (data) => {
      return data.shopName;
    }
  },
  {
    title: '操作',
    width: '140px',
    bodyRender: (data) => {
      return <span onClick={() => !isDisableDelete ? removeCampus(data) : ''} className={isDisableDelete ? 'campus-operation-disabled' : 'campus-select-table-operation'}>删除</span>;
    }
  }];

  const [dataSets, setDataSets] = useState({
    currentPage: 1,
    currentData: []
  });

  const disableDialogFlag = useRef();
  const disableOutsideDialogFlag = useRef();
  const dialogSelectedRow = useRef();

  useEffect(() => {
    disableDialogFlag.current = false;
    disableOutsideDialogFlag.current = false;
  }, []);

  useMemo(
    () => {
      let currentPage = dataSets.currentPage;
      let currentData = getPageData(value.applicableCampusList, currentPage);
      if (currentData.length === 0 && currentPage > 1) {
        currentPage = currentPage - 1;
        currentData = getPageData(value.applicableCampusList, currentPage);
      }
      setDataSets({
        currentPage,
        currentData
      });
    },
    [dataSets.currentPage, value.applicableCampusList]
  );

  const [createDialog, Dialog] = Schoolchooser({
    componentConfig: {
      hasSelect: true,
      data: {
        selectInfo: {
          selectedRowKeys: value.applicableCampusList.map(item => item.shopName),
          selectedRows: value.applicableCampusList
        }
      },
      select: async (selectInfo) => {
        const { selectedRowKeys, currentRow } = selectInfo;
        const unCheckedShopName = getUnCheckedShopName(selectedRowKeys);
        if (isEdit && !currentRow && unCheckedShopName && !isCanDelete) {
          const shopItem = value.applicableCampusList.find(item => item.shopName === unCheckedShopName);
          if (shopItem) {
            await checkShopRemove(shopItem.kdtId, shopItem.shopName);
            dialogSelectedRow.current = selectedRowKeys.map(item => ({ shopName: item }));
          }
        }
        return selectInfo;
      }
    },
    dialogConfig: {
      title: `选择${BRANCH_STORE_NAME}`,
      onSubmit: (data) => {
        if (data && data.selectInfo.selectedRows) {
          onChange(assign({}, value, { applicableCampusList: data.selectInfo.selectedRows }));
        }
      }
    }
  });

  const onPageChange = (data) => {
    setDataSets({
      currentPage: data.current,
      currentData: getPageData(value.applicableCampusList, data.current)
    });
  };

  const onAllCampusChange = (e) => {
    onChange(assign({}, value, { applicableCampusType: e.target.value }));
  };

  function checkShopRemove(kdtId, shopName) {
    return new Promise((resolve, reject) => {
      if (!disableDialogFlag.current) {
        openDialog({
          title: '移除上课校区',
          dialogId: 'remove-shop-dialog',
          children: <>
            <p>确定移除校区“{shopName}”吗？</p>
            <p>移除校区后，该校区将无法查看这门课程及关联了该课程的线下课。</p>
          </>,
          closeBtn: false,
          footer: <Foot
            onStopSellOK={(checked) => {
              closeDialog('remove-shop-dialog');
              if (checked) {
                disableDialogFlag.current = true;
              }
              if (isCheckRemove) {
                checkEduCourse({ eduCourseCheckQuery: { kdtId, hqId: id } }).then(resp => {
                  resolve();
                }).catch(err => {
                  Notify.error(err);
                  reject();
                });
              } else {
                resolve();
              }
            }}
            onStopSellCancel={() => {
              reject();
              closeDialog('remove-shop-dialog');
            }}
          />
        });
      } else {
        if (isCheckRemove) {
          checkEduCourse({ eduCourseCheckQuery: { kdtId, hqId: id } }).then(resp => {
            closeDialog('remove-shop-dialog');
            resolve();
          }).catch(() => {
            Notify.error('该课程已关联线下课，无法删除');
            reject();
          });
        } else {
          resolve();
        }
      }
    });
  }

  function getPageData(dataset, currentPage) {
    return [].concat(dataset).slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }

  function removeCampus(data) {
    const { kdtId, shopName } = data;
    if (isEdit && isCheckRemove) {
      if (!disableOutsideDialogFlag.current) {
        openDialog({
          title: '移除上课校区',
          dialogId: 'remove-campus-dialog',
          children: <>
            <p>确定移除校区“{shopName}”吗？</p>
            <p>移除校区后，该校区将无法查看这门课程及关联了该课程的线下课。</p>
          </>,
          closeBtn: false,
          footer: <Foot
            onStopSellOK={(checked) => {
              closeDialog('remove-campus-dialog');
              if (checked) {
                disableOutsideDialogFlag.current = true;
              }
              checkEduCourse({ eduCourseCheckQuery: { kdtId, hqId: id } }).then(resp => {
                const applicableCampusList = [].concat(value.applicableCampusList)
                  .filter(item => item.shopName !== shopName);
                onChange(assign({}, value, { applicableCampusList }));
              }).catch(err => {
                Notify.error(err);
              });
            }}
            onStopSellCancel={() => {
              closeDialog('remove-campus-dialog');
            }}
          />
        });
      } else {
        checkEduCourse({ eduCourseCheckQuery: { kdtId, hqId: id } }).then(resp => {
          const applicableCampusList = [].concat(value.applicableCampusList).filter(item => item.shopName !== shopName);
          onChange(assign({}, value, { applicableCampusList }));
        }).catch(err => {
          Notify.error(err);
        });
      }
    } else {
      const applicableCampusList = [].concat(value.applicableCampusList).filter(item => item.shopName !== shopName);
      onChange(assign({}, value, { applicableCampusList }));
    }
  }

  function getUnCheckedShopName(applicableCampusList) {
    if (!dialogSelectedRow.current) {
      dialogSelectedRow.current = value.applicableCampusList;
    }
    const shopDiffList = [].concat(dialogSelectedRow.current).map(item => item.shopName).concat(applicableCampusList)
      .filter((item, i, array) => {
        return array.indexOf(item) === array.lastIndexOf(item);
      });
    if (shopDiffList.length && dialogSelectedRow.current.filter(item => item.shopName === shopDiffList[0]).length) {
      return shopDiffList[0];
    }
    return null;
  };

  return <div>
    <RadioGroup
      className='campus-select-radio'
      onChange={onAllCampusChange}
      disabled={isEdit}
      value={value.applicableCampusType}
    >
      <Radio value={0}>指定{BRANCH_STORE_NAME}</Radio>
      <Radio value={1}>全部{BRANCH_STORE_NAME}</Radio>
    </RadioGroup>
    {!value.applicableCampusType && <>
      <div className={isDisableDelete ? 'campus-select-dialog-disable' : 'campus-select-dialog'} onClick={!isDisableDelete ? createDialog : null}>选择{BRANCH_STORE_NAME}</div>
      <Dialog />
      {!!value.applicableCampusList.length && <Table
        className="campus-select-table"
        datasets={dataSets.currentData}
        columns={columns}
        onChange={onPageChange}
        pageInfo={{
          current: dataSets.currentPage,
          totalItem: value.applicableCampusList.length,
          pageSize
        }}
      ></Table>}</>}
  </div>;
}

export default getControlGroup(SchoolSelector);
