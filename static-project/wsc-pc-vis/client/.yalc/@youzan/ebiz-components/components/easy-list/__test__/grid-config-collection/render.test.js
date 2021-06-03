import React from 'react';
import { act, render, fireEvent, cleanup, screen, waitFor } from '@testing-library/react';
import EasyList from '../../index';

// 测试zent的grid使用方式，能不能正常渲染
const { EasyGrid, quickEditRender, GoodsBriefCard, GridSweetAlert, GridPop } = EasyList;
const totalItem = 40;
const HELP_DESC = '商品提示信息';
const VALIDATE_ERROR = '值必须为数字';
const QUICK_EDIT_TEXT = '测试快捷编辑';
const datasets = [];
const columns = [
  {
    title: '商品名',
    name: 'name',
    headerHelp: HELP_DESC,
    fixed: 'left',
  },
  {
    title: '访问量',
    name: 'uv',
  },
  {
    title: '库存',
    name: 'stock',
    bodyRender: quickEditRender('stock', {
      required: true,
      defaultValue: 222,
      validators: [
        (value) => {
          if (Number(value)) return null;
          return {
            name: 'notANumber',
            message: VALIDATE_ERROR,
          };
        },
      ],
      onConfirm(value) {
        quickEditValue = value;
        return new Promise((resolve) => setTimeout(resolve, 2000));
      },
    }),
  },
  {
    title: '商品',
    name: 'goods',
    width: 267,
    bodyRender(data) {
      const { goods } = data;
      const { title, label, price, url } = goods;
      return (
        <GoodsBriefCard
          title={title}
          label={label}
          labelTagTheme="red"
          labelOutline
          price={price}
          url={url}
          image="https://img.yzcdn.cn/upload_files/2019/12/13/Fv6S5Gty68hyMYLznLuxF4Wifhm9.jpg!small.webp"
        />
      );
    },
  },
  {
    title: '创建时间',
    name: 'createdTime',
    width: 140,
  },
  {
    title: '操作',
    bodyRender() {
      return (
        <div>
          <GridSweetAlert
            confirmType="primary"
            text="弹窗删除"
            content="你确定要删除吗?"
            onConfirm={() => {
              Sweetalert.alert({ content: '删除了' });
            }}
            onCancel={() => {
              Sweetalert.alert({ content: '取消' });
            }}
          />
          ,
          <div onClick={() => (eventBubbling += 1)}>
            <GridPop trigger="hover" text="鼠标悬浮出现pop">
              {() => <span>悬浮内容1</span>}
            </GridPop>
            <GridPop trigger="click" text={<span>点击出现pop</span>} content="悬浮内容2" />
            <GridPop preventDefault trigger="click" text="阻止默认行为" content="悬浮内容3" />
            <GridPop preventDefault trigger="click" text="阻止默认行为">
              悬浮内容3
            </GridPop>
          </div>
        </div>
      );
    },
  },
];
let renderTime = 0;
let currentPageSize = 20;
let currentPage = 1;
let quickEditValue = undefined;
let eventBubbling = 0;

/**
 * @param {import('../../types/grid').IEasyGridProps} [overrideProps=]
 */
const renderGrid = (overrideProps = {}) => {
  for (let i = 0; i < 20; i++) {
    datasets.push({
      id: `f-${renderTime}-${i}`,
      name: `母婴商品 ${i}`,
      uv: 20,
      stock: 5,
      goods: {
        title: `这是一个超长的文案这是一个超长的文案这是一个超长的文案这是一个超长的文案这是一个超长的文案这是一个超长的文案${i}`,
        price: `${i}`,
        label: `商品`,
        url: 'https://shop192223.m-qa.youzan.com/wscgoods/detail/2op0ui37m9egn?alias=2op0ui37m9egn',
      },
      createdTime: '2019-11-21',
    });
  }

  /** @type {import('react').RefObject<import('../../types/grid').IEasyGridRef>} */
  const gridRef = React.createRef(null);
  /** @type {import('@testing-library/react').RenderResult<import('@testing-library/react').queries>} */
  let renderRes;
  act(() => {
    renderRes = render(
      <EasyGrid
        ref={gridRef}
        columns={columns}
        datasets={datasets}
        pageNumber={currentPage}
        pageSize={currentPageSize}
        total={totalItem}
        easySelection
        rowKey="id"
        scroll={{ x: 2000 }}
        {...overrideProps}
      />
    );
  });
  return {
    grid: renderRes,
    gridRef,
  };
};

