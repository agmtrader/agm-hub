export function formatURL(path:string, lang:string) {

    if (!path.includes('/en') && !path.includes('/es')) {
      return changeLang(lang, path)
    }

    return path

}

export function changeLang(lang: string, path: string) {

  let paths = path.split('/')
  paths.splice(1, 0, lang)
  let joined_paths = paths.join('/')
  return joined_paths

}
