var commander = require('commander');
var magento = require('./magento');

commander
    .version('0.0.1');

commander
    .command('map [projectPath]')
    .description('Mapping of the project by path. Command: node map /var/www/magento_root')
    .action(function(projectPath) {
        if (projectPath) {
            console.log('I am mapping the project .It may takes some minutes.');
            console.log('...');
            setTimeout(function() {
                var mapper = require('./tasks/map/mapper');
                mapper.run(projectPath);
                var parser = require('./tasks/map/parser');
                parser.setTree(mapper.getMap());
                if (parser.analysis()) {
                    console.log('I just have mapped the Magento.');
                } else {
                    console.log('This directory is not a Magento root.');
                }                
            }, 2000);            
        }    
});

commander
    .command('show [name]')
    .description('List of all events and their modules.')
    .action(function(name){
        if (name == 'events') {
            magento.findEvents();
            var events = magento.getEvents();
            if (events instanceof Object) {
                for (var i in events) {
                    console.log(i);
                    for (var j in events[i]) {
                        console.log('....' + events[i][j]);
                    }
                    console.log();
                }
            }
        }
});

commander
    .command('*')
    .description('Helper')
    .action(function(env) {
        console.log('Type the following: node marymage --help');
});
  
commander.parse(process.argv);
