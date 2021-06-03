export interface Goods {
  coverImg: string;
  url: string;
  price: number;
  name: string;
}

export interface Room {
  roomId: string;
  name: string;
  coverImg: string;
  startTime: string;
  endTime: string;
  authorName: string;
  authorImg: string;
  goods: Goods[];
}
