import express from 'express';
import connection from  "../../controllers/connection.js"
const router = express.Router();

router.get("/connect", connection)

export default router;
