import tl = require('vsts-task-lib/task');
import { isNullOrUndefined } from 'util';
import { isValidFileExtension } from './utils';

const assemblyExt: string = '.dll';

export async function packFromAssemblies() : Promise<void> {
    try {
        let assemblyPath: string = tl.getPathInput('assemblyPath');
    
        if(isNullOrUndefined(assemblyPath)) {
            tl.error(tl.loc("Error_NotAValidFilePath", "assemblyPath"));
            throw new Error(tl.loc("Error_NotAValidValueForInput", "assemblyPath", assemblyPath));

        } else {
            
            if (!isValidFileExtension(assemblyPath, assemblyExt)) {
                tl.error(tl.loc("Error_NotAValidFileExtension"));
                throw new Error(tl.loc("Warning_UnexpectedFileExtension", assemblyExt));
            }
        }

        console.log("assembly path: " + assemblyPath);

    } catch (error) {
        tl.error(error);
        tl.setResult(tl.TaskResult.Failed, error.message);
    }
}