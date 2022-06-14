import Response from '../model/response.model.js';
import { exec } from 'child_process';
import fs from 'fs';
import CJudge from '../runner/cJudge.js';
export default class JudgeController {

    static submitProblem = async (req, res, next) => {
        try {
            function callback(result) {
                return res.status(200).json(new Response(200, 'success', 'message2', result));
            }
            // const result
            const pbno = req.params.pbno;
            const str = req.body.source;
            const source = decodeURIComponent(str.replace(/\+/g, ' '));
            const cjudge = new CJudge();

            cjudge.writeFile(source);
            cjudge.compile(callback);

            
        } catch (err) {
            next(err);
        }
    }
}