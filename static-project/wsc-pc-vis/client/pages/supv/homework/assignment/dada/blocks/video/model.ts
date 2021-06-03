import { useState } from '@youzan/tany-react';

const AppModel = () => {
  const [localImgViewList, setList] = useState<{
    url: string;
    videoId?: number;
    videoStatus?: number;
  }[]>([{ videoStatus: 7, url: '' }]);

  const handleImgChange = (data) => {
    console.log('项目内 video change', data);
    setList(data);
  };

  return {
    localImgViewList,
    handleImgChange,
  };
};

export default AppModel;
