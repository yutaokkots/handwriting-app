import {SQLiteHTTPVFSDatabaseClient} from "@mjbo/sqljs-httpvfs"

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