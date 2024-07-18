import { DocumentData } from "firebase/firestore/lite";
import { Map, Ticket } from "@/lib/types";

export function sortColumns(data: DocumentData[], columns:string[]) {

    Object.keys(data[0]).forEach((key) => {
        if (!columns.includes(key)) {
            delete data[0][key]
        }
    })

    const sortedKeys = Object.keys(data[0]).sort((a, b) => columns.indexOf(a) - columns.indexOf(b));
    const objs:DocumentData[] = []

    data.forEach((row:Map) => {
        let sortedObj:Map = {}

        sortedKeys.forEach(key => {
            sortedObj[key] = row[key];
        });

        objs.push(sortedObj)
    })

    return objs

}