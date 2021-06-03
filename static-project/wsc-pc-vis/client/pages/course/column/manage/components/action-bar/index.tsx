import { Popover, Pop } from '@zent/compat';
/* eslint-disable import/no-duplicates */
/* eslint-disable camelcase */
import React, { FC, useState, useCallback, useRef } from 'react';
import { Menu, Notify, Icon, Sweetalert, Dialog } from 'zent';
import AutoComplete from './auto-complete-input';
import { VideoUpload } from '@youzan/react-components';
import { Button as SamButton } from '@youzan/sam-components';
import makeBatchData from './make-batch-data';
import { LockWrap, Select } from '@youzan/ebiz-components';
import { LockType } from '@youzan/ebiz-components/es/lock-wrap';
import { get, map, debounce } from 'lodash';
import AddContent from '../add-content';
import { setCourseNotice, directoryAddContent, getContentsAndLives } from '../../api';
import { IColumnData } from '../../model';
import { ADD_DIALOG_ID } from '../../constants';
import { postBatchContent } from '../../../../content/api';
import { AudioWrap } from 'components/field/audio';
import './style.scss';
import '@youzan/react-components/es/components/video-upload/style/index.css';
import { ShowWrapper, isInStoreCondition } from 'fns/chain';
import waitFor from 'components/wait-for';

const { openDialog, closeDialog } = Dialog;
const { MenuItem } = Menu;
const baseUrl = window._global.url.v4;

const options = [
  {
    text: '全部',
    value: 'all',
  },
  {
    text: '出售中',
    value: 'selling',
  },
  {
    text: '已停售',
    value: 'stopSell',
  },
];

interface IProps {
  data: IColumnData;
  isLock: boolean;
  currentDirId: number;
  onBatchSuccess: () => void;
  onChangeUpdate: () => void;
  onFilter?: () => {};
  setFilterData?: (data: any) => void;
}

const ActionBar: FC<IProps> = (props) => {
  const [batching, setBatching] = useState(false);
  const uploadRef = useRef<HTMLSpanElement>(null);
  const { onChangeUpdate, onBatchSuccess, data, isLock, currentDirId, setFilterData } = props;
  const { isUpdate, alias, author } = data;
  const [filterType, setFilterType] = useState<string | number>('all');
  const [searchWord, setSearchWord] = useState<string>('');
  const [wordOptions, setWordOptions] = useState<string[]>([]);

  const addContent = useCallback(
    (selected, columnNotice) => {
      return directoryAddContent({
        columnAlias: alias,
        id: currentDirId,
        contentList: map(selected, ({ alias, type }) => ({ alias, mediaType: type })),
      })
        .then(() => waitFor(2000))
        .then(() => {
          // 发送专栏更新提醒
          // 临时解决方案，延迟2s关闭弹窗
          if (columnNotice) {
            setCourseNotice({
              needNotice: true,
              columnAlias: alias,
              contentAliases: selected.map((item) => {
                return {
                  contentAlias: item.alias,
                  mediaType: item.type,
                };
              }),
            }).catch((msg) => {
              Notify.error(msg);
            });
          }
          Notify.success('添加内容中，请手动刷新列表');
          closeDialog(ADD_DIALOG_ID);
          onBatchSuccess();
        })
        .catch((msg) => {
          closeDialog(ADD_DIALOG_ID);
          Notify.error(msg);
        });
    },
    [alias, currentDirId, onBatchSuccess],
  );

  // 添加内容
  const onAddClick = useCallback(() => {
    openDialog({
      dialogId: ADD_DIALOG_ID,
      title: '添加内容',
      style: { width: '850px' },
      children: (
        <AddContent
          alias={alias}
          author={author}
          isLock={isLock}
          showColumnNoticeConf
          onSubmit={addContent}
        />
      ),
    });
  }, [alias, author, isLock, addContent]);

  const batchUpdate = useCallback(
    (contents) => {
      setBatching(true);
      postBatchContent(contents)
        .then(() => {
          Notify.success('批量添加中，请手动刷新页面');
        })
        .catch(({ code, msg, data }) => {
          // 部分添加成功
          if (code === 10099) {
            // 日常改动新增：对含有敏感词批量上传的音频或者视频进行敏感词提示
            let errContents = data.filter((item) => item.error);
            let errArray: string[] = [];
            const titleMap = {
              2: 'audioContentDTO.audioWholeName',
              3: 'videoContentDTO.videoWholeName',
            };
            Sweetalert.confirm({
              content: (
                <div className="batch-update-retry-wrap">
                  抱歉，以下内容创建失败：
                  <br />
                  <br />
                  {errContents.map((item, key) => {
                    const { data = {}, error = {} } = item;
                    errArray.push(get(data, titleMap[data.mediaType]));
                    return (
                      <div key={key}>
                        {get(data, titleMap[data.mediaType])}
                        {
                          error.code === 320100001
                            ? <div><span className="batch-update-retry-wrap__tips">失败原因：</span>{get(error, 'msg')}</div> : ''
                        }
                      </div>
                    );
                  })}
                  <br />

                </div>
              ),
              confirmText: '重新创建',
              closeBtn: true,
              onConfirm: () => {
                const retryContents = contents.filter(item => (
                  errArray.includes(item.audioWholeName || item.videoWholeName)
                ));
                batchUpdate(retryContents);
              },
            });
          } else {
            Notify.error(msg || '批量添加失败');
          }
        })
        .finally(() => {
          onBatchSuccess();
          setBatching(false);
        });
    },
    [onBatchSuccess],
  );

  const uploadSuccessAudio = useCallback(
    (res) => {
      const contents = makeBatchData('audio', res, data);
      if (Array.isArray(contents)) {
        // @ts-ignore
        contents.map(item => {
          item.directoryId = currentDirId;
          return item;
        });
      }
      batchUpdate(contents);
    },
    [data, batchUpdate, currentDirId],
  );

  const uploadSuccessVideo = useCallback(
    (res) => {
      const contents = makeBatchData('video', res, data);
      if (Array.isArray(contents)) {
        // @ts-ignore
        contents.map(item => {
          item.directoryId = currentDirId;
          return item;
        });
      }
      batchUpdate(contents);
    },
    [data, batchUpdate, currentDirId],
  );

  const onBatchAddClick = useCallback(
    (_e, key) => {
      if (key === 'video') {
        const maxSize = 3;
        const uploadOptions = {
          materials: true,
          tokenUrl: `${baseUrl}/vis/commom/material/videoUploadToken.json`,
          categoryListUrl: `${baseUrl}/api/iron/materials/videoCategoryList.json`,
          materialsListUrl: `${baseUrl}/api/iron/materials/videoList.json`,
          confirmUrl: `${baseUrl}/vis/commom/material/confirmVideoUpload.json`,
          publishUrl: `${baseUrl}/api/iron/materials/publishVideo.json`,
          maxSize: maxSize * 1024 * 1024 * 1024,
          onSuccess: uploadSuccessVideo,
          maxAmount: 5,
          videoHelpDesc: (
            <span>
              点击 + 选择视频，视频大小不超过{maxSize}G，建议时长10~30分钟，宽高比16:9， <br />
              支持mp4，mov，m4v，flv,x-flv，mkv，wmv，avi，rmvb，3gp格式{' '}
              <p>
                为了提升视频播放流畅度，我们对此处上传的视频做了技术处理，建议不要在知识付费以外的地方使用该视频
              </p>
            </span>
          ),
          transformData: {
            tokenUrl: (data) => {
              return {
                api_url: data.uploadApiUrl,
                token: data.uploadToken,
                video_path: data.videoPath, // eslint-disable-line
              };
            },
          },
        };

        VideoUpload.initialize(uploadOptions);
      } else {
        uploadRef && uploadRef.current && uploadRef.current.click();
      }
    },
    [uploadSuccessVideo],
  );

  const fetchWords = useCallback((filterType, searchValue) => {
    const data = {
      pageNumber: 1,
      pageSize: 20,
      order: 'DESC',
      orderBy: 'column_serial_no',
      subSortBy: 'publish_at',
      columnAlias: alias,
      directoryId: currentDirId,
      sellType: filterType,
      keyWord: searchValue,
    };
    getContentsAndLives(data)
      .then((res) => {
        const { list = [] } = res;
        setWordOptions(list.map(item => item.title));
      });
  }, [alias, currentDirId]);

  const onCompleteChange = useCallback(debounce((keyword: string) => {
    fetchWords(filterType, keyword);
    setSearchWord(keyword);
  }, 800), [fetchWords, setSearchWord, filterType]);

  const onSellTypeChange = useCallback((value) => {
    setFilterType(value);
    setFilterData && setFilterData({ type: value, name: searchWord });
  }, [searchWord, setFilterData]);

  const onCompleteSelect = useCallback((value) => {
    setSearchWord(value);
  }, []);

  let actions = (
    <div className="list-filter">
      <div className="list-filter__btngroup">
        {isUpdate === 1 ? (
          <>
            <ShowWrapper
              isInStoreCondition={!isInStoreCondition({ supportMinifyRetailBranchShop: true })}
            >
              <>
                <SamButton name="活动管理" type="primary" onClick={onAddClick}>
                    添加内容
                </SamButton>
                <span className="batch-wrap">
                  <Popover
                    position={Popover.Position.AutoBottomLeft}
                    display="inline"
                    cushion={5}
                  >
                    <Popover.Trigger.Hover>
                      <SamButton className="batch-btn" name="活动管理" loading={batching}>
                          批量添加
                      </SamButton>
                    </Popover.Trigger.Hover>
                    <Popover.Content>
                      <LockWrap
                        lockType={LockType.PCT_GOODS}
                        isLock={isLock}
                        onClick={onBatchAddClick}
                      >
                        <Menu className="content-menu-item">
                          <MenuItem key="audio">音频</MenuItem>
                          <MenuItem key="video">视频</MenuItem>
                        </Menu>
                      </LockWrap>
                    </Popover.Content>
                  </Popover>
                  <Pop
                    trigger="hover"
                    position="right-center"
                    content="批量添加内容时，默认取文件名称为内容标题，取专栏封面为内容封面，取专栏简介为内容简介"
                  >
                    <Icon type="help-circle" className="column-batch-help-icon" />
                  </Pop>
                </span>
              </>
            </ShowWrapper>
            <AudioWrap
              maxAmount={10}
              onChange={uploadSuccessAudio}
              trigger={(onClick) => <span ref={uploadRef} onClick={onClick} />}
            />
          </>
        ) : (
          <>
            {' '}
            <SamButton type="primary" onClick={onChangeUpdate}>
                开启更新
            </SamButton>
            <span className="tips">(专栏已完结，如需增加/删减专栏中的内容，可重新开启更新)</span>
          </>
        )}
      </div>
      <div className="list-filter__search">
        <Select
          defaultValue={['all']}
          options={options}
          onSelect={(value) => onSellTypeChange(value)}
        />
        <AutoComplete
          placeholder="输入内容名称搜索"
          data={wordOptions}
          onChange={onCompleteChange as any}
          onSelect={onCompleteSelect}
          onPressEnter={() => setFilterData && setFilterData({ type: filterType, name: searchWord })}
        />
      </div>
    </div>
  );

  return <div className="app-filter-region column-action-bar">{actions}</div>;
};

export default ActionBar;
