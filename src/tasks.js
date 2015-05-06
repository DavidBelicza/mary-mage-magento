var commander = require('commander');
var magento = require('./magento');

commander
    .version('0.0.7');

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
    .description('List of all tasks and their modules. Name can be "jobs", "cron", or "events".')
    .action(function(name){
        console.log('--------------------------------------------------------------------------------');
        var tags = Array();
        if (name == 'events') {
            magento.findEvents();
            tags = magento.getEvents();
        } else if (name == 'jobs' || name == 'cron') {
            magento.findJobs();
            tags = magento.getJobs();            
        }        
        if (tags instanceof Object) {
            for (var i in tags) {
                console.log(i);
                for (var j in tags[i]) {
                    console.log('....' + tags[i][j]);
                }
                console.log();
            }
        }
        console.log('--------------------------------------------------------------------------------');
});

commander
    .command('*')
    .description('Helper')
    .action(function(env) {
        console.log('Type the following: node marymage --help');
});
  
commander.parse(process.argv);
