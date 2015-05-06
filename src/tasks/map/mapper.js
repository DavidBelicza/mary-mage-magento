var fs = require('fs');
var path = require('path');
var util = require('util');

var crawler = function (filename) {
    var stats = fs.lstatSync(filename);
    var info = {
        path: filename,
        name: path.basename(filename)
    };

    if (stats.isDirectory()) {
		console.log('mapping: ' + info.path);
        info.type = "folder";
        info.children = fs.readdirSync(filename).map(function(child) {
            return crawler(filename + '/' + child);
        });
    } else {
        //@todo link
        info.type = "file";
    }

    return info;
};

function Mapper() {
    this.map = Object;
}

Mapper.prototype.run = function(path) {	
    if (fs.existsSync(path)) {
        this.map = crawler(path);
    }	
};
Mapper.prototype.getMap = function () {
    return this.map;
};

module.exports = new Mapper();