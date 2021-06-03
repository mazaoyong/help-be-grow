export function parseCancelAppointmentRules(item) {
  if (!item) {
    return;
  }
  const { canCancelAppointmentSetting, canCancelAppointmentHour = 0 } = item;
  if (canCancelAppointmentSetting === undefined || canCancelAppointmentSetting === null) {
    return null;
  } else if (!canCancelAppointmentSetting) {
    return '不允许取消';
  }
  return `上课前${canCancelAppointmentHour}小时允许取消`;
};
