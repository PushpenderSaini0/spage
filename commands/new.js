const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');

function createSpageApp(appName, rootPath) {
    console.log(`Creating new app in ${path.resolve(rootPath)}`);
    const appPath = path.join(rootPath, appName);

    const packageJson = {
        name: appName,
        version: '0.1.0',
        scripts: {
            build: "spage build"
        },
        dependencies: {
            "spagejs": "^1.0.0"
        }
    };

    fs.writeFileSync(
        path.join(appPath, 'package.json'),
        JSON.stringify(packageJson, null, 2) + '\n'
    );

    const template = path.resolve(__dirname, "..", "template");
    fse.copySync(template, appPath);
    console.log(
        'App created successfully.\n' +
        'you can now cd ' + appName + '\n' +
        'and install packages using npm install \n' +
        'to build the app use npm run build \n'
    );
}

const run = (argv, rootPath) => {
    if (argv.length > 3) {
        const appName = argv[3];

        // TODO : Check if provided name is valid
        if (!fs.existsSync(appName)) {
            fs.mkdirSync(appName);
            createSpageApp(appName, rootPath);
        } else {
            console.log(`${appName} directory already exist, try some other name`);
        }
    }
    else {
        console.log(
            'Please specify the appName' +
            '\n' +
            'npx spage new <appName>'
        );
    }
}
module.exports = run;
