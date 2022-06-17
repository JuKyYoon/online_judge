import {spawn, spawnSync} from 'child_process';
import path from 'path';
import fs from 'fs';
import MyError from '../model/error.model.js';
export default class CJudge {

    constructor(pbno) {
        this.source = `submission/${pbno}.c`
        this.out = `submission/${pbno}.out`
        this.pbno = pbno
    }

    writeFile(source) {
        fs.writeFile(this.source, source, 'utf8', function(error){
            console.log('complete Write')
        });
    }

    async compile(callback,failCallback) {
        const args = [this.source, '-o', this.out, '-Wall', '-g']
        const compiler = spawn('gcc', args);
        let errCheck = false;
        let errorMsg ="";
        compiler.stdout.on('data', (data)=> {
            console.log(`stdout ${data}`)
        })

        compiler.stderr.on('data', (data) => {
            console.log(`error1 ${data}`)
            errCheck = true;
            errorMsg += String(data);
            // failCallback(String(data));
            // throw new MyError(500, String(data));
        })

        compiler.on('close', (data) => {
            console.log(data)
            if(data == 0 && !errCheck) {
                let answer = []
                let returnResult = []
                let outputData = fs.readFileSync(`submission/${this.pbno}/output.txt`, 'utf8');
                answer = outputData.toString().trim().split("\r\n")
                console.log(answer)
                fs.readFile(`submission/${this.pbno}/input.txt`, 'utf8' , (err, data) => {
                    if (err) {
                      console.error(err)
                      failCallback("read input file fail")
                    }
                    const arr = data.toString().split("\n");
                    for(let i = 0; i < arr.length; i++) {
                        // this.execute(arr[i], answer[i], result, callback, i == arr.length - 1);
                        let startTime = new Date();
                        const result = spawnSync(this.out, {
                            input: arr[i],
                            timeout: 1000 // ms 
                        });
                        let endTime = new Date();
                        
                        let output = result.stdout.toString("utf-8");
                        const errorCheck= result.error;
                        const runtimeCheck = result.signal;
                        // console.log(result.stdout.toString("utf-8"))
                        // console.log(result.stderr.toString("utf-8"))
                        console.log(result)
                        if(errorCheck) {
                            const errcode = result.error.code;
                            if(errcode == 'ETIMEDOUT') {
                                returnResult.push({"result" : {"status": "fail", "type":"time"}});
                                return callback(returnResult)
                            } else {
                                returnResult.push({"result" : {"status": "fail", "type":"runtime"}});
                                return callback(returnResult)
                            }
                        } else {
                            if(runtimeCheck == "SIGSEGV") {
                                returnResult.push({"result" : {"status": "fail", "type":"runtime"}});
                            } else {
                                console.log(output, answer[i], output === answer[i])
                                if(output === answer[i]) {
                                    returnResult.push({"result" : {"status": "success", "type":endTime - startTime}});
                                } else {
                                    returnResult.push({"result" : {"status": "fail", "type":"unmatched"}});
                                }
                            }
                        }

                    }
                    callback(returnResult);
                })
            } else if (data == 0 && errCheck) {
                callback([{"result" : {"status": "fail", "type":"warning", "msg" : errorMsg}}])
            } else  {
                console.log(errorMsg)
                callback([{"result" : {"status": "fail", "type":"compile"}}])
            }
        })
    }

    // 콜백으로 작동
    async execute(input, answer, result, callback, status) {
        console.log("execute",)

        // const executer = spawn(this.out, {
        //     stdio: [
        //         fs.openSync('submission/input.txt', 'r'),
        //         'pipe'
        //     ]
        // }); //child process
        const executer = spawn(this.out);

        executer.stdout.on('data', (output) => {
            console.log("output: ", String(output), output)
            console.log(`answer: ${answer}`)
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