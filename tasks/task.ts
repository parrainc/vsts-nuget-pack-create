//Grab the vsts task library helpers
import tl = require('vsts-task-lib/task');
import trm = require('vsts-task-lib/toolrunner');
import { isNullOrUndefined } from 'util';
import fs = require('fs');

async function run() {
    try {
        let tool: trm.ToolRunner;

        //Get variables
        let source: string = tl.getInput('source');
        let nuspecPath: string = tl.getPathInput('nuspecPath');
        let overrideTags: boolean = tl.getBoolInput('overridetags');
        let assemblyPath: string = tl.getPathInput('assemblyPath');

        //make sure parameters aren't null
        if(isNullOrUndefined(nuspecPath))
        {
            throw new Error("[!] Missing required input: sourcePath");
        }

        //read file
        let specFile: string = fs.readFileSync(nuspecPath, 'utf-8');

        console.log(specFile);
        console.log("Done!");
    } catch (error) {
        tl.setResult(tl.TaskResult.Failed, error.message);
    }
}

run();