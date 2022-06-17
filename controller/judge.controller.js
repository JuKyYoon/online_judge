import Response from '../model/response.model.js';
import { exec } from 'child_process';
import fs from 'fs';
import CJudge from '../runner/cJudge.js';
export default class JudgeController {

    static submitProblem = async (req, res, next) => {
        try {
            function callback(result) {
                return res.status(200).json(new Response(200, 'success', 'success', result));
            }
            function failCallback(result) {
                return res.status(200).json(new Response(200, 'fail', 'compile error', result));
            }
            // const result
            const pbno = req.params.pbno.trim();
            const str = req.body.source;
            // const source = decodeURIComponent(str.replace(/\+/g, ' '));
            const source = decodeURI(str)
            // console.log(source);
            const cjudge = new CJudge(pbno);
            cjudge.writeFile(source);
            cjudge.compile(callback, failCallback);
            
        } catch (err) {
            next(err);
        }
    }
}