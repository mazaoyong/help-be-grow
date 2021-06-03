export interface IStatsTitleProps {
  title?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
  alias?: string;
}

export interface IStatsSummaryProps {
  participantCount?: number;
  orderCount?: number;
  orderValueSum?: number;
  uv?: number;
  pv?: number;
}
