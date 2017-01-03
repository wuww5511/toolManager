const Command = require('../lib').Command;



        var command = new Command({});
        Command.pushLog(command, "lalala");
        console.log(command.logs);
