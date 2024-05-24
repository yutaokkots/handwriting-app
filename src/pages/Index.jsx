import React from 'react'

// sql.js is a javascript engine that allows running SQLite in the broswer.
// It compiles the sqlite db engine to webassembly (wasm) using Emscripten.
import initSqlJs from '@jlongster/sql.js'

// SQLiteFS is a virtual file system (FS) that integrates the Emscripten FS, 
// stored and persisted in IndexedDB.
import { SQLiteFS } from 'absurd-sql'

// IndexedDBBackend is a storage backend for the virtual FS .
// It is a low-level API for storing data. 
import IndexedDBBackend from 'absurd-sql/dist/indexeddb-backend'

export const Index = () => {
    const initializeDB = async () => {
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



    return (
        <div>Index</div>
    )
}
