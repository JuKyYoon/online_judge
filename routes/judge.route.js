import express from "express";
import JudgeController from '../controller/judge.controller.js';
import path from 'path';
const __dirname = path.resolve();
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
router.post('/:pbno', JudgeController.submitProblem);

export default router;