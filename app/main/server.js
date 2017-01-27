"use strict"
const electron = require('electron');
const ipcMain = electron.ipcMain;

class Server {
    constructor () {
        this._clients = {};
        
        this._cmds = {};
        
        ipcMain.on('connect', (event, clientId) => {
            if(!this._clients[clientId])
                this._clients[clientId] = event.sender;
            
            event.returnValue = {
                status: true,
                data: null
            };
        });
        
        ipcMain.on('command', (event, commandId, command, data) => {
            if(this._cmds[command]) {
                this._cmds[command].call(null, (res) => {
                    event.sender.send(commandId, res);
                    event.returnValue = res;
                }, data);
            }
            else {
                event.sender.send(`command_${commandId}`, null);
                event.returnValue = null;
            }
                
        });
    }
    
    removeClient (clientId) {
        delete this._clients[clientId];
    }
    
    broadcast (type, data) {
        for(var i in this._clients)
            this._clients[i].send(type, data);
    }
    
    /**
     *  @description 注册命令
     *  @param type {String}
     *  @param callback {Function} 具体执行的操作
     *      @param {Function} 回调函数，命令执行结束后，将结果传入该函数
     *      @param  传入的数据 
     */
    register (type, callback) {
        this._cmds[type] = callback;
    }
                   
}
var ins = null;
module.exports = function () {
    if(!ins) ins = new Server();
    return ins;
};