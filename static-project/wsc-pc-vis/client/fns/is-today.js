export default data => {
  return new Date(data).toDateString() === new Date().toDateString();
};
