const loadComponents = require('./loadComponents.js');
const getComponentForPage = require('./getComponentForPage.js');
const compileRequiredComponents = require("./compileRequiredComponents.js");
const renderComponentInPageDom = require('./renderComponentInPageDom');
const loadPages = require('./loadPages.js');
const fse = require('fs-extra');

const renderComponentInPageDomHandler = ([pageWithComponent, projectConfig]) => {
    renderComponentInPageDom(pageWithComponent, projectConfig);
}

const startBuild = (projectConfig) => {

    // Load all components
    const components = loadComponents(projectConfig);

    // Check if more tha one components were loaded
    if (components.length != 0) {

        // Clean previous build data and copy pages
        fse.emptyDirSync(projectConfig["buildDir"]);
        fse.copySync(projectConfig["pagesDir"], projectConfig["buildDir"]);

        // Load pages from buildDir
        const pages = loadPages(projectConfig);

        // TODO : check for conflicts in public folder and copy

        // Update component for page
        const pageWithComponent = getComponentForPage(pages, components);

        compileRequiredComponents(pageWithComponent, components, projectConfig).then(
            renderComponentInPageDomHandler
        );

    } else {
        console.log("No components were found / loaded");
    }

}
module.exports = startBuild;