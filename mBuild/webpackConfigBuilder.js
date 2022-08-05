const path = require('path');

let component;
let projectConfig;

const getEntryConfig = () => {
    return path.resolve(component["dirPath"], `${component["name"]}.${component["extension"]}`);
}

const getOutputConfig = () => {
    const outputConfigObj = {
        path: path.join(projectConfig["buildDir"],"__componentsLib"),
        filename: `${component["name"]}.js`,
        libraryTarget: 'commonjs',
        library: component["name"],
    };
    return outputConfigObj;
}


const getRulesConfigForJsx = () => {
    const rulesConfigForJsx = {
        exclude: /node_modules/,
        test: /\.(jsx|js)$/,
        use: [
            {
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/react', {
                                "pragma": "__spage.createElement",
                                "pragmaFrag": "__spage.Fragment",
                                "throwIfNamespace": false,
                                "runtime": "classic",

                            }
                        ]
                    ]
                }
            }
        ]
    };
    return rulesConfigForJsx;
}

const webpackConfigBuilder = (componentArg, projectConfigArg) => {
    // Set projectConfig and component
    component = componentArg;
    projectConfig = projectConfigArg;

    const webpackConfig = {
        entry: getEntryConfig(),
        mode: "none",
        target: 'node',
        output: getOutputConfig(),
        module: {
            rules: [
                getRulesConfigForJsx()
            ]
        }
    };
    return webpackConfig;
}

module.exports = webpackConfigBuilder;