afterEach(() => {
  ++renderTime;
  currentPageSize = 20;
  currentPage = 1;
  quickEditValue = undefined;
  eventBubbling = 0;
  cleanup();
});

describe('渲染Grid组件', () => {
  test('测试渲染数据、快捷编辑等', async () => {
    const { grid } = renderGrid();
    const { queryByTestId, queryAllByTestId } = grid;
    // 需要限制在scroll中，要不会统计出两倍的值= =
    const table = queryByTestId('easy-grid').querySelector('.zent-grid-table');
    const dataRows = table.querySelectorAll('.zent-grid-tbody .zent-grid-tr');
    expect(dataRows && dataRows.length).toBe(currentPageSize);

    // 测试helpDesc
    const header = queryByTestId('easy-grid').querySelector('.zent-grid-thead');
    const headerHelps = header.querySelectorAll('.header-help-icon');
    // 有提示的icon
    expect(headerHelps && headerHelps.length).toBe(1);

    // 测试快捷编辑
    const quickEditIcon = queryByTestId('easy-grid').querySelector('.easy-grid__quickEdit-icon');
    expect(quickEditIcon.classList.value.includes('visible')).toBe(false);
    act(() => {
      fireEvent.click(quickEditIcon);
    });
    expect(quickEditIcon.classList.value.includes('visible')).toBe(true);
    const inputEle = screen.queryByTestId('easy-grid-quickEdit').querySelector('input');
    const confirmBtn = screen.queryByTestId('easy-grid-quickEdit-confirm');
    // 输入错误
    act(() => {
      fireEvent.change(inputEle, { target: { value: QUICK_EDIT_TEXT } });
    });
    act(() => {
      fireEvent.click(confirmBtn);
    });
    const errorEle = screen.queryByTestId('easy-grid-quickEdit').querySelector('.error-message');
    expect(errorEle.innerHTML.includes(VALIDATE_ERROR)).toBe(true);
    act(() => {
      fireEvent.change(inputEle, { target: { value: 999 } });
    });
    act(() => {
      fireEvent.click(confirmBtn);
    });
    expect(Number(quickEditValue)).toBe(999);

    // 是否渲染了商品卡片
    const goodsCard = queryAllByTestId('easy-grid-goodsCard');
    expect(goodsCard.length > 0).toBe(true);

    // 渲染sweetAlert
    const sweetAlert = queryAllByTestId('easy-grid-sweetAlert');
    expect(sweetAlert.length > 0).toBe(true);
  });

  test('翻页', () => {
    const handleChange = jest.fn();
    const { grid } = renderGrid({ onChange: handleChange });
    const ele = grid.getByTestId('easy-grid');
    const pagenation = ele.querySelectorAll('.zent-pagination-page-list--normal button');
    act(() => {
      let pageTwo;
      pagenation.forEach((btn) => {
        if (btn.innerHTML.includes(2)) {
          pageTwo = btn;
        }
      });
      fireEvent.click(pageTwo);
    });
    expect(handleChange.mock.calls.length).toBe(1);
  });

  test('测试GridPop', async () => {
    const { grid } = renderGrid();
    const { queryAllByTestId } = grid;
    const gridPops = queryAllByTestId('easy-grid-gridPop');
    const hoverOne = gridPops[0];
    expect(hoverOne.innerHTML.includes('鼠标悬浮出现pop')).toBe(true);
    const clickOne = gridPops[1];
    expect(clickOne.innerHTML.includes('点击出现pop')).toBe(true);
    const clickTwo = gridPops[2];
    expect(clickTwo.innerHTML.includes('阻止默认行为')).toBe(true);
    act(() => {
      fireEvent.mouseEnter(hoverOne);
    });
    await screen.findByText('悬浮内容1');
    act(() => {
      fireEvent.click(clickOne);
    });
    await screen.findByText('悬浮内容2');
    act(() => {
      fireEvent.click(clickTwo);
    });
    await screen.findByText('悬浮内容3');
    expect(eventBubbling).toBe(1);
  });

  test('emptyLabel', () => {
    const { grid } = renderGrid({ emptyLabel: <a id="emptyLabel">空文案</a>, datasets: [] });
    expect(screen.getByText('空文案').tagName).toBe('A');
    grid.rerender(
      <EasyGrid
        emptyCreateLabel={<a id="emptyCreateLabel">去创建</a>}
        columns={columns}
        datasets={[]}
      />
    );
    expect(screen.getByText('去创建').tagName).toBe('A');
  });
});

