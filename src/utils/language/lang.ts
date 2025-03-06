export function formatURL(path:string, lang:string) {

  if (path.includes('www.clientam.com/sso/Login?partnerID=agmbvi2022')) {
    return path
  }

  if (!path.includes('/en') && !path.includes('/es')) {
    return changeLang(lang, path)
  }

  return path

}

export function goHome(lang:string) {
  return changeLang(lang, '/')
}

export function getCallbackUrl(path: string) {
  const segments = path.split('/');
  if (segments.length <= 2) {
    return null;
  }
  return '/' + segments.slice(2).join('/');
}

export function changeLang(lang: string, path: string) {

  let paths = path.split('/')
  paths.splice(1, 0, lang)
  let joined_paths = paths.join('/')
  return joined_paths

}
