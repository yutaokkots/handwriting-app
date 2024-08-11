/**
 * 'initializeDB' dynamically imports the required modules (rather than import statements 
 * at the top of the code), because of conflict between Vite's requirement for ECMA and 
 * CommonJS-based code from 'absurd-sql' and '@jlongster' dependencies.
 * @returns 
 */

import { data } from './data/masterKanji'

let useRawIDB = true;

const cacheSize = 0;
const pageSize = 8192;

// Initializes the database.
const initializeDB = async () => {
    // sql.js is a javascript engine that allows running SQLite in the broswer.
    // It compiles the sqlite db engine to webassembly (wasm) using Emscripten.
    // 'sqlJsModule', and the 'initSqlJs' function initializes the library and returns a promise.
    // This is done so the .wasm fully loads before the module can be called and used.
    const sqlJsModule = await import('@jlongster/sql.js');

    // 'SQLiteFS' class acts as bridge between virtual file system (FS module) and 
    // the SQLite database backend. Translates file system operations into 
    // SQLite database files, allowing interaction with SQLite databases.
    const { SQLiteFS } = await import('absurd-sql');

    // Provides thread-safe way to interact with SQLite databases using 
    // SharedArrayBuffers and web workers. 
    const IndexedDBBackend = await import('absurd-sql/dist/indexeddb-backend');

    // Check if the sqlJsModule exports a default function
    const initSqlJs = sqlJsModule.default || sqlJsModule;

    // Initializes the library and returns a promise.
    // The 'sql-wasm.wasm' file (which the initSQLJs uses)
    // is located at 'public/wasm/bin/sql-wasm.wasm':
    let SQL = await initSqlJs({ locateFile: file => `/wasm/bin/${file}`});

    // SQL.FS is the file system (FS) interface provided by sql.js
    // Creates an instance of the SQLite db with integration with IndexedDB 
    let sqlFS = new SQLiteFS(SQL.FS, new IndexedDBBackend.default());

    // register_for_idb, registers the virtual FS (sqlFS) with the
    // SQL.js library. It allows the use of SQLite db operations while
    // the data is stored in indexedDB.
    SQL.register_for_idb(sqlFS);
  
    // Creates a directory in the virtual FS (that is managed by
    // SQL.js and Emscripten (and not in the actual host system)).
    SQL.FS.mkdir('/sql');
  
    // Mounts (makes accessible) a file system into the Emscripten VFS.
    // sqlFS <= instance of the SQLiteFS virtual file system
    // {} <= empty options
    // '/sql' <= the mount point path.
    SQL.FS.mount(sqlFS, {}, '/sql');
  
    // new SQL.Database() is a constructor to open or create a SQLite db.
    // '/sql/db.sqlite' <= file path within VFS, and file name.
    // { filename: true } <= option that db should be created as a file, rather than in-memory.
    let db = new SQL.Database('/sql/db.sqlite', { filename: true });
  
    // db.exec() executes SQL statements on the database.
    // PRAGMA page_size <= sets database page size (single page of db in SQLite).
    // PRAGMA journal_mode=MEMORY <= rollback journal is kept in memory rather than disk.
    db.exec(`
      PRAGMA page_size=8192;
      PRAGMA journal_mode=MEMORY;
    `);
    return db;
  };


// Retrieves the database from indexedDB and returns the object.
  const getRawIDBDatabase = async () => {
    return new Promise((resolve, reject) => {
      let req = globalThis.indexedDB.open('db.sqlite');
      req.onsuccess = e => {
        resolve(e.target.result);
      };
      req.onerror = e => {
        reject(e.target.result)
      }
      req.onblocked = e => {
        console.log('opening db is blocked');
      };
    });
  }

  async function readDataFromIndexedDB() {
    let _db = await getRawIDBDatabase();
    console.log(_db.objectStoreNames)
    console.log(_db.objectStoreNames.contains('kanji') && _db.objectStoreNames.contains('kana'))
    if (_db.objectStoreNames.contains('kanji') && _db.objectStoreNames.contains('kana')){
      let transaction = _db.transaction(['kanji', 'kana'], 'readonly');
      return new Promise((resolve, reject) => {
        let kanjiStore = transaction.objectStore('kanji');
        let kanaStore = transaction.objectStore('kana');
        let kanjiRequest = kanjiStore.getAll();
        let kanaRequest = kanaStore.getAll();
        let results = {};

        kanjiRequest.onsuccess = () => {
          results.kanji = kanjiRequest.result;
          if (results.kana) {
            resolve(results);
          }
        };
        kanaRequest.onsuccess = () => {
          results.kana = kanaRequest.result;
          if (results.kanji) {
            resolve(results);
          }
        };
        
        kanjiRequest.onerror = () => {
          reject(kanjiRequest.error);
        };
        kanaRequest.onerror = () => {
          reject(kanaRequest.error);
        };
      });
    } else {
      return
    }
  }

