export default function getPath() : string {
  const pathRegEx = /\/([0-9a-zA-Z]*)#/.exec(window.location.href);
  return (pathRegEx && pathRegEx[1]) || '';
}
