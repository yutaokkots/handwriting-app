//const express = require('express');

import express from 'express';
import getYomi from  "../../controllers/yomi.js"
const router = express.Router();

//const yomiCtrl = require('../../controllers/yomi')

console.log("ROUTES")
// GET yomi
// "/api/yomi/:chr"
router.get("/yomi/:chr", getYomi)
//router.get("/yomi/:chr", yomiCtrl)

export default router;

//module.exports = router;