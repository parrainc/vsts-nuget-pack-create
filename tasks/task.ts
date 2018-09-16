import tl = require('vsts-task-lib/task');
import trm = require('vsts-task-lib/toolrunner');
import fs = require('fs');
import * as nuspec from './nuspec';
import * as assembly from './assemblies';

async function run() {
    try {
        let tool: trm.ToolRunner;
        
        //Get variables
        let source: string = tl.getInput('source');
        let strph: string = tl.getInput('placeholder');
        let boolph: boolean = tl.getBoolInput('testBoolean');

        console.log("selected source: " + source);

        switch (source) {
            case "nuspec":
                nuspec.packFromNuspec();
                break;
            case "assemblies":
                assembly.packFromAssemblies();
                break;
            default:
                tl.error("unknown source");
                tl.setResult(tl.TaskResult.Failed, `[!] Selected source is invalid: ${source}`);
                break;
        }
        
        console.log("Task Done!");
    } catch (error) {
        tl.error(error);
        tl.setResult(tl.TaskResult.Failed, error.message);
    }
}

run();