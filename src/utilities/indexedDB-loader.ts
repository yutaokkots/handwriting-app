/**
 * Utility for loading data into indexedDB for client.
 * https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase
 */
//import { data } from '../data/masterData2'
import { data } from '../data/masterKanji'

import { IDBPDatabase, openDB } from 'idb';

interface CharacterData {
  id: string;
  values: string[];
}

export const loadDB = async (dbName: string) => {
  try {
    const db: IDBPDatabase = await openDB(dbName, 1, {
      upgrade(db) {
        const store = db.createObjectStore('characters', { keyPath: 'id' });
        store.createIndex('valuesIndex', 'values');
      },
    });

    const transaction = db.transaction('characters', 'readwrite');
    const objectStore = transaction.objectStore('characters');

    const requests: Promise<void>[] = Object.entries(data).map(
      async ([key, value]) => {
        const item: CharacterData = {
          id: key,
          values: value,
        };
        await objectStore.put(item);
      }
    );

    await Promise.all(requests);

    console.log('Data added to database successfully');
  } catch (err) {
    console.error('Error adding data to database:', err);
  }
};

// export const loadDB = async (dbName: string) => {
//     const idbRequestObj = window.indexedDB.open(dbName)
//     try {
//         // Data that is read/write is not complete until the transaction is complete. 
//         // .transaction() returns a IDBTransaction object, which contains the 'objectStore'.
//         idbRequestObj.onsuccess = (event) => {
            
//             const transaction = idbRequestObj.transaction("characters", "readwrite")
//             const objectStore = transaction.objectStore('characters')
            
//             Object.entries(data).forEach(([key, value]) => {
//                 const item = {
//                     id: key,
//                     values:value
//                 }
//                 objectStore.add(item, key)
//                 transaction.onsuccess = () => {
//                     console.log('Data added to database successfully');
//                 };
                
//                 transaction.onerror = (event) => {
//                     console.error('Error adding data to database:', event.target.error);
//                 };
//             })
//         }
            
//     } catch(err){
//         console.log("Failed to load data", err)
//     }
// }

// Retrieves stored indexedDB in a usable format
export const indexedDBLoader = (dbName:string) => {
    // Creates connection with indexedDB.
    // Creates a resource with the name, 'dbName' (in this app, "characterResource").
    const idbRequestObj = window.indexedDB.open(dbName)
    
    // During first time use, a database called 'characters' under 'characterResource' is created.
    idbRequestObj.onupgradeneeded = (event:Event) => {
        console.log(event)
        const db = idbRequestObj.result;
        db.createObjectStore('characters');
    }

    idbRequestObj.onsuccess = (event:Event) => {
        if (event && event.target){
            const db = idbRequestObj.result

            if (db.objectStoreNames.length > 1){
                console.log("part A")
            } else if (db.objectStoreNames.length == 1) {
                console.log("part B")
                const transaction = db.transaction("characters", "readwrite")
                const objectStore = transaction.objectStore('characters')

                Object.entries(data).forEach(([key, value]) => {
                    const item = {
                        id: key,
                        values:value
                    }
                    objectStore.add(item, key)
                })
                
            }
        }
    }

    idbRequestObj.onerror = () => {
        console.log("Error with database, some results may not show properly.")
        return ""
    }

}

// Checks if DB exists, then returns boolean
export const indexedDBCheck = () => {



}