const listTables = (db) => {
  const stmt = db.prepare("SELECT name FROM sqlite_master WHERE type='table'");
  while (stmt.step()) {
    const row = stmt.getAsObject();
    console.log('Table:', row.name);
  }
  stmt.free();
};


// Loads the database.
const loadDB = async (kanjiData) => {

  let db = await initializeDB();
  const idb = await readDataFromIndexedDB()

  if (idb == undefined){
    try{
      db.exec(`
        CREATE TABLE IF NOT EXISTS kanji (
          key TEXT PRIMARY KEY,
          value TEXT
        )
      `)
      db.exec(`
        CREATE TABLE IF NOT EXISTS kana (
          key INTEGER PRIMARY KEY AUTOINCREMENT,
          kanji_key TEXT,
          value TEXT,
          FOREIGN KEY (kanji_key) REFERENCES kanji(key)
        )
      `)

    } catch(err){
      console.log(err)
    } 
    db.exec('BEGIN TRANSACTION');
  
    // Compiles the SQL statement into a prepared statement. 
    // 'INSERT OR REPLACE INTO' inserts key into new row if key does not exist, or 
    //    replaces the existing row if the key already exists. 
    let insertKanjiStmt = db.prepare('INSERT OR REPLACE INTO kanji (key, value) VALUES (?, ?)');
    let insertKanaStmt = db.prepare('INSERT OR REPLACE INTO kana (kanji_key, value) VALUES (?, ?)');
  
    for (const [key, values] of Object.entries(data)){
      insertKanjiStmt.run(key);
      values.forEach((value) => {
        insertKanaStmt.run(key, value)
      })
    }
    insertKanjiStmt.free()
    insertKanaStmt.free()
    db.exec('COMMIT');
    db.close()
    listTables(db);
  } else{
    let sqlDb = await getDatabase(); 
    await insertDataIntoSQL(sqlDb, idb);
  }

      // let indexedDBData = await readDataFromIndexedDB();
      // console.log(indexedDBData)
  // if (db == null) {
  //   if (useRawIDB) {
  //     db = await getRawIDBDatabase();
  //     if (db != null){
  //       return db;
  //     }
  //   }
  // }
  console.log(kanjiData)

}


onmessage = async(e) => {
  const {action, data} = e.data;
  if (action == "searchKanji"){
    
    try {
      const kanaArray = await loadDB(data)
      postMessage({success: true, data: kanaArray})
    } catch(err){
      postMessage({success: false, data: err.message})
    }
  }
}



loadDB();   





async function insertDataIntoSQL(db, data) {
  db.exec(`
  CREATE TABLE IF NOT EXISTS kanji (
    key TEXT PRIMARY KEY,
    value TEXT
  )
  `)
  db.exec(`
    CREATE TABLE IF NOT EXISTS kana (
      key INTEGER PRIMARY KEY AUTOINCREMENT,
      kanji_key TEXT,
      value TEXT,
      FOREIGN KEY (kanji_key) REFERENCES kanji(key)
    )
  `)
  let insertKanjiStmt = db.prepare('INSERT OR REPLACE INTO kanji (key, value) VALUES (?, ?)');
  let insertKanaStmt = db.prepare('INSERT OR REPLACE INTO kana (kanji_key, value) VALUES (?, ?)');

  // Inserting kanji data
  data.kanji.forEach(item => {
    insertKanjiStmt.run([item.key, item.value]);
  });

  // Inserting kana data
  data.kana.forEach(item => {
    insertKanaStmt.run([item.kanji_key, item.value]);
  });

  insertKanjiStmt.free();
  insertKanaStmt.free();
}


async function loadDataFromIndexedDBToSQL() {
  let indexedDBData = await readDataFromIndexedDB();
  let sqlDb = await getDatabase(); // Assuming getDatabase() opens the SQL.js database
  await insertDataIntoSQL(sqlDb, indexedDBData);
}

