const fs = require('fs');
const path = require('path');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const isComponentGlobalUnique = (components, componentName) => {
    // TODO Implement this
    return true;
}

const getComponentForPage = (pages, components) => {

    // Add all component in set for fast lookup
    const componentsSet = new Set();
    for (let i = 0; i < components.length; i++) {
        const component = components[i];
        componentsSet.add(component.name);
    }

    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];

        // Read page data
        const pageCode = fs.readFileSync(path.join(page.dirPath, `${page.name}.${page.extension}`), 'utf8');

        // Construct dom
        const dom = new JSDOM(pageCode);

        // Get Root Div
        const rootDivList = dom.window.document.getElementsByTagName("DIV");

        if (rootDivList.length != 0) {

            // We will render the first div
            const rootDiv = rootDivList[0];

            if (rootDiv.id) {
                if (componentsSet.has(rootDiv.id)) {

                    if (isComponentGlobalUnique(rootDiv.id)) {

                        // Add component only if its globally unique
                        pages[i]["component"] = rootDiv.id;
                    } else {
                        console.log("Component used in root div must be globally unique\n" + rootDiv.id
                            + " component cannot be used");
                    }
                }
                else {
                    console.log("No component found with name " + rootDiv.id);
                }
            } else {
                console.log("No id found on root div in page " + page.name);
            }
        }
        else {
            console.log("No root div found in page " + page.name);
        }

    }
    return pages;
}

module.exports = getComponentForPage;