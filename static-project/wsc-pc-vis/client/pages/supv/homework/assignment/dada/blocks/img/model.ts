import { useState } from '@youzan/tany-react';

const AppModel = () => {
  const [localImgViewList, setList] = useState<{
    url: string;
    status?: number;
    imgId?: number;
  }[]>([
    {
      url: 'https://img.yzcdn.cn/public_files/2018/12/19/5941d128d3d3e8a4748c7c9b95bea409.png',
    },
    {
      url: 'https://img.yzcdn.cn/public_files/2018/12/19/5941d128d3d3e8a4748c7c9b95bea409.png',
    },
  ]);

  const handleImgChange = (data) => {
    console.log('项目内 img change', data);
    setList(data);
  };

  return {
    localImgViewList,
    handleImgChange,
  };
};

export default AppModel;
