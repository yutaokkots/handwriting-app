import express from 'express';
import path from 'path';
import logger from 'morgan';

const app = express();

app.use(logger('dev'));

app.use(express.json());

app.use(express.static(path.join(new URL(import.meta.url).pathname, 'dist')));
console.log("ROUTE?");

// Put all API routes here (before the catch-all)
import  yomiRouter  from './routes/api/yomi.js';
app.use('/api', yomiRouter);

app.use(express.static(path.join(new URL(import.meta.url).pathname, '..', 'dist')));

console.log("Before Catchall");

// app.get('/*', (req, res) => {
//     res.sendFile(path.join(new URL(import.meta.url).pathname, 'dist', 'index.html'));
// });

app.get('/*', (req, res) => {
    res.sendFile(path.join(new URL(import.meta.url).pathname, '..', 'dist', 'index.html'));
});

console.log("After Catchall");

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Express app running on port ${port}`);
});





///
// import express from 'express';
// import path from 'path';
// import logger from 'morgan';

// //import { fileURLToPath } from 'url';

// //const __dirname = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(import.meta.url);

// const app = express();

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.static(path.join(__dirname, 'dist')));

// // Put all API routes here (before the catch-all)

// console.log("ROUTE?")

// import yomiRouter from './routes/api/yomi.js';  
// app.use('/api/yomi', yomiRouter);

// //app.use('/api/yomi', require('./routes/api/yomi'))


// // app.get('/*', (req, res) => {
//     //       res.sendFile(path.join(__dirname, 'dist', 'index.html'));
//     //     });
    
// console.log("no ROUTE")

// app.get('/*', function(req, res) {
//     const dirname = path.dirname(new URL(import.meta.url).pathname);
//     res.sendFile('index.html', { root: path.join(dirname, 'dist') });
// });

// console.log("after catchall")


// // app.get('/*', function(req, res) {
// //     res.sendFile('dist/index.html', { root: __dirname });
// //     });

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Express app running on port ${port}`);
// });

/////

///// ver2

// import express from 'express';
// import path from 'path';
// import logger from 'morgan';
// // import dotenv from 'dotenv';
// // dotenv.config();
// // import './config/database';

// const app = express();

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.static(path.join(path.dirname(import.meta.url), 'dist')));

// // Put all API routes here (before the catch-all)
// import yomiRouter from './routes/api/yomi.js';
// app.use('/api/yomi/', yomiRouter);

// app.get('/*', (req, res) => {
//   res.sendFile(path.join(path.dirname(import.meta.url), 'dist', 'index.html'));
// });

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Express app running on port ${port}`);
// });


//////// ver1:

// // import express from 'express';
// // import path from 'path'
// // import logger from 'morgan'

// const express = require('express');
// const path = require('path');
// const logger = require('morgan');
// // require('dotenv').config();
// // require('./config/database')

// const app = express();

// app.use(logger('dev'));

// app.use(express.json());

// app.use(express.static(path.join(__dirname, 'dist')));

// console.log("ROUTE?")

// // Put all API routes here (before the catch-all)
// // import yomiRouter from './routes/api/yomi.js';
// // app.use('/api/yomi/', yomiRouter);
// app.use('/api/quotes', require('./routes/api/yomi'))


// console.log("Before Catchall")

// app.get('/*', function(req, res) {
//     res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

// console.log("after Catchall")

// const port = process.env.PORT || 3000;

// app.listen(port, function() {
//     console.log(`Express app running on port ${port}`)
// });