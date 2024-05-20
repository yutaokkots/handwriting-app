// import WebWorker from '';


//import fetch from 'cross-fetch'

// import { Blob } from 'blob-polyfill'

// export const workerUrl = async () => {
//     const response = fetch(
//         "https://cdn.jsdelivr.net/npm/sql.js-httpvfs/dist/sqlite.worker.js"
//     )
//     const workerScript = await response.text()
//     const workerBlob = new Blob(
//         [workerScript], 
//         {
//             type: "application/javascript"
//         }
//     )
//     const workerUrl = URL.createObjectURL(workerBlob);

//     return workerUrl
// }





// const wasmUrl = "https://cdn.jsdelivr.net/npm/sql.js-httpvfs/dist/sql-wasm.wasm"

// const workerUrl = "blob:https://mjbo.static.observableusercontent.com/3db62db6-f32f-4d28-89a4-696892fc7684"

// const workerUrl = URL.createObjectURL(
//     new Blob(
//       [
//         await fetch(
//           "https://cdn.jsdelivr.net/npm/sql.js-httpvfs/dist/sqlite.worker.js"
//         ).then((d) => d.text())
//       ],
//       {
//         type: "application/javascript"
//       }
//     )
//   )