import express from 'express';
import path from 'path';
import logger from 'morgan';
import yomiRouter from './routes/api/yomi.js';

const app = express();

app.use(logger('dev'));

app.use(express.json());

app.use(express.static(path.join(new URL(import.meta.url).pathname, 'dist')));

// Put all API routes here (before the catch-all)
app.use('/api', yomiRouter);

app.use(express.static(path.join(new URL(import.meta.url).pathname, '..', 'dist')));

// Catch-all API-route
app.get('/*', (req, res) => {
    res.sendFile(path.join(new URL(import.meta.url).pathname, '..', 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Express app running on port ${port}`);
});
