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
            overrideNuspecNodes(nuspecPath, tagsToOverride);            
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

function overrideNuspecNodes(nuspecPath: string, tagsToOverride: string) {
    console.log("Overriding tags in nuspec file");
    
    tl.debug("Overriding nuspec tags");
    
    let nodesValues = 
    {
        "authors": "Carlos Parra",
        "description": "This is the new description"
    } //tagsToOverride.substr(1, tagsToOverride.indexOf('"')-1).trim()
    
    try {
        const parser = new xml2js.Parser();
        const builder = new xml2js.Builder();
        let newXml: string;
        let nuspecFile: string = readNuspecFile(nuspecPath);

        parser.parseString(nuspecFile, function (err, result) {
            if (err) console.log(err);

            tl.debug("Original .nuspec file: " + result);
            
            let json = result;

            Object.keys(nodesValues).forEach(key => {
                let hasProperty: boolean = json.package.metadata[0].hasOwnProperty(key);
                console.log(key);
                console.log(hasProperty);
                
                tl.debug(`Old value for ${key}: ` + json.package.metadata[0][key]);

                if (hasProperty) {
                    json.package.metadata[0][key] = nodesValues[key];
                } else {
                    // create property
                    tl.warning(`Property ${key} doesn't exists in file!`);
                }

                tl.debug(`New value for ${key}: ` + json.package.metadata[0][key]);
            });

            newXml = builder.buildObject(json);
            
            tl.debug("Modified .nuspec file: " + newXml);
        });

        // fs.writeFileSync('newfile.nuspec', newXml);
    } catch (error) {
        tl.error(error);
    }

    tl.debug("Overriding tags done!");
    console.log("Overriding tags done!");
}

function readNuspecFile(nuspecPath: string) : string {
    return fs.readFileSync(nuspecPath, 'utf-8');
}

function isValidFileExtension(filePath: string, fileExtension: string) : boolean {
    return filePath.endsWith(fileExtension);
}

run();