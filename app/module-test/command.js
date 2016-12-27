const Command = require("../module/command").Command;
var cmd = new Command({
    cmd: "gulp",
    path: "/Users/wuww/code/comic_web/src/main/webapp/src"
});
cmd.on('data', (str) => console.log(str));

cmd.exec()
