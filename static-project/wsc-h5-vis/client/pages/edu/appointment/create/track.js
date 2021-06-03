// track 平台项目地址：http://track.qima-inc.com/projects/293

export function logMakeAppointment(from = '') {
  window.yzlogInstance && window.yzlogInstance.log({
    et: 'click',
    ei: 'make_appointment',
    en: '预约日历页-预约课程',
    params: {
      from,
    },
  });
}
