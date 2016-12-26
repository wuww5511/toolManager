import {ipcRenderer} from 'electron'

function get (key, callback) {
    var id = +new Date();
    
    ipcRenderer.once('callback_read_' + id, function (event, data) {
        callback && callback(data);
    });
    
    ipcRenderer.send('read', id, key);
}

function set (key, data, callback) {
    var id = +new Date();
    
    ipcRenderer.once('callback_write_' + id, function (event, data) {
        callback && callback(data);
    });
    
    ipcRenderer.send('write', id, key, data);
}

export default {
    get,
    set
}