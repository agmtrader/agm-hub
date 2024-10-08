import { Map } from "@/lib/types";

export function sortColumns(data: any[], columns:string[]) {

    Object.keys(data[0]).forEach((key) => {
        if (!columns.includes(key)) {
            delete data[0][key]
        }
    })

    const sortedKeys = Object.keys(data[0]).sort((a, b) => columns.indexOf(a) - columns.indexOf(b));
    const objs:any[] = []

    data.forEach((row:Map) => {
        let sortedObj:Map = {}

        sortedKeys.forEach(key => {
            sortedObj[key] = row[key];
        });

        objs.push(sortedObj)
    })

    return objs

}

// Find way of using only json strings
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
