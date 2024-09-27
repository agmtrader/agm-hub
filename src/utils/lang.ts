
export function formatURL(path:string, lang:string) {
    if (path.includes('https://')) {
      return path
    }

    if (!path.includes('/en') && !path.includes('/es')) {
      let paths = path.split('/')
      paths.splice(1, 0, lang)
      let paths1 = paths.join('/')
      return paths1
    }

    return path
  }