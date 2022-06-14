import {spawn} from 'child_process';
import path from 'path';
import fs from 'fs';
import MyError from '../model/error.model.js';
export default class CJudge {

    constructor() {
        this.source = "submission/test.c"
        this.out = "submission/test.out"
    }

    writeFile(source) {
        fs.writeFile(this.source, source, 'utf8', function(error){
            console.log('complete Write')
        });
    }

    async compile(callback) {
        const args = [this.source, '-o', this.out]
        const compiler = spawn('gcc', args);

        compiler.stdout.on('data', (data)=> {
            console.log(`stdout ${data}`)
        })

        compiler.stderr.on('data', (data) => {
            console.log(`error ${data}`)
            throw new MyError(500, String(data));
        })

        compiler.on('close', (data) => {
            if(data == 0) {
                let answer = []
                let result = []
                fs.readFile('submission/output.txt', 'utf8' , (err, data) => {
                    if (err) {
                      console.error(err)
                      return 0;
                    }
                    answer = data.toString().split("\n");
                })

                fs.readFile('submission/input.txt', 'utf8' , (err, data) => {
                    if (err) {
                      console.error(err)
                      return 0;
                    }
                    const arr = data.toString().split("\n");
                    for(let i = 0; i < arr.length; i++) {
                        this.execute(arr[i], answer[i], result, callback, i == arr.length - 1);
                    }
                })

            }
        })
    }

    execute(input, answer, result, callback, status) {
        console.log("execute",)

        // const executer = spawn(this.out, {
        //     stdio: [
        //         fs.openSync('submission/input.txt', 'r'),
        //         'pipe'
        //     ]
        // }); //child process
        const executer = spawn(this.out);

        executer.stdout.on('data', (output) => {
            // console.log("output: ", String(output))
            // console.log(`answer: ${answer}`)
            if(answer == String(output).trim()) {
                result.push(true);
            } else {
                result.push(false);
            }
        })

        executer.stderr.on('data', (output) => {
            console.log(`error`)
            throw new MyError(500, String(output));
        })

        executer.stdin.write(input);
        executer.stdin.end(); // EOF

        executer.on('close', (output) => {
            // console.log(`close ${output}`)
            if(status) {
                callback(result);
            }
        })
    }



};