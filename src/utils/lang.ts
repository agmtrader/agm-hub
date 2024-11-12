export function formatURL(path:string, lang:string) {

    if (!path.includes('/en') && !path.includes('/es')) {
      return changeLang(lang, path)
    }

    return path
}

// Make sure to redirect to the default language if the path is not the default language
export function changeLang(lang: string, path: string) {
  let paths = path.split('/')
  paths.splice(1, 0, lang)
  let joined_paths = paths.join('/')
  return joined_paths
}
