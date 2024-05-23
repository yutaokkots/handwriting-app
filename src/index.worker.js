/**

// sql.js is a javascript engine that allows running SQLite in the broswer.
// It compiles the sqlite db engine to webassembly (wasm) using Emscripten.
// import __vite__cjsImport0__jlongster_sql_js from "/node_modules/.vite/deps/@jlongster_sql__js.js?v=af7567eb";
import initSqlJs from '@jlongster/sql.js'

// SQLiteFS is a virtual file system (FS) that integrates the Emscripten FS, 
// stored and persisted in IndexedDB.
import { SQLiteFS } from 'absurd-sql'

// IndexedDBBackend is a storage backend for the virtual FS .
// It is a low-level API for storing data. 
import IndexedDBBackend from 'absurd-sql/dist/indexeddb-backend'


export const initializeDB = async () => {
    // initializes the library and returns a promise.
    // {locateFile: file => file} is a function that returns the file name as is
    // implies that the .wasm file is expected to be in the same directory. 
    let SQL = await initSqlJs({ locateFile: file => file });
    
    // SQL.FS is the file system (FS) interface provided by sql.js
    let sqlFS = new SQLiteFS(SQL.FS, new IndexedDBBackend());
    
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
    PRAGMA page_size = 8192;
    PRAGMA journal_mode=MEMORY;
    `)
    return db
}
*/

const initializeDB = async () => {
    // Dynamically import the required modules
    const sqlJsModule = await import('@jlongster/sql.js');
    const { SQLiteFS } = await import('absurd-sql');
    const IndexedDBBackend = await import('absurd-sql/dist/indexeddb-backend');

    // Check if the sqlJsModule exports a default function
    const initSqlJs = sqlJsModule.default || sqlJsModule;

    // initializes the library and returns a promise.
    // {locateFile: file => file} is a function that returns the file name as is
    // implies that the .wasm file is expected to be in the same directory.
    
    //let SQL = await initSqlJs({ locateFile: (file) => file });

    // Update the locateFile function to correctly locate the sql-wasm.wasm file
    // const locateFile = (file) => {
    //     // Assuming the sql-wasm.wasm file is in the parent directory of the 'src' folder
    //     const sqlWasmPath = new URL('../sql-wasm.wasm', import.meta.url).href;
    //     return file === 'sql-wasm.wasm' ? sqlWasmPath : file;
    // };
    const locateFile = (file) => {
        if (file === 'sql-wasm.wasm') {
          // Use a dynamic import to load the sql-wasm.wasm file
          return import('../sql-wasm.wasm');
        }
        return file;
      };
    

    // Initializes the library and returns a promise.
    let SQL = await initSqlJs({ locateFile });

    // SQL.FS is the file system (FS) interface provided by sql.js
    let sqlFS = new SQLiteFS(SQL.FS, new IndexedDBBackend.default());

    // register_for_idb, registers the virtual FS (sqlFS) with the
    // SQL.js library. It allows the use of SQLite db operations while
    // the data is stored in indexedDB.
    SQL.register_for_idb(sqlFS);

    // // Dynamically import the required modules
    // const initSqlJs = await import('@jlongster/sql.js');
    // const { SQLiteFS } = await import('absurd-sql');
    // const IndexedDBBackend = await import('absurd-sql/dist/indexeddb-backend');
  
    // // initializes the library and returns a promise.
    // // {locateFile: file => file} is a function that returns the file name as is
    // // implies that the .wasm file is expected to be in the same directory.
    // let SQL = await initSqlJs({ locateFile: (file) => file });
  
    // // SQL.FS is the file system (FS) interface provided by sql.js
    // let sqlFS = new SQLiteFS(SQL.FS, new IndexedDBBackend.default());
  
    // // register_for_idb, registers the virtual FS (sqlFS) with the
    // // SQL.js library. It allows the use of SQLite db operations while
    // // the data is stored in indexedDB.
    // SQL.register_for_idb(sqlFS);
  
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

async function runQueries() {
    let db = await initializeDB();

    try {
        db.exec('CREATE TABLE kv (key TEXT PRIMARY KEY, value TEXT)');
    } catch (e) {}

    db.exec('BEGIN TRANSACTION');
    let stmt = db.prepare('INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)');
    for (let i = 0; i < 5; i++) {
        stmt.run([i, ((Math.random() * 100) | 0).toString()]);
    }
    stmt.free();
    db.exec('COMMIT');

    stmt = db.prepare(`SELECT SUM(value) FROM kv`);
    stmt.step();
    console.log('Result:', stmt.getAsObject());
    stmt.free();
}

runQueries();    