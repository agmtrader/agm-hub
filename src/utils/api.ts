import { 
    collection, 
    doc, 
    getDocs, 
    getDoc, 
    setDoc, 
    DocumentData, 
    query, 
    where, 
    updateDoc
} from "firebase/firestore/lite";

import { db } from "@/utils/firestore";

export async function getDocumentsFromCollection(path: string) {

    const documents:Array<DocumentData> = []

    const documentsCollection = await getDocs(collection(db,path)).then(async (data) => await data)

    documentsCollection.forEach((document) => {
        documents.push(document.data())
    })

    return documents
}

export async function queryDocumentsFromCollection(path: string, key: string, value:string) {

    const documents:Array<DocumentData> = []

    const q = query(collection(db, path), where(key, '==', value));
    const documentsCollection = await getDocs(q).then(async (data) => await data)

    documentsCollection.forEach((document) => {
        documents.push(document.data())
    })

    return documents
}

export async function addDocument(data: {}, path:string, id:string) {

    console.log('Adding document: ', data)
    await setDoc(doc(db, path, id), data)
  
}

export async function getDocument(path:string) {

    var document = null;

    const documentReference = await getDoc(doc(db,path)).then(async (data) => await data)
    document = documentReference.data()
    
    return document

}

export async function getDocumentReference(path:string) {

    const documentReference = doc(db,path)
    
    return documentReference

}

// Find way of only using foreign tables
export async function getForeignTables(documents:DocumentData[]  ) {

    for (const d of documents) {

        for (const key of Object.keys(d)) {
    
            if (typeof(d[key]) == 'object') {

                const foreignTablePath = d[key].path
                
                console.log(foreignTablePath)

                const foreignTable = await getDocument(foreignTablePath)
                console.log(foreignTable)
                
                // Check if foreign table is table or column
                // Append each column if is table

                delete d[key]
                if (foreignTable) {
                    Object.keys(foreignTable!).forEach((col) => {
                        d[col] = foreignTable![col]
                    })
                }
            }
        }
    }
    return documents
  }

// Find way of using only json strings
export async function addColumnsFromJSON(documents:DocumentData[]) {

    for (const d of documents) {

        for (const key of Object.keys(d)) {

            if (typeof(d[key]) == 'object') {
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

export async function updateFieldInDocument(path:string, key:string, value:string) {

    await updateDoc(doc(db, path), {
        [key]: value
    })

}