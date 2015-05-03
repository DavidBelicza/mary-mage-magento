var magento = require('../../magento'), rootPath = '';

function Parser() {
	this.tree = new Array();
}

Parser.prototype.setTree = function (tree) {
	this.tree[0] = tree;
	rootPath = this.tree[0]['path'];
};
Parser.prototype.analysis = function () {
	search(this.tree);
	if (magento.getModules().length < 1) {
		return false;
	}
	magento.save();
	return true;
};

var isModuleRegister = function (path) {	
	return isModuleDir(
		path, 
		rootPath + '/app/etc/modules/', 
		rootPath + '/app/etc/modules/',
		'.xml'
	);
},
isCommunityModule = function (path) {
	return isModuleDir(
		path, 
		rootPath + '/app/code/community/', 
		rootPath + '/app/code/community/',
		'/'
	);
},
isLocalModule = function (path) {
	return isModuleDir(
		path, 
		rootPath + '/app/code/local/', 
		rootPath + '/app/code/local/',
		'/'
	);
},
isLocalMage = function (path) {
	return isModuleDir(
		path, 
		rootPath + '/app/code/local/', 
		rootPath + '/app/code/local/Mage/',
		'/'
	);
},
isModuleDir = function(path, codePool, subCodePool, separator) {
	if (path.indexOf(subCodePool) === 0) {
		var vendorModule = path.replace(codePool, '');
		if (vendorModule.length > 0) {
			var vendorModuleArr = vendorModule.split(separator);
			if (vendorModuleArr.length === 2) {				
				return vendorModule;
			}			
		}		
	}
	return false;
},
search = function (jsonObject) {
	if (jsonObject instanceof Array) {		
		for (var key in jsonObject) {
			if (jsonObject.hasOwnProperty(key) && jsonObject[key]['path']) {
				var moduleRegister = isModuleRegister(jsonObject[key]['path']);
				if (moduleRegister) {
					continue;	
				}			
				
				var localMage = isLocalMage(jsonObject[key]['path']);
				if (localMage) {
					continue;	
				}
					 
				var localModule = isLocalModule(jsonObject[key]['path']);
				if (localModule) {
					continue;	
				}
					
				var communityModule = isCommunityModule(jsonObject[key]['path']);
				if (communityModule) {
					var vendorName = communityModule.split('/');
					var moduleJsonData = {
						pool : 'community',
						vendor : vendorName[0],
						name : vendorName[1],
						config : ''
					};
					var index = magento.addModule(moduleJsonData);
					addConfig(moduleJsonData, index);
					continue;	
				}
					
				if (jsonObject[key]['children'] instanceof Object) {
					search(jsonObject[key]['children']);
				}
			}
		}
	}
},
addConfig = function (moduleObject, index) {
	pullConfig(moduleObject, index, function (response) {
		magento.updateModule(response['index'], 'config', response['result']);
	});
},
pullConfig = function (moduleObject, index, callBack) {
	var fileName = rootPath + '/app/code/' +
		moduleObject['pool'] + '/' +
		moduleObject['vendor'] + '/' +
		moduleObject['name'] + 
		'/etc/config.xml';
		
	var xml2js = require('xml2js');
	var fs = require('fs');
	
	var parser = new xml2js.Parser();
	fs.readFile(fileName, function(err, data) {
		if (data) {
		    parser.parseString(data, function (err, result) {
				return callBack({
					'index' : index,
					'result' : result
				});
		    });
		}
	});	
};

module.exports = new Parser();