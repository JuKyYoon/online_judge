import express from "express";
import JudgeController from '../controller/judge.controller.js';

const router = express.Router();

router.post('/:pbno', JudgeController.submitProblem);

export default router;