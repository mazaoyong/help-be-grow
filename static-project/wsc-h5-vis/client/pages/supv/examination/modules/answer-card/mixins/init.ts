const mixin: any = {
  rootActions: ['fetchAnswerCard'],

  created() {
    this.fetchAnswerCard();
  },
};

export default mixin;
