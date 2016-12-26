var fs = require('fs'),
    path = require('path');

const name = path.resolve(__dirname, "./data.json");

function isExit () {
    return fs.existsSync(name);
}

exports.get = function (key) {
    
    if(!isExit()) 
        return null;
    
    try {
        var data = JSON.parse(fs.readFileSync(name));
    }
    catch(e) {
        return null;
    }
    
    if(key) 
        return data[key];
    else
        return data;
};

exports.set = function (key, value) {
    var data = this.get() || {};
    data[key] = value;
    fs.writeFileSync(name, JSON.stringify(data));
};