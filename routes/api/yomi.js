/**
 * Yomi route directs the endpoint for retrieving the
 * hiragana equivalent of kanji from stored file (.json file).
 */

import express from 'express';
import getYomi from  "../../controllers/yomi.js"
const router = express.Router();

router.get("/yomi/:chr", getYomi)

export default router;
