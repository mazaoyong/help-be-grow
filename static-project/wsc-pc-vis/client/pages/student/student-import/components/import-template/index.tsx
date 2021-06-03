import React, { MouseEvent, useState } from 'react';
import { Icon } from '@youzan/ebiz-components';
import InfoTip from '@ability-center/student/info-tip';
import { Link as SamLink } from '@youzan/sam-components';
import { Notify } from 'zent';
import { isEduHqStore } from 'fns/chain/index';

import { getTemplate } from '../../api/prepare';
import styles from './styles.m.scss';
import download from '../../utils/file-saver';

interface IImportTemplateProps {
  branchKdtId: number;
}

export default function ImportTemplate(props: IImportTemplateProps) {
  const { branchKdtId } = props;
  const [templateUrl, setTemplateUrl] = useState('javascript:;');

  async function fetchData(kdtId) {
    let url;
    try {
      const res = await getTemplate({ templateType: 0, kdtId });
      setTemplateUrl(url);
      url = res.url;
    } catch (error) {
      Notify.error(error || '获取文件模板失败');
      return;
    }
    try {
      await download(url, '学员导入模板（学员基本信息）.xls');
    } catch (error) {
      Notify.error(error || '下载文件模板失败');
    }
  }

  function handleDownload(e: MouseEvent) {
    e.preventDefault();
    if (isEduHqStore && !branchKdtId) {
      Notify.error('请选择校区');
      return;
    }
    if (isEduHqStore) {
      fetchData(branchKdtId);
      return;
    }
    fetchData(_global.kdtId);
  }

  return (
    <div>
      <div>
        <a href={templateUrl} onClick={handleDownload}>
          <Icon type="doc" />
          下载文件模板
        </a>
      </div>
      <InfoTip>
        {({ openAddPage }) => {
          return (
            <div className={styles.desc}>
              <span className={styles.tip}>请根据模板导入学员基本信息。</span>
              <span>
                模版中的资料项根据自定义的学员资料项自动生成，如需调整，请前往设置
                <SamLink className={styles.pointer} onClick={openAddPage}>学员资料项</SamLink>
              </span>
              <span>。</span>
            </div>
          );
        }}
      </InfoTip>
    </div>
  );
}
