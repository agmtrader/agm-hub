export async function addColumnsFromJSON(documents:any[]) {

  for (const d of documents) {

      for (const key of Object.keys(d)) {

          if (typeof(d[key]) == 'object' && d[key]) {
              let json = d[key]
              Object.keys(json).forEach((col) => {
                  d[col] = json[col]
              })
              delete d[key]
          }
      }
  }
  return documents
}
