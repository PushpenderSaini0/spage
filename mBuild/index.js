const loadComponents = require('./loadComponents.js');

const startBuild = (projectConfig) => {

    // Load all components
    const components = loadComponents(projectConfig);

    // Check if more tha one components were loaded
    if (components.length != 0) {

    } else {
        console.log("No components were found / loaded");
    }

}
module.exports = startBuild;