// // Call the function to load data
// loadDataFromIndexedDBToSQL().then(() => {
//   console.log('Data loaded from IndexedDB to SQL database');
// }).catch(err => {
//   console.error('Failed to load data:', err);
// });



const getDatabase = async ()  => {
  let db = await initializeDB()
  db = await getRawIDBDatabase();
  console.log(db)
  if (db == null) {
    if (useRawIDB) {
      db = await getRawIDBDatabase();
      console.log(db)
      return db;
    }

    const dbName = "db.sqlite"
    let path = `/sql/${dbName}`;

    const sqlJsModule = await import('@jlongster/sql.js');
    // Check if the sqlJsModule exports a default function
    const initSqlJs = sqlJsModule.default || sqlJsModule;

    // Initializes the library and returns a promise.
    // The 'sql-wasm.wasm' file (which the initSQLJs uses)
    // is located at 'public/wasm/bin/sql-wasm.wasm':
    let SQL = await initSqlJs({ locateFile: file => `/wasm/bin/${file}`});

    if (typeof SharedArrayBuffer === 'undefined') {
      let stream = SQL.FS.open(path, 'a+');
      await stream.node.contents.readIfFallback();
      SQL.FS.close(stream);
    }

    db = new SQL.Database(path, { filename: true });

    // Should ALWAYS use the journal in memory mode. Doesn't make
    // any sense at all to write the journal. It's way slower
    db.exec(`
      PRAGMA cache_size=-${cacheSize};
      PRAGMA page_size=${pageSize};
      PRAGMA journal_mode=MEMORY;
    `);
  }

  if (!useRawIDB) {
    let curPageSize = getPageSize(db);

    if (curPageSize !== pageSize) {
      db.exec('VACUUM');
      // Vacuuming resets the cache size, so set it back
      db.exec(`PRAGMA cache_size=-${cacheSize}`);
    }
  }

  return db;
}


function getPageSize(db) {
  let stmt = db.prepare('PRAGMA page_size');
  stmt.step();
  let row = stmt.getAsObject();
  stmt.free();
  return row.page_size;
}




// const loadDB = async (kanjiData) => {
//   let db = await initializeDB();

//   try{
//     db.exec(`
//       CREATE TABLE IF NOT EXISTS kanji (
//         key TEXT PRIMARY KEY,
//         value TEXT
//       )
//     `)
//     db.exec(`
//       CREATE TABLE IF NOT EXISTS kana (
//         key INTEGER PRIMARY KEY AUTOINCREMENT,
//         kanji_key TEXT,
//         value TEXT,
//         FOREIGN KEY (kanji_key) REFERENCES kanji(key)
//       )
//     `)
//     db.exec(`
//     CREATE TABLE IF NOT EXISTS metadata (
//         key TEXT PRIMARY KEY,
//         value TEXT
//     )
// `);
//   } catch(err){
//     console.log(err)
//   } 

//   // checks to see if kanji table is populated. 'metadata' table holds information
//   // 
//   const metaDataStmt = db.prepare('SELECT value FROM metadata WHERE key = ?')
//   let isLoadedFromMaster = false;
//   let entryCount = 0

//   try {
//     let result = metaDataStmt.get('loaded_from_master_kanji')
//     isLoadedFromMaster = result?.value === 'true'

//   } catch(err){
//     console.error('Metadata check error:', err)
//   } finally {
//     metaDataStmt.free()
//   }

//   let countStmt = db.prepare('SELECT COUNT(*) as count FROM kanji')
//   try {
//     let countResult = countStmt.get();
//     entryCount = countResult?.count || 0
//   } catch(err) {
//     console.log('Count check error:', err)
//   } finally {
//     countStmt.free()
//   }

//   const indexedDBDataLength = indexedDBData ? Object.keys(indexedDBData).length : 0;
//   const dataObjectLength = Object.keys(data).length;

//   // if the number of kanji is 0
//   if (!isLoadedFromMaster || entryCount !== dataObjectLength || dataObjectLength !== indexedDBDataLength) {
//     db.exec('BEGIN TRANSACTION');

//     // Compiles the SQL statement into a prepared statement. 
//     // 'INSERT OR REPLACE INTO' inserts key into new row if key does not exist, or 
//     //    replaces the existing row if the key already exists. 
//     let insertKanjiStmt = db.prepare('INSERT OR REPLACE INTO kanji (key, value) VALUES (?, ?)');
//     let insertKanaStmt = db.prepare('INSERT OR REPLACE INTO kana (kanji_key, value) VALUES (?, ?)');
  
