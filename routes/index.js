import express from "express";
const router = express.Router();

import judge from './judge.route.js';
router.use('/judge', judge);

export default router;