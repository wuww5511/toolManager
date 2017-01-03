const chai = require('chai');

const Command = require('../lib').Command;

chai.should();

describe("Lib Test", () => {
    
    it('empty_oneLine', () => {
        var command = new Command({});
        Command.pushLog(command, "lalala");
        command.logs[0].should.equal("lalala");
    });
    
    it('empty_multiLines', () => {
        var command = new Command({});
        Command.pushLog(command, "1111\n2222\n3333");
        command.logs[0].should.equal("1111");
        command.logs[1].should.equal("2222");
        command.logs[2].should.equal("3333");
    });
    
    it('oneLine_multiLines', () => {
        var command = new Command({});
        command.logs.push("l")
        Command.pushLog(command, "1111\n2222\n3333\n\n");
        command.logs[0].should.equal("l1111");
        command.logs[1].should.equal("2222");
        command.logs[2].should.equal("3333");
        Command.pushLog(command, "123");
        command.logs[3].should.equal("");
        command.logs[4].should.equal("123");
    });
    
    
});