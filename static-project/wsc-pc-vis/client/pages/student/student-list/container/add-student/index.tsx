import { Popover } from '@zent/compat';
import React, { FC } from 'react';
import { Button, Menu } from 'zent';
import VersionWrapper from 'fns/version';

import { StudentImportLink } from '@ability-center/student';
import {
  INavigateToEnrollmentOption,
  EnrollmentSource,
  EnrollmentLink,
} from '@ability-center/assets';

import { IAddStudentProps } from './types';

const enrollmentOption: INavigateToEnrollmentOption = {
  source: EnrollmentSource.offline,
};

const AddStudent: FC<IAddStudentProps> = () => {
  return (
    <VersionWrapper name="student-list-operators">
      <Popover className="add-student" position={Popover.Position.BottomLeft} cushion={8}>
        <Popover.Trigger.Click>
          <Button className="add-student__btn" type="primary">
            添加学员
          </Button>
        </Popover.Trigger.Click>
        <Popover.Content>
          <Menu className="add-student__menu-list">
            <Menu.MenuItem>
              <EnrollmentLink {...enrollmentOption} target="_self">
                办理报名
              </EnrollmentLink>
            </Menu.MenuItem>
            <Menu.MenuItem>
              <StudentImportLink target="_self">导入学员</StudentImportLink>
            </Menu.MenuItem>
          </Menu>
        </Popover.Content>
      </Popover>
    </VersionWrapper>
  );
};

export default AddStudent;
