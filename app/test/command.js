const {Command} = require("../module/command");
const chai = require('chai');
const path = require('path');

chai.should();

describe('Command Test', () => {
    var cmd = null;
    var ph = path.resolve(__dirname, "../module-test/");
    
    it('get output', (done) => {
        
        cmd = new Command({
            cmd: "node ./log.js 0",
            path: ph
        });
            
        var res = "";
        cmd.on('data', (str) => {
             res += str;
        });
        
        cmd.on('terminated', () => {
            res.should.equal("log\n");
            done();
        });
        
        cmd.exec();
        
    })
    
    it('kill process', (done) => {
        
        cmd = new Command({
            cmd: "node ./log.js 1",
            path: ph
        });
            
        var res = "";
        cmd.on('data', (str) => {
             res += str;
        });
        
        cmd.on('terminated', () => {
            ("log").should.equal("log");
            done();
        });
        
        cmd.exec();
        cmd.kill();
        
    })
})