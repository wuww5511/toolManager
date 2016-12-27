class Command {
    constructor ({cmd, path, name, id}) {
        this.isRunning = false;
        this.logs = [];
        this.cmd = cmd;
        this.path = path;
        this.name = name;
        this.id = id || `cmd${+new Date()}`;
    }
    getData () {
        
    }
}

Command.getData = (command) => {
    var {cmd, path, name, id} = command;
    return {
        cmd,
        path,
        name,
        id
    };
}

export default {
    Command
}