const fs = require('fs');
const path = require('path');

const pages = [];
const pathToVisit = [];
// To keep track of all visited paths avoids infinite loop
const visitedPath = new Set();


const pushValidPages = (currentVisitingPath, currentVisitingPathFiles) => {

    // Check all valid pages in current path
    // Valid pages are files with extention html
    for (const idx in currentVisitingPathFiles) {

        const file = currentVisitingPathFiles[idx];
        const fileName = file;
        const fileFullPath = path.join(currentVisitingPath, fileName);

        // Ignore if file is a directory
        if (!(fs.statSync(fileFullPath).isDirectory())) {
            const fileExtension = fileName.split('.').pop();
            const pageName = fileName.split('.')[0];

            // Add to array if files is js or jsx
            if (fileExtension == "html") {
                // push component in array
                pages.push(
                    {
                        name: pageName,
                        extension: fileExtension,
                        dirPath: currentVisitingPath,
                    }
                );
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


const loadPages = (projectConfig) => {

    // Pages should have beeen copied to the buildDir
    const pagesDir = projectConfig["buildDir"];

    // Start visiting path from root directory set for pages
    pathToVisit.push(pagesDir);
    visitedPath.add(pagesDir);

    // keep visiting untill all paths are visited
    while (pathToVisit.length != 0) {

        const currentVisitingPath = pathToVisit.pop();
        const currentVisitingPathFiles = fs.readdirSync(currentVisitingPath);

        // From current path push all valid pages and paths
        pushValidPages(currentVisitingPath, currentVisitingPathFiles);
        pushValidPaths(currentVisitingPath, currentVisitingPathFiles);
    }

    return pages;
}

module.exports = loadPages;