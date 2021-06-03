import { useState } from '@youzan/tany-react';

const AppModel = () => {
  const [localImgViewList, setList] = useState<{
    url: string;
    status?: number;
    videoId?: number;
  }[]>([]);

  const [localVideoViewList, setVideoList] = useState([]);

  const handleImgChange = (data) => {
    console.log('项目内 img change', data);
    setList(data);
  };

  const handleVideoChange = (data) => {
    console.log('项目内 video change', data);
    setVideoList(data);
  };

  return {
    localImgViewList,
    handleImgChange,
    localVideoViewList,
    handleVideoChange,
  };
};

export default AppModel;
