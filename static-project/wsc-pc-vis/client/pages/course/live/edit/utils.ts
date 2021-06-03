const urlMatchRes = window.location.href.match(/edit\/(.*)/);
export const editAlias = urlMatchRes ? urlMatchRes[1] : null;
