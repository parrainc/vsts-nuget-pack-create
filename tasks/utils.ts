import fs = require('fs');
import tl = require('vsts-task-lib/task');
import * as xml2js from 'xml2js';

export function overrideNuspecNodes(nuspecPath: string, tagsToOverride: string) {
    console.log("Overriding tags in nuspec file");
    
    tl.debug(tl.loc("Info_OverridingTags"));
    tl.debug(tl.loc("Info_TagsToOverride", tagsToOverride));
    
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

        tl.debug(tl.loc("Info_OriginalNuspecContent", nuspecFile));

        parser.parseString(nuspecFile, function (err, result) {
            if (err) console.log(err);

            let json = result;

            Object.keys(nodesValues).forEach(key => {
                let hasProperty: boolean = json.package.metadata[0].hasOwnProperty(key);

                if (hasProperty) {
                    tl.debug(tl.loc("Info_OldValueForNode", key, json.package.metadata[0][key]));

                    json.package.metadata[0][key] = nodesValues[key];

                    tl.debug(tl.loc("Info_NewValueForNode", key ,json.package.metadata[0][key]));
                } else {
                    // create property if user decide so
                    tl.warning(tl.loc("Warning_NodeToOverrideDoesntExistsInNuspec", key));
                }
            });

            newXml = builder.buildObject(json);
            
            tl.debug(tl.loc("Info_UpdatedNuspecContent", newXml));
        });

        fs.writeFileSync(nuspecPath, newXml, 'utf-8');
        // to be included here
        // tl.debug(tl.loc("Info_UpdatedNuspecContent", newXml));

    } catch (error) {
        tl.error(error);
        tl.setResult(tl.TaskResult.Failed, error.message);
    }

    tl.debug(tl.loc("Info_TagsOverrideDone"));
    console.log(tl.loc("Info_TagsOverrideDone"));
}

export function readNuspecFile(nuspecPath: string) : string {
    return fs.readFileSync(nuspecPath, 'utf-8');
}

export function isValidFileExtension(filePath: string, fileExtension: string) : boolean {
    return filePath.endsWith(fileExtension);
}