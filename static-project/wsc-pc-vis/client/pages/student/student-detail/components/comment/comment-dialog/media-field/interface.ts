export interface IMediaPropsParam {
  contentType: number;
  id: number;
  url?: string;
  videoDTO?: any;
}

export interface IMediaComponentParams {
  value: IMediaPropsParam[];
  onChange: (data: any) => void;
}

export interface IMediaFieldParam {
  value: IMediaPropsParam[];
}
