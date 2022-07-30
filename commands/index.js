
const fs = require('fs');
const path = require('path');

// Loads all commands from the commands directory to an object
const getCommands = () => {
    // Read all files in the commands directory
    const commandFiles = fs.readdirSync(__dirname);
    const commandsObj = {};

    // For all files in commands directory
    // Add them to commands object
    for (const idx in commandFiles) {

        // Skip the index file as it's not a command
        if (commandFiles[idx] == "index.js") continue;

        // Get filename and command name
        const fileName = commandFiles[idx];
        const commandName = fileName.split('.')[0];

        // Add the command to the command object
        commandsObj[commandName] = require(path.join(__dirname, fileName));
    }

    return commandsObj;
}

// Command Handler gets argv and current working directory
// and runs a command according to it
const commandHandler = (argv, cwd) => {

    // First 2 strings in argv is the process name followed by the arguments passed
    // If any arguments were passed argv length will be more than 2
    if (argv.length > 2) {

        // Get the command the user wants to run
        const userCommand = argv[2].toLocaleLowerCase();

        // Load all commands in the commands directory
        const commands = getCommands();
        let commandToRun = null;

        // Check if the command user wants to run is a valid command
        for (const command in commands) {
            if (command == userCommand) {
                commandToRun = commands[command];
                break;
            }
        }

        // If commandToRun is null the userCommand is not valid
        if (commandToRun == null) {
            console.log(
                'Unknown command ' +
                userCommand +
                '\n' +
                'Please run npx spage help to check commands'
            );
        } else {
            // Pass the argv and cwd to the command
            commandToRun(argv, cwd);
        }

    } else {
        console.log(
            'No arguments were passed.\n' +
            'Please run npx spage help to check commands'
        );
    }
};

module.exports = commandHandler;