const fs = require('fs');
const path = require('path');

const components = [];
const pathToVisit = [];
const componentsFreq = {};
const componentsSet = new Set();
// To keep track of all visited paths avoids infinite loop
const visitedPath = new Set();


const pushValidComponents = (currentVisitingPath, currentVisitingPathFiles) => {

    // Check all valid components in current path
    // Valid components are files with extention JS / JSX
    for (const idx in currentVisitingPathFiles) {

        const file = currentVisitingPathFiles[idx];
        const fileName = file;
        const fileFullPath = path.join(currentVisitingPath, fileName);

        // Ignore if file is a directory
        if (!(fs.statSync(fileFullPath).isDirectory())) {
            const fileExtension = fileName.split('.').pop();
            const componentName = fileName.split('.')[0];

            // Add to array if files is js or jsx
            if (fileExtension == "js" || fileExtension == "jsx") {

                // Warn if component name does not starts with a capital letter
                if (componentName[0].toUpperCase() === componentName[0]) {

                    // push component in array
                    components.push(
                        {
                            name: componentName,
                            extension: fileExtension,
                            dirPath: currentVisitingPath,
                            // Set globalUnique to true as default 
                            // This whill be updated later when all components are processed
                            globalUnique: true
                        }
                    );

                    // Check if component is seen for the first time
                    if (componentsSet.has(componentName)) {

                        // When component was already in set we increase the frequency by one
                        let prevCount = componentsFreq[componentName];
                        componentsFreq[componentName] = prevCount + 1;

                    } else {

                        // Add component to set
                        componentsSet.add(componentName);
                        // Set frequency to 1
                        componentsFreq[componentName] = 1;
                    }
                } else {
                    console.log(
                        "[WARN] Component name must start with capital letter\n-> "
                        + fileName
                    );
                }
            }
        }


    }
};
const pushValidPaths = (currentVisitingPath, currentVisitingPathFiles) => {

    // For all directory in this path that are not visited
    // Push them in pathToVisit and mark as visited
    for (const idx in currentVisitingPathFiles) {
        const file = currentVisitingPathFiles[idx];
        const fileFullPath = path.join(currentVisitingPath, file);

        // Check if file is a directory
        if (fs.statSync(fileFullPath).isDirectory()) {

            // Only add to path to visit if previously not visited
            if (!(visitedPath.has(fileFullPath))) {
                visitedPath.add(fileFullPath);
                pathToVisit.push(fileFullPath);
            }
        }
    }
};


const updateGlobalUniqueProp = () => {
    for (const idx in components) {
        const component = components[idx];

        // if component was only seen more than once
        // mark it as globalUnique : false
        if (componentsFreq[component["name"]] != 1) {
            component["globalUnique"] = false;
        }
    }
};

const loadComponents = (projectConfig) => {
    const componentsDir = projectConfig["componentsDir"];

    // Start visiting path from root directory set for components
    pathToVisit.push(componentsDir);
    visitedPath.add(componentsDir);

    // keep visiting untill all paths are visited
    while (pathToVisit.length != 0) {

        const currentVisitingPath = pathToVisit.pop();
        const currentVisitingPathFiles = fs.readdirSync(currentVisitingPath);

        // From current path push all valid components and paths
        pushValidComponents(currentVisitingPath, currentVisitingPathFiles);
        pushValidPaths(currentVisitingPath, currentVisitingPathFiles);
    }

    // update the globalUnique property for all the components
    updateGlobalUniqueProp();
    return components;
}

module.exports = loadComponents;