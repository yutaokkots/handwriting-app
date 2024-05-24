import {SQLiteHTTPVFSDatabaseClient} from "@mjbo/sqljs-httpvfs"

import { workerUrl } from '../workers/sqliteWorker'

const wasmUrl = "https://cdn.jsdelivr.net/npm/sql.js-httpvfs/dist/sql-wasm.wasm"

const dbInline = SQLiteHTTPVFSDatabaseClient.open({
    configs:
    {
        from: "inline",
        config: {
            serverMode: "full",
            url: "https://___",
            requestChunkSize: 4096
        }
    }
})