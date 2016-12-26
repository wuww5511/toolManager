const exec = require('child_process').exec,
      EventEmitter = require('events');

/**
 *  可以执行指定命令。有data事件，terminate事件。
 */

class Command extends EventEmitter {
    
    /**
     *  @param opts {Object}
     *      -   path
     *      -   cmd 
     *      -   
     */
    constructor (opts) {
        super();
        this._opts = opts;
        this._process = null;
    }
    
    exec () {
        this._process = exec(this._opts.cmd, {
            cwd: this._opts.path
        }, (error, stdout, stderr) => {
            if(error) {
                this.emit("data", error);
            }
            else
                this.emit("data", stdout);
            
            this.emit("terminated");
        });
        
        this._process.on('data', (str) => {
            this.emit("data", str);
        })
    }
    
    kill () {
        this._process && this._process.kill();
    }
}

module.exports = {
    Command
};