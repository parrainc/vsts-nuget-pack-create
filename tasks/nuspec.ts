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
            tl.error(tl.loc("Error_NotAValidFilePath", "nuspec"));
            throw new Error(tl.loc("Error_NotAValidValueForInput", "nuspecPath", nuspecPath));

        } else {
            if (!isValidFileExtension(nuspecPath, nuspecExt)) {
                tl.error(tl.loc("Error_NotAValidFileExtension"));
                throw new Error(tl.loc("Warning_UnexpectedFileExtension", nuspecExt));

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