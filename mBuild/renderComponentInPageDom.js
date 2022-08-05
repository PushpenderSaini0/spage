const path = require('path');
const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const renderComponentInPageDom = (pageWithComponent, projectConfig) => {

    for (let i = 0; i < pageWithComponent.length; i++) {
        const page = pageWithComponent[i];
        if ("component" in page) {
            const component = page["component"];
            const pagePath = path.join(page.dirPath, `${page.name}.${page.extension}`);
            const componentLibPath = path.join(projectConfig["buildDir"], "__componentsLib");
            // Read page data
            const pageCode = fs.readFileSync(pagePath, 'utf8');

            // Construct dom
            const dom = new JSDOM(pageCode);

            // Get Root Div

            const rootDiv = [...dom.window.document.getElementsByTagName("DIV")][0];

            rootDiv.innerHTML = require(path.join(componentLibPath, `${component}.js`))[component][component]();

            const markup = dom.serialize();
            fs.writeFileSync(pagePath, markup);
        }
    }

}

module.exports = renderComponentInPageDom;