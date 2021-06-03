
export const mutations = {
  SET_STUDENT_REFRESH(state, isNeedRefresh) {
    state.student.isNeedRefresh = isNeedRefresh;
  },

  SET_CHOSEN_STUDENT(state, student) {
    state.student.chosenId = student.id;
  },

  SET_STUDENT_LIST(state, list) {
    state.student.list = list;
  },

  SET_INFO_COLLECT_DATA(state, data) {
    state.infoCollect.data = data;
  },

  SET_INFO_COLLECT_POPUP(state, data) {
    state.infoCollect.isOpenPopup = data;
  },

  SET_CLASS_ADDRESS_LIST(state, addressList) {
    state.classAddress.list = addressList;
  },

  SET_CLASS_ADDRESS_DOWN(state, data) {
    state.classAddress.down = data;
  },

  SET_CHOSEN_CLASS_ADDRESS(state, address) {
    state.classAddress.chosenId = address.id;
  },

  SET_CHOSEN_CLASS_TIME(state, time) {
    state.classTime.chosenTime = time;
  },

  SET_CHOSEN_APPOINTMENT(state, appointment) {
    state.appointment = appointment;
  },
};
