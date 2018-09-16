import fs = require('fs');
import tl = require('vsts-task-lib/task');
import * as xml2js from 'xml2js';

export function overrideNuspecNodes(nuspecPath: string, tagsToOverride: string) {
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

        fs.writeFileSync(nuspecPath, newXml, 'utf-8');

    } catch (error) {
        tl.error(error);
    }

    tl.debug("Overriding tags done!");
    console.log("Overriding tags done!");
}

export function readNuspecFile(nuspecPath: string) : string {
    return fs.readFileSync(nuspecPath, 'utf-8');
}

export function isValidFileExtension(filePath: string, fileExtension: string) : boolean {
    return filePath.endsWith(fileExtension);
}