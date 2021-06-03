import React from 'react';
import { Button, Notify } from 'zent';

import TeacherGrid from './teacher-grid';
import AssistantGrid from './assistant-grid';
import GuestGrid from './guest-grid';
import { uploadTrackerInfo } from '../record-manage';
import { getLiveEnterInfo, ITeacherInfoType, IRoleType } from '../../../api/live-manage';
import { getByAlias } from '../../../api';
import './styles.scss';

interface IRoleManageProps {
  alias: string;
  name: string;
}
interface IBackgroundURL {
  teacher: string;
  assistant: string;
}

const RoleManage: React.FC<IRoleManageProps> = (props) => {
  const { alias, name } = props;
  const [fetchTeacher, setFetchTeacher] = React.useState(true);
  const [fetchAssistant, setFetchAssistant] = React.useState(true);
  const [fetchGuest, setFetchGuest] = React.useState(true);
  const [teacherInfoList, setTeacherInfoList] = React.useState<ITeacherInfoType[]>([]);
  const [assistantList, setAssistantList] = React.useState<IRoleType[]>([]);
  const [guestList, setGuestList] = React.useState<IRoleType[]>([]);
  const [openConnection, setOpenConnection] = React.useState<boolean>(false);
  const [connectionNumber, setConnectionNumber] = React.useState<number>(0);
  const [backgroundUrl, setBackgroundUrl] = React.useState<IBackgroundURL>({
    teacher: '#',
    assistant: '#'
  });

  const fetchRoleInfoList = React.useCallback(() => {
    getLiveEnterInfo({ alias })
      .then((data) => {
        if (data) {
          const { videoEnterInfoDTO, assistantEntryDTO, guestEntryDTO } = data;
          const { assistantEntryItemDTOList = [], url: assistantURL = '' } =
            assistantEntryDTO || {};
          const { guestEntryItemDTOList = [] } =
            guestEntryDTO || {};

          // 原有的逻辑先不动，后面再看看判空是否多余
          if (videoEnterInfoDTO && assistantEntryItemDTOList) {
            const teacherURL = videoEnterInfoDTO.url;
            setTeacherInfoList([videoEnterInfoDTO]);
            setAssistantList((assistantEntryItemDTOList || []).slice().reverse());
            setBackgroundUrl({ teacher: teacherURL, assistant: assistantURL });
          }

          return {
            guestEntryItemDTOList
          };
        }
      })
      .then((guestData) => {
        if (guestData) {
          getByAlias({ alias })
            .then(data => {
              const {
                guestEntryItemDTOList,
              } = guestData;
              const {
                open_connection: openConnection,
                connection_number: connectionNumber
              } = data;

              setGuestList(guestEntryItemDTOList.slice().reverse());
              setOpenConnection(Boolean(openConnection));
              setConnectionNumber(connectionNumber);
            });
        }
      })
      .catch(Notify.error)
      .finally(() => {
        setFetchTeacher(false);
        setFetchAssistant(false);
        setFetchGuest(false);
      });
  }, [alias]);

  React.useEffect(() => {
    setFetchTeacher(true);
    setFetchAssistant(true);
    setFetchGuest(true);
    fetchRoleInfoList();
  }, [fetchRoleInfoList]);

  const baseTrackParams = React.useMemo(
    () => ({
      liveName: name,
      liveAlias: alias,
    }),
    [alias, name],
  );
  const handleUploadInfo = React.useCallback<typeof uploadTrackerInfo>(
    (params) => {
      const combinedOtherParams = Object.assign({}, baseTrackParams, params.otherParams || {});
      const uploadParams = Object.assign({}, params, { otherParams: combinedOtherParams });
      uploadTrackerInfo(uploadParams);
    },
    [baseTrackParams],
  );

  const modifyTeacher = React.useCallback(() => {
    setFetchTeacher(true);
    fetchRoleInfoList();
  }, [fetchRoleInfoList]);

  const modifyAssistant = React.useCallback(() => {
    setFetchAssistant(true);
    fetchRoleInfoList();
  }, [fetchRoleInfoList]);

  const modifyGuest = React.useCallback(() => {
    setFetchGuest(true);
    fetchRoleInfoList();
  }, [fetchRoleInfoList]);

  return (
    <div className="live-manage__roleManage">
      <section className="content-box">
        <div className="header">
          <div className="partial">
            <h1 className="subtitle">讲师信息</h1>
          </div>
          <div className="partial">
            <Button
              outline
              bordered={false}
              type="primary"
              target="__blank"
              href={backgroundUrl.teacher}
            >
              讲师后台
            </Button>
          </div>
        </div>
        <section>
          <TeacherGrid
            alias={alias}
            loading={fetchTeacher}
            datasets={teacherInfoList}
            handleModified={modifyTeacher}
            dispatchUploadTrackInfo={handleUploadInfo}
          />
        </section>
      </section>
      {
        // 开启课堂连线后才有嘉宾
        openConnection
          ? (<section className="content-box">
            <div className="header">
              <div className="partial">
                <h1 className="subtitle">嘉宾信息</h1>
              </div>
            </div>
            <section>
              <GuestGrid
                alias={alias}
                loading={fetchGuest}
                datasets={guestList}
                connectionNumber={connectionNumber}
                handleModified={modifyGuest}
              />
            </section>
          </section>)
          : null
      }
      <section className="content-box">
        <div className="header">
          <div className="partial">
            <h1 className="subtitle">助教信息</h1>
          </div>
          <div className="partial">
            <Button
              outline
              bordered={false}
              type="primary"
              target="__blank"
              href={backgroundUrl.assistant}
            >
              助教后台
            </Button>
          </div>
        </div>
        <section>
          <AssistantGrid
            alias={alias}
            loading={fetchAssistant}
            datasets={assistantList}
            handleModified={modifyAssistant}
            dispatchUploadTrackInfo={handleUploadInfo}
          />
        </section>
      </section>
    </div>
  );
};

export default RoleManage;