//     for (const [key, values] of Object.entries(data)){
//       insertKanjiStmt.run(key);
//       values.forEach((value) => {
//         insertKanaStmt.run(key, value)
//       })
//     }
//     insertKanjiStmt.free()
//     insertKanaStmt.free()
//     db.exec('COMMIT');

//     // Update metadata
//     let updateMetadataStmt = db.prepare('INSERT OR REPLACE INTO metadata (key, value) VALUES (?, ?)');
//     updateMetadataStmt.run('loaded_from_master_kanji', 'true');
//     updateMetadataStmt.free();
//   }

//   if (kanjiData){
//     console.log(data)
//     // Prepares the statement to retrieve the kana 
//     const selectKanaStmt = db.prepare('SELECT value FROM kana WHERE kanji_key = ?')

//     // Executes the statement with the kanjiData parameter.
//     let kanaRows = selectKanaStmt.all(kanjiData)
//     let kanaArray = kanaRows.map((row) => row.value);
//     selectKanaStmt.free();
//     db.close()
//     return kanaArray
//   }
// db.close()
// }


///////
///////

/**
 * 


const loadDB = async (kanjiData) => {
  let db = await initializeDB();

  // Open IndexedDB connection and retrieve data
  const indexedDBData = await getDataFromIndexedDB();

  try {
    // ... (create tables if not exist) ...
  } catch (err) {
    console.log(err);
  }

  // Check if kanji table is populated
  const metaDataStmt = db.prepare('SELECT value FROM metadata WHERE key = ?');
  let isLoadedFromMaster = false;
  let entryCount = 0;

  // ... (check metadata and row count) ...

  console.log(entryCount);
  console.log(Object.keys(data).length);
  console.log(isLoadedFromMaster);

  // Check if IndexedDB data matches the data object
  const indexedDBDataLength = indexedDBData ? Object.keys(indexedDBData).length : 0;
  const dataObjectLength = Object.keys(data).length;

  if (!isLoadedFromMaster || entryCount !== dataObjectLength || dataObjectLength !== indexedDBDataLength) {
    // Decide which data source to use (indexedDBData or data)
    const dataSource = indexedDBData || data;

    db.exec('BEGIN TRANSACTION');
    let insertKanjiStmt = db.prepare('INSERT OR REPLACE INTO kanji (key, value) VALUES (?, ?)');
    let insertKanaStmt = db.prepare('INSERT OR REPLACE INTO kana (kanji_key, value) VALUES (?, ?)');

    for (const [key, values] of Object.entries(dataSource)) {
      insertKanjiStmt.run(key);
      values.forEach((value) => {
        insertKanaStmt.run(key, value);
      });
    }

    insertKanjiStmt.free();
    insertKanaStmt.free();
    db.exec('COMMIT');

    // Update metadata
    let updateMetadataStmt = db.prepare('INSERT OR REPLACE INTO metadata (key, value) VALUES (?, ?)');
    updateMetadataStmt.run('loaded_from_master_kanji', 'true');
    updateMetadataStmt.free();
  }

  // ... (rest of the code) ...
}

// Helper function to retrieve data from IndexedDB
const getDataFromIndexedDB = async () => {
  // Open IndexedDB connection and retrieve data from the relevant object store
  // Return the retrieved data or null if no data is found
};

 */

/////




/**
 * C/C++ based SQL Interface:
 * sqlite3 → The database connection object. Created by sqlite3_open() and destroyed by sqlite3_close().
 * sqlite3_stmt → The prepared statement object. Created by sqlite3_prepare() and destroyed by sqlite3_finalize().
 * sqlite3_open() → Open a connection to a new or existing SQLite database. The constructor for sqlite3.
 * sqlite3_prepare() → Compile SQL text into byte-code that will do the work of querying or updating the database. The constructor for sqlite3_stmt.
 * sqlite3_bind() → Store application data into parameters of the original SQL.
 * sqlite3_step() → Advance an sqlite3_stmt to the next result row or to completion.
 * sqlite3_column() → Column values in the current result row for an sqlite3_stmt.
 * sqlite3_finalize() → Destructor for sqlite3_stmt.
 * sqlite3_close() → Destructor for sqlite3.
 * sqlite3_exec() → A wrapper function that does sqlite3_prepare(), sqlite3_step(), sqlite3_column(), and sqlite3_finalize() for a string of one or more SQL statements.
 */