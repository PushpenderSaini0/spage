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

    const compiler = webpack(webpackConfig);

    return new Promise((resolve, reject) => {

        let messages;
        compiler.run((err, stats) => {
            messages = stats.toJson({ all: false, warnings: true, errors: true });
            if (err || stats.hasErrors()) {
                console.log("Compiled " + component["name"] + " with " + messages.errors.length + " errors");
                console.log(messages.errors[0].message);
            } else {
                console.log("Compiled " + component["name"]);
            }
            resolve();
            // Close compiler instance
            compiler.close((closeErr) => { /* */ });
        });
    });
}

const compileRequiredComponents = async (pageWithComponent, components, projectConfig) => {

    const requiredComponentsSet = new Set();

    for (let i = 0; i < pageWithComponent.length; i++) {
        if ("component" in pageWithComponent[i])
            requiredComponentsSet.add(pageWithComponent[i]["component"]);
    }

    const requiredComponents = [...requiredComponentsSet];

    for (let i = 0; i < requiredComponents.length; i++) {
        await compileComponent(getComponentByName(components, requiredComponents[i]), projectConfig);
    }
    return [pageWithComponent, components, projectConfig];
}
module.exports = compileRequiredComponents;
