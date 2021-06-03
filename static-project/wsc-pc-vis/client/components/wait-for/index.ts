const waitFor: (milsec: number) => Promise<void> = (milsec) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, milsec);
  });
};

export default waitFor;
