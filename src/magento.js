function Magento () {
	this.modules = new Array();
}

Magento.prototype.getModules = function () {
	return this.modules;
};
Magento.prototype.addModule = function (moduleObject) {
	var index = this.modules.length;
	this.modules[index] = moduleObject;
	return index;
};
Magento.prototype.updateModule = function (index, key, value) {
	this.modules[index][key] = value;
};
Magento.prototype.setMageLocal = function () {
	
};
Magento.prototype.save = function () {
	var moduleCount = this.modules.length;
	var magentoModules = this.modules;
	
	var waitForSaveTime = setInterval(function() {
		if (magentoModules[moduleCount-1]['config'] || magentoModules.length < 1) {
			var fs = require("fs");
			fs.writeFile("magicmary.json", JSON.stringify(magentoModules), "utf8");
			clearInterval(waitForSaveTime);
		}
	}, 200);
};
Magento.prototype.findEvents = function () {
	var fs = require('fs');
	if (fs.existsSync('magicmary.json') != true) {
		return false;
	}
	var config = JSON.parse(fs.readFileSync('magicmary.json', 'utf8'));
	collectAllEvent(config);
	return true;
};
Magento.prototype.getEvents = function () {
	return events;
};
var events = Array();
var collectAllEvent = function (jsonObject, moduleName) {
	if (jsonObject instanceof Object != true) return false;
	if (jsonObject['config'] && jsonObject['config']['modules']) {
		for (var i in jsonObject['config']['modules'][0])
		moduleName = i;
	}
	for (var i in jsonObject) {
		if (i == 'events') {			
			for (var j in jsonObject[i][0]) {
				var index = 0;
				if (events[j]) {
					index = events[j].length;
				} else {
					events[j] = new Array();
				}
				events[j][index] = moduleName;
			}
		} else if (jsonObject[i] instanceof Object) {
			collectAllEvent(jsonObject[i], moduleName);
		}
	}
};

/**
 * @todo from here
 */
Magento.prototype.find = function (yesQuery, noQuery) {
	var fs = require('fs');
	var config = JSON.parse(fs.readFileSync('magicmary.json', 'utf8'));
	var condition = {
		'yes' : makeCondition(yesQuery),
		'no' : makeCondition(noQuery)
	};
	console.log(condition);
	
	console.log('Looking for...');
	findInConfig(yesQuery, noQuery, config);
	console.log('Searching has finished');
};

var makeCondition = function(query) {
	if (query == undefined) return query;
	var condition = new Array();
	var queryArr = query.split(',');
	for (var i in queryArr) {
		var keyValue = queryArr[i].split(':');
		if (queryArr[i] != undefined) {
			condition[i] = {
				'block' : keyValue[0],
				'value' : keyValue[1]
			};
		}
	}
	return condition;
};
var findInConfig = function(yesQuery, noQuery, jsonObject) {
	if (jsonObject instanceof Object != true) return false;
	
};


module.exports = new Magento();