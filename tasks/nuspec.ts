import tl = require('vsts-task-lib/task');
import { isNullOrUndefined } from 'util';
import { isValidFileExtension, overrideNuspecNodes } from './utils';

const nuspecExt: string = '.nuspec';

export async function packFromNuspec() : Promise<void> {

    try {
        let nuspecPath: string = tl.getPathInput('nuspecPath');
        let overrideTags: string = tl.getInput('overridetags');
        let tagsToOverride: string = tl.getInput('tagsToOverride');

        if(isNullOrUndefined(nuspecPath)) {
            tl.error("nuspecPath cannot be null or undefined");
            throw new Error("[!] Missing required input: sourcePath");

        } else {
            if (!isValidFileExtension(nuspecPath, nuspecExt)) {
                tl.error("File extension is invalid");
                throw new Error("[!] Error, file extension is invalid.");

            }
        }

        if (overrideTags == "yes") {
            tl.debug("Override Tags = " + overrideTags);
            overrideNuspecNodes(nuspecPath, tagsToOverride);            
        }


        console.log("nuspec file path: " + nuspecPath);
        console.log("override tags?: " + overrideTags);
        console.log("tags overwritten: " + tagsToOverride);
        
    } catch (error) {
        tl.error(error);
        tl.setResult(tl.TaskResult.Failed, error.message);
    }
}