import { Pop } from '@zent/compat';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Radio, Notify } from 'zent';
import { VisList, VisTable, VisFilter } from 'components/vis-list';
import SchoolHeader from './components/school-config-header';
import {
  findPageCampusProduct,
  setBatchSetSellStatus,
  quickUpdateProductSkuByAlias,
  quickUpdateProductByAlias,
  getCoursePCDetailApi,
} from '../api/course-manage';
import { options, columns, defaultOptions } from './components/school-config';
import assign from 'lodash/assign';
import './styles/school.scss';
const RadioGroup = Radio.Group;

export default function SchoolList(props) {
  const [selectRows, setSelectRows] = useState([]);
  const [batchStatus, setBatchStatus] = useState(false);
  const [dialogCheck, setDialogCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [datasets, setDatasets] = useState({
    picUrl: '',
    courseName: '',
    shortenUrl: '',
    price: 0,
    totalStock: 0,
    isClassCourse: 0,
    skuSize: 0,
  });
  const courseId = props.location.query.id;
  const visTable = useRef(null);

  useEffect(() => {
    if (props.location && props.location.query) {
      setDatasets(assign({}, datasets, props.location.query));
    }
  }, [props.location.query]);

  const renderBottomAction = filter => {
    const { submit, reset } = filter;
    return (
      <div className="classroom-filter">
        <Button type="primary" onClick={submit}>
          筛选
        </Button>
        <a
          style={{ marginLeft: '10px', cursor: 'pointer' }}
          className="classroom-filter_reset"
          onClick={reset}
        >
          重置筛选条件
        </a>
      </div>
    );
  };

  const fetchData = ({ filterConditions = {}, pageConditions = {} }) => {
    const { keyword = '', status = '' } = filterConditions;
    const courseProductQuery = {
      itemId: courseId,
      keyword,
    };
    if (status !== '') {
      courseProductQuery['status'] = status;
    }
    return findPageCampusProduct({
      pageRequest: pageConditions,
      courseProductQuery,
    })
      .then(resp => {
        return {
          datasets: resp.content || [],
          current: resp.pageable.current,
          total: resp.total,
        };
      })
      .catch(error => {
        Notify.error(error);
      });
  };

  const getCourseDetail = useCallback(() => {
    return new Promise((resolve, reject) => {
      const alias = props.location.query.alias;
      getCoursePCDetailApi({ alias })
        .then(resolve)
        .catch(reject);
    });
  }, [props.location]);

  const onSchoolSelect = (selectedRowkeys, selectedRows, currentRow) => {
    setSelectRows(selectedRowkeys);
  };

  const SubmitSelectRow = props => {
    const { option, pop, data = [] } = props;
    const [status, setStatus] = useState(1);

    const onRadioChange = e => {
      setStatus(e.target.value);
    };

    const onClose = () => {
      pop.close();
    };

    const onConfirm = option => {
      if (option === 2) {
        visTable.current.resetSelection();
        setBatchStatus(false);
      }
      pop.close();
      setLoading(true);
      setBatchSetSellStatus({
        sellStatusProductModelList: data.map(item => ({ kdtId: item.kdtId, alias: item.alias })),
        sell: !!status,
      })
        .then(resp => {
          setSelectRows([]);
          setLoading(false);
          refresh();
          Notify.success(!status ? '所选校区停止销售完成' : '全部校区上架销售完成');
        })
        .catch(err => {
          Notify.error(err);
        });
    };

    return (
      <div>
        <div className="batch-set-dialog-header">{`将${
          option === 2 ? '全部' : `所选的${data.length}`
        }个校区`}</div>
        <RadioGroup className="batch-set-dialog-content" onChange={onRadioChange} value={status}>
          <Radio value={1}>上架销售</Radio>
          <Radio value={0}>停止销售</Radio>
        </RadioGroup>
        <div className="batch-set-dialog-foot">
          <div />
          <div>
            <Button onClick={onClose}>取消</Button>
            <Button onClick={() => onConfirm(option, status)} type="primary">
              确定
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const SubmitSelectWrap = Pop.withPop(props => <SubmitSelectRow {...props}></SubmitSelectRow>);

  const CurrentSelectPanel = data => {
    return (
      <div>
        {!!data.length && (
          <Pop
            trigger="click"
            content={<SubmitSelectWrap option={1} data={data}></SubmitSelectWrap>}
          >
            <Button>所选校区{selectRows.length ? `（${selectRows.length}）` : ''}</Button>
          </Pop>
        )}
        {!data.length && (
          <Button
            onClick={() => {
              Notify.error('请选择校区');
            }}
          >
            所选校区{selectRows.length ? `（${selectRows.length}）` : ''}
          </Button>
        )}
      </div>
    );
  };

  const onDialogChecked = checked => {
    setDialogCheck(checked);
  };

  const refresh = () => visTable.current.refetchData.refresh(true);

  /**
   * 保存快捷修改的改动
   *
   * @param {string} name 数据中的key
   * @param {number} index 数据所在的位置
   * @param {any} value 数据的值
   * @param {boolean} useSku 是否使用sku数据修改接口
   * @param {string} alias 商品alias
   * @param {number} kdtId 校区kdtId
   */
  const submitQuickEdit = (name, index, value, useSku = false, alias, kdtId) => {
    try {
      setLoading(true);
      let promise = null;
      if (useSku) {
        const productQuickUpdateSkuDTO = {
          productAlias: alias,
          skus: value,
          kdtId,
          skuType: datasets.skuSize > 0 ? 2 : 1,
        };
        promise = quickUpdateProductSkuByAlias(productQuickUpdateSkuDTO);
      } else {
        const productQuickUpdateDTO = {
          [name]: value,
          alias: alias,
          kdtId,
        };
        promise = quickUpdateProductByAlias(productQuickUpdateDTO);
      }
      promise
        .then(resp => {
          refresh();
          // 获取新的总名额
          getCourseDetail().then(data => {
            const { totalStock } = data.product;
            const { router } = props;
            router.replace({
              pathname: props.location.pathname,
              query: { ...props.location.query, totalStock },
            });
          });
          Notify.success('修改信息成功');
        })
        .catch(err => {
          setLoading(false);
          Notify.error(err);
        });
    } catch (err) {
      throw new Error(err);
    }
  };
  return (
    <div className="course-school-page">
      <SchoolHeader {...datasets} />
      <VisList>
        <VisFilter
          {...{
            defaultValue: defaultOptions,
            options: options,
            bottomActions: renderBottomAction,
          }}
        />
        <VisTable
          ref={table => (visTable.current = table)}
          columns={columns({
            onDialogChecked,
            dialogCheck,
            submitQuickEdit,
            refresh,
            skuSize: parseInt(datasets.skuSize),
            isClassCourse: parseInt(datasets.isClassCourse),
          })}
          rowKey="name"
          loading={loading}
          fetchData={fetchData}
          selectable={batchStatus}
          onSelect={(selectedRowkeys, selectedRows, currentRow) => {
            onSchoolSelect(selectedRowkeys, selectedRows, currentRow);
          }}
          getRowConf={(data, index) => {
            return {
              canSelect: !data.hasLock,
            };
          }}
          batchComponents={
            batchStatus
              ? [<span key="all-selelect-word">当页全选</span>, CurrentSelectPanel]
              : [<Button key="set-batch-status" className="set-batch-status" onClick={() => setBatchStatus(true)}>批量操作</Button>]
          }
        />
      </VisList>
    </div>
  );
}
