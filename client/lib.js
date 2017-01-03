"use strict"

class Command {
    constructor ({cmd, path, name, id}) {
        this.isRunning = false;
        this.logs = [];
        this.cmd = cmd;
        this.path = path;
        this.name = name;
        this.id = id || `cmd${+new Date()}`;
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

Command.pushLog = (command, log) => {
    var logs = command.logs;
    log = log.toString();
    
    if(logs.length == 0) logs.push("");
    
    var reg = /[\n\r]/g;
    
    var res = reg.exec(log);
    
    var start = 0;
    
    while(res) {
        var str = log.slice(start, res.index);
        logs[logs.length - 1] += str;
        logs.push("");
        start = res.index + 1;
        res = reg.exec(log);
    }
    
    logs[logs.length - 1] += log.slice(start);
    
};

module.exports = {
    Command
};