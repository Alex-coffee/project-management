//fs ====================================
var fs = require('fs');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var settings = rootRequire('config/settings');

var SchemaFactory = rootRequire('app/utils/SchemaFactory');
SchemaFactory.init();

var ServicesFactory = rootRequire('app/utils/ServicesFactory');
var ORFactory = rootRequire('app/utils/ORFactory');
var ScenarioFactory = rootRequire('app/utils/ScenarioFactory');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Cache-Control,Content-Disposition,X-Requested-With');
    next();
}

var clearAllOutPutFile = function(){
    let outPutFiles = fs.readdirSync(settings.outputPath);
    outPutFiles.forEach(fileName => {
        if(fileName.endsWith(".json")){
            var fd = fs.openSync(settings.outputPath + fileName, "w");
            let content = JSON.stringify([]);
            var buf = new Buffer(content);
            fs.writeSync(fd,buf,0,buf.length,0);
            console.log("clear file: " + fileName);
        }
    })
}

module.exports = function(app) {
    app.use(allowCrossDomain);
    ServicesFactory.apiInit(app);
    ORFactory.apiInit(app);
    ScenarioFactory.apiInit(app);

    app.get('/api/test', function(req, res){
        res.status(200).send({"message" : "测试输出"});
    })

    app.post('/api/saveJSON', function(req, res){
        var fd = fs.openSync(settings.dataPath + req.body.fileUrl, "w");
        var points = JSON.stringify(req.body.content);
        var buf = new Buffer(points);
        fs.writeSync(fd,buf,0,buf.length,0);
        res.status(200).send({"message" : "数据已保存"});
    })

    app.post('/api/runOR', function(req, res){
        //set the output file to [] before runing or
        clearAllOutPutFile();
        var orCommand = [];
        orCommand.push(settings.systemPath + settings.command);
        orCommand.push(settings.systemPath + "input/");
        orCommand.push(settings.systemPath + "output/");
        orCommand.push("optimize");
        console.log("command: " + orCommand.join(" "));

        var bat = spawn('cmd', ['/s', '/c', orCommand.join(" ")]);
        bat.stdout.on('data', function (data) {
            console.log(data.toString());
        });

        bat.stderr.on('error', function (data) {
            console.log(data.toString());
        });

        bat.on('exit', function (code) {
            console.log("Code: " + code);
            if(code == 0){
                res.status(200).send({"message" : "已生成优化结果"});
            }else{
                res.status(500).send({"message" : "Code: " + ' + code +'});
            }
        });
    })

    
};