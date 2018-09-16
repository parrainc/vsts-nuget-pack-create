//Grab the vsts task library helpers
import tl = require('vsts-task-lib/task');
import trm = require('vsts-task-lib/toolrunner');
import { isNullOrUndefined } from 'util';
import fs = require('fs');
import * as xml2js from 'xml2js';

const nuspecExt: string = '.nuspec';
const assemblyExt: string = '.dll';

async function run() {
    try {
        let tool: trm.ToolRunner;

        //Get variables
        let source: string = tl.getInput('source');
        let nuspecPath: string = tl.getPathInput('nuspecPath');
        let overrideTags: string = tl.getInput('overridetags');
        let tagsToOverride: string = tl.getInput('tagsToOverride');
        let assemblyPath: string = tl.getPathInput('assemblyPath');
        let strph: string = tl.getInput('placeholder');
        let boolph: boolean = tl.getBoolInput('testBoolean');

        //make sure required parameters aren't null
        if (source == "nuspec") {
            if(isNullOrUndefined(nuspecPath)) {
                tl.error("nuspecPath cannot be null or undefined");
                throw new Error("[!] Missing required input: sourcePath");

            } else {
                if (!isValidFileExtension(nuspecPath, nuspecExt)) {
                    tl.error("File extension is invalid");
                    throw new Error("[!] Error, file extension is invalid.");

                }
            }
        } else if (source == "assemblies") {
            
            if(isNullOrUndefined(assemblyPath)) {
                tl.error("AssemblyPath cannot be null or undefined");
                throw new Error("[!] Missing required input: assemblyPath");

            } else {
                
                if (!isValidFileExtension(assemblyPath, assemblyExt)) {
                    tl.error("File extension is invalid");
                    throw new Error("[!] Error, file extension is invalid.");
                }
            }
        } else {
            tl.error("unknown source");
            throw new Error(`[!] Selected source is invalid: ${source}`);
        }

        if (overrideTags == "yes") {
            tl.debug("Override Tags = " + overrideTags);
            
        }

        console.log("source: " + source);
        console.log("nuspec file path: " + nuspecPath);
        console.log("override tags?: " + overrideTags);
        console.log("tags overwritten: " + tagsToOverride);
        console.log("assembly path: " + assemblyPath);

        console.log("Task Done!");
    } catch (error) {
        tl.setResult(tl.TaskResult.Failed, error.message);
    }
}

function isValidFileExtension(filePath: string, fileExtension: string) : boolean {
    return filePath.endsWith(fileExtension);
}

run();