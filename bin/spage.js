#!/usr/bin/env node

// Check the node version in use
// Exit if less than 14

const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split('.');
const major = semver[0];

if (major < 14) {
    console.error(
        'You are running Node ' +
        currentNodeVersion +
        '.\n' +
        'Spage Framework requires Node 14 or higher. \n' +
        'Please update your version of Node.'
    );
    process.exit(1);
}

const init = require('../commands/index.js');
init(process.argv, process.cwd());