export type ICalendarProps = ICalendarHeaderProps & ICalendarPanelProps;

export interface ICalendarHeaderProps {
  current: Date;
  onMonthChange: (date: Date) => void;
}

export interface ICalendarPanelProps {
  // 当前月
  current: Date;
  // 每周开始的日期，0-7，默认为1，从周一开始
  weekStartsOn: number;
  // 月份变化触发事件
  onMonthChange?: (date: Date) => void;
  // 自定义渲染日期单元格，返回内容会被追加到单元格，日期下面
  dateCellRender?: (date: Date) => JSX.Element;
  // 自定义渲染日期单元格，返回内容覆盖单元格
  dateFullCellRender?: (date: Date) => JSX.Element;
  // 点击日期的会调
  onSelect?: (date: Date) => void;
}