describe('EasyGrid选择', () => {
  test('测试选中状态', () => {
    const handleSelect = jest.fn(() => true);
    const { grid, gridRef } = renderGrid({
      // 当同时出现这两个属性的时候，globalState不应该被使用
      list: {
        globalState: {
          selectedRowKeys: [
            `f-${renderTime}-1`,
            `f-${renderTime}-2`,
            `f-${renderTime}-3`,
            `f-${renderTime}-4`,
          ],
        },
      },
      selection: {
        selectType: 'multiple',
        selectedRowKeys: [`f-${renderTime}-1`],
        onSelect: handleSelect,
      },
    });
    const { queryByTestId } = grid;
    const table = queryByTestId('easy-grid').querySelector('.zent-grid-table');
    let selectedRows = table.querySelectorAll('.zent-grid-tbody .zent-checkbox-checked');
    expect(selectedRows && selectedRows.length).toBe(1);

    // 再选择一个
    const rows = table.querySelectorAll('.zent-grid-tbody .zent-checkbox-wrap');
    const lastOne = rows[rows.length - 1];
    act(() => {
      fireEvent.click(lastOne);
    });
    selectedRows = table.querySelectorAll('.zent-grid-tbody .zent-checkbox-checked');
    expect(selectedRows && selectedRows.length).toBe(2);
    expect(handleSelect.mock.calls.length).toBe(1);

    // 使用ref选中
    act(() => {
      gridRef.current.setSelectedRowKeys([
        `f-${renderTime}-1`,
        `f-${renderTime}-2`,
        `f-${renderTime}-3`,
      ]);
    });
    selectedRows = table.querySelectorAll('.zent-grid-tbody .zent-checkbox-checked');
    expect(selectedRows && selectedRows.length).toBe(3);
  });

  test('在List包裹下默认选中', () => {
    const { grid } = renderGrid({
      list: {
        globalState: {
          selectedRowKeys: [
            `f-${renderTime}-1`,
            `f-${renderTime}-2`,
            `f-${renderTime}-3`,
            `f-${renderTime}-4`,
          ],
        },
      },
    });
    const { queryByTestId } = grid;
    const table = queryByTestId('easy-grid').querySelector('.zent-grid-table');
    let selectedRows = table.querySelectorAll('.zent-grid-tbody .zent-checkbox-checked');
    expect(selectedRows && selectedRows.length).toBe(4);
  });

  test('测试单选渲染', () => {
    const { grid } = renderGrid({
      selection: {
        selectType: 'single',
        selectedRowKeys: [`f-${renderTime}-1`, `f-${renderTime}-2`],
      },
    });
    expect(
      grid.getByTestId('easy-grid').querySelectorAll('.zent-grid-scroll .zent-radio-checked').length
    ).toBe(1);
  });

  test('测试单选功能完整性', () => {
    const handleSelect = jest.fn();
    const { grid } = renderGrid({
      selection: {
        selectType: 'single',
        selectedRowKeys: [`f-${renderTime}-1`, `f-${renderTime}-2`],
        onSelect: handleSelect,
        getCheckboxProps(data) {
          const [, id] = data.id.match(/f-\d+-(\d+)/);
          return {
            disabled: id % 2 === 0,
          };
        },
      },
    });
    const easyGrid = grid.getByTestId('easy-grid');
    const gridFixedLeftBox = easyGrid.querySelector('.zent-grid-fixed-left');
    expect(gridFixedLeftBox.querySelectorAll('.zent-radio-checked').length).toBe(1);
    const availableOne = gridFixedLeftBox.querySelector(`label[data-testid="f-${renderTime}-3"]`);
    const hasCheckedOne = gridFixedLeftBox.querySelector(`label[data-testid="f-${renderTime}-1"]`);
    const disabledOne = gridFixedLeftBox.querySelector(`label[data-testid="f-${renderTime}-2"]`);
    expect(availableOne.querySelector('.zent-radio-disabled')).toBeFalsy();
    expect(disabledOne.querySelector('.zent-radio-disabled')).toBeTruthy();
    act(() => {
      fireEvent.click(hasCheckedOne);
    });
    act(() => {
      fireEvent.click(availableOne);
    });
    act(() => {
      fireEvent.click(disabledOne);
    });
    expect(handleSelect.mock.calls.length).toBe(1);
    expect(availableOne.querySelector('.zent-radio-checked')).toBeTruthy();
  });
});

describe('测试自定义表头', () => {
  const grid = render(
    <EasyGrid
      customColumns
      customColumnsDialogTitle="自定义表头的标题"
      customColumnsTriggerText="打开自定义表头"
      datasets={[]}
    />
  );
  // TODO: add test
  expect(true).toBeTruthy();
});
