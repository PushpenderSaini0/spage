const webpack = require('webpack');
const webpackConfigBuilder = require('./webpackConfigBuilder.js');

const getComponentByName = (components, componentName) => {
    let component;
    for (let i = 0; i < components.length; i++) {
        if (components[i]["name"] == componentName) {
            component = components[i];
            break;
        }
    }
    return component;
}

const compileComponent = (component, projectConfig) => {
    const webpackConfig = webpackConfigBuilder(component, projectConfig);
    let messages;
    webpack(
        webpackConfig,
        (err, stats) => {
            // [Stats Object](#stats-object)
            messages = stats.toJson({ all: false, warnings: true, errors: true });
            if (err || stats.hasErrors()) {
                console.log("Compiled " + component["name"] + " with " + messages.errors.length + " errors")
            } else {
                console.log("Compiled " + component["name"])

            }
        }
    );
}

const compileRequiredComponents = (pageWithComponent, components, projectConfig) => {

    const requiredComponentsSet = new Set();

    for (let i = 0; i < pageWithComponent.length; i++) {
        if ("component" in pageWithComponent[i])
            requiredComponentsSet.add(pageWithComponent[i]["component"]);
    }

    const requiredComponents = [...requiredComponentsSet];

    for (let i = 0; i < requiredComponents.length; i++) {
        compileComponent(getComponentByName(components, requiredComponents[i]), projectConfig);
    }
}
module.exports = compileRequiredComponents;
