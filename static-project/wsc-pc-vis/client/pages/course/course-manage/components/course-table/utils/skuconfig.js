import { Pop } from '@zent/compat';
import React from 'react';
import { Icon, Dialog, Alert } from 'zent';
import ShortcutPop from '../components/shortcut-pop';
// import SchoolSelector from 'components/school-selector';
import SchoolConfigHeader from '../../../components/school-config-header';
import { findPageCampusProduct } from '../../../../api/course-manage';
import { isInStoreCondition } from 'fns/chain';
import { Icon as EbizIcon } from '@youzan/ebiz-components';
import { VisTable } from 'components/vis-list';
import VersionWrapper from 'fns/version';

const isChainBranch = isInStoreCondition({ supportBranchStore: true });
const SELL_STATUS = ['已停售', '出售中', '已售罄'];
const { openDialog } = Dialog;
let tableRef = null;

const HQSupportSKU = (ctx, data, { row }) => {
  const { courseType, skuSize, formalCourseDTO, totalStock, price, id } = data;
  const { courseSellType } = formalCourseDTO || {};
  const columns = [
    {
      title: '校区',
      bodyRender({ name }) {
        return <div className="config-shop-number-name">
          <span>{name}</span>
        </div>;
      },
    },
    {
      title: '价格',
      bodyRender() {
        return <div style={{ color: '#FF6600' }}>
          <span>¥{price / 100}</span>
        </div>;
      },
    },
    {
      title: '名额',
      textAlign: 'center',
      bodyRender(rowData) {
        const { totalStock, kdtId, alias, operateCampusStock } = rowData;
        const renderDiffCourseSellType = (courseSellType) => {
          // 无规格时
          if (skuSize === 0) {
            return <span>总部不能修改该校区的招生名额，<a style={{ color: '#38F' }} href={`/v4/shop/select-store?hqKdtId=${window._global.kdtId}&redirect=`}>切换校区</a></span>;
          } else if (courseType === 1 && courseSellType === 3) {
            // 按期
            return <React.Fragment>
              <VersionWrapper name='course-manage-quickmodify'>
                <Alert type="warning">
                  <span>只能在班级里修改名额，<a style={{ color: '#38F' }} href='/v4/vis/edu/page/educlass#/list'>去设置</a></span>
                </Alert>
              </VersionWrapper>
              {StockPopup(row, courseType, courseSellType, true, operateCampusStock, totalStock,
                kdtId, ctx, alias, skuSize)}
            </React.Fragment>;
          }
          // 有规格时
          return <React.Fragment>
            <Alert type="warning">
              <span>总部不能修改该校区的招生名额，<a style={{ color: '#38F' }} href={`/v4/shop/select-store?hqKdtId=${window._global.kdtId}&redirect=`}>切换校区</a></span>
            </Alert>
            {StockPopup(row, courseType, courseSellType, true, operateCampusStock, totalStock,
              kdtId, ctx, alias, skuSize)}
          </React.Fragment>;
        };
        return <div className="config-shop-number-avanum">
          <span>{totalStock}</span>
          <Pop
            trigger="click"
            position="bottom-left"
            wrapperClassName="shortcut-pop"
            centerArrow
            // onShow={ctx.toggleShowEditIcon.bind(ctx, `stock${row}`, 'visible')}
            // onClose={ctx.toggleShowEditIcon.bind(ctx, `stock${row}`)}
            content={
              !operateCampusStock && !(courseType === 1 && courseSellType === 3) // 去除按期
                ? renderDiffCourseSellType(courseSellType)
                : StockPopup(row, courseType, courseSellType, true, operateCampusStock, totalStock,
                  kdtId, ctx, alias, skuSize)
            }
          >
            <div className="hover-visibleBtn" >
              {
                operateCampusStock ? <Icon type="edit-o" style={{ color: '#c3c3c3' }} />
                  : <EbizIcon type="lookup" size="16px" color="#c3c3c3" />
              }
            </div>
          </Pop>
        </div>;
      },
    },
    {
      title: '出售状态',
      bodyRender({ status }) {
        return typeof status === 'number' ? SELL_STATUS[status + 1] : '-';
      },
    },
  ];

  const openSchoolDialog = () => {
    return openDialog({
      className: 'course-manage-dialog',
      children: <div className='school-selltype-dialog'>
        <SchoolConfigHeader
          {...data}
          isShowConfig={true}
        />
        <VisTable
          ref={table => (tableRef = table)}
          columns={columns}
          sortBy={'created_at'}
          rowKey={'shopName'}
          pageConfig={{ pageSize: 6 }}
          fetchData={({ filterConditions, pageConditions }) => {
            return findPageCampusProduct({ courseProductQuery: { itemId: id },
              pageRequest: {
                pageNumber: pageConditions.pageNumber,
                pageSize: 6,
              } }).then(resp => {
              return {
                datasets: resp.content || [],
                current: resp.pageable.current,
                total: resp.total,
              };
            });
          }}
        />
      </div>,
    });
  };
  return typeof totalStock === 'number' ? <span><a onClick={openSchoolDialog}>{totalStock}</a></span> : '-';
};

