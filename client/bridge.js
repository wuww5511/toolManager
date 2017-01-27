import {ipcRenderer} from 'electron'

class Bridge {
    constructor () {
        this._id = window.location.search.slice(4);
        var res = ipcRenderer.sendSync('connect', this._id);
    }
    
    trigger (command, data, callback) {
        var id = `command_${+new Date()}`;
        ipcRenderer.once(id, (event, res) => {
            callback && callback(res);
        });
        ipcRenderer.send("command", id, command, data);
        
    }
    
    on (name, callback) {
        ipcRenderer.on(name, (event, data) => {
            callback(data);
        });
    }
}

module.exports = new Bridge();