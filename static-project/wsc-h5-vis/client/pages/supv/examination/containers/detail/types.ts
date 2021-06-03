export enum ActionStatus {
  NOT_STARTED = 'notStarted',
  NOT_STARTED_COMMITED = 'notStartedCommited',
  STARTED = 'started',
  ENDED = 'ended',
  ENDING = 'ending', // 结束但正在考试中
  NOT_JOINED = 'notJoined',
  COMMITED = 'commited',
  NOT_COMMITED = 'notCommited',
  CAN_REEXAM = 'canReexam',
  WILL_REEXAM = 'willReexam',
};
