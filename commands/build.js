const fs = require('fs');
const path = require('path');
const process = require('process');
const startBuild = require('../mBuild/index.js');

const isSpageProject = (configFile) => {
    // Check if config file exist
    return fs.existsSync(configFile);
}

const loadProjectConfig = (configFile) => {
    const projectConfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    const requiredProps = ["componentsDir", "pagesDir", "buildDir"];
    const requiredPropsIsPath = [true, true, true];

    // Check if all required properties are set in the config file
    for (let i = 0; i < requiredProps.length; i++) {
        if (requiredProps[i] in projectConfig) {

            // Do processing on paths only if the property is a path
            if (requiredPropsIsPath[i]) {
                // Change all paths to absolute paths
                const rPath = projectConfig[requiredProps[i]];
                const aPath = path.resolve(rPath)
                projectConfig[requiredProps[i]] = aPath;

                // Check if this path exist
                if (!(fs.existsSync(aPath))) {
                    console.log(
                        "Error in set path\n"
                        + requiredProps[i]
                        + " is set to "
                        + rPath
                        + "\nUnable to find "
                        + aPath
                    );
                    process.exit(1);
                }
            }

        } else {
            console.log(
                "Error in config filen\n"
                + requiredProps[i]
                + " is not set in config"
            );
            process.exit(1);
        }
    }

    return projectConfig;
}

// Build command
const run = (argv, cwd) => {

    const configFile = path.join(cwd, "spage.config.json");

    // Check if current directory is a spage project
    if (isSpageProject(configFile)) {

        // Load the config file
        const projectConfig = loadProjectConfig(configFile);

        // Add a property of project root
        projectConfig['projectRoot'] = cwd;

        // Start Build process
        startBuild(projectConfig);

    } else {
        console.log(
            "Cannot start build as this is not a spage project\n"
            + "Missing config file at\n"
            + path.join(cwd, "spage.config.json"
            ));
        process.exit(1);
    }
};

module.exports = run;