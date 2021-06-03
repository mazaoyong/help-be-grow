import { useState } from '@youzan/tany-react';

const AppModel = () => {
  const [localImgViewList, setList] = useState([
    {
      url: 'https://img.yzcdn.cn/upload_files/2020/12/18/ljI-thP1JE6TtnfG9CoaesrOsYwh.mp3',
      name: '出羽良彰 - 海の涙.mp3',
    },
    {
      url: 'https://img.yzcdn.cn/upload_files/2019/11/04/lj3gGa3EWk738ifnI9NVvDZGqp6X.mp3',
    },
  ]);

  const handleImgChange = (data) => {
    console.log('项目内 audio change', data);
    setList(data);
  };

  return {
    localImgViewList,
    handleImgChange,
  };
};

export default AppModel;
