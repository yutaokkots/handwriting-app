/**
 *  Dynamically import the required modules, because of conflict between Vite's
    import of CommonJS-based code from 'absurd-sql' and '@jlongster' dependencies.
 * @returns 
 */

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
      console.log("index.worker.js")
    return db;
  };



async function runQueries() {
    let db = await initializeDB();

    console.log(db)
    try {
      db.exec(`CREATE TABLE kv (key TEXT PRIMARY KEY, value TEXT)`);
      console.log('table created?')
    } catch (e) {
      console.log(e)
    }

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