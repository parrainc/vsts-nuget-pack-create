import tl = require('vsts-task-lib/task');
import { isNullOrUndefined } from 'util';
import { isValidFileExtension } from './utils';

const assemblyExt: string = '.dll';

export async function packFromAssemblies() : Promise<void> {
    try {
        let assemblyPath: string = tl.getPathInput('assemblyPath');
    
        if(isNullOrUndefined(assemblyPath)) {
            tl.error("AssemblyPath cannot be null or undefined");
            throw new Error("[!] Missing required input: assemblyPath");

        } else {
            
            if (!isValidFileExtension(assemblyPath, assemblyExt)) {
                tl.error("File extension is invalid");
                throw new Error("[!] Error, file extension is invalid.");
            }
        }

        console.log("assembly path: " + assemblyPath);

    } catch (error) {
        tl.error(error);
        tl.setResult(tl.TaskResult.Failed, error.message);
    }
}