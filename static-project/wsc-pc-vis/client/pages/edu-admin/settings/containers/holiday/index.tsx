import React, { useState, useRef, FC, useCallback } from 'react';
import { Dialog, Button, Notify } from 'zent';
import { HolidayModify } from './components/holiday-modify';
import { HolidayList } from '../../../components/holiday-list';
import { createHoliday, updateHoliday, deleteHoliday, CustomHolidayData } from '../../../api/holiday';
import { getScheduleListAPI } from '../../api';
import { isEduHqStore } from '@youzan/utils-shop';
import { date } from '@youzan/utils';

const HolidaySetting: FC = () => {
  const [modifyDialogVisible, setModifyDialogVisible] = useState(false);
  const [deleteScheduleDialogVisible, setDeleteScheduleDialogVisible] = useState(false);
  const [modifyItem, setModifyItem] = useState<CustomHolidayData>();
  const [modifiedData, setModifiedData] = useState<any>();
  const holidayListRefetcher = useRef<(reset?: boolean) => void>();

  const toggleModifyDialog = useCallback((visible: boolean, item?: any) => {
    if (visible) {
      setModifyItem(item);
    }
    setModifyDialogVisible(visible);
  }, []);

  const toggleDeleteScheduleDialog = useCallback((visible: boolean, modifiedData?: any) => {
    if (visible) {
      setModifiedData(modifiedData);
    }
    setDeleteScheduleDialogVisible(visible);
  }, []);

  return (
    <div className="edu-settings" style={{ paddingTop: 0 }}>
      <HolidayList
        type="setting"
        onCreate={() => toggleModifyDialog(true)}
        onModify={(item) => toggleModifyDialog(true, item)}
        onDelete={(id) => deleteHoliday({ holidayId: id })
          .then(() => holidayListRefetcher.current && holidayListRefetcher.current())
          .catch(err => Notify.error(err))
        }
        refetcherRef={holidayListRefetcher}
      />
      <HolidayModify
        visible={modifyDialogVisible}
        create={!modifyItem}
        onClose={() => toggleModifyDialog(false)}
        onModify={async (item, isCreate) => {
          try {
            if (isCreate) {
              await createHoliday({ item });
            } else {
              await updateHoliday({
                item: {
                  holidayId: modifyItem!.id,
                  ...item,
                },
              });
            }
            Notify.success(isCreate ? '新建成功' : '编辑成功');
            holidayListRefetcher.current && holidayListRefetcher.current(isCreate);
          } catch (err) {
            Notify.error(err);
            return;
          }

          try {
            const option: any = {
              query: {
                startTime: new Date(item.startTime).getTime(),
                endTime: new Date(item.endTime).getTime(),
              },
              page: {
                pageSize: 1,
                pageNumber: 1,
              },
            };
            if (isEduHqStore && !isCreate && modifyItem!.kdtId !== _global.kdtId) {
              option.query.kdtId = modifyItem!.kdtId;
            }
            const scheduleList = await getScheduleListAPI(option);
            toggleModifyDialog(false);
            if (scheduleList.total > 0) {
              toggleDeleteScheduleDialog(true, { item, isCreate });
            }
          } catch (err) {
            Notify.error(err);
          }
        }}
        modifyItem={modifyItem}
      />
      {modifiedData &&
      <Dialog
        style={{ width: 396 }}
        maskClosable={false}
        visible={deleteScheduleDialogVisible}
        title="提示"
        onClose={() => toggleDeleteScheduleDialog(false)}
        footer={<>
          <Button onClick={() => toggleDeleteScheduleDialog(false)}>暂不删除</Button>
          <Button onClick={() => {
            const startTime = new Date(modifiedData.item.startTime).getTime();
            let url = `${_global.url.v4}/vis/edu/page/schedule#/panel/list?scheduleType=custom&startTime=${startTime}&endTime=${modifiedData.item.endTime}`;
            if (isEduHqStore && modifyItem && modifyItem.kdtId !== _global.kdtId) {
              url += `&kdtId=${modifyItem.kdtId}`;
            }
            window.open(url);
            toggleDeleteScheduleDialog(false);
          }} type="primary">前往删除</Button>
        </>}
      >
        <p>
          你已{modifiedData.isCreate ? '新建' : '编辑'}节假日“
          {`${modifiedData.item.name} ${
            date.makeDateStr(modifiedData.item.startTime)
          }至${
            date.makeDateStr(modifiedData.item.endTime)
          }`}
          ”
        </p>
        <p>可删除节假日内的排课，以免影响正常教学安排。</p>
      </Dialog>}
    </div>
  );
};

export default HolidaySetting;
