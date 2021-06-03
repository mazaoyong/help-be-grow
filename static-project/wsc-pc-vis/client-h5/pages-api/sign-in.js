import ajax from 'fns/ajax';

const signIn = {
  GetStudentList(data) {
    return ajax({
      url: '/v4/vis/h5/edu/getStudentList.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
  GetActionResult(data) {
    return ajax({
      url: '/v4/vis/h5/edu/getActionResult.json',
      method: 'GET',
      data,
      loading: false,
    });
  },
  SignIn(data) {
    return ajax({
      url: '/v4/vis/h5/edu/signIn.json',
      method: 'POST',
      data,
      loading: false,
    });
  },
  RemoveStudent(data) {
    return ajax({
      url: '/v4/vis/h5/edu/removeStudent.json',
      method: 'POST',
      data,
      loading: false,
    });
  },
  ChangeSignInState(data) {
    return ajax({
      url: '/v4/vis/h5/edu/changeSignInState.json',
      method: 'POST',
      data,
      loading: false,
    });
  },
};

export default signIn;