// eslint-disable-next-line max-len
const StockPopup = (row, courseType, courseSellType, isHQSupportSKU, cannotOperateStock, totalStock, kdtId, ctx, alias, skuSize) => {
  return <React.Fragment>
    {courseType === 1 && courseSellType === 3
      // 按期
      ? <VersionWrapper name='course-manage-quickmodify'>
        <Alert type="warning">
          <span>只能在班级里修改名额，<a style={{ color: '#38F' }} href='/v4/vis/edu/page/educlass#/list'>去设置</a></span>
        </Alert>
      </VersionWrapper>
      : null
    }
    <ShortcutPop
      name="stockNum"
      label="名额"
      index={row}
      disabled={
        isHQSupportSKU
          ? (courseType === 1 && courseSellType === 3 && isInStoreCondition({ supportEduHqStore: true })) ||
          !cannotOperateStock
          : (courseType === 1 && courseSellType === 3) || !cannotOperateStock
      }
      defaultValue={totalStock}
      type="number"
      kdtId={kdtId}
      onOk={(name, index, value, useSku = false) => {
        ctx.submitQuickEdit(name, index, value, useSku, alias, kdtId);
        if (tableRef) {
          tableRef.refetchData.refresh();
        }
      }}
      productAlias={alias}
      useSku
      showPrice
      required
      skuSize={skuSize}
      validate={val => Number(val) >= 0 && val - Number(val).toFixed(0) === 0}
    />
  </React.Fragment>;
};

const SingleAndBranchSupportSKU = (ctx, data, rowConfig) => {
  const {
    totalStock,
    skuSize,
    alias,
    courseType,
    formalCourseDTO,
    kdtId = null,
  } = data;

  const isStockIndependent = !isChainBranch ? true : data.isStockIndependent;
  const courseSellType = formalCourseDTO ? formalCourseDTO.courseSellType : null;

  const { row } = rowConfig;
  const renderDiffCourseSellType = (courseSellType) => {
    // 无规格时
    if (skuSize === 0) {
      return <span>仅总部有权限修改名额</span>;
    }
    // 有规格时
    return <React.Fragment>
      <Alert type="warning">
        <span>仅总部有权限修改名额</span>
      </Alert>
      {StockPopup(row, courseType, courseSellType, false, isStockIndependent, totalStock,
        kdtId, ctx, alias, skuSize)}
    </React.Fragment>;
  };
  return (
    <React.Fragment>
      <span style={{ marginRight: '5px' }}>{totalStock}</span>
      { <Pop
        trigger="click"
        position="bottom-left"
        wrapperClassName="shortcut-pop"
        centerArrow
        onShow={ctx.toggleShowEditIcon.bind(ctx, `stock${row}`, 'visible')}
        onClose={ctx.toggleShowEditIcon.bind(ctx, `stock${row}`)}
        content={
          !isStockIndependent && !(courseType === 1 && courseSellType === 3) // 去除按期
            ? (
              renderDiffCourseSellType(courseSellType)
            )
            : StockPopup(row, courseType, courseSellType, false, isStockIndependent, totalStock,
              kdtId, ctx, alias, skuSize)
        }
      >
        <div className="hover-visibleBtn" ref={icon => (ctx[`stock${row}`] = icon)}>
          { isStockIndependent ? <Icon type="edit-o" style={{ color: '#c3c3c3' }} />
            : <EbizIcon type="lookup" size="16px" color="#c3c3c3" />
          }
        </div>
      </Pop>}
    </React.Fragment>
  );
};

export { HQSupportSKU, SingleAndBranchSupportSKU